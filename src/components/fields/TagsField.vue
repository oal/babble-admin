<template>
    <v-select v-model="value" :label="label" chips tags></v-select>
</template>

<script>
    export default {
        name: 'tags-field',

        props: [
            'options',
            'value',
            'label'
        ],

        mounted() {
            if (!Array.isArray(this.value)) {
                this.$emit('input', []);
            }
        }
    }
</script>
