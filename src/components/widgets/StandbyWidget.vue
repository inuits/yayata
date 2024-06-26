<template lang="pug">
div(class='card card-top-blue mb-3')
  div(class='card-header text-center') 💤&nbsp;
    span Standby / On-call

  div(class='card-body')
    vue-form-generator(:schema="schema" :model="model" :options="formOptions")

    div(class='form-group my-0')
      div(class='row justify-content-between')
        div(class='col')
          input(class='btn btn-primary' type="submit" value="Save" @click="submit()")
</template>

<script>
import moment from 'moment';
import VueFormGenerator from 'vue-form-generator';
import toastr from 'toastr';
import * as types from '../../store/mutation-types';
import preferences from '../../preferences';
import store from '../../store';

var model = {
  date: null,
  contracts: null,
  timesheet: null,
  performances: null
};
var submit = null;

export default {
  name: 'StandbyWidget',

  mixins: [
  ],

  props: [
    'date',
    'performances'
  ],

  created: function() {
    submit = this.submit

    Promise.all([
      new Promise((resolve, reject) => {
        if (!store.getters.active_contracts) {
          store.dispatch(types.NINETOFIVER_RELOAD_CONTRACTS).then(() => resolve())
        } else{
          resolve()
        }
      })
    ]).then(() => {
      this.resetForm()
    })
  },

  methods: {
    resetForm: function() {
      new Promise((resolve, reject) => {
        this.model.date = this.date ? moment(this.date).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
        
        if (this.performances) {
          resolve(this.performances)
        } else {
          store.dispatch(types.NINETOFIVER_API_REQUEST, {
            path: '/performances/',
            params: {
              date: this.model.date,
              type: 'StandbyPerformance'
            }
          }).then(res => {
            resolve(res.data.results)
          })
        }
      }).then(performances => {
        this.model.performances = performances
        const defaultContracts = this.model.performances.map(performance => {
          return performance.contract.id
        })
        this.model.contracts = preferences.get(preferences.key.STANDBY_SELECTED_CONTRACT_ID,defaultContracts)
      })
    },

    submit: function() {
      if (this.loading) return
      this.loading = true

      let contracts = this.model.contracts.slice(0)
      preferences.set(preferences.key.STANDBY_SELECTED_CONTRACT_ID,contracts)
      let contractsWithPerformances = this.model.performances.map(performance => performance.contract.id)
      // Every performance not belonging to a selected contract is deleted
      let performancesToDelete = this.model.performances.filter(performance => !contracts.includes(performance.contract.id))
      Promise.all(performancesToDelete.map(performance => {
        return store.dispatch(types.NINETOFIVER_API_REQUEST, {
          path: `/performances/${performance.id}/`,
          method: 'DELETE',
        })
      })).then(() => {
        // Create performances for all contracts for which there is not yet a performance
        let contractsRequiringPerformances = contracts.filter(contractId => !contractsWithPerformances.includes(contractId))
        Promise.all(contractsRequiringPerformances.map(contractId => {
          let body = {
            date: this.model.date,
            contract: contractId,
            type: 'StandbyPerformance'
          }

          return store.dispatch(types.NINETOFIVER_API_REQUEST, {
            path: '/performances/',
            method: 'POST',
            body: body,
          })
        })).then(response => {
          this.$emit('success', response)
          toastr.success('Performances updated.')
          this.loading = false
          this.resetForm()
        })
      }).catch((error) => {
        this.$emit('error', error)
        toastr.error('Error updating performances.')
        this.loading = false
      })
    },
  },

  data: () => {
    return {
      loading: false,

      model: model,

      schema: {
        fields: [
          {
            type: "vueMultiSelect",
            label: "Contracts",
            model: "contracts",
            required: true,
            validator: VueFormGenerator.validators.required,
            selectOptions: {
              key: "id",
              label: "display_label",
              trackBy: 'id',
              showLabels: false,
              multiple: true,
              closeOnSelect: false,
              hideSelected: true,
            },
            values: () => {
              if (store.getters.active_contracts) {
                return store.getters.active_contracts.filter(contract => {
                  return contract.type == 'SupportContract'
                })
              }

              return []
            },
            get: function() {
              if (store.getters.active_contracts && model.contracts) {
                return store.getters.active_contracts.filter(contract => model.contracts.includes(contract.id))
              }
            },
            set: function(model, value) {
              model.contracts = value.map(x => x.id)
            },
          },
          {
            type: "submit",
            buttonText: "Save",
            validateBeforeSubmit: true,
            styleClasses: ["d-none"],
            onSubmit: () => {
              submit()
            }
          }
        ]
      },

      formOptions: {
        validateAfterLoad: false,
        validateAfterChanged: true
      }
    }
  }
}
</script>

<style lang="less">
</style>
