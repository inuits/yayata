<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {faGift} from "@fortawesome/free-solid-svg-icons";
import {faBirthdayCake} from "@fortawesome/free-solid-svg-icons";
</script>

<template lang="pug">
  div(class='col')
    AgendaBlock(
      color="success-soft"
      :icon="faGift"
      title="Month birthdays"
      :style="{flexGrow: 1}"
    )
      div(class="d-flex align-items-start flex-row flex-xl-column flex-wrap flex-xl-nowrap g-3 gy-xl-1 agenda-block-body")
        div(
          v-for="user in birthdayUsers"
          :key="user.id"
          class="d-flex align-items-center"
        )
          AgendaAvatar(:user="user" color="success")
            template(slot="info")
              p(class="text-muted m-0")
                | {{ getUserBirthdayString(user) }}
            template(slot="icon")
              FontAwesomeIcon(v-if="todayBirthdaysUsers.includes(user)" :icon='faBirthdayCake' :class="`text-success-soft`" size="3x")
</template>

<script>
import AgendaBlock from "./AgendaBlock.vue";
import AgendaAvatar from "./AgendaAvatar.vue";
import store from "../../../store";
import moment from "moment";

export default {
  name: 'AgendaBirthdayBlock',
  components: {
    AgendaBlock,
    AgendaAvatar,
  },
  methods: {
    getUserBirthdayString(user) {
      const birthday = moment(user.userinfo.birth_date, 'YYYY-MM-DD');
      const alreadyHadBirthday = birthday.clone().set({
        year: moment().year()
      }).isBefore(moment());
      const hasBirthdayToday = birthday.date() === moment().date() && birthday.month() === moment().month();
      const nextAge = moment().diff(birthday, 'years') + (alreadyHadBirthday ? 0 : 1);

      if (hasBirthdayToday) {
        return `Is ${nextAge} today! 🎉`
      }

      return `${alreadyHadBirthday ? 'Turned' : 'Turns'} ${nextAge} on ${birthday.format('MMMM Do')}`;
    },
  },
  computed: {
    birthdayUsers: function () {
      if (store.getters.users) {
        return store.getters.users
            .filter(user => {
              if (!user.userinfo?.birth_date) return false

              const birthday = moment(user.userinfo.birth_date, 'YYYY-MM-DD')

              return birthday.month() === moment().month()
            })
            .sort((a, b) => {
              const aBirthday = moment(a.userinfo.birth_date, 'YYYY-MM-DD')
              const bBirthday = moment(b.userinfo.birth_date, 'YYYY-MM-DD')

              return aBirthday.date() - bBirthday.date()
            })
      }
    },
    todayBirthdaysUsers: function() {
      return this.birthdayUsers?.filter(user => {
        if (!user.userinfo?.birth_date) return false

        const birthday = moment(user.userinfo.birth_date, 'YYYY-MM-DD')

        return birthday.month() === moment().month() && birthday.date() === moment().date()
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../../assets/scss/bootstrap/variables";

.agenda-block-body {
  margin-left: 22px;
}
</style>
