<template>
    <v-select v-model="tags" :label="label" chips tags></v-select>
</template>

<script>
    export default {
        name: 'tags-field',

        props: [
            'options',
            'value',
            'label'
        ],

        data() {

            return {
                tags: []
            }
        },

        mounted() {
            if (!Array.isArray(this.value)) {
                let value = [];
                if (this.value) value.push(this.value);
                this.tags = value;
            } else {
                this.tags = [...this.value];
            }
        },

        watch: {
            value(value) {
                this.$emit('input', value);
            },
            tags(value) {
                this.$emit('input', value);
            }
        }
    }
</script>
