<template>
  <tr>
    <ModelTableCell
      v-for="column in listDisplay"
      :key="column.key"
      :class="{highlight: column.key === 'id'}"
      :column="column"
      :model="model"
      :record="record"
    />

    <td class="text-xs-right text-no-wrap">
      <v-btn
        class="mr-2"
        left
        color="green"
        prepend-icon="edit"
        :to="{name: 'Edit', params: {modelType: model.type, id: record.id}}"
      >
        {{ $t('edit') }}
      </v-btn>
      <v-btn
        left
        variant="text"
        color="red"
        prepend-icon="delete"
        @click="remove(record)"
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
    record: Object,
    model: Object,
    listDisplay: Array
  },
  emits: ['remove'],

  methods: {
    remove () {
      this.$emit('remove')
    }
  }
}
</script>
