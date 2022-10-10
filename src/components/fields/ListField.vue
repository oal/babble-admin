<template>
    <v-card color="grey lighten-5">
        <v-card-title>
            <v-layout>
                <v-flex>
                    <h2 class="headline mb-0">{{ label }}</h2>
                </v-flex>
                <v-spacer></v-spacer>
                <div>
                    <v-btn text color="green" v-for="block in blockObjects" @click="addBlock(block.type)"
                           :key="block.type">
                        <v-icon left>add_circle</v-icon>
                        {{ block.name }}
                    </v-btn>
                </div>
            </v-layout>
        </v-card-title>

        <v-card-text v-if="error" class="red--text">{{ error }}</v-card-text>

        <v-card-text class="pt-0" v-if="blocksWithFields.length > 0">
            <v-layout :column="!displayAsCards" wrap>
                <v-flex :md4="displayAsCards" v-for="(block, $index) in blocksWithFields" :key="block.key">
                    <ListFieldBlock :block="block.block" :blocks="blocks" :value="block.value" :is-first="$index === 0"
                                    :is-last="$index === blocksWithFields.length-1" :display-as-cards="displayAsCards"
                                    @input="onFieldInput($index, $event)" @move="moveBlock($index, $event)"
                                    @remove="removeBlockAt($index)"/>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script>
    import {get} from 'lodash';
    import ListFieldBlock from "./helpers/ListFieldBlock";

    export default {
        name: 'list-field',
        components: {
            ListFieldBlock
        },

        props: {
            value: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            name: String,
            label: String,
            options: Object,
            blocks: Object,
            error: Object
        },

        created() {
            // Set an internal key on field init for all data blocks for reordering etc. to work nicely.
            if (Array.isArray(this.value)) {
                this.value.forEach(item => {
                    item._key = Math.floor(Math.random() * 99999999).toString(16);
                })
            }
        },

        methods: {
            addBlock(type) {
                this.$emit('input', [
                    ...this.value,
                    {
                        type: type,
                        value: {}
                    }
                ]);
            },

            moveBlock(index, movement) {
                let newValue = [...this.value];
                // Swap.
                let temp = newValue[index + movement];
                newValue[index + movement] = newValue[index];
                newValue[index] = temp;

                this.$emit('input', newValue);
            },

            removeBlockAt(index) {
                let newValue = [...this.value];
                newValue.splice(index, 1);

                this.$emit('input', newValue);
            },

            onFieldInput(blockIndex, event) {
                let newFieldValue = {...this.value[blockIndex]};
                newFieldValue.value[event.key] = event.value;

                let newValue = [...this.value];
                newValue[blockIndex] = newFieldValue;

                this.$emit('input', newValue);
            }
        },

        computed: {
            blocksWithFields() {
                if (!this.blocks) return [];
                return this.value.map(blockData => {
                    let block = this.blocks[blockData.type];
                    if (!block) return null;

                    return {
                        value: blockData,
                        block: block,
                        key: blockData._key
                    };
                }).filter(it => !!it)
            },

            displayAsCards() {
                return get(this.options, 'admin.cards') === true;
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
