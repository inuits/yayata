<script setup>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faHourglassHalf, faHourglassEnd} from "@fortawesome/free-solid-svg-icons";
</script>

<template lang="pug">
  div(class='card widget-card widget-px widget-py shadow-sm mb-3')
    div(class="card-header mb-3 p-0")
      span(v-if='!model.id') Request leave
      span(v-else) Update leave
    div(class='card-body')
      b-alert(
        variant='secondary-soft'
        class='text-secondary border border-secondary'
        :show='!isFutureLeave'
      )
        h5(class='alert-heading') You are not requesting leave in the future!
        | Please keep in mind that your request will receive additional review, since leave should only be requested for future dates under normal circumstances.<br>
        | Adding a description is highly recommended.<br>

      b-alert(
        variant='danger-soft'
        class='text-danger border border-danger'
        :show='!isMultipleDays && isGreaterThanWorkHours'
      )
        h5(class='alert-heading') You are requesting more hours than your contract allows!
        | You are trying to request leave for more hours than your contract allows. Change the time range to proceeed.

      div(class='form-group mb-2')
        label(for='leave_type') Type
        b-form-select(
          v-model='model.leave_type'
          :options='leaveTypes'
          :required='true'
          :placeholder='model.leave_type ? "" : "Select leave type"'
          id='leave_type'
          text-field="display_label"
          value-field="id"
        )
          template(v-slot:first)
            b-form-select-option(:value='null' disabled)
              | < Nothing selected >

      //- Admin-authored message for the selected leave type 
      b-alert(
        v-if='selectedLeaveTypeMessage'
        variant='info-soft'
        class='text-info border border-info'
        show
      )
        span(v-html='selectedLeaveTypeMessage')

      div(class='d-flex flex-wrap flex-lg-nowrap gx-3 mb-2')
        div(class='form-group m-0 w-50 flex-grow-1 mb-md-2 mb-lg-0')
          label(for='time_from') Time from
          date-picker(
            v-model='model.timeFrom'
            :type='timePickerType'
            :format='timePickerFormat'
            :placeholder='new Date() | moment("YYYY-MM-DD HH:mm")'
            :lang="datePickerLang"
            :time-picker-options='{ start: "06:00", step: "00:15", end: "20:00" }'
            :shortcuts='datePickerShortcuts'
            id='time_from'
          )

        div(class='form-group m-0 w-50 flex-grow-1')
          label(for='time_to') Time to
          date-picker(
            v-model='model.timeTo'
            :type='timePickerType'
            :format='timePickerFormat',
            :placeholder='new Date() | moment("YYYY-MM-DD HH:mm")'
            :lang="datePickerLang"
            :time-picker-options='{ start: "06:00", step: "00:15", end: "20:00" }'
            :shortcuts='datePickerShortcuts'
            id='time_to'
          )

      div(class='form-group')
        label(for='description') Description
        b-form-textarea(
          v-model='model.description'
          :max='255'
          :rows='2'
          id='description'
          placeholder='Description'
        )

      div(class='d-flex flex-column flex-sm-row g-2 align-items-end')
        div(class='w-100 w-sm-auto d-flex flex-grow-1 align-items-end gx-2')
          button(
            class='btn btn-primary-soft btn-sm btn-square text-primary d-flex align-items-center'
            v-b-tooltip.bottom
            :title="'Half day'"
            :disabled='isMultipleDays'
            @click="changeHalfDay(true)"
          )
            FontAwesomeIcon(:icon='faHourglassEnd' :style="{'aspect-ratio': '1/1' }" )
          button(
            class='btn btn-primary-soft btn-sm btn-square text-primary d-flex align-items-center'
            v-b-tooltip.bottom
            :title="'Full day'"
            :disabled='isMultipleDays'
            @click="changeHalfDay(false)"
          )
            FontAwesomeIcon(:icon='faHourglassHalf' :style="{'aspect-ratio': '1/1'}" )
        div(class='w-100 w-sm-50 d-flex flex-grow-1 justify-content-end align-items-stretch gx-2')
          button(
            v-if="model.id"
            class='btn btn-danger-soft text-danger w-50 w-sm-auto flex-grow-1 flex-sm-grow-0'
            type="submit"
            @click="remove()"
          ) delete

          button(
            class='btn btn-primary-soft text-primary w-50 w-sm-auto flex-grow-1 flex-sm-grow-0'
            type="submit"
            @click="submit()"
          ) request leave
</template>

<script>
import moment from 'moment';
import DatePicker from "vue2-datepicker";
import toastr from 'toastr';
import * as types from '../../store/mutation-types';
import store from '../../store';
import {isDate} from "lodash";
import {getLeaveTypeById, leaveTypeMessage} from '../../utils/leaveTypes';

export default {
  name: 'LeaveWidget',

  components: {
    DatePicker,
  },

  props: [
    'leave',
    'date',
  ],

  emits: ['success', 'error'],

  data: () => {
    return {
      loading: false,

      model: {
        id: null,
        leave_type: null,
        description: null,
        status: 'draft',
        timeFrom: new Date(),
        timeTo: new Date(),
      },

      workHours: 0,
      workHoursForSelectedDate: -1,

      datePickerLang: {
        formatLocale: {
          firstDayOfWeek: 1,
        }
      },
      datePickerShortcuts: [
        {
          text: 'Today',
          onClick: () => new Date(),
        },
        {
          text: 'Yesterday',
          onClick: () => moment().subtract(1, 'days').toDate(),
        },
        {
          text: 'Tomorrow',
          onClick: () => moment().add(1, 'days').toDate(),
        },
        {
          text: 'Next week start',
          onClick: () => moment().add(1, 'weeks').startOf('week').set({
            hour: 9,
            minute: 0,
          }).toDate(),
        },
        {
          text: 'Next week end',
          onClick: () => moment().add(1, 'weeks').endOf('week').set({
            hour: 17,
            minute: 0,
          }).toDate(),
        },
        {
          text: 'Last week start',
          onClick: () => moment().subtract(1, 'weeks').startOf('week').set({
            hour: 9,
            minute: 0,
          }).toDate(),
        },
        {
          text: 'Last week end',
          onClick: () => moment().subtract(1, 'weeks').endOf('week').set({
            hour: 17,
            minute: 0,
          }).toDate(),
        }
      ],
    }
  },

  computed: {
    leaveTypes() {
      if (!store.getters.leave_types) return [];

      return store.getters.leave_types
    },
    selectedLeaveTypeMessage() {
      return leaveTypeMessage(getLeaveTypeById(store.getters.leave_types, this.model.leave_type))
    },
    isMultipleDays() {
      return !moment(this.model.timeFrom).isSame(moment(this.model.timeTo), 'day')
    },
    timePickerFormat() {
      return this.isMultipleDays ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm'
    },
    timePickerType() {
      return this.isMultipleDays ? 'date' : 'datetime';
    },
    isFutureLeave() {
      return moment(this.model.timeFrom).isAfter(moment(), 'day')
    },
    isGreaterThanWorkHours() {
      if (this.workHoursForSelectedDate === -1) return false

      return Math.abs(moment(this.model.timeTo).diff(moment(this.model.timeFrom), 'milliseconds')) > this.workHoursForSelectedDate * 60 * 60 * 1e3
    }
  },

  watch: {
    'model.timeFrom'(value, oldValue) {
      if (moment(value).isAfter(this.model.timeTo)) {
        this.$set(
            this.model,
            'timeTo',
            value
        )
      }

      if (!moment(value).isSame(oldValue, 'day')) {
        this.$set(
            this.model,
            'timeFrom',
            moment(this.model.timeFrom).set({
              hour: 9,
              minute: 0,
            }).toDate()
        )
      }

      this.workHoursForSelectedDate = -1
    },
    'model.timeTo'(value, oldValue) {
      if (moment(value).isBefore(this.model.timeFrom)) {
        this.$set(
            this.model,
            'timeFrom',
            value
        )
      }

      if (!moment(value).isSame(oldValue, 'day')) {
        this.$set(
            this.model,
            'timeTo',
            moment(this.model.timeTo).set({
              hour: this.workHours ? 9 + this.workHours : 17,
              minute: 0,
            }).toDate()
        )
      }

      this.workHoursForSelectedDate = -1
    },
    isMultipleDays(value, oldValue) {
      if (oldValue && !value || !oldValue && value) {
        this.$set(
            this.model,
            'timeFrom',
            moment(this.model.timeFrom).set({
              hour: 9,
              minute: 0,
            }).toDate()
        )
        this.$set(
            this.model,
            'timeTo',
            moment(this.model.timeTo).set({
              hour: this.workHours ? 9 + this.workHours : 17,
              minute: 0,
            }).toDate()
        )
      }
    },
  },

  created() {
    this.resetForm(true);

    Promise.all([
      new Promise(() => {
        // fetch work hours
        store.dispatch(types.NINETOFIVER_API_REQUEST, {
          path: '/range_availability/',
          params: {
            from: moment(moment.now()).format("YYYY-MM-DD"),
            until: moment(moment.now()).format("YYYY-MM-DD")
          }
        }).then((res) => {
          this.workHours = res.data[store.getters.user.id][moment(moment.now()).format("YYYY-MM-DD")]["work_hours"]
          this.resetForm(true)
        });
      }),
      new Promise((resolve) => {
        if (!store.getters.leave_types) {
          store.dispatch(types.NINETOFIVER_RELOAD_LEAVE_TYPES).then(() => resolve())
        } else {
          resolve()
        }
      }),
    ]).then(() => {
      this.resetForm(true)
    })
  },

  methods: {
    async setWorkingHoursForTheDate() {
      if (!this.isMultipleDays) {
        const rangeInfo = await this.getRangeInfo(moment(this.model.timeFrom), moment(this.model.timeTo))
        this.workHoursForSelectedDate = rangeInfo.data.work_hours
      }
    },
    changeHalfDay(half) {
      const fromHours = moment(this.model.timeFrom).hours();
      const toHour = Math.round(fromHours + (this.workHours * (half ? 0.5 : 1)))

      this.$set(
          this.model,
          'timeFrom',
          moment(this.model.timeFrom).set({
            hour: fromHours,
            minute: 0,
          }).toDate()
      )
      this.$set(
          this.model,
          'timeTo',
          moment(this.model.timeTo).set({
            hour: toHour,
            minute: 0,
          }).toDate()
      )
    },

    resetForm(resetTime = false) {
      if (this.leave) {
        this.$set(
            this.model,
            'id',
            this.leave.id
        );
        this.$set(
            this.model,
            'description',
            this.leave.description
        );
        this.$set(
            this.model,
            'leave_type',
            this.leave.leave_type.id
        );

        const sortedLeaveDateSet = this.leave.leavedate_set.sort((a, b) => {
          return moment(a.starts_at).diff(moment(b.starts_at))
        })

        this.$set(
            this.model,
            'timeFrom',
            moment(sortedLeaveDateSet[0].starts_at).toDate()
        );

        this.$set(
            this.model,
            'timeTo',
            moment(sortedLeaveDateSet[sortedLeaveDateSet.length - 1].ends_at).toDate()
        );
      } else {
        this.$set(this.model, 'id', null)
        this.$set(this.model, 'leave_type', store.getters.leave_types?.[0]?.id)
        this.$set(this.model, 'description', null)

        if (resetTime) {
          this.$set(this.model, 'timeFrom', moment(
              this.date ? this.date : new Date()
          ).set({hour: 9, minute: 0}).toDate())
          this.$set(this.model, 'timeTo', moment(
              this.date ? this.date : new Date()
          ).set({hour: 9 + this.workHours, minute: 0}).toDate())
        }
      }
    },

    async validate() {
      if (this.model.leave_type === null) {
        toastr.error('Please select leave type.')
        return false
      }

      if (!isDate(this.model.timeFrom) || !isDate(this.model.timeTo)) {
        toastr.error('Please select valid dates.')
        return false
      }

      if (this.isMultipleDays) {
        if (moment(this.model.timeFrom).isAfter(this.model.timeTo)) {
          toastr.error('Start date cannot be after end date.')
          return false
        }
      } else {
        if (moment(this.model.timeFrom).isAfter(this.model.timeTo)) {
          toastr.error('Start time cannot be after end time.')
          return false
        }
      }

      await this.setWorkingHoursForTheDate();

      if (!this.isMultipleDays && this.isGreaterThanWorkHours) return false

      return true
    },

    sendLeaveRequest(body) {
      store.dispatch(types.NINETOFIVER_API_REQUEST, {
        path: this.model.id ? `/leave/${this.model.id}/` : '/leave/',
        method: this.model.id ? 'PUT' : 'POST',
        body: body,
      }).then((response) => {
        this.$emit('success', response)
        toastr.success('Leave requested.')
        this.resetForm()
      }).catch((error) => {
        this.$emit('error', error)
        toastr.error('Error requesting leave.')

        try {
          for (var key in error.data) {
            error.data[key].forEach((err) => {
              toastr.error(err.message)
            })
          }
        } catch (err) {
        }
      }).finally(() => {
        store.dispatch(types.NINETOFIVER_RELOAD_LEAVES);
        this.loading = false
      })
    },

    async getRangeInfo(start, end) {
      return store.dispatch(types.NINETOFIVER_API_REQUEST, {
        path: '/range_info/',
        params: {
          'from': start.format('YYYY-MM-DD'),
          'until': end.format('YYYY-MM-DD'),
          'daily': true,
          'detailed': true
        }
      })
    },

    async submit() {
      if (this.loading) return
      if (!(await this.validate())) return

      this.loading = true

      let body = {
        leave_type: this.model.leave_type,
        description: this.model.description,
        status: this.model.status
      };
      let dt_format = 'YYYY-MM-DDTHH:mm:00ZZ'
      let timezone = moment.tz.guess()

      let start_date = moment(this.model.timeFrom)
      let end_date = moment(this.model.timeTo)

      if (this.isMultipleDays) {
        start_date = start_date.tz(timezone).startOf('date')
        end_date = end_date.tz(timezone).endOf('date')
      }

      body.full_day = this.isMultipleDays
      body.starts_at = start_date.format(dt_format)
      body.ends_at = end_date.format(dt_format)

      this.sendLeaveRequest(body)
    },

    remove: function () {
      if (this.loading) return
      this.loading = true

      store.dispatch(types.NINETOFIVER_API_REQUEST, {
        path: `/leave/${this.model.id}/`,
        method: 'DELETE',
      }).then((response) => {
        this.$emit('success', response)
        toastr.success('Leave deleted.')
        this.resetForm()
      }).catch((error) => {
        this.$emit('error', error)
        toastr.error('Error deleting leave.')
      }).finally(() => {
        this.loading = false
        store.dispatch(types.NINETOFIVER_RELOAD_LEAVES);
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "../../assets/scss/components/widgets";

.card-body {
  & .mx-datepicker {
    width: 100%;
  }

  .alert {
    font-size: 0.875rem;
  }

  button {
    font-weight: 600;
    justify-content: center;
  }
}

.multiple-days {
  .single-day-input {
    display: none;
  }
}

.single-day {
  .multiple-days-input {
    display: none;
  }
}

.btn {
  height: 37px;
}
</style>
