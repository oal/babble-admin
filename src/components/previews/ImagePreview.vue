<template>
  <div>
    <v-menu
      bottom
      nudge-bottom="32px"
      class="pa-0"
    >
      <template v-slot:activator="{ on }">
        <v-chip
          outlined
          label
          color="blue-grey darken-1"
          v-on="on"
        >
          <v-icon left>
            image
          </v-icon>
          {{ value.filename }}
        </v-chip>
      </template>

      <v-card class="pa-1 blue-grey darken-3">
        <img
          :src="value.url"
          class="preview-image-preview"
        >
      </v-card>
    </v-menu>
  </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: Object
            }
        }
    }
</script>

<style lang="scss">
    .preview-image-preview {
        display: block;
        max-width: 320px;
        max-height: 240px;
        margin: 0 auto;
        border: 1px solid rgba(#fff, 0.25);
        background-clip: content-box;
    }
</style>
