<template>
  <tr>
    <ModelTableCell
      v-for="column in listDisplay"
      :key="column.key"
      :model-value="modelValue"
      :class="{highlight: column.key === 'id'}"
      :column="column"
      :model="model"
      @update:model-value="$emit('update:modelValue', $event)"
    />

    <td class="text-xs-right text-no-wrap">
      <v-btn
        class="mr-2"
        left
        color="green"
        prepend-icon="edit"
        :to="{name: 'Edit', params: {modelType: model.type, id: modelValue.id}}"
      >
        {{ $t('edit') }}
      </v-btn>
      <v-btn
        left
        variant="text"
        color="red"
        prepend-icon="delete"
        @click="remove(modelValue)"
      >
        {{ $t('delete') }}
      </v-btn>
    </td>
  </tr>
</template>

<script>
import ModelTableCell from '../components/ModelTableCell.vue'

export default {
  components: {
    ModelTableCell
  },

  props: {
    modelValue: Object,
    model: Object,
    listDisplay: Array
  },
  emits: ['remove', 'update:modelValue'],

  methods: {
    remove () {
      this.$emit('remove')
    }
  }
}
</script>
