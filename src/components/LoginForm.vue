<template>
    <v-form @keypress.native.enter="login">
        <v-text-field
                :label="$t('username')"
                v-model="username"
                required
        ></v-text-field>
        <v-text-field
                :label="$t('password')"
                v-model="password"
                type="password"
                required
        ></v-text-field>
        <v-btn large block color="primary" :loading="loading" @click="login">
            {{ $t('login') }}
        </v-btn>
    </v-form>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                username: '',
                password: ''
            }
        },

        methods: {
            login() {
                if (this.loading) return;

                this.loading = true;
                let auth = {
                    username: this.username,
                    password: this.password,
                };
                this.$http.get('/models/User/' + this.username, {
                    auth: auth
                }).then(response => {
                    this.$http.defaults.auth = auth;
                    this.$root.user = response.data;
                    this.loading = false;
                    this.$emit('login');
                }).catch(response => {
                    this.$root.addMessage(this.$t('invalidLogin'), 'error');
                    this.loading = false;
                });
            }
        }
    }
</script>

