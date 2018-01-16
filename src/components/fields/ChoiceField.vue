<template>
    <div class="field">
        <label>{{ label }}</label>
        <input disabled v-if="loading">
        <select class="ui dropdown" v-model="choice" v-else>
            <option v-for="choice in choices" :value="choice.value" :key="choice.key">{{ choice.label }}</option>
        </select>
    </div>
</template>

<script>
    import {get} from 'lodash';

    export default {
        name: 'choice-field',

        props: [
            'options',
            'value',
            'label'
        ],

        data() {
            return {
                loading: false,
                choices: [],
                choice: this.value
            };
        },

        created() {
            this.choices = this.choicesToArray();
            if(!this.choices.length) {
                this.loadModel();
            }
        },

        methods: {
            choicesToArray() {
                let choices = this.options.choices;
                if (!choices) return [];

                // Array (use values as keys as well)
                if (Array.isArray(choices)) {
                    return choices.map(choice => {
                        return {
                            value: choice,
                            label: choice,
                            key: choice
                        }
                    });
                }
                // An object (keys and values)
                return Object.keys(choices).map((value) => {
                    return {
                        value: value,
                        label: choices[value],
                        key: value
                    }
                });
            },

            loadModel() {
                this.loading = true;
                let modelType = this.options.model;

                this.$http.options('/models/' + modelType).then(response => {
                    let previewField = response.data.model.fields[0].key; // TODO: Allow overriding this.
                    this.$http.get('/models/' + modelType).then(response => {
                        this.choices = response.data.map(record => {
                            return {
                                value: record.id,
                                label: record[previewField], // TODO: Allow specifying preview in model definition.
                                key: record.id
                            }
                        });
                        this.loading = false;
                    });
                })
            }
        },

        watch: {
            choice(value) {
                this.$emit('input', value);
            }
        },

    }
</script>
