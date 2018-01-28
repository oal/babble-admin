<template>
    <v-layout fill-height justify-center align-center v-if="loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-layout>
    <v-form v-else>
        <v-container fluid grid-list-lg>
            <v-layout column>
                <v-flex>
                    <v-layout wrap align-center>
                        <v-flex>
                            <h1 class="headline">
                                <span v-if="isNew && !model.single">{{ $t('new') }}</span>
                                <span v-else>{{ $t('edit') }}</span>
                                {{ model.name }}
                            </h1>
                        </v-flex>

                        <v-spacer></v-spacer>

                        <v-flex style="flex-grow: 0" v-if="!model.single">
                            <span v-if="data._permalink">
                                <strong>{{ $t('permalink') }}</strong>: {{ data._permalink }}
                            </span>
                            <span v-else>
                                <strong>ID</strong>: {{ data.id }}
                            </span>

                            <v-btn dark color="blue-grey" @click="editId = true">
                                {{ $t('edit') }}
                                <v-icon right>link</v-icon>
                            </v-btn>

                            <v-btn color="secondary" v-if="data._permalink" tag="a" :href="data._permalink"
                                   target="_blank">
                                {{ $t('view') }} {{ model.name }}
                                <v-icon right>open_in_browser</v-icon>
                            </v-btn>

                            <v-btn dark color="green" v-on:click="save" class="hidden-md-and-down">
                                {{ $t('save') }} {{ model.name }}
                                <v-icon right>save</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-flex>

                <v-flex v-if="!model.single && (isNew || editId)">
                    <v-card>
                        <v-card-text>
                            <v-text-field label="ID" v-model="changedId" :rules="[validateId]" required>
                            </v-text-field>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-flex>
                    <v-layout wrap>
                        <v-flex style="flex-basis: 240px">
                            <v-card>
                                <v-card-text>
                                    <field-list :fields="mainFields"
                                                :data="data"
                                                :errors="errors"
                                                :blocks="blocks"
                                                @input="onFieldInput">
                                    </field-list>
                                </v-card-text>
                                <edit-card-actions :class="{'hidden-md-and-down': sidebarFields.length > 0}"
                                                   :error="saveError" :model="model" @save="save">
                                </edit-card-actions>
                            </v-card>
                        </v-flex>
                        <v-flex v-if="sidebarFields.length > 0" style="max-width: 460px">
                            <v-card>
                                <v-card-text>
                                    <field-list :fields="sidebarFields"
                                                :data="data"
                                                :errors="errors"
                                                :blocks="blocks"
                                                @input="onFieldInput">
                                    </field-list>
                                </v-card-text>
                                <edit-card-actions class="hidden-md-and-up" :error="saveError" :model="model"
                                                   @save="save">
                                </edit-card-actions>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </v-form>
</template>

<script>
    import {upperFirst, camelCase, get} from 'lodash';
    import slug from 'slug';

    import FieldList from '@/components/fields/helpers/FieldList';
    import EditCardActions from '@/components/helpers/EditCardActions';

    export default {
        name: 'panel',

        components: {
            FieldList,
            EditCardActions
        },

        props: [
            'modelType',
            'id'
        ],

        data() {
            return {
                a: true,
                isNew: !this.id,
                editId: false,
                changedId: this.id,
                loading: true,
                model: {},
                blocks: {},
                data: {},
                errors: {}
            }
        },

        created: function () {
            this.fetchData();
        },

        watch: {
            '$route': 'fetchData',
        },

        methods: {
            fetchData() {
                this.loading = true;

                if (!this.id) {
                    this.changedId = null;
                    this.data = {};
                }

                this.$http.options('/models/' + this.modelType).then(response => {
                    this.model = response.data.model;
                    this.blocks = response.data.blocks;

                    // Only load record data if ID is set, or if this is a single instance model (doesn't have an ID).
                    if (this.id || this.model.single) {
                        this.$http.get(this.dataPath).then(response => {
                            this.data = response.data;
                            this.initEmptyFields();
                            this.loading = false;
                        });
                    } else {
                        this.initEmptyFields();
                        this.loading = false;
                    }
                });
            },
            validateId(value) {
                if (this.errors.id) {
                    return this.errors.id;
                }
                if (value && !value.match(/^([a-z0-9-_]+)$/)) {
                    return this.$t('invalidIdError');
                }
                return true;
            },
            save() {
                this.loading = true;
                let request;
                if (this.id) request = this.$http.put;
                else request = this.$http.post;

                let data = this.data;
                if (this.id !== this.changedId) {
                    data = {
                        ...this.data,
                        '_old_id': this.id
                    };
                }

                request(this.dataPath, data).then(response => {
                    // Redirect if page didn't already have an ID. Otherwise, update data.
                    if (this.id !== response.data.id) {
                        let location;
                        if (this.model.single) {
                            location = {
                                name: 'EditSingle',
                                params: {
                                    modelType: this.model.type
                                }
                            };
                        } else {
                            location = {
                                name: 'Edit',
                                params: {
                                    modelType: this.model.type,
                                    id: this.changedId
                                }
                            };
                        }
                        this.$router.push(location);
                    } else {
                        Object.keys(this.data).forEach(field => {
                            this.data[field] = response.data[field];
                        });
                    }

                    this.errors = {};
                    this.loading = false;
                }).catch(error => {
                    let errors = {};
                    error.response.data.errors.forEach(errorObject => {
                        errors[errorObject.property] = errorObject.message;
                    })
                    this.errors = errors;
                    this.loading = false
                });
            },
            onFieldInput(event) {
                this.data[event.key] = event.value;
            },
            initEmptyFields() {
                this.model.fields.forEach(field => {
                    if (!this.data[field.key]) {
                        this.data[field.key] = '';
                    }
                });

                // Automatic ID if enabled in model options.
                if (this.autoIdField) {
                    this.data = {...this.data}; // Allows us to watch for changes.

                    let watchKey = 'data.' + this.autoIdField;

                    this.$watch(watchKey, value => {
                        this.changedId = slug(value, {mode: 'rfc3986'}).replace(/[.]/g, '');
                    });
                }
            }
        },

        computed: {
            mainFields() {
                return this.model.fields.filter(field => {
                    return !get(field, 'options.admin.sidebar');
                }).map(field => {
                    let numColumns = get(field, 'options.admin.columns') || 12;
                    field.classes = 'md' + numColumns;
                    return field;
                });
            },
            sidebarFields() {
                return this.model.fields.filter(field => {
                    return get(field, 'options.admin.sidebar') === true;
                });
            },
            dataPath() {
                let path = '/models/' + this.modelType;

                if (this.model.single) return path;
                if (!this.changedId) return null;

                return path + '/' + this.changedId;
            },

            autoIdField() {
                let field = get(this.model, 'options.admin.id');
                if (!field) return null;

                let fieldKeys = this.model.fields.map(field => field.key);
                if (fieldKeys.indexOf(field) === -1) return null;

                return field;
            },

            saveError() {
                return this.dataPath ? null : this.$t('missingIdError');
            }
        }
    }
</script>

<style>
</style>
