<template>
  <span>{{ datetime }}</span>
</template>


<script>
import moment from 'moment';

export default {
  props: {
    modelValue: [Date, String]
  },

  computed: {
    datetime() {
      return moment(this.modelValue, 'YYYY-MM-DD hh:mm').format('LLL');
    }
  }
}
</script>
