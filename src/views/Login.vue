<template>
    <v-container class="blue-grey darken-3" fluid fill-height>
        <v-dialog persistent v-model="showLoginDialog" max-width="300px">
            <v-card>
                <v-toolbar dark color="blue-grey darken-2">
                    <v-toolbar-title>{{ $t('login') }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <login-form @login="onLogin"></login-form>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import LoginForm from '@/components/LoginForm';

    export default {
        components: {
            LoginForm
        },

        data() {
            return {
                showLoginDialog: true
            }
        },

        methods: {
            onLogin() {
                this.showLoginDialog = false;
                this.$router.replace({name: 'Index'});
            }
        }
    }
</script>
