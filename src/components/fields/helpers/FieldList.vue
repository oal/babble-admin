<template>
    <v-layout wrap>
        <Field :type="field.type"
               :label="field.name"
               :name="field.key"
               :options="field.options"
               :class="field.classes"
               :blocks="blocks"
               :error="errors['fields.' + field.key]"

               :value="data[field.key]"
               @input="onInput(field.key, $event)"

               v-for="field in fields"
               :key="field.key"/>
    </v-layout>
</template>

<script>
    import Field from './Field';

    export default {
        name: 'field-list',

        props: [
            'fields',
            'data',
            'errors',
            'blocks'
        ],

        components: {
            Field
        },

        methods: {
            onInput(field, value) {
                this.$emit('input', {
                    key: field,
                    value: value
                });
            }
        }
    }
</script>