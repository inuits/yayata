<script setup>
import {faCalendarDay} from "@fortawesome/free-solid-svg-icons";
</script>

<template lang="pug">
  div(class='col flex-grow-1')
    AgendaBlock(
      class="d-flex flex-column overflow-hidden"
      color="primary-soft"
      :icon="faCalendarDay"
      title="Calendar"
      no-padding
    )
      template(slot="custom_header")
        div(class="d-flex cal-header")

      div(
        class="d-flex align-items-center flex-column cal-body"
        :class="{ 'pb-2': !quote }"
      )
        p {{ dayOfTheWeek }}
        p {{ dayOfTheMonth }}
        p {{ shortMonth }}

        hr(v-if="quote")

        div(class="quote" v-if="quote")
          div(class="quote-content")
            p {{ quoteText }}
            p {{ author }}
</template>

<script>
import AgendaBlock from "./AgendaBlock.vue";
import store from "../../../store";
import * as types from "../../../store/mutation-types";
import {sample} from "lodash";

/**
 * @typedef Quote
 * @type {object}
 * @property {number} id
 * @property {string} display_label
 * @property {string} quote
 * @property {string} author
 */

export default {
  name: 'AgendaCalendarBlock',
  components: {AgendaBlock},
  data() {
    return {
      /** @type {Quote | null} */
      quote: null,
    }
  },
  created() {
    store.dispatch(types.NINETOFIVER_API_REQUEST, {
      path: '/quotes/',
    }).then(res => {
      this.$set(this, 'quote', sample(res.data));
    })
  },
  computed: {
    dayOfTheWeek() {
      return new Date().toLocaleDateString('en-US', {weekday: 'long'}).toUpperCase();
    },
    dayOfTheMonth() {
      return new Date().toLocaleDateString('en-US', {day: 'numeric'}).padStart(2, '0').toUpperCase();
    },
    shortMonth() {
      return new Date().toLocaleDateString('en-US', {month: 'long'}).toUpperCase();
    },
    quoteText() {
      if (!this.quote) return '';

      return this.quote.quote;
    },
    author() {
      if (!this.quote) return '';

      return `– ${this.quote.author}`;
    },
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/bootstrap/theme";

:deep(.cal-header) {
  justify-content: space-around;
  align-items: center;
  height: 28px;
  background: $primary url("data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2220%22%20height%3D%2218%22%20viewBox%3D%220%200%2020%2018%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cmask%20id%3D%22circleMask%22%3E%0A%09%3Ccircle%20cx%3D%226%22%20cy%3D%2212%22%20r%3D%226%22%20fill%3D%22%23EEEEEE%22%2F%3E%20%20%0A%09%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%225%22%20height%3D%2218%22%20fill%3D%22%23EEEEEE%22%20%2F%3E%0A%3C%2Fmask%3E%0A%3Ccircle%20cx%3D%226%22%20cy%3D%2212%22%20r%3D%226%22%20fill%3D%22%23FFFFFF%22%2F%3E%0A%20%20%3Cpath%20d%3D%22M7.47227%204.02773C6.9353%203.49076%206.0647%203.49076%205.52773%204.02773C4.99076%204.5647%204.99076%205.4353%205.52773%205.97227L7.47227%204.02773ZM5%209.125C5.00041%209.125%204.6038%209.05955%204.16644%208.55221C3.7747%208.0978%203.375%207.29922%203.375%206H0.625C0.625%209.76078%203.05616%2011.875%205%2011.875V9.125ZM3.375%206C3.375%204.57877%203.67357%203.1427%204.05615%201.97965C4.24642%201.40121%204.45105%200.909986%204.63609%200.539919C4.72862%200.354848%204.81121%200.2102%204.87877%200.105261C4.95195%20-0.00839676%204.98533%20-0.0407906%204.97227%20-0.0277282L3.02773%20-1.97227C2.69878%20-1.64333%202.41061%20-1.1583%202.17641%20-0.689919C1.92395%20-0.184986%201.67024%200.43212%201.44385%201.12035C0.993099%202.49063%200.625%204.22123%200.625%206H3.375ZM5%2011.875C6.24537%2011.875%207.25507%2011.4045%207.89642%2010.5153C8.4805%209.70557%208.625%208.73016%208.625%207.9375C8.625%207.12117%208.47207%206.31775%208.28939%205.68752C8.19718%205.36939%208.09091%205.0729%207.97915%204.82144C7.89284%204.62725%207.72996%204.28541%207.47227%204.02773L5.52773%205.97227C5.39504%205.83959%205.38841%205.76337%205.46617%205.93832C5.51847%206.05601%205.58407%206.23217%205.64811%206.45311C5.77793%206.901%205.875%207.44133%205.875%207.9375C5.875%208.45734%205.7695%208.76318%205.66608%208.90656C5.61993%208.97054%205.50463%209.125%205%209.125V11.875Z%22%20fill%3D%22%23C0C0C0%22%20mask%3D%22url%28%23circleMask%29%22%2F%3E%0A%3C%2Fsvg%3E%0A");
  background-repeat: repeat-x;
  background-position: center top;
  background-size: auto 80%;
}

.cal-body {
  flex-grow: 1;
  position: relative;

  & > p {
    width: 100%;
    margin: 0;
    text-align: center;
    font-weight: 600;
    line-height: 1.15;
    color: $gray-900;

    &:nth-child(1) {
      font-size: 1rem;
    }

    &:nth-child(2) {
      font-size: 3rem;
    }

    &:nth-child(3) {
      font-size: 1.25rem;
    }
  }

  & > hr {
    width: 90%;
    margin: 0.5rem;
  }

  & > .quote {
    width: 100%;
    display: flex;
    flex-grow: 1;
    padding: 12px 5%;
    align-items: flex-end;
    justify-content: flex-end;

    & > .quote-content {
      display: flex;
      flex-direction: column;
      font-size: 0.875rem;
      line-height: 1.5;
      padding-right: 12px;
      color: $gray-900;
      border-right: 2px solid $primary;

      & > p {
        margin: 0;

        &:first-child {
          font-style: italic;
        }

        &:last-child {
          font-size: 0.75rem;
          align-self: flex-end;
        }
      }
    }
  }

  //&::after {
  //  content: '';
  //  width: 100%;
  //  height: 12px;
  //  margin-top: 12px;
  //  background: rgba(0, 0, 0, 0.32);
  //}
}
</style>
