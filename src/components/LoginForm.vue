<template>
  <v-form @keypress.native.enter="login">
    <v-text-field
      v-model="username"
      class="mt-3"
      :label="$t('username')"
      required
    />
    <v-text-field
      v-model="password"
      :label="$t('password')"
      type="password"
      required
    />
    <v-btn
      large
      block
      color="blue-grey"
      dark
      :loading="loading"
      @click="login"
    >
      {{ $t('login') }}
    </v-btn>
  </v-form>
</template>

<script>
    import api from "@/api";

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
                const auth = {
                    username: this.username,
                    password: this.password,
                };
                api.get('/models/User/' + this.username, {
                    auth: auth
                }).then(response => {
                    api.defaults.auth = auth;
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
