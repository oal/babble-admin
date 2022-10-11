<template>
  <v-chip
    outlined
    label
    color="blue-grey darken-1"
    v-on="on"
  >
    <v-icon left>
      insert_drive_file
    </v-icon>
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
