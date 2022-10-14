<template>
  <v-textarea
    v-if="!!getOption('admin.multiline')"
    :label="label"
    :model-value="modelValue"
    :error-messages="error"
    @update:model-value="onInput"
  />
  <v-text-field
    v-else
    :label="label"
    :model-value="modelValue"
    :error-messages="error"
    @update:model-value="onInput"
  />
</template>

<script>
import {get} from 'lodash';

export default {
  name: 'TextField',

  props: {
    options: Object,
    modelValue: String,
    label: String,
    error: String
  },
  emits: ['update:modelValue'],

  methods: {
    getOption(path) {
      return get(this.options, path, null)
    },
    onInput(value) {
      this.$emit('update:modelValue', value);
    }
  }
}
</script>
