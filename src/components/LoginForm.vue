<template>
    <v-form @keypress.native.enter="login">
        <v-text-field class="mt-3"
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
        <v-btn large block color="blue-grey" dark :loading="loading" @click="login">
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
                this.axios.get('/models/User/' + this.username, {
                    auth: auth
                }).then(response => {
                    this.axios.defaults.auth = auth;
                    this.$root.user = response.data;
                    this.loading = false;
                    this.$emit('login');
                }).catch(() => {
                    this.$root.addMessage(this.$t('invalidLogin'), 'error');
                    this.loading = false;
                });
            }
        }
    }
</script>

