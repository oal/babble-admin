<template>
    <v-checkbox :label="label" v-model="state"></v-checkbox>
</template>

<script>

    export default {
        name: 'boolean-field',

        props: [
            'value',
            'name',
            'label'
        ],

        data() {
            return {
                state: !!this.value
            }
        },

        watch: {
            value() {
                this.state = this.value
            },
            state() {
                this.$emit('input', this.state);
            }
        },
    }
</script>