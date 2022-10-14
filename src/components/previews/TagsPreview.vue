<template>
  <div>
    <v-chip
      v-for="tag in modelValue"
      :key="tag"
      small
      disabled
    >
      {{ tag }}
    </v-chip>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: Array
  }
}
</script>
