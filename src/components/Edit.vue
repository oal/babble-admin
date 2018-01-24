<template>
    <div>
        <div class="ui loading basic segment" v-if="loading"></div>
        <div v-else>
            <h1>
                <span v-if="isNew && !model.single">{{ $t('new') }}</span>
                <span v-else>{{ $t('edit') }}</span>
                {{ model.name }}
            </h1>

            <v-form>
                <v-text-field label="ID" v-model="changedId" :rules="[validateId]" required v-if="!model.single"></v-text-field>

                <field :type="field.type"
                       :label="field.name"
                       :name="field.key"
                       :options="field.options"
                       :class="field.classes"
                       :blocks="blocks"
                       :error="errors['fields.' + field.key]"

                       :value="data[field.key]"
                       @input="onFieldInput(field.key, $event)"

                       v-for="field in processedFields"
                       :key="field.key">
                </field>

                <div class="sixteen wide column">
                    <div class="ui divider"></div>

                    <div class="green labeled icon button" v-on:click="save" v-if="this.dataPath">
                        <i class="save icon"></i>
                        {{ $t('save') }}
                    </div>
                </div>
            </v-form>
        </div>
    </div>
</template>

<script>
    import {upperFirst, camelCase} from 'lodash';
    import slug from 'slug';

    import Field from '@/components/fields/Field';

    const numberToString = (num) => {
        return [
            'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight',
            'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'][num];
    };

    export default {
        name: 'panel',

        components: {
            Field
        },

        props: [
            'modelType',
            'id'
        ],

        data() {
            return {
                isNew: !this.id,
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
                console.log(this.errors.id)
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
                        let location = {
                            name: 'Edit',
                            params: {
                                modelType: this.model.type,
                                id: this.changedId
                            }
                        };
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
            onFieldInput(key, value) {
                this.data[key] = value;
            },
            initEmptyFields() {
                this.model.fields.forEach(field => {
                    if (!this.data[field.key]) {
                        this.data[field.key] = '';
                    }
                });

                // Automatic ID if enabled in model options.
                if (!this.data.id && this.model.options && this.model.options.admin && this.model.options.admin.id) {
                    this.data = {...this.data}; // Allows us to watch for changes.

                    let autoFieldKey = this.model.options.admin.id;
                    let watchKey = 'data.' + autoFieldKey;

                    this.$watch(watchKey, value => {
                        this.changedId = slug(value, {mode: 'rfc3986'});
                    });
                }
            }
        },

        computed: {
            processedFields() {
                return this.model.fields.map(field => {
                    let adminOptions = field.options['admin'];
                    if (adminOptions && adminOptions['columns']) {
                        field.classes = numberToString(adminOptions['columns']) + ' wide';
                    } else {
                        field.classes = 'sixteen wide';
                    }
                    return field;
                });
            },
            dataPath() {
                let path = '/models/' + this.modelType;

                if (this.model.single) return path;
                if (!this.changedId) return null;

                return path + '/' + this.changedId;
            }
        }
    }
</script>

<style>
</style>
