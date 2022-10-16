<template>
  <v-layout wrap>
    <v-flex>
      <v-text-field
        v-model="modelValue"
        :label="label"
        type="password"
      />
    </v-flex>
    <v-flex>
      <v-text-field
        v-model="confirmValue"
        :label="$t('confirm')"
        type="password"
        :rules="[validate]"
      />
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'PasswordField',

  props: {
    label: String
  },
  emits: ['update:modelValue'],

  data () {
    return {
      modelValue: '',
      confirmValue: ''
    }
  },

  watch: {
    modelValue () {
      this.emit()
    },
    confirmValue () {
      this.emit()
    }
  },

  methods: {
    emit () {
      this.$emit('update:modelValue', this.modelValue)
    },
    validate () {
      if (this.modelValue === this.confirmValue) return true

      return this.$t('invalidPassword')
    }
  }
}
</script>
