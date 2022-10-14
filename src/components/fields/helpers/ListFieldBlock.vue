<template>
  <v-card>
    <v-card-text>
      <v-layout align-center>
        <v-flex>
          <h3 class="subheading">
            {{ blockName }}
          </h3>
        </v-flex>
        <v-spacer />
        <div>
          <v-btn
            v-if="!isFirst"
            color="primary"
            small
            icon
            class="ml-0"
            @click="moveBlock(-1)"
          >
            <v-icon
              v-if="displayAsCards"
              icon="keyboard_arrow_left"
            />
            <v-icon
              v-else
              icon="keyboard_arrow_up"
            />
          </v-btn>
          <v-btn
            v-if="!isLast"
            color="primary"
            small
            icon
            class="ml-0"
            @click="moveBlock(1)"
          >
            <v-icon
              v-if="displayAsCards"
              icon="keyboard_arrow_right"
            />
            <v-icon
              v-else
              icon="keyboard_arrow_down"
            />
          </v-btn>
          <v-btn
            color="red"
            dark
            small
            icon
            class="ml-0"
            @click="removeBlock()"
          >
            <v-icon icon="clear" />
          </v-btn>
        </div>
      </v-layout>
    </v-card-text>

    <v-card-text>
      <!-- TODO: Send errors -->
      <FieldList
        :fields="block.fields"
        :data="value.value"
        :errors="{}"
        :blocks="blocks"
        @input="onFieldInput($event)"
      />
    </v-card-text>
  </v-card>
</template>

<script>
    import FieldList from '@/components/fields/helpers/FieldList.vue';

    export default {
        props: {
            blocks: Object, // In case there's a nested ListField, pass through
            block: Object,
            value: Object,
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

        computed: {
            blockName() {
                return this.block.name;
            }
        },

        beforeCreate: function () {
            // Relevant: https://vuejs.org/v2/guide/components.html#Recursive-Components
            this.$options.components.FieldList = FieldList
        },

        methods: {
            moveBlock(direction) {
                this.$emit('move', direction);
            },
            removeBlock() {
                this.$emit('remove');
            },
            onFieldInput(value) {
                this.$emit('input', value);
            }
        }
    }
</script>