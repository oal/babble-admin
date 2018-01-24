<template>
    <v-app light id="app">
        <router-view></router-view>

        <v-snackbar
                v-for="message in $root.messages"
                :key="message.key"
                :timeout="5000"
                v-model="message.visible"
                bottom>
            {{ message.message }}
            <v-btn dark icon @click.native="message.visible = false">
                <v-icon>close</v-icon>
            </v-btn>
        </v-snackbar>
    </v-app>
</template>

<script>
    // import '../assets/style.scss';

    export default {
        name: 'app'
    }
</script>
