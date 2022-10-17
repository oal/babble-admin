<template>
  <td>
    <div class="model-table-cell">
      <component
        :is="column.type + 'Preview'"
        v-if="hasPreviewComponent"
        :model-value="value"
        :field="column"
      />
      <div v-else>
        {{ value }}
      </div>
      <InlineEdit
        v-model:open="isEditing"
        :column="column"
        :error="errors['fields.' + column.key]"
        :model-value="value"
        @update:model-value="save"
      />
    </div>
  </td>
</template>

<script>
import { camelCase, upperFirst } from 'lodash'
import InlineEdit from './helpers/InlineEdit.vue'
import { previews } from '@/fields'
import api from '@/api'

export default {
  components: {
    InlineEdit,
    ...previews
  },

  props: {
    model: Object,
    modelValue: Object,
    column: Object
  },
  emits: ['update:modelValue'],

  data () {
    return {
      changedValue: null,
      errors: {},
      isEditing: false
    }
  },

  computed: {
    hasPreviewComponent () {
      const componentName = upperFirst(`${camelCase(this.column.type)}Preview`)
      return !!this.$options.components[componentName]
    },
    value () {
      return this.modelValue[this.column.key]
    }
  },

  methods: {
    save (newValue) {
      const key = this.column.key
      const partialData = {}
      partialData[key] = newValue
      api.patch(`models/${this.model.type}/${this.modelValue.id}`, partialData).then(response => {
        this.$emit('update:modelValue', {
          ...this.modelValue,
          [key]: response.data[key]
        })
        this.isEditing = false
      }).catch(error => {
        console.log(error)
      })
    }
  }

}
</script>

<style lang="scss">
.model-table-cell {
  display: flex;
  align-items: center;

  .model-table-cell-edit {
    opacity: 0;
    transition: opacity 0.2s;
    margin-left: 0.5rem;
  }

  &:hover {
    .model-table-cell-edit {
      opacity: 1;
    }
  }
}
</style>
