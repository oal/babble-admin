<template>
  <v-card-actions>
    <v-btn
      v-if="!error"
      text
      dark
      color="green"
      @click="save"
    >
      <v-icon
        icon="save"
        left
      />
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
          v-on="on"
        >
          <v-icon
            icon="error"
            left
          />
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

        methods: {
            save() {
                this.$emit('save');
            }
        }
    }
</script>
