<template>
  <v-card :title="blockName">
    <template #append>
      <v-btn
        v-if="!isFirst"
        color="primary"
        size="small"
        :icon="displayAsCards ? 'keyboard_arrow_left' : 'keyboard_arrow_up'"
        class="ml-2"
        @click="moveBlock(-1)"
      />
      <v-btn
        v-if="!isLast"
        color="primary"
        size="small"
        :icon="displayAsCards ? 'keyboard_arrow_right' : 'keyboard_arrow_down'"
        class="ml-2"
        @click="moveBlock(1)"
      />
      <v-btn
        color="red"
        size="small"
        icon="clear"
        class="ml-2"
        @click="removeBlock()"
      />
    </template>

    <!-- TODO: Send errors -->
    <FieldList
      :fields="block.fields"
      :data="modelValue.value"
      :errors="{}"
      :blocks="blocks"
      @update:model-value="onFieldInput($event)"
    />
  </v-card>
</template>

<script>

import FieldList from '@/components/fields/helpers/FieldList.vue'

export default {
  components: {
    FieldList
  },
  props: {
    blocks: Object, // In case there's a nested ListField, pass through
    block: Object,
    modelValue: Object,
    displayAsCards: {
      type: Boolean,
      default: false
    },
    isFirst: {
      type: Boolean,
      default: false
    },
    isLast: {
      type: Boolean,
      default: false
    }
  },
  emits: ['move', 'remove', 'update:modelValue'],

  computed: {
    blockName () {
      return this.block.name
    }
  },

  methods: {
    moveBlock (direction) {
      this.$emit('move', direction)
    },
    removeBlock () {
      this.$emit('remove')
    },
    onFieldInput (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>
