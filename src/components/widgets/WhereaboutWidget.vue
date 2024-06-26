<template lang="pug">
div(class='card card-top-blue mb-3' v-on:keyup.enter='submit')
  div(class='card-header text-center') 📍&nbsp;
    span(v-if='!model.id') Log whereabout
    span(v-else) Update whereabout
    span(v-if='model.date') &nbsp;for {{ model.date | moment('MMMM Do') }}

  div(class='card-body')
    vue-form-generator(:schema="schema" :model="model" :options="formOptions" ref='form')

    div(class='form-group my-0')
      div(class='row justify-content-between')
        div(class='col')
          input(class='btn btn-primary' type="submit" value="Save" @click="submit()" ref='submitButton')
        div(class='col-auto' v-if='model.id')
          input(class='btn btn-danger' type="submit" value="Delete" @click="remove()")
</template>

<script>
import moment from 'moment';
import VueFormGenerator from 'vue-form-generator';
import toastr from 'toastr';
import utils from '../../utils';
import * as types from '../../store/mutation-types';
import store from '../../store';
import preferences from '../../preferences';

var model = {
  id: null,
  location: null,
  date: null,
  start_time: '09:00',
  end_time: null,
  timesheet: null,
  description: null,
};
var dateSet = false;
var submit = null;

export default {
  name: 'WhereaboutWidget',

  mixins: [
  ],

  props: [
    'whereabout',
    'date',
  ],

  created: function() {
    submit = this.submit

    Promise.all([
      new Promise((resolve, reject) => {
        if (!store.getters.locations) {
          store.dispatch(types.NINETOFIVER_RELOAD_LOCATIONS).then(() => resolve())
        } else {
          resolve()
        }
      })
    ]).then(() => {
      this.resetForm()
    })
  },

  mounted: function() {
    setTimeout(() => {
      this.$refs.submitButton.focus()
    })
  },

  methods: {
    resetForm: function() {
      if (this.whereabout) {
        this.model.id = this.whereabout.id
        this.model.date = moment(this.whereabout.starts_at)
        this.model.start_time = moment(this.whereabout.starts_at).format('HH:mm')
        this.model.end_time = moment(this.whereabout.ends_at).format('HH:mm')
        this.model.location = this.whereabout.location.id
        this.model.description = this.whereabout.description
      } else {
        this.model.id = null

        // Attempt to set saved selected location as selected location
        let location_field = this.schema.fields.find(f => f.model == 'location')
        let location_ids = location_field.values.call(this).map(x => x.id)
        let selected_location_id = preferences.get(preferences.key.WHEREABOUT_SELECTED_LOCATION_ID)
        let location_id = selected_location_id && (location_ids.indexOf(selected_location_id) !== -1) ? selected_location_id : location_ids[0]
        this.model.location = location_id
        // location_field.set(this.model, location_id)

        this.model.date = this.date ? moment(this.date) : null
        this.model.start_time = '09:00'
        this.model.end_time = '17:00'
        this.model.description = null
      }

      dateSet = false
    },

    remove: function() {
      if (this.loading) return
      this.loading = true

      store.dispatch(types.NINETOFIVER_API_REQUEST, {
          path: `/whereabouts/${this.model.id}/`,
          method: 'DELETE',
      }).then((response) => {
        this.$emit('success', response)
        toastr.success('Whereabout deleted.')
        this.loading = false
        this.resetForm()
      }).catch((error) => {
        console.log(error)
        this.$emit('error', error)
        toastr.error('Error deleting whereabout.')
        this.loading = false
      });
    },

    validate: function() {
      return true
    },

    submit: function(event) {
      if (this.loading) return
      if (!this.validate()) return
      if (event && (event.target.tagName !== 'INPUT' || event.type === "keyup")) return

      this.loading = true

      let body = {
        description: this.model.description,
        location: this.model.location
      };

      let dt_format = 'YYYY-MM-DDTHH:mm:00ZZ'
      let timezone = moment.tz.guess()

      let start_time = moment(this.model.start_time, "HH:mm")
      let end_time = moment(this.model.end_time, "HH:mm")

      let start_date = moment(this.model.date).tz(timezone).hour(start_time.hour()).minute(start_time.minute()).second(0)
      let end_date = moment(this.model.date).tz(timezone).hour(end_time.hour()).minute(end_time.minute()).second(0)

      body.starts_at = start_date.format(dt_format)
      body.ends_at = end_date.format(dt_format)

      if (!this.model.id) {
        // Save last selected location ID so we can select it upon logging new whereabout
        preferences.set(preferences.key.WHEREABOUT_SELECTED_LOCATION_ID, body.location)

        store.dispatch(types.NINETOFIVER_API_REQUEST, {
            path: '/whereabouts/',
            method: 'POST',
            body: body,
        }).then((response) => {
          this.$emit('success', response)
          toastr.success('Whereabout logged.')
          this.loading = false
          this.resetForm()
        }).catch((error) => {
          this.$emit('error', error)
          toastr.error('Error saving whereabout.')
          this.loading = false
        });
      } else {
        store.dispatch(types.NINETOFIVER_API_REQUEST, {
            path: `/whereabouts/${this.model.id}/`,
            method: 'PUT',
            body: body,
        }).then((response) => {
          this.$emit('success', response)
          toastr.success('Whereabout updated.')
          this.loading = false
        }).catch((error) => {
          this.$emit('error', error)
          toastr.error('Error updating whereabout.')
          this.loading = false
        });
      }
    },
  },

  data: () => {
    return {
      loading: false,

      model: model,

      schema: {
        fields: [
          {
            type: "pikaday",
            label: "Date",
            model: "date",
            validator: [
              VueFormGenerator.validators.date,
              VueFormGenerator.validators.required
            ],
            pikadayOptions: {
              position: "top left",
              firstDay: 1,
              onDraw: function(pikaday) {
                if ((typeof model.date === 'object') && !dateSet) {
                  dateSet = true
                  pikaday.setDate(moment(model.date).toDate(), true)
                }
              },
            },
            styleClasses: ['third-width-md']
          },
          {
            type: "select",
            label: "From",
            model: "start_time",
            required: true,
            validator: VueFormGenerator.validators.time,
            values: utils.getTimeOptions().map(x => { return {id: x, name: x} }),
            styleClasses: ['third-width-md']
          },
          {
            type: "select",
            label: "Until",
            model: "end_time",
            required: true,
            validator: VueFormGenerator.validators.time,
            values: utils.getTimeOptions().map(x => { return {id: x, name: x} }),
            styleClasses: ['third-width-md']
          },
          {
            type: "select",
            label: "Location",
            model: "location",
            required: true,
            selectOptions: {
              value: "id",
              name: "display_label"
            },
            values: function() {
              if (store.getters.locations) {
                return store.getters.locations
              }

              return []
            },
            validator: VueFormGenerator.validators.required
          },
          {
            type: "textArea",
            label: "Description",
            model: "description",
            max: 255,
            rows: 2,
            validator: VueFormGenerator.validators.string
          },
          {
            type: "submit",
            buttonText: "Save",
            styleClasses: ["d-none"],
            validateBeforeSubmit: true,
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
