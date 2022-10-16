<template>
  <v-checkbox
    v-model="state"
    :label="label"
  />
</template>

<script>
export default {
  name: 'BooleanField',
  props: {
    modelValue: Boolean,
    name: String,
    label: String
  },
  emits: ['update:modelValue'],
  data () {
    return {
      state: !!this.modelValue
    }
  },
  watch: {
    modelValue () {
      this.state = this.modelValue
    },
    state () {
      this.$emit('update:modelValue', this.state)
    }
  },
  mounted () {
    if (this.modelValue !== this.state) this.$emit('update:modelValue', this.state)
  }
}
</script>
