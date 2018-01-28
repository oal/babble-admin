<template>
    <v-layout fill-height justify-center align-center v-if="loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-layout>
    <v-container fluid v-else>
        <v-layout wrap align-center class="pb-3">
            <h1 class="headline">{{ model.name_plural }}</h1>
            <v-spacer></v-spacer>
            <v-btn color="primary" :to="{name: 'Create', params: {modelType: model.type}}"
                   class="blue labeled icon button">
                <i class="add icon"></i>
                {{ $t('addRecord') }} {{ model.name }}
            </v-btn>
        </v-layout>

        <v-data-table
                v-bind:headers="headers"
                :items="models"
                hide-actions
                class="elevation-1">
            <template slot="items" slot-scope="props">
                <td v-for="column in listDisplay" :key="column.key" :class="{highlight: column.key === 'id'}">
                    <component :is="column.type + '-preview'"
                               :value="getColumnValue(column, props.item)"
                               :field="column"
                               v-if="hasPreviewComponent(column)"></component>
                    <div v-else>{{ getColumnValue(column, props.item) }}</div>
                </td>

                <td class="text-xs-right">
                    <v-btn left flat color="green" dark
                           :to="{name: 'Edit', params: {modelType: model.type, id: props.item.id}}">
                        <v-icon left>edit</v-icon>
                        {{ $t('edit') }}
                    </v-btn>
                    <v-btn left flat color="red" dark @click="remove(props.item)">
                        <v-icon left>delete</v-icon>
                        {{ $t('delete') }}
                    </v-btn>
                </td>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
    import {camelCase, upperFirst} from 'lodash';
    import IdPreview from '@/components/previews/IdPreview';
    import BooleanPreview from '@/components/previews/BooleanPreview';
    import DatetimePreview from '@/components/previews/DatetimePreview';
    import ChoicePreview from '@/components/previews/ChoicePreview';
    import TagsPreview from '@/components/previews/TagsPreview';

    export default {
        name: 'panel',

        components: {
            IdPreview,
            BooleanPreview,
            DatetimePreview,
            ChoicePreview,
            TagsPreview
        },

        props: [
            'modelType'
        ],

        data() {
            return {
                loading: true,
                model: {},
                models: [],
                sort: 'id'
            }
        },

        created: function () {
            this.fetchData();
        },

        watch: {
            '$route': 'fetchData'
        },

        methods: {
            fetchData() {
                this.loading = true;

                let modelPromise = this.$http.options('/models/' + this.modelType).then(response => {
                    this.model = response.data.model;
                });

                Promise.all([modelPromise, this.fetchRecords()]).then(() => {
                    // Redirect if single instance model.
                    if (this.model.single) {
                        this.$router.replace({name: 'EditSingle', params: {modelType: this.model.type}})
                        return;
                    }
                    this.loading = false;
                });
            },
            fetchRecords() {
                let wasLoading = this.loading;
                this.loading = true;

                let params = {
                    sort: this.sort
                };
                return this.$http.get('/models/' + this.modelType, {params: params}).then(response => {
                    this.models = response.data;

                    // If fetchRecords is called outside of fetchData, and it wasn't already loading,
                    // there is no more requests waiting at this time.
                    if (!wasLoading) this.loading = false;
                });
            },
            getColumnValue(column, record) {
                return record[column.key];
            },
            hasPreviewComponent(column) {
                let componentName = upperFirst(`${camelCase(column.type)}Preview`);
                return !!this.$options.components[componentName];
            },
            remove(record) {
                let ok = confirm('Do you really want to delete this item?');
                if (!ok) return;

                this.$http.delete('/models/' + this.modelType + '/' + record.id).then(response => {
                    console.log(response);
                    this.fetchData();
                });
            },
            sortBy(columnKey) {
                if (this.sort === columnKey) {
                    this.sort = '-' + columnKey;
                } else {
                    this.sort = columnKey;
                }
                this.fetchRecords();
            }
        },

        computed: {
            options: function () {
                let options = this.model.options.admin || {};
                if (!options.list_display) options.list_display = [this.model.fields[0].key];

                return options;
            },
            fieldsByKey() {
                let fields = {};
                this.model.fields.forEach(field => fields[field.key] = field);
                return fields;
            },
            listDisplay() {
                let columnKeys = this.options['list_display'];

                let columns = columnKeys.filter(fieldKey => fieldKey !== 'id').map(fieldKey => this.fieldsByKey[fieldKey]);

                let idIndex = columnKeys.indexOf('id');
                if (idIndex !== -1) {
                    columns = [
                        {
                            key: 'id',
                            name: 'ID',
                            type: 'id',
                            options: []
                        },
                        ...columns
                    ];
                }

                return columns;
            },
            headers() {
                let buttonHeader = {text: '', value: null, sortable: false};
                return [
                    ...this.listDisplay.map(column => {
                        return {
                            text: column.name,
                            value: column.key,
                            align: 'left'
                        }
                    }),
                    buttonHeader
                ];
            }
        }
    }
</script>
