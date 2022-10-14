<template>
  <div>
    <v-icon
      v-if="value"
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
            value: Boolean
        }
    }
</script>
