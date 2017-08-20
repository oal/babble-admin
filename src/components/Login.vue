<template>
    <div id="login">
        <div class="ui basic padded segment">
            <h2 class="ui header center aligned">
                {{ $t('login') }}
            </h2>
            <login-form @login="onLogin"></login-form>
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
</style>
