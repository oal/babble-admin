<template>
  <v-combobox
    v-model="tags"
    :label="label"
    chips
    multiple
  />
</template>

<script>
export default {
  name: 'TagsField',
  props: {
    options: Object,
    modelValue: [String, Array],
    label: String
  },
  emits: ['update:modelValue'],
  data () {
    return {
      tags: []
    }
  },
  watch: {
    value (value) {
      this.$emit('update:modelValue', value)
    },
    tags (value) {
      this.$emit('update:modelValue', value)
    }
  },
  mounted () {
    if (!Array.isArray(this.modelValue)) {
      const value = []
      if (this.modelValue) value.push(this.modelValue)
      this.tags = value
    } else {
      this.tags = [...this.modelValue]
    }
  }
}
</script>
