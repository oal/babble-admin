<template>
  <div>
    <v-chip
      v-for="tag in value"
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
            value: Array
        }
    }
</script>
