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

            <v-btn color="green" large depressed :loading="building" @click="build" class="build-button" v-if="canBuildViaAPI">
                <v-icon left>publish</v-icon>
                {{ $t('publish') }}
            </v-btn>
            <v-toolbar-items align-center>
                <v-btn flat @click="logout">
                    {{ $t('logout') }}
                    <v-icon right>logout</v-icon>
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
    import {get} from 'lodash';
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

                let promises = [
                    this.$http.options('/models').then(response => {
                        this.models = response.data;
                    }),
                    this.$http.get('/config').then(response => {
                        this.config = response.data;
                    })
                ];

                Promise.all(promises).then(() => {
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
                building: false,
                drawer: true,
                showLoginDialog: false,
                config: {},
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
            },
            build() {
                this.building = true;
                this.$http.post('build').then(response => {
                    this.$root.addMessage(this.$t('publishSuccess'));
                }).finally(() => {
                    this.building = false;
                });
            }
        },

        computed: {
            canBuildViaAPI() {
                if (!this.config) return false;

                try {
                    return this.config.api.build;
                } catch (e) {
                    return false;
                }
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

    .build-button {
        padding: 0 24px 0 20px;
    }
</style>
