<template>
    <div id="login-form">
        <div class="ui raised segments">
            <div class="ui padded segment">
                <div class="ui form" @keypress.enter="login">
                    <div class="field">
                        <label for="username">{{ $t('username') }}</label>
                        <input id="username" name="username" v-model="username">
                    </div>
                    <div class="field">
                        <label for="password">{{ $t('password') }}</label>
                        <input id="password" type="password" name="password" v-model="password">
                    </div>
                </div>
            </div>
            <div class="ui center aligned secondary segment">
                <div class="blue fluid icon button" @click="login" :class="{loading: loading}">
                    <i class="key icon"></i>
                    {{ $t('login') }}
                </div>
            </div>
        </div>
    </div>
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

<style scoped>
#login-form {
    display: flex;
    flex-grow: 1;
    margin: auto;
    justify-content: center;
}

.segment {
    margin: auto;
    align-self: center;
}
</style>
