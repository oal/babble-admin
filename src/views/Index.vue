<template>
    <div>
        <main-toolbar>
            <template slot="title">
                {{ $t('manageContent') }}
            </template>
        </main-toolbar>
        <v-progress-circular indeterminate v-if="loading"/>
        <v-container fluid grid-list-md v-if="!loading">
            <v-layout row wrap>
                <v-flex d-flex xs12 sm6 md4 v-for="model in models" :key="model.type">
                    <v-card outlined class="grow">
                        <v-card-title class="title py-3"
                                      v-if="model.options && model.options.admin && model.options.admin.icon">
                            <v-icon left class="hidden-sm-and-down">{{ model.options.admin.icon }}</v-icon>
                            <span>{{ model.name }}</span>
                        </v-card-title>
                        <v-card-actions class="grey lighten-4">
                            <v-btn color="green" dark :to="{name: 'Create', params: {modelType: model.type}}"
                                   v-if="!model.single">
                                <v-icon left>add</v-icon>
                                {{ $t('addRecord') }}
                            </v-btn>

                            <v-btn color="green" dark :to="{name: 'EditSingle', params: {modelType: model.type}}"
                                   v-if="model.single">
                                <v-icon left>edit</v-icon>
                                {{ $t('edit') }}
                            </v-btn>
                            <v-btn color="primary" text :to="{name: 'List', params: {modelType: model.type}}" v-else>
                                <v-icon left>view_list</v-icon>
                                {{ $t('viewAll') }}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import MainToolbar from '../components/MainToolbar';

    export default {
        components: {
            MainToolbar
        },
        data() {
            return {
                loading: false,
                models: []
            }
        },

        created() {
            this.loading = true;
            this.axios.options('/models').then(response => {
                this.models = response.data;
                this.loading = false;
            });
        }
    }
</script>
