<template>
  <div>
    <router-link
      v-if="modelEditRoute"
      :to="modelEditRoute"
    >
      {{ preview }}
    </router-link>
    <span v-else>{{ preview }}</span>
  </div>
</template>

<script>
    export default {
        props: [
            'value',
            'field'
        ],

        data() {
            return {
                modelInstance: null
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
        },

        watch: {
            value(oldValue, newValue) {
                if (this.isModelChoiceField && oldValue !== newValue) {
                    this.loadData();
                }
            }
        },

        created() {
            if (this.isModelChoiceField) {
                this.loadData();
            }
        },

        methods: {
            loadData() {
                let model = this.relatedModelName;
                this.axios.get(`/models/${model}/${this.value}`).then(response => {
                    this.modelInstance = response.data;
                })
            }
        }
    }
</script>
