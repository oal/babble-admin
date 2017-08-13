<template>
    <div>
        <div class="ui loading basic segment" v-if="loading"></div>
        <div v-else>
            <div class="flex between">
                <h1>{{ model.name_plural }}</h1>
                <router-link v-bind:to="{name: 'Create', params: {modelType: model.type}}"
                             class="blue icon button">
                    <i class="add icon"></i>
                    {{ $t('addRecord') }} {{ model.name }}
                </router-link>
            </div>
            <table class="table">
                <thead>
                <tr>
                    <th v-for="column in listDisplay" :class="{collapsing: column.name === 'ID'}" :key="column.key">
                        {{ column.name }}
                    </th>
                    <th>&nbsp;</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="record in models" :key="record.id">
                    <td v-for="column in listDisplay" :key="column.key">
                        <component v-bind:is="column.type + '-preview'"
                                   v-bind:value="getColumnValue(column, record)"
                                   v-if="hasPreviewComponent(column)"></component>
                        <div v-else>{{ getColumnValue(column, record) }}</div>
                    </td>

                    <td>
                        <router-link v-bind:to="{name: 'Edit', params: {modelType: model.type, id: record.id}}"
                                     class="green icon button">
                            <i class="edit icon"></i>
                            {{ $t('edit') }}
                        </router-link><!--
                        --><a href="#" class="red icon button">
                            <i class="remove icon"></i>
                            {{ $t('delete') }}
                        </a>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import {camelCase, upperFirst} from 'lodash';
    import BooleanPreview from '@/components/previews/BooleanPreview';
    import DatetimePreview from '@/components/previews/DatetimePreview';

    export default {
        name: 'panel',

        components: {
            BooleanPreview,
            DatetimePreview
        },

        props: [
            'modelType'
        ],

        data() {
            return {
                loading: true,
                model: {},
                models: [],
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
                    this.model = response.data;
                });
                let recordsPromise = this.$http.get('/models/' + this.modelType).then(response => {
                    this.models = response.data;
                });

                Promise.all([modelPromise, recordsPromise]).then(() => {
                    // Redirect if single instance model.
                    if(this.model.single) {
                        this.$router.replace({name: 'EditSingle', params: {modelType: this.model.type}})
                        return;
                    }
                    this.loading = false;
                });
            },
            getColumnValue(column, record) {
                return record[column.key];
            },
            hasPreviewComponent(column) {
                let componentName = upperFirst(`${camelCase(column.type)}Preview`);
                return !!this.$options.components[componentName];
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
                            type: 'text',
                            options: []
                        },
                        ...columns
                    ];
                }

                return columns;
            },
        }
    }
</script>

<style>
</style>