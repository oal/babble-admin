<template>
    <v-checkbox :label="label" v-model="state"/>
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
        mounted() {
            if (this.value !== this.state) this.$emit('input', this.state);
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
