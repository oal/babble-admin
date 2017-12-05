<template>
    <div class="field">
        <label>{{ label }}</label>
        <div class="ui fluid dropdown selection multiple visible">
            <a class="ui label transition visible" style="display: inline-block !important;" v-for="tag in value">
                {{ tag }}<i class="delete icon" @click="remove(tag)"></i>
            </a>
            <input class="search" autocomplete="off" v-model="tag" v-on:keyup="onInput">
        </div>
    </div>
</template>

<script>
    import {get} from 'lodash';

    export default {
        name: 'tags-field',

        props: [
            'options',
            'value',
            'label'
        ],

        data() {
            return {
                tag: ''
            }
        },

        methods: {
            getOption(path) {
                return get(this.options, path, null)
            },

            onInput(event) {
                if (event.key === ' ' || event.key === 'Enter' || event.key === ',') {
                    let value = event.target.value.trim();
                    this.tag = '';

                    if (value.length === 0 || this.value.indexOf(value) !== -1) return;

                    this.$emit('input', [...this.value, value]);
                }
            },

            remove(tag) {
                this.$emit('input', this.value.filter(t => t !== tag));
            }
        }
    }
</script>

<style scoped>
    input {
        border: 0 !important;
        max-width: 150px;
        padding: 6px 0 0 0 !important;
    }
</style>