<template lang="pug">
div(class='card card-top-blue mb-3')
  div(class='card-header text-center d-flex justify-content-between')
    span 📝 Summary for&nbsp;
      router-link(:to='{ name: "calendar_month", params: { year: timesheet.year, month: timesheet.month } }')
        | {{ timesheet | timesheetDate | moment('MMMM YYYY') }}
    b-button(
      @click='submitTimesheet',
      :disabled='timesheet.status !== "active"',
      :variant='timesheet.status === "active"?"primary":"inactive"'
      ref='timesheetSubmissionToggle'
    ) Submit timesheet
    b-badge(
      style="height:37px; line-height:25px;"
      :variant='timesheet.status === "active" ? "success" : timesheet.status === "closed" ? "danger" : "warning"'
    )
      span(class="align-middle") {{ timesheet.status == "active" ? "Active" : timesheet.status == "closed" ? "Closed" : "Pending"}}

  table(class='table my-0')
    tbody(v-if='rangeInfo')
      tr(v-if='rangeInfo')
        th Work required
        td
        td(class='text-right') {{ rangeInfo.work_hours | round }} hours

      tr(v-if='rangeInfo' v-for='performance in rangeInfo.summary.performances')
        td {{ performance.contract.display_label }}
        td
          button(class='btn-outline-secondary btn btn-sm fa fa-print' @click='exportContractToPdf(performance.contract)')
        td(class='text-right') {{ performance.duration | round }} hours

      tr(v-if='rangeInfo')
        th Total performed
        td
        td(class='text-right') {{ rangeInfo.performed_hours | round }} hours

      tr(v-if='rangeInfo')
        td Leave taken
        td
        td(class='text-right') {{ rangeInfo.leave_hours | round }} hours

      tr(v-if='rangeInfo')
        td Holidays
        td
        td(class='text-right') {{ rangeInfo.holiday_hours | round }} hours

      tr(v-if='rangeInfo')
        th Remaining
        td
        td(class='text-right') {{ rangeInfo.remaining_hours | round }} hours

  b-modal(ref='timesheetSubmissionModal' hide-header=true hide-footer=true lazy=true size='lg')
    TimesheetSubmissionWidget(
      :timesheet='timesheet'
      v-on:success='onTimesheetSubmitted()'
    )
</template>

<script>
import moment from 'moment';
import * as FileSaver from 'file-saver';
import * as types from '../../store/mutation-types';
import store from '../../store';
import TimesheetSubmissionWidget from './TimesheetSubmissionWidget.vue';

export default {
  name: 'TimesheetWidget',

  components: {
    TimesheetSubmissionWidget,
  },

  props: [
    'timesheet',
  ],

  data: function() {
    return {
      rangeInfo: null,
    }
  },

  computed: {
    user: function() {
      if (store.getters.user) {
        return store.getters.user
      }
    }
  },

  watch: {
    timesheet: function (oldVal, newVal) {
      this.reloadData()
    }
  },

  created: function() {
    this.reloadData()
  },

  filters: {
    round: function(val) {
      return Math.round(val * 100) / 100;
    },

    timesheetDate: function(timesheet) {
      return moment().year(timesheet.year).month(timesheet.month - 1)
    }
  },

  methods: {
    reloadData: function() {
      let start = moment().year(this.timesheet.year).month(this.timesheet.month - 1).startOf('month')
      let end = moment().year(this.timesheet.year).month(this.timesheet.month - 1).endOf('month')

      store.dispatch(types.NINETOFIVER_API_REQUEST, {
        path: '/range_info/',
        params: {
          'from': start.format('YYYY-MM-DD'),
          'until': end.format('YYYY-MM-DD'),
          'summary': true
        }
      }).then(res => {
        this.rangeInfo = res.data
      })
    },

    exportContractToPdf: function (contract) {
      store.dispatch(types.NINETOFIVER_API_REQUEST, {
        path: `/downloads/timesheet_contract_pdf/${this.timesheet.id}/${contract.id}/`,
        method: 'GET',
        responseType: 'arraybuffer'
      }).then((res) => {
        var blob = new Blob([res.body], {
          type: 'application/pdf;charset=utf-8',
          responseType: 'arraybuffer'
        });
        var filename = `timesheet_${this.user.display_label}_${this.timesheet.year}-${this.timesheet.month}_${contract.display_label}.pdf`
        filename = filename.replace(/[^a-z_0-9A-Z-\.]/, '')
        filename = filename.replace(' ', '_')
        FileSaver.saveAs(blob, filename);
      })
    },

    submitTimesheet: function() {
      this.$refs.timesheetSubmissionModal.show()
      this.$refs.timesheetSubmissionToggle.toggled = false
    },

    onTimesheetSubmitted: function() {
      this.$refs.timesheetSubmissionModal.hide()
      this.$emit('submit')
    }
  }
}
</script>

<style>
</style>
