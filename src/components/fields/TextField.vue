<template>
  <v-textarea
    v-if="!!getOption('admin.multiline')"
    :label="label"
    :value="value"
    :error-messages="error"
    @input="onInput"
  />
  <v-text-field
    v-else
    :label="label"
    :value="value"
    :error-messages="error"
    @input="onInput"
  />
</template>

<script>
    import {get} from 'lodash';

    export default {
        name: 'TextField',

        props: {
            options: Object,
            value: String,
            label: String,
            error: String
        },

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
