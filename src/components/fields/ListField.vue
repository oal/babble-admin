<template>
    <v-card color="grey lighten-3">
        <v-card-title>
            <v-layout>
                <v-flex>
                    <h2 class="headline mb-0">{{ label }}</h2>
                </v-flex>
                <v-spacer></v-spacer>
                <div>
                    <v-btn flat color="green" v-for="block in blockObjects" @click="addBlock(block.type)"
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
                <v-flex v-for="(block, $index) in blocksWithFields" :key="block.key" v-if="block">
                    <v-card>
                        <v-card-text>
                            <v-layout align-center>
                                <v-flex>
                                    <h3 class="subheading">
                                        {{ getBlockName(block.type) }}
                                    </h3>
                                </v-flex>
                                <v-spacer></v-spacer>
                                <div>
                                    <v-btn color="primary" small icon @click="moveBlock($index, -1)" class="ml-0"
                                           v-if="$index > 0">
                                        <v-icon v-if="displayAsCards">keyboard_arrow_left</v-icon>
                                        <v-icon v-else>keyboard_arrow_up</v-icon>
                                    </v-btn>
                                    <v-btn color="primary" small icon @click="moveBlock($index, 1)" class="ml-0"
                                           v-if="$index < blocksWithFields.length-1">
                                        <v-icon v-if="displayAsCards">keyboard_arrow_right</v-icon>
                                        <v-icon v-else>keyboard_arrow_down</v-icon>
                                    </v-btn>
                                    <v-btn color="red" dark small icon @click="removeBlockAt($index)" class="ml-0">
                                        <v-icon>clear</v-icon>
                                    </v-btn>
                                </div>
                            </v-layout>
                        </v-card-text>

                        <v-card-text>
                            <!-- TODO: Send errors -->
                            <field-list :fields="block.fields"
                                        :data="blockData[$index].value"
                                        :errors="{}"
                                        :blocks="blocks"
                                        @input="onFieldInput($index, $event)">
                            </field-list>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
</template>

<script>
    import {get} from 'lodash';
    import FieldList from '@/components/fields/helpers/FieldList.vue';

    export default {
        props: [
            'value',
            'name',
            'label',
            'options',
            'blocks',
            'error'
        ],

        beforeCreate: function () {
            // Relevant: https://vuejs.org/v2/guide/components.html#Recursive-Components
            this.$options.components.FieldList = FieldList
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
                    key: (Math.random() * 9999999) | 0
                });
                this.emitInput();
            },

            moveBlock(index, movement) {
                // Swap.
                let temp = this.blockData[index + movement];
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

            onFieldInput(blockIndex, event) {
                this.blockData[blockIndex].value[event.key] = event.value;
                this.emitInput();
            },
            emitInput() {
                this.$emit('input', [...this.blockData]);
            }
        },

        computed: {
            blocksWithFields() {
                if (!this.blocks) return [];
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
