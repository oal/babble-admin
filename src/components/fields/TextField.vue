<template>
    <v-text-field :label="label" :value="value" @input="onInput" :textarea="!!getOption('admin.multiline')" :error-messages="error">
    </v-text-field>
</template>

<script>
    import {get} from 'lodash';

    export default {
        name: 'text-field',

        props: [
            'options',
            'value',
            'label',
            'error'
        ],

        methods: {
            getOption(path) {
                return get(this.options, path, null)
            },
            onInput(value) {
                this.$emit('input', value);
            }
        }
    }
</script>