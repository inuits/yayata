<template lang="pug">
  div(class='card widget-card widget-px widget-py shadow-sm')
    div(class="card-header mb-3 p-0")
      | Log performance
    div(class="card-body d-flex flex-column" v-on:keyup.enter="submit")
      div(class="form-group mb-2")
        label(for='contract') Contract
        multiselect(
          v-model="model.contract",
          :options="contractValues",
          :allowEmpty="false",
          track-by="id",
          :disabled="loading",
          label='display_label',
          id='contract',
          @select="handleContractChange"
        )

      div(class='d-flex flex-wrap flex-lg-nowrap gx-3 mb-2')
        div(class='form-group m-0 w-50 flex-grow-1 mb-md-2 mb-lg-0')
          label(for='duration') Duration
          input(
            v-model="model.duration",
            type='text',
            class='form-control',
            id='duration',
            :disabled="loading",
            required='required',
            pattern="^([0-9]{1,2}(?:(?::[0-9]{2})?(?:[\\.,][0-9]{1,2})?)?)$",
          )
        div(class='form-group m-0 w-50 flex-grow-1')
          label(for='performance_type') Type
          b-form-select(
            v-model="model.performance_type"
            :options="performanceTypeValues",
            class='form-control',
            id='performance_type',
            required='required',
            :disabled="loading",
            text-field="display_label",
            value-field="id",
          )
            template(v-slot:first)
              b-form-select-option(:value='null' disabled)
                | < Nothing selected >

      div(class='form-group mb-2')
        label(for='description') Description
        textarea(
          v-model="model.description",
          class='form-control',
          id='description',
          rows='3',
          :disabled="loading",
          maxlength='2048',
        )
        small(class='form-text text-muted text-right') {{ descriptionLength }} / 2048

      div(class='flex-grow-1')

      div(class='d-flex flex-column flex-sm-row g-2 align-items-end')
        div(class='w-100 w-sm-auto')
          div(class='form-group w-auto mb-0')
            label(for='role') Role
            b-form-select(
              v-model="model.contract_role",
              :options="rolesValues",
              class='form-control',
              id='role',
              required='required',
              :disabled="loading",
              text-field="display_label",
              value-field="id",
            )
              template(v-slot:first)
                b-form-select-option(:value='null' disabled)
                  | < Nothing selected >

        div(class='w-100 w-sm-50 d-flex flex-grow-1 justify-content-end align-items-end gx-2')
          button(
            v-if="model.id",
            type='submit',
            class='btn btn-danger-soft text-danger w-50 w-sm-auto flex-grow-1 flex-sm-grow-0',
            :disabled="loading",
            @click="remove()"
          ) delete
          div(
            v-b-tooltip="{disabled:!disabledSave}"
            :title="disabledSave ? 'Manual entry for selected contract is not allowed. Import hours from Redmine instead.' : ''"
          )
            button(
              type='submit',
              class='btn btn-primary-soft text-primary w-50 w-sm-auto flex-grow-1 flex-sm-grow-0',
              :disabled="loading || disabledSave",
              @click="submit()",
            ) log time

</template>

<script>
import moment from "moment";
import toastr from "toastr";
import utils from "../../utils";
import * as types from "../../store/mutation-types";
import store from "../../store";
import preferences from "../../preferences";
import {isEmpty, isNull, isString} from "lodash";
import {EventBus} from "../../utils/event-bus";

export default {
  name: "PerformanceWidget",

  props: ["performance", "date", "duration"],

  data: () => ({
    loading: false,

    model: {
      id: null,
      date: null,
      contract: null,
      contract_role: null,
      performance_type: null,
      duration: null,
      description: null,
    },
  }),

  computed: {
    performanceContract() {
      if (!store.getters.contracts) return null;

      return store.getters.contracts?.find((contract) => contract.id === this.model.contract?.id) ?? null;
    },

    disabledSave() {
      return this.performanceContract?.external_only;
    },

    descriptionLength() {
      return this.model.description?.length ?? 0;
    },

    contractValues() {
      if (store.getters.active_contracts) {
        let contracts = {};
        let final = [];
        for (
            let i = 0;
            i < store.getters.active_contracts.length;
            i++
        ) {
          const element = store.getters.active_contracts[i];
          if (!contracts[element.display_label]) {
            contracts[element.display_label] = [];
          }
          contracts[element.display_label].push(element);
        }

        const ordered = Object.keys(contracts)
            .sort((a, b) => a.localeCompare(b, undefined, {
              numeric: true
            }))
            .reduce((object, key) => {
              object[key] = contracts[key];
              return object;
            }, {});
        for (let i = 0; i < Object.keys(ordered).length; i++) {
          const list = ordered[Object.keys(ordered)[i]];
          final = final.concat(
              list.sort((a, b) => a.name.localeCompare(b.name, undefined, {numeric: true}))
          );
        }
        return final
      }

      return [];
    },

    performanceTypeValues() {
      if (!store.getters.active_contracts || !store.getters.performance_types || !this.model.contract)
        return [];

      let contract = store.getters.active_contracts.find(
          (contract) => contract.id === this.model.contract.id
      );

      if (contract) {
        if (
            contract.performance_types &&
            contract.performance_types.length
        ) {
          return contract.performance_types;
        }

        return store.getters.performance_types;
      }
    },

    rolesValues() {
      if (!store.getters.contract_users || !this.model.contract)
        return [];

      return store.getters.contract_users
          .filter(
              (contract_user) =>
                  contract_user.contract.id === this.model.contract.id
          )
          .map((contract_user) => contract_user.contract_role);
    }
  },

  created: function () {
    Promise.all([
      new Promise((resolve) => {
        if (!store.getters.performance_types) {
          store
              .dispatch(types.NINETOFIVER_RELOAD_PERFORMANCE_TYPES)
              .then(() => resolve());
        } else {
          resolve();
        }
      }),
      new Promise((resolve) => {
        if (!store.getters.contract_users) {
          store
              .dispatch(types.NINETOFIVER_RELOAD_CONTRACT_USERS)
              .then(() => resolve());
        } else {
          resolve();
        }
      }),
      new Promise((resolve) => {
        if (!store.getters.active_contracts) {
          store
              .dispatch(types.NINETOFIVER_RELOAD_CONTRACTS)
              .then(() => resolve());
        } else {
          resolve();
        }
      }),
    ]).then(() => {
      this.resetForm();
    });
  },

  methods: {
    handleContractChange() {
      this.$set(this.model, "performance_type", this.performanceTypeValues?.[0]?.id);
      this.$set(this.model, "contract_role", this.rolesValues?.[0]?.id);
    },

    resetForm: function () {
      if (this.performance) {
        this.$set(this.model, "id", this.performance.id);
        this.$set(this.model, "performance_type", this.performance.performance_type.id);
        this.$set(this.model, "contract_role", this.performance.contract_role.id);
        this.$set(this.model, "contract", this.performance.contract);
        this.$set(this.model, "date", this.performance.date);
        this.$set(this.model, "duration", this.performance.duration);
        this.$set(this.model, "description", this.performance.description);
      } else {
        this.$set(this.model, "id", null);

        // Attempt to set saved selected contract as selected contract
        let selectedContractId = preferences.get(
            preferences.key.PERFORMANCE_SELECTED_CONTRACT_ID
        );
        this.$set(
            this.model,
            "contract",
            this.contractValues?.find((contract) => contract.id === selectedContractId) ?? this.contractValues[0],
        );

        this.handleContractChange();

        this.$set(
            this.model,
            "date",
            this.date
                ? moment(this.date)
                : moment().format("YYYY-MM-DD")
        );
        this.$set(
            this.model,
            "duration",
            this.duration ? this.duration : 1
        );
        this.$set(this.model, "description", null);
      }

      this.$set(this.model, "duration", `${Math.round(this.model.duration * 100) / 100}`);
    },

    remove: function () {
      if (this.loading) return;
      this.loading = true;

      store
          .dispatch(types.NINETOFIVER_API_REQUEST, {
            path: `/performances/${this.model.id}/`,
            method: "DELETE",
          })
          .then((response) => {
            this.$emit("success", response);
            toastr.success("Performance deleted.");
            this.loading = false;
            this.resetForm();
          })
          .catch((error) => {
            this.$emit("error", error);
            toastr.error("Error deleting performance.");
            this.loading = false;
          });
    },

    validate: function () {
      if (this.disabledSave) {
        toastr.error("Manual entry for selected contract is not allowed. Import hours from Redmine instead.");
        return false;
      }

      if (isNull(this.model.contract)) {
        toastr.error("Contract is required.");
        return false;
      }

      if (isNull(this.model.performance_type)) {
        toastr.error("Performance type is required.");
        return false;
      }

      if (isNull(this.model.contract_role)) {
        toastr.error("Role is required.");
        return false;
      }

      if (isEmpty(this.model.duration) || !utils.validateDuration(this.model.duration) || !isString(this.model.duration)) {
        toastr.error("Invalid duration provided.");
        return false;
      }

      return true;
    },

    submit: function (event) {
      if (this.loading) return
      if (!this.validate()) return
      if (event && (event.target.tagName !== 'INPUT' || event.type === "keyup")) return

      this.loading = true;

      let body = {
        date: moment(this.model.date).format("YYYY-MM-DD"),
        duration: utils.transformDuration(this.model.duration),
        description: this.model.description,
        performance_type: this.model.performance_type,
        contract: this.model.contract.id,
        contract_role: this.model.contract_role,
        type: "ActivityPerformance",
      };

      if (!this.model.id) {
        // Save last selected contract ID so we can select it upon logging new performance
        preferences.set(
            preferences.key.PERFORMANCE_SELECTED_CONTRACT_ID,
            body.contract,
        );

        store
            .dispatch(types.NINETOFIVER_API_REQUEST, {
              path: "/performances/",
              method: "POST",
              body: body,
            })
            .then((response) => {
              this.$emit("success", response);
              toastr.success("Performance logged.");
              this.loading = false;
              this.resetForm();
              EventBus.$emit("performance:logged");
            })
            .catch((error) => {
              this.$emit("error", error);
              toastr.error("Error saving performance.");
              this.loading = false;
            });
      } else {
        store
            .dispatch(types.NINETOFIVER_API_REQUEST, {
              path: `/performances/${this.model.id}/`,
              method: "PUT",
              body: body,
            })
            .then((response) => {
              this.$emit("success", response);
              toastr.success("Performance updated.");
              this.loading = false;
            })
            .catch((error) => {
              this.$emit("error", error);
              toastr.error("Error updating performance.");
              this.loading = false;
            });
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/scss/styles";

.card-body {
  button {
    font-weight: 600;
  }
}
</style>
