<template>
    <v-layout wrap>
        <field-wrapper :type="field.type"
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
    export default {
        name: 'FieldList',

        props: [
            'fields',
            'data',
            'errors',
            'blocks'
        ],

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