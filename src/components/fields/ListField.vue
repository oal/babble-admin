<template>
  <v-card
    :title="label"
    color="grey lighten-5"
  >
    <template #append>
      <v-btn
        v-for="block in blockObjects"
        :key="block.type"
        text
        color="green"
        prepend-icon="add_circle"
        @click="addBlock(block.type)"
      >
        {{ block.name }}
      </v-btn>
    </template>

    <v-card-text
      v-if="error"
      class="red--text"
    >
      {{ error }}
    </v-card-text>

    <v-card-text
      v-if="blocksWithFields?.length > 0"
      class="pt-0"
    >
      <v-row v-if="blocksWithFields">
        <v-col
          v-for="(block, $index) in blocksWithFields"
          :key="block.key"
          :cols="displayAsCards ? 4 : 12"
        >
          <ListFieldBlock
            :block="block.block"
            :blocks="blocks"
            :model-value="block.value"
            :is-first="$index === 0"
            :is-last="$index === blocksWithFields.length-1"
            :display-as-cards="displayAsCards"
            @update:model-value="onFieldInput($index, $event)"
            @move="moveBlock($index, $event)"
            @remove="removeBlockAt($index)"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { get } from 'lodash'
import ListFieldBlock from './helpers/ListFieldBlock.vue'

export default {
  name: 'ListField',
  components: {
    ListFieldBlock
  },

  props: {
    modelValue: {
      type: Array,
      default: () => ([])
    },
    name: String,
    label: String,
    options: Object,
    blocks: Object,
    error: Object
  },
  emits: ['update:modelValue'],

  computed: {
    value () {
      return this.modelValue ?? []
    },
    blocksWithFields () {
      if (!this.blocks) return []
      return (this.modelValue ?? []).map(blockData => {
        const block = this.blocks[blockData.type]
        if (!block) return null

        return {
          value: blockData,
          block,
          key: blockData._key
        }
      }).filter(it => !!it)
    },

    displayAsCards () {
      return get(this.options, 'admin.cards') === true
    },

    blockObjects () {
      const blockTypes = this.options.blocks
      const blocks = []
      blockTypes.forEach(type => {
        blocks.push(this.blocks[type])
      })
      return blocks
    }
  },

  created () {
    // Set an internal key on field init for all data blocks for reordering etc. to work nicely.
    this.value.forEach(item => {
      item._key = Math.floor(Math.random() * 99999999).toString(16)
    })
  },

  methods: {
    addBlock (type) {
      this.$emit('update:modelValue', [
        ...this.value,
        {
          type,
          value: {}
        }
      ])
    },

    moveBlock (index, movement) {
      const newValue = [...this.value]
      // Swap.
      const temp = newValue[index + movement]
      newValue[index + movement] = newValue[index]
      newValue[index] = temp

      this.$emit('update:modelValue', newValue)
    },

    removeBlockAt (index) {
      const newValue = [...this.value]
      newValue.splice(index, 1)

      this.$emit('update:modelValue', newValue)
    },

    onFieldInput (blockIndex, event) {
      const newFieldValue = { ...this.value[blockIndex] }
      newFieldValue.value[event.key] = event.value

      const newValue = [...this.value]
      newValue[blockIndex] = newFieldValue

      this.$emit('update:modelValue', newValue)
    }
  }
}
</script>

<style scoped>
    .card {
        flex-grow: 1;
    }

    .vertical.segment:first-child {
        padding-top: 0;
    }
</style>
