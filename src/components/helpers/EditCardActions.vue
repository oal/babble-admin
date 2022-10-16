<template>
  <v-card-actions>
    <v-btn
      v-if="!error"
      color="green"
      prepend-icon="save"
      @click="save"
    >
      {{ $t('save') }} {{ model.name }}
    </v-btn>
    <v-tooltip v-else>
      <template #activator="{ props }">
        <v-btn
          color="red"
          prepend-icon="error"
          v-bind="props"
        >
          {{ $t('save') }} {{ model.name }}
        </v-btn>
      </template>
      <span>{{ error }}</span>
    </v-tooltip>
  </v-card-actions>
</template>

<script>
export default {
  props: {
    model: Object,
    error: String
  },
  emits: ['save'],

  methods: {
    save () {
      this.$emit('save')
    }
  }
}
</script>
