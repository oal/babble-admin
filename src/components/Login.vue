<template>
    <div id="login">
        <div class="ui basic padded segment">
            <h2 class="ui header center aligned">
                {{ $t('login') }}
            </h2>
            <login-form @login="onLogin"></login-form>

            <div class="ui visible message" v-for="message in $root.messages" :key="message.message" :class="message.type">
                {{ message.message }}
            </div>
        </div>
    </div>
</template>

<script>
import LoginForm from '@/components/LoginForm';
export default {
    components: {
        LoginForm
    },

    methods: {
        onLogin() {
            this.$router.replace({ name: 'Panel' });
        }
    }
}
</script>

<style scoped>
#login {
    display: flex;
    flex-grow: 1;
    background-color: #f2f2f2;
}

.segment {
    margin: auto;
    align-self: center;
}

.message {
    position: absolute;
    z-index: 2;
    margin: 0;
    width: 100%;
    left: 0;
    padding: 1rem;
    margin: 1rem 0;
}
</style>
