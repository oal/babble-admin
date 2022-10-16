<template>
  <v-container>
    <v-row>
      <FieldWrapper
        v-for="field in fields"
        :key="field.key"
        :type="field.type"
        :label="field.name"
        :name="field.key"
        :options="field.options"
        :class="field.classes"

        :blocks="blocks"
        :error="errors['fields.' + field.key]"

        :model-value="data[field.key]"
        @update:model-value="onInput(field.key, $event)"
      />
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'FieldList',

  props: {
    fields: Array,
    data: Object,
    errors: Object,
    blocks: Object
  },
  emits: ['update:modelValue'],

  methods: {
    onInput (field, value) {
      this.$emit('update:modelValue', {
        key: field,
        value
      })
    }
  }
}
</script>
