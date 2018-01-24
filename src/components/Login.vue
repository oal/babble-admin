<template>
    <v-container fill-height>
        <v-layout align-center>
            <v-flex justify-center>
                <v-card>
                    <v-card-text>
                        <h4 class="headline">
                            {{ $t('login') }}
                        </h4>
                        <login-form @login="onLogin"></login-form>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
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
                a: true
            }
        },

        methods: {
            onLogin() {
                this.$router.replace({name: 'Panel'});
            }
        }
    }
</script>

<style scoped>
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
