<script setup>
import {
  faCalendarCheck,
  faArrowUp,
  faMapMarker,
  faClock,
  faInfo,
  faCalendarPlus
} from "@fortawesome/free-solid-svg-icons";
</script>

<template lang="pug">
  div(class='col' v-if="events.length")
    AgendaBlock(
      color="info-soft"
      :icon="faCalendarCheck"
      title="Events"
      :style="{flexGrow: 1}"
    )
      div(class="d-flex align-items-start flex-column gy-2 agenda-block-body")
        div(
          v-for="event in events"
          :key="event.id"
          class="d-flex flex-row align-items-start w-100 event-row"
        )
          div(
            v-if="event.is_running"
            :title="event.is_running ? 'Event is running' : 'Event is not running'"
            class="live"
            v-b-tooltip.hover.top="{ boundary: 'window', variant: 'primary' }"
          )
          div(class="d-flex flex-column flex-grow-1 info")
            div(class="d-flex flex-row align-items-center mb-1")
              p {{ event.display_label }}
              button(
                class="btn btn-info-soft rounded-pill btn-sm btn-square text-info d-flex align-items-center ics-button"
                :class="{ 'mr-1': event.link }"
                @click="downloadICSFile(event)"
              )
                font-awesome-icon(:icon='faCalendarPlus' :style="{'aspect-ratio': '1/1'}" )
            div(class="d-flex flex-row align-items-baseline gx-2")
              font-awesome-icon(:icon="faClock" size="xs")
              p {{ getEventDateString(event) }}
            div(class="d-flex flex-row align-items-baseline gx-2" v-if="event.location")
              font-awesome-icon(:icon="faMapMarker" size="xs")
              p {{ event.location }}
            div(class="d-flex flex-row align-items-baseline gx-2" v-if="event.help_text")
              font-awesome-icon(:icon="faInfo" size="xs")
              p(v-html="event.help_text" class="font-italic")

          div(class='d-flex align-items-center gx-2')
            a(
              v-if="event.link"
              :href="event.link"
              target="_blank"
              class="btn btn-info rounded-pill btn-sm btn-square text-info-soft d-flex align-items-center"
            )
              font-awesome-icon(:icon='faArrowUp' :style="{'aspect-ratio': '1/1', transform: 'rotate(45deg)'}" )
</template>

<script>
import AgendaBlock from "./AgendaBlock.vue";
import store from "../../../store";
import moment from "moment";
import * as types from "../../../store/mutation-types";
import {createEvent} from "ics";
import {linkify} from "../../../utils/text/linkify";

/**
 * @typedef Event
 * @type {object}
 * @property {number} id
 * @property {'Event'} type
 * @property {string} name
 * @property {string} display_label
 * @property {string | null} link
 * @property {string | null} location
 * @property {string | null} help_text
 * @property {boolean} is_running
 * @property {`${Digit}${Digit}${Digit}${Digit}-${Digit}${Digit}-${Digit}${Digit}`} starts_at
 * @property {`${Digit}${Digit}${Digit}${Digit}-${Digit}${Digit}-${Digit}${Digit}`} ends_at
 */

export default {
  name: 'AgendaEventsBlock',
  components: {
    AgendaBlock,
  },
  data() {
    return {
      /** @var {Array<Event>} events */
      events: [],
    }
  },
  created() {
    store.dispatch(types.NINETOFIVER_API_REQUEST, {
      path: '/events/',
      params: {
        from: moment().format('YYYY-MM-DD'),
        until: moment().add(30, "days").format('YYYY-MM-DD'),
      }
    }).then((res) => {
      this.events = res.data.map(event => ({
        ...event,
        ...(event.help_text && {help_text: linkify(event.help_text)}),
      }))
    });
  },
  methods: {
    getEventDateString(event) {
      const startDate = moment(event.starts_at)
      const endDate = moment(event.ends_at)
      const isSingleDay = startDate.isSame(endDate, 'day')

      return isSingleDay
          ? `${startDate.format('DD/MM/YYYY')} ${startDate.format('HH:mm')} - ${endDate.format('HH:mm')}`
          : `${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}`
    },
    /**
     * @param {Event} event
     */
    downloadICSFile(event) {
      const startDate = moment(event.starts_at)
      const endDate = moment(event.ends_at)

      const isMultiDay = !startDate.isSame(endDate, 'day')

      /**
       * @type {EventAttributes}
       */
      const ICSEvent = {
        start: [startDate.year(), startDate.month() + 1, startDate.date(), startDate.hour(), startDate.minute()],
        startInputType: 'local',
        end: [endDate.year(), endDate.month() + 1, endDate.date(), endDate.hour(), endDate.minute()],
        endInputType: 'local',
        title: event.display_label,
        status: 'CONFIRMED',
        busyStatus: 'BUSY',
        alarms: [
          {
            action: 'display',
            trigger: {
              hours: 1,
              before: true,
            },
          }
        ],
        ...(event.help_text && {description: event.help_text}),
        ...(event.link && {url: event.link}),
        ...(event.location && {location: event.location}),
      }

      createEvent(ICSEvent, (error, value) => {
        if (error) {
          console.error(error)
          return
        }

        if (isMultiDay) {
          value = value.replace(/DTSTART:[0-9]{8}T[0-9]{6}Z/gm, `DTSTART;VALUE=DATE:${startDate.format('YYYYMMDD')}`)
          value = value.replace(/DTEND:[0-9]{8}T[0-9]{6}Z/gm, `DTEND;VALUE=DATE:${endDate.format('YYYYMMDD')}`)
        }

        const blob = new Blob([value], {type: 'text/calendar'})
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${event.display_label}.ics`
        a.click()
        URL.revokeObjectURL(url)
      })
    }
  },
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/bootstrap/variables";

.agenda-block-body {
  margin-left: 22px;
}

.event-row {
  position: relative;

  & > .live {
    $size: 0.5rem;
    position: absolute;
    top: calc(0.5rem + calc($size / 2));
    left: calc(-8px - $size);
    width: $size;
    height: $size;
    border-radius: $size;
    background-color: $primary;
  }

  & > .info {
    & > div {
      & > .ics-button {
        line-height: 1;
        align-self: flex-start;

        &:hover, &:active, &:focus {
          background-color: $info-soft;
          border-color: $info-soft;
          outline: none;
          box-shadow: none;

          &:hover, &:active, &:focus {
            box-shadow: none;
          }
        }
      }

      & > p {
        margin: 0;
      }

      &:first-child {
        & > p {
          font-size: 0.875rem;
          color: $gray-900;
        }
      }

      &:not(:first-child) {
        & > p {
          font-size: 0.75rem;
          color: $gray-500;
          word-break: break-word;
        }

        & > svg {
          min-width: 0.75rem;
          width: 0.75rem;
          color: $gray-500;
        }
      }
    }
  }
}
</style>
