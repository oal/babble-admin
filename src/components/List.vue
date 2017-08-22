<template>
    <div>
        <div class="ui loading basic segment" v-if="loading"></div>
        <div v-else>
            <div class="flex between">
                <h1>{{ model.name_plural }}</h1>
                <router-link v-bind:to="{name: 'Create', params: {modelType: model.type}}"
                             class="blue labeled icon button">
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
                    <td v-for="column in listDisplay" :key="column.key" :class="{highlight: column.key === 'id'}">
                        <component :is="column.type + '-preview'"
                                   :value="getColumnValue(column, record)"
                                   :field="column"
                                   v-if="hasPreviewComponent(column)"></component>
                        <div v-else>{{ getColumnValue(column, record) }}</div>
                    </td>

                    <td>
                        <router-link v-bind:to="{name: 'Edit', params: {modelType: model.type, id: record.id}}"
                                     class="green labeled icon button">
                            <i class="edit icon"></i>
                            {{ $t('edit') }}
                        </router-link><!--
                        --><div class="red labeled icon button" @click="remove(record)">
                            <i class="remove icon"></i>
                            {{ $t('delete') }}
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import {camelCase, upperFirst} from 'lodash';
    import IdPreview from '@/components/previews/IdPreview';
    import BooleanPreview from '@/components/previews/BooleanPreview';
    import DatetimePreview from '@/components/previews/DatetimePreview';
    import ChoicePreview from '@/components/previews/ChoicePreview';

    export default {
        name: 'panel',

        components: {
            IdPreview,
            BooleanPreview,
            DatetimePreview,
            ChoicePreview
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
            },
            remove(record) {
                let ok = confirm('Do you really want to delete this item?');
                if(!ok) return;

                this.$http.delete('/models/' + this.modelType + '/' + record.id).then(response => {
                    console.log(response);
                    this.fetchData();
                });
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
        }
    }
</script>

<style>
</style>
