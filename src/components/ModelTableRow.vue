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
        left
        color="green"
        dark
        :to="{name: 'Edit', params: {modelType: model.type, id: record.id}}"
      >
        <v-icon left>
          edit
        </v-icon>
        {{ $t('edit') }}
      </v-btn>
      <v-btn
        left
        text
        color="red"
        dark
        @click="remove(record)"
      >
        <v-icon left>
          delete
        </v-icon>
        {{ $t('delete') }}
      </v-btn>
    </td>
  </tr>
</template>

<script>
    import ModelTableCell from '../components/ModelTableCell';

    export default {
        components: {
            ModelTableCell
        },

        props: {
            record: Object,
            model: Object,
            listDisplay: Array,
        },

        methods: {
            remove() {
                this.$emit('remove');
            }
        }
    }
</script>
