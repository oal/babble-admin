<template>
    <div class="field">
        <label>{{ label }}</label>
        <div :class="{'top attached': !displayAsCards}" class="ui menu">
            <a class="item" v-for="block in blockObjects" @click="addBlock(block.type)" :key="block.type">
                <i class="add icon"></i> {{ block.name }}
            </a>
        </div>

        <div :class="{'ui cards': displayAsCards, 'ui attached segment': !displayAsCards}">
            <div :class="{'card': displayAsCards, 'ui vertical segment': !displayAsCards}"
                 v-for="(block, $index) in blocksWithFields" :key="block.key" v-if="block">
                <div class="content">
                    <div class="flex between header">
                        <strong>{{ getBlockName(block.type) }}</strong>
                        <div class="right floated">
                            <div class="tiny blue icon button" @click="moveBlock($index, -1)" v-if="$index > 0">
                                <i class="caret icon" :class="{left: displayAsCards, up: !displayAsCards}"></i>
                            </div><!--
                            --><div class="tiny blue icon button" @click="moveBlock($index, 1)" v-if="$index < blocksWithFields.length-1">
                                <i class="caret icon" :class="{right: displayAsCards, down: !displayAsCards}"></i>
                            </div><!--
                            --><div class="tiny red icon button" @click="removeBlockAt($index)">
                                <i class="remove icon"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="content">
                    <field :type="field.type"
                           :label="field.name"
                           :name="field.key"
                           :options="field.options"
                           :blocks="blocks"

                           :value="blockData[$index].value[field.key]"
                           @input="onFieldInput($index, field.key, $event)"

                           v-for="field in block.fields"
                           :key="field.key">
                    </field>
                </div>
            </div>
            <div class="ui visible error message" v-else>
                Could not find block type.
            </div>
        </div>
    </div>
</template>

<script>
    import {get} from 'lodash';

    import Field from '@/components/fields/Field';

    export default {
        props: [
            'value',
            'name',
            'label',
            'options',
            'blocks'
        ],

        beforeCreate: function () {
            // Relevant: https://vuejs.org/v2/guide/components.html#Recursive-Components
            this.$options.components.Field = require('./Field.vue')
        },

        data() {
            return {
                blockData: this.value ? [...this.value] : []
            }
        },

        methods: {
            getBlock(blockType) {
                return this.blockObjects.filter(block => block.type === blockType)[0];
            },
            getBlockName(blockType) {
                return this.getBlock(blockType).name;
            },
            addBlock(type) {
                this.blockData.push({
                    type: type,
                    value: {},
                    key: (Math.random()*9999999)|0
                });
                this.emitInput();
            },

            moveBlock(index, movement) {
                // Swap.
                let temp = this.blockData[index+movement];
                this.blockData[index + movement] = this.blockData[index];
                this.blockData[index] = temp;

                // Trigger change.
                this.blockData = [...this.blockData];
                this.emitInput();
            },
            removeBlockAt(index) {
                this.blockData.splice(index, 1);
                this.emitInput();
            },

            onFieldInput(blockIndex, key, value) {
                this.blockData[blockIndex].value[key] = value;
                this.emitInput();
            },
            emitInput() {
                this.$emit('input', [...this.blockData]);
            }
        },

        computed: {
            blocksWithFields() {
                if(!this.blocks) return [];
                return this.blockData.map((blockData, index) => {
                    let block = this.getBlock(blockData.type);
                    if (!block) return null;

                    return {
                        ...blockData,
                        fields: block.fields,
                        key: index
                    };
                })
            },

            displayAsCards() {
                return this.options.admin && this.options.admin.cards === true;
            },

            blockObjects() {
                let blockTypes = this.options.blocks;
                let blocks = [];
                blockTypes.forEach(type => {
                    blocks.push(this.blocks[type]);
                });
                return blocks;
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
