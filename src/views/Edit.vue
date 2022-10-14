<template>
  <v-layout
    v-if="loading"
    fill-height
    justify-center
    align-center
  >
    <v-progress-circular
      indeterminate
      color="primary"
    />
  </v-layout>
  <v-form
    v-else
    class="fill-height"
  >
    <MainToolbar>
      <template #title>
        <span
          v-if="isNew && !model.single"
          class="blue-grey--text text--lighten-3"
        >{{ $t('new') }}</span>
        <span
          v-else
          class="blue-grey--text text--lighten-3"
        >{{ $t('edit') }}</span>
        <router-link
          v-slot="{ navigate }"
          :to="{name: 'List', params: {modelType: model.type}}"
          custom
        >
          <span
            role="link"
            class="pl-2"
            @click="navigate"
            @keypress.enter="navigate"
          >{{ model.name }}</span>
        </router-link>
      </template>

      <v-layout
        shrink
        wrap
        align-center
      >
        <v-flex
          v-if="!model.single"
          shrink
        >
          <v-card
            class="d-flex align-center mr-3"
            light
          >
            <div class="hidden-xs-only px-3">
              <span v-if="data._permalink">
                <strong class="blue-grey--text">{{ $t('permalink') }}</strong>: {{ data._permalink }}
              </span>
              <span v-else>
                <strong class="blue-grey--text">ID</strong>: {{ data.id }}
              </span>
            </div>

            <v-divider
              vertical
              class="hidden-xs-only"
            />

            <v-btn
              text
              color="blue-grey"
              @click="editId = !editId"
            >
              <v-icon
                icon="link"
                :left="$vuetify.breakpoint.smAndUp"
              />
              <span class="hidden-xs-only">{{ $t('edit') }}</span>
            </v-btn>
          </v-card>
        </v-flex>
        <v-flex shrink>
          <v-btn
            v-if="data._permalink"
            outlined
            tag="a"
            :href="data._permalink"
            target="_blank"
          >
            <v-icon
              icon="open_in_browser"
              :left="$vuetify.breakpoint.smAndUp"
            />
            <span class="hidden-xs-only">{{ $t('view') }} {{ model.name }}</span>
          </v-btn>

          <v-btn
            dark
            color="green"
            class="hidden-md-and-down ml-3"
            @click="save"
          >
            <v-icon
              icon="save"
              left
            />
            {{ $t('save') }} {{ model.name }}
          </v-btn>
        </v-flex>
      </v-layout>
    </MainToolbar>
    <v-container
      fluid
      grid-list-lg
      class="fill-height pa-0"
    >
      <v-layout
        wrap
        class="pl-2"
      >
        <v-flex style="flex-basis: 240px">
          <div v-if="!model.single && (isNew || editId)">
            <v-card>
              <v-card-text>
                <v-text-field
                  v-model="changedId"
                  label="ID"
                  :rules="[validateId]"
                  required
                />
              </v-card-text>
            </v-card>
          </div>
          <div class="pa-sm-2">
            <FieldList
              :fields="mainFields"
              :data="data"
              :errors="errors"
              :blocks="blocks"
              @input="onFieldInput"
            />
          </div>
          <edit-card-actions
            :class="{'hidden-md-and-down': sidebarFields.length > 0}"
            :error="saveError"
            :model="model"
            @save="save"
          />
        </v-flex>
        <v-divider vertical />
        <v-flex
          v-if="sidebarFields.length > 0"
          style="max-width: 460px"
          class="pa-0"
        >
          <div class="fill-height blue-grey lighten-5">
            <v-card-text class="pa-5">
              <FieldList
                :fields="sidebarFields"
                :data="data"
                :errors="errors"
                :blocks="blocks"
                @input="onFieldInput"
              />
            </v-card-text>
            <edit-card-actions
              class="hidden-md-and-up"
              :error="saveError"
              :model="model"
              @save="save"
            />
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
    import {get} from 'lodash';
    import slug from 'slug';

    import FieldList from '../components/fields/helpers/FieldList.vue';
    import EditCardActions from '../components/helpers/EditCardActions.vue';
    import MainToolbar from '../components/MainToolbar.vue';

    export default {
        name: 'Panel',

        components: {
            FieldList,
            EditCardActions,
            MainToolbar
        },

        props: {
            modelType: String,
            id: String
        },

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
        },

        watch: {
            '$route': 'fetchData',
        },

        created() {
            this.fetchData();
        },

        methods: {
            fetchData() {
                this.loading = true;

                if (!this.id) {
                    this.changedId = null;
                    this.data = {};
                }

                this.axios.options('/models/' + this.modelType).then(response => {
                    this.model = response.data.model;
                    this.blocks = response.data.blocks;

                    // Only load record data if ID is set, or if this is a single instance model (doesn't have an ID).
                    if (this.id || this.model.single) {
                        this.axios.get(this.dataPath).then(response => {
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

                let validChars = 'a-z0-9-_';
                if (this.model.hierarchical) {
                    validChars = validChars + '/';
                }

                if (value && !value.match(new RegExp(`^([${validChars}]+)$`, 'g'))) {
                    return this.$t('invalidIdError');
                }
                return true;
            },
            save() {
                this.loading = true;
                let request;
                if (this.id) request = this.axios.put;
                else request = this.axios.post;

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
                let updatedData = {...this.data};
                updatedData[event.key] = event.value;
                this.data = updatedData;
            },
            initEmptyFields() {
                this.model.fields.forEach(field => {
                    if (typeof this.data[field.key] === 'undefined') {
                        this.data[field.key] = '';
                    }
                });

                // Automatic ID if enabled in model options.
                if (!this.data.id && this.autoIdField) {
                    this.data = {...this.data}; // Allows us to watch for changes.

                    let watchKey = 'data.' + this.autoIdField;

                    this.$watch(watchKey, value => {
                        this.changedId = slug(value, {mode: 'rfc3986'}).replace(/[.]/g, '');
                    });
                }
            }
        }
    }
</script>
