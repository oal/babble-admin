<template>
  <div>
    <v-icon
      v-if="modelValue"
      icon="check"
      color="green"
    />
    <v-icon
      v-else
      icon="clear"
      color="red"
    />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: Boolean
  }
}
</script>
