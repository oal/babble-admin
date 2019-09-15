<template>
  <v-app id="app">
    <router-view></router-view>

    <v-snackbar
            v-for="message in $root.messages"
            :key="message.key"
            :timeout="5000"
            :color="message.type"
            v-model="message.visible"
            class="mr-2 mb-1"
            bottom right>
      {{ message.message }}
      <v-btn dark icon @click.native="message.visible = false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>


<script>

export default {
  name: 'App',
  data: () => ({
    //
  }),
};
</script>
