<template>
    <v-layout fill-height justify-center align-center v-if="loading">
        <v-progress-circular indeterminate color="primary"/>
    </v-layout>
    <div v-else>
        <MainToolbar>
            <template slot="title">
                {{ model.name_plural }}
            </template>

            <v-btn color="green" :to="{name: 'Create', params: {modelType: model.type}}">
                <v-icon :left="$vuetify.breakpoint.smAndUp">add</v-icon>
                <span class="hidden-xs-only">{{ $t('addRecord') }} {{ model.name }}</span>
            </v-btn>
        </MainToolbar>
        <v-container fluid class="pa-0">
            <v-data-table
                    :headers="headers"
                    @update:sort-by="updateSortBy"
                    @update:sort-desc="updateSortDesc"
                    :sort-by="sortColumn"
                    :sort-desc="sortDesc"
                    hide-default-footer>
                <template v-slot:body="{ items }">
                    <tbody>
                        <ModelTableRow :record="item" v-for="item in models" :key="item.id" :list-display="listDisplay" :model="model" @remove="remove(item)"/>
                    </tbody>
                </template>
            </v-data-table>
        </v-container>
    </div>
</template>

<script>
    import MainToolbar from '../components/MainToolbar';
    import ModelTableRow from '../components/ModelTableRow';
    export default {
        name: 'panel',

        components: {
            MainToolbar,
            ModelTableRow,
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

        created() {
            this.fetchData();
        },

        methods: {
            fetchData() {
                this.loading = true;

                let modelPromise = this.axios.options('/models/' + this.modelType).then(response => {
                    this.model = response.data.model;
                    this.sort = this.options['sort'] || 'id'
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
                return this.axios.get('/models/' + this.modelType, {params: params}).then(response => {
                    this.models = response.data;

                    // If fetchRecords is called outside of fetchData, and it wasn't already loading,
                    // there is no more requests waiting at this time.
                    if (!wasLoading) this.loading = false;
                });
            },
            remove(record) {
                let ok = confirm('Do you really want to delete this item?');
                if (!ok) return;

                this.axios.delete('/models/' + this.modelType + '/' + record.id).then(response => {
                    console.log(response);
                    this.fetchData();
                });
            },
            updateSortBy(column) {
                if(Array.isArray(column)) {
                    column = column[0];
                }
                this.sort = column;
            },
            updateSortDesc(desc) {
                if(desc) {
                    this.sort = `-${this.sort}`;
                } else {
                    this.sort = this.sortColumn; // Without - prefix.
                }
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

        watch: {
            '$route': 'fetchData',
            sort() {
                this.fetchData();
            }
        },

        computed: {
            options: function () {
                let options = this.model.options.admin || {};
                if (!options.list_display) {
                    options.list_display = [this.model.fields[0].key];
                }
                if(!options.sort) {
                    options.sort = this.model.fields[0].key;
                }
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
                let buttonHeader = {text: '', value: null, sortable: false, width: '1px'};
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
            },
            sortColumn() {
                if(this.sort && this.sort.substr(0, 1) === '-') {
                    return this.sort.substr(1, this.sort.length);
                }
                return this.sort;
            },
            sortDesc() {
                if(!this.sort) return false;
                return this.sort.substr(0, 1) === '-';
            }
        }
    }
</script>
