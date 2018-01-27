<template>
    <v-container>
        <v-layout>
            <v-flex>
                <h1 class="headline pt-2 pb-3">{{ $t('manageContent') }}</h1>
            </v-flex>
        </v-layout>
        <v-container fluid grid-list-md class="pa-0">
            <v-layout row wrap>
                <v-flex d-flex xs12 sm6 md4 v-for="model in models" :key="model.type">
                    <v-card>
                        <v-card-title class="title"
                                      v-if="model.options && model.options.admin && model.options.admin.icon">
                            <span class="pl-2">{{ model.name }}</span>
                            <v-spacer></v-spacer>
                            <v-icon class="hidden-sm-and-down">{{ model.options.admin.icon }}</v-icon>
                        </v-card-title>
                        <v-card-actions>
                            <v-btn color="primary" flat :to="{name: 'List', params: {modelType: model.type}}">
                                {{ $t('viewAll') }}
                                <v-icon right>view_list</v-icon>
                            </v-btn>
                            <v-btn color="green" flat :to="{name: 'Create', params: {modelType: model.type}}"
                                   v-if="!model.single">
                                {{ $t('addRecord') }}
                                <v-icon right>add_circle</v-icon>
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                models: []
            }
        },

        created() {
            this.$http.options('/models').then(response => {
                this.models = response.data;
                this.loading = false;
            });
        }
    }
</script>