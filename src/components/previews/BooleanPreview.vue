<template>
  <div>
    <v-icon
      v-if="value"
      color="green"
    >
      check
    </v-icon>
    <v-icon
      v-else
      color="red"
    >
      clear
    </v-icon>
  </div>
</template>

<script>
    export default {

        props: [
            'value'
        ]

    }
</script>
