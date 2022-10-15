<template>
  <div>
    <div class="pb-3 input-group input-group--text-field">
      <label>{{ label }}</label>
    </div>
    <v-layout
      row
      wrap
    >
      <v-flex>
        <v-menu
          ref="menu"
          v-model="menuDate"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template #activator="{ props: menu }">
            <v-text-field
              v-model="date"
              :label="$t('date')"
              prepend-icon="event"
              readonly
              v-bind="menu"
            />
          </template>
          <v-date-picker v-model="date" />
        </v-menu>
      </v-flex>
      <v-flex>
        <v-menu
          ref="menu"
          v-model="menuTime"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template #activator="{ props: menu }">
            <v-text-field
              v-model="time"
              :label="$t('time')"
              prepend-icon="schedule"
              readonly
              v-bind="menu"
            />
          </template>
          <v-time-picker
            v-model="time"
            format="24hr"
          />
        </v-menu>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'DatetimeField',

  props: {
    modelValue: [String, Date],
    label: String
  },
  emits: ['update:modelValue'],

  data() {
    let dateTime;
    if (this.modelValue) dateTime = moment(this.modelValue);
    else dateTime = moment();

    return {
      menuDate: false,
      menuTime: false,

      date: dateTime.format('YYYY-MM-DD'),
      time: dateTime.format('HH:mm')
    }
  },

  watch: {
    date() {
      this.emitInput();
    },
    time() {
      this.emitInput();
    }
  },

  mounted() {
    this.emitInput();
  },

  methods: {
    emitInput() {
      if (!this.date || !this.time) return null;
      let dateTime = moment(`${this.date}T${this.time}:00`, 'YYYY-MM-DD hh:mm:ss');
      this.$emit('update:modelValue', dateTime.format())
    }
  }
}
</script>
