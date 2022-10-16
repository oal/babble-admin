<template>
  <v-select
    v-model="choice"
    :label="label"
    :items="choices"
    item-value="value"
    item-title="label"
    :loading="loading"
  />
</template>

<script>
import api from "@/api";

export default {
  name: 'ChoiceField',

  props: {
    options: Object,
    modelValue: String,
    label: String
  },
emits: ['update:modelValue'],

  data() {
    return {
      loading: false,
      choices: [],
      choice: this.modelValue
    };
  },

  watch: {
    choice(value) {
      this.$emit('update:modelValue', value);
    }
  },

  created() {
    this.choices = this.choicesToArray();
    if (!this.choices.length) {
      this.loadModel();
    }
  },

  methods: {
    choicesToArray() {
      const choices = this.options.choices;
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
      const modelType = this.options.model;

      api.options('/models/' + modelType).then(response => {
        const previewField = response.data.model.fields[0].key; // TODO: Allow overriding this.
        api.get('/models/' + modelType).then(response => {
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

}
</script>
