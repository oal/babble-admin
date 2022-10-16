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
import api from "@/api";

export default {
  props: {
    modelValue: String,
    field: Object
  },

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
        if (!this.modelInstance) return this.modelValue;
        return this.modelInstance.title || this.modelInstance.name || this.modelInstance.id;
      }
      const choices = this.field.options.choices;
      if (Array.isArray(choices)) return this.modelValue;
      return choices[this.modelValue];
    },
    modelEditRoute() {
      if (!this.modelInstance) return;
      return {name: 'Edit', params: {modelType: this.relatedModelName, id: this.modelInstance.id}};
    }
  },

  watch: {
    modelValue(oldValue, newValue) {
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
      const model = this.relatedModelName;
      api.get(`/models/${model}/${this.modelValue}`).then(response => {
        this.modelInstance = response.data;
      })
    }
  }
}
</script>
