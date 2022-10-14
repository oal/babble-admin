<template>
  <v-layout wrap>
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

      :value="data[field.key]"
      @input="onInput(field.key, $event)"
    />
  </v-layout>
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

  methods: {
    onInput(field, value) {
      this.$emit('input', {
        key: field,
        value: value
      });
    }
  }
}
</script>