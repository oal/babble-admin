<template>
  <div>
    <label class="d-block pb-3">{{ label }}</label>
    <v-row
      row
      wrap
    >
      <v-col>
        <v-text-field
          v-model="date"
          type="date"
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="time"
          type="time"
        />
      </v-col>
    </v-row>
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
      date: dateTime.format('YYYY-MM-DD'),
      time: dateTime.format('HH:mm')
    }
  },

  watch: {
    date: 'emitInput',
    time: 'emitInput'
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
