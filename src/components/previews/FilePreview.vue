<template>
  <v-chip
    outlined
    label
    color="blue-grey darken-1"
    v-on="on"
  >
    <v-icon
      icon="insert_drive_file"
      left
    />
    {{ value }}
  </v-chip>
</template>

<script>
    export default {
        props: {
            value: String
        }
    }
</script>
