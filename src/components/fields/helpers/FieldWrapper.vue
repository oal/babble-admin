<template>
  <v-col
    v-if="hasTypeComponent()"
    :cols="options?.admin?.columns ?? 12"
  >
    <component
      :is="type + 'Field'"
      :model-value="modelValue"
      :label="label"
      :name="name"
      :options="options"
      :error="error"
      :blocks="blocks"
      @update:model-value="onFieldInput"
    />
  </v-col>
</template>

<script>
import { camelCase, upperFirst } from 'lodash'
import { fields } from '@/fields'

export default {
  name: 'FieldWrapper',

  components: {
    ...fields
  },

  props: {
    type: String,
    label: String,
    name: String,
    modelValue: {},
    options: Object,
    blocks: Object,
    error: String
  },
  emits: ['update:modelValue'],

  methods: {
    hasTypeComponent () {
      const componentName = upperFirst(`${camelCase(this.type)}Field`)
      return !!this.$options.components[componentName]
    },
    onFieldInput (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>
