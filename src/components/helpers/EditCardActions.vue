<template>
  <v-card-actions>
    <v-btn
      v-if="!error"
      text
      dark
      color="green"
      prepend-icon="save"
      @click="save"
    >
      {{ $t('save') }} {{ model.name }}
    </v-btn>
    <v-tooltip
      v-else
      right
    >
      <template #activator="{ on }">
        <v-btn
          text
          dark
          color="red"
          prepend-icon="error"
          v-on="on"
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
    save() {
      this.$emit('save');
    }
  }
}
</script>
