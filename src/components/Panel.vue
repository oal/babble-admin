<template>
    <div class="very padded loading segment" v-if="loading"></div>
    <div id="panel" v-else>
        <header id="top">
            <router-link :to="{name: 'Index'}">Babble CMS Admin</router-link>
            <ul class="top-right">
                <li>{{ $t('welcome') }}, {{ $root.user.id }}!</li>
                <li>
                    <a @click="logout">
                        {{ $t('logout') }}
                        <i class="sign out icon"></i>
                    </a>
                </li>
            </ul>
        </header>
        <div id="main">
            <aside id="sidebar">
                <div class="menu" v-for="model in models" v-bind:key="model.type">
                    <i class="icon" :class="model.options.admin.icon"
                        v-if="model.options && model.options.admin && model.options.admin.icon"></i>
                    <div class="content">
                        <router-link v-bind:to="{name: 'List', params: {modelType: model.type}}" class="header item">
                            <span v-if="model.single">{{ model.name }}</span>
                            <span v-else>{{ model.name_plural }}</span>
                        </router-link>

                        <router-link v-bind:to="{name: 'Create', params: {modelType: model.type}}" class="item" v-if="!model.single">
                            {{ $t('addRecord') }}
                        </router-link>
                    </div>
                </div>

                <div class="menu">
                    <i class="file icon"></i>
                    <div class="content">
                        <router-link v-bind:to="{name: 'Files'}" class="header item">
                            {{ $t('fileManager') }}
                        </router-link>
                    </div>
                </div>
            </aside>
            <article id="content">
                <router-view></router-view>
            </article>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'panel',

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
        },

        data() {
            return {
                loading: false,
                models: []
            }
        },

        methods: {
            logout() {
                this.$http.auth = null;
                this.$router.push({name: 'Login'});
            }
        }
    }
</script>
