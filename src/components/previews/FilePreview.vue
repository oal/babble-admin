<template>
  <v-chip
    variant="outlined"
    color="blue-grey"
    prepend-icon="insert_drive_file"
  >
    {{ modelValue }}
  </v-chip>
</template>

<script>
export default {
  props: {
    modelValue: String
  }
}
</script>
