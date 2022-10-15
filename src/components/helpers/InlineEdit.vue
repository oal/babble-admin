<template>
  <v-menu
    v-if="column.type !== 'id'"
    :model-value="open"
    :close-on-content-click="false"
    @update:model-value="setVisibility($event)"
  >
    <template #activator="{ props: menu }">
      <v-btn
        icon="edit"
        color="orange"
        class="model-table-cell-edit"
        v-bind="menu"
      />
    </template>
    <v-card width="320px">
      <FieldWrapper
        v-model="internalValue"
        :type="column.type"
        :label="column.name"
        :name="column.key"
        :options="column.options"
        :class="column.classes"
        :blocks="[]"
        class="pt-3"
      />

      <v-card-actions>
        <v-btn
          color="secondary"
          @click="setVisibility(false)"
        >
          {{ $t('close') }}
        </v-btn>
        <v-btn
          color="primary"
          @click="save"
        >
          {{ $t('save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  name: 'InlineEdit',

  props: {
    column: Object,
    error: String,
    modelValue: {},
    open: Boolean
  },
  emits: ['update:modelValue', 'update:open'],

  data() {
    return {
      internalValue: null
    }
  },

  watch: {
    modelValue: {
      handler() {
        this.internalValue = JSON.parse(JSON.stringify(this.modelValue))
      },
      immediate: true
    }
  },

  methods: {
    save() {
      this.$emit('update:modelValue', this.internalValue)
    },
    setVisibility(state) {
      this.$emit('update:open', state)
    }
  }
}
</script>
