<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  ArcElement,
  CategoryScale,
} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {computed, ref} from "vue";
import moment from "moment/moment";
import store from "../../../store";
import * as types from "../../../store/mutation-types";
import Values from "values.js";
import {isEmpty} from "lodash";
import {EventBus} from "../../../utils/event-bus";
import {Doughnut} from "vue-chartjs";

const {timesheet} = defineProps({
  timesheet: Object
});

ChartJS.register(Title, Tooltip, ArcElement, CategoryScale, ChartDataLabels);

const inactiveColor = "#EBEBEB";
const primaryColor = "#0AA6C9";

const contractsData = ref(null);
const hoverContractIndex = ref(null);
const options = {
  responsive: true,
  onHover: (_, elements) => {
    hoverContractIndex.value = elements?.[0]?.index;
  },
  interaction: {
    mode: 'point',
    axis: 'r',
    intersect: false
  },
  hoverOffset: 4,
  plugins: {
    tooltip: {
      callbacks: {
        label(tooltipItem) {
          let label = tooltipItem.label.match(/^(\[[\w\/]*])/g)?.[0];

          return isEmpty(label) ? tooltipItem.label : label;
        },
        footer: function (tooltipItems) {
          const item = tooltipItems[0];
          const caption = [...item?.label.matchAll(/^\[[\w\/]*](.*)/g)]?.[0]?.[1]?.trim();

          return isEmpty(caption) ? item.label : caption;
        }
      }
    }
  }
};

const performances = computed(() => contractsData.value?.summary?.performances || []);
const computedWorkHours = computed(() => {
  const hours = (
      contractsData.value?.work_hours -
      contractsData.value?.leave_hours -
      contractsData.value?.holiday_hours
  );

  return hours ? hours.toFixed(1) : 0;
});
const performedHours = computed(() => {
  const hours = contractsData.value?.performed_hours;
  return hours ? hours.toFixed(1) : 0;
});
const remainingHours = computed(() => {
  const hours = contractsData.value?.remaining_hours;
  return hours ? hours.toFixed(1) : 0;
});
const chartShades = computed(() => {
  const count = performances.value.length || 0;

  return new Values(primaryColor).tints(100 / (count + 1)).reverse().slice(1);
});
const chartCompleteData = computed(() => ({
  labels: [
    ...(performances.value.map(performance => performance.contract.display_label) || []),
    'Remaining'
  ],
  datasets: [{
    label: "Hours performed",
    data: [
      ...(performances.value.map(performance => performance.duration) || []),
      remainingHours.value,
    ],
    backgroundColor: [...chartShades.value.map(shade => `#${shade.hex}`), inactiveColor],
    cutout: '80%',
    datalabels: {
      anchor: 'center',
      backgroundColor: null,
      borderWidth: 0,
    }
  }]
}));

function getData() {
  let start = moment().year(timesheet.year).month(timesheet.month - 1).startOf('month')
  let end = moment().year(timesheet.year).month(timesheet.month - 1).endOf('month')


  store.dispatch(types.NINETOFIVER_API_REQUEST, {
    path: '/range_info/',
    params: {
      'from': start.format('YYYY-MM-DD'),
      'until': end.format('YYYY-MM-DD'),
      'summary': true
    }
  }).then(res => {
    contractsData.value = res.data
  })
}

getData()

EventBus.$on('performance:logged', () => {
  this.getData()
})
</script>
<template lang="pug">
  div(class='card widget-card widget-px widget-py shadow-sm' v-if="contractsData")
    div(class="card-header mb-3 p-0")
      | Contract summary

    div(class='card-body')
      div(class="chart mb-3")
        Doughnut(:chartOptions="options" :chartData="chartCompleteData" ref="chart")
        div(class="chart-overlay")
          div(class="d-flex flex-column justify-content-center align-items-center")
            span {{ performedHours }}H / {{ computedWorkHours }}H
            span performed / total

      div(class="d-flex flex-column align-items-start gy-2")
        div(
          v-for="(performance, index) in performances"
          :key="performance.contract.id"
          class="d-flex gx-1 legend-item"
          :class="{'hovered': hoverContractIndex === index}"
          :style="{color: `#${chartShades[index].hex}`}"
        )
          div(class="legend-dot")
          span {{ performance.contract.display_label }}
</template>

<style scoped lang="scss">
@import "../../../assets/scss/components/widgets";
@import "./charts";
</style>
