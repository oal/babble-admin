<template>
    <v-app>

        <v-navigation-drawer v-model="drawer" light fixed clipped app>
            <v-list dense v-if="!loading">
                <v-list-tile v-for="model in models" :key="model.type"
                             :to="{name: 'List', params: {modelType: model.type}}">
                    <v-list-tile-action>
                        <v-icon v-if="model.options && model.options.admin && model.options.admin.icon">
                            {{ model.options.admin.icon }}
                        </v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <span v-if="model.single">{{ model.name }}</span>
                            <span v-else>{{ model.name_plural }}</span>
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>

                <v-list-tile :to="{name: 'Files'}">
                    <v-list-tile-action>
                        <v-icon>folder</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{ $t('fileManager') }}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>

        <v-toolbar dark color="primary" fixed app class="pl-3 toolbar--clipped">
            <v-btn icon @click="drawer = !drawer">
                <v-icon>menu</v-icon>
            </v-btn>
            <v-toolbar-title class="hidden-sm-and-down">
                <router-link tag="div" :to="{name: 'Index'}">Babble CMS Admin</router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-title v-if="$root.user" class="hidden-sm-and-down pr-3">
                {{ $t('welcome') }}, {{ $root.user.id }}!
            </v-toolbar-title>
            <v-toolbar-items align-center>
                <v-btn flat @click="logout">
                    {{ $t('logout') }}
                    <i class="sign out icon"></i>
                </v-btn>
            </v-toolbar-items>
        </v-toolbar>

        <v-content>
            <v-container fill-height v-if="loading">
                <v-layout justify-center align-center>
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-layout>
            </v-container>

            <router-view v-else></router-view>

            <v-dialog persistent v-model="showLoginDialog" max-width="300px">
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-toolbar-title>{{ $t('login') }}</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <login-form @login="onLogin"></login-form>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-content>
    </v-app>
</template>

<script>
    import LoginForm from '@/components/LoginForm';

    export default {
        name: 'panel',

        components: {
            LoginForm
        },

        created: function () {
            this.loading = true;

            this.$http.get('/login').then(response => {
                this.$root.user = response.data;
                this.$http.options('/models').then(response => {
                    this.models = response.data;
                    this.loading = false;
                });
            }).catch(() => {
                this.$router.push({name: 'Login'});
                this.loading = false;
            });

            this.$http.interceptors.response.use(null, (error) => {
                if (error.response.status === 401) {
                    this.showLoginDialog = true;
                }
                return Promise.reject(error);
            });
        },

        data() {
            return {
                loading: false,
                drawer: true,
                showLoginDialog: false,
                models: []
            }
        },

        methods: {
            logout() {
                this.$http.auth = null;
                this.$router.push({name: 'Login'});
            },
            onLogin() {
                this.showLoginDialog = false;
            }
        }
    }
</script>

<style scoped>
    #login-overlay {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(25, 25, 25, 0.8);
        z-index: 1;
        display: flex;
    }
</style>
