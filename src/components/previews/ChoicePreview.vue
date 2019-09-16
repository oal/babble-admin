<template>
    <div>
        <router-link :to="modelEditRoute" v-if="modelEditRoute">{{ preview }}</router-link>
        <span v-else>{{ preview }}</span>
    </div>
</template>

<script>
    export default {
        props: [
            'value',
            'field'
        ],

        created() {
            if (this.isModelChoiceField) {
                this.loadData();
            }
        },

        data() {
            return {
                modelInstance: null
            }
        },

        methods: {
            loadData() {
                let model = this.relatedModelName;
                this.axios.get(`/models/${model}/${this.value}`).then(response => {
                    this.modelInstance = response.data;
                })
            }
        },

        computed: {
            relatedModelName() {
                return this.field.options.model;
            },
            isModelChoiceField() {
                return !!this.relatedModelName;
            },
            preview() {
                if (this.isModelChoiceField) {
                    if (!this.modelInstance) return this.value;
                    return this.modelInstance.title || this.modelInstance.name || this.modelInstance.id;
                }
                let choices = this.field.options.choices;
                if (Array.isArray(choices)) return this.value;
                return choices[this.value];
            },
            modelEditRoute() {
                if (!this.modelInstance) return;
                return {name: 'Edit', params: {modelType: this.relatedModelName, id: this.modelInstance.id}};
            }
        }
    }
</script>
