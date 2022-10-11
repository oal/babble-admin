<template>
  <v-checkbox
    v-model="state"
    :label="label"
  />
</template>

<script>
    export default {
        name: 'BooleanField',
        props: {
            value: Boolean,
            name: String,
            label: String
        },
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
        mounted() {
            if (this.value !== this.state) this.$emit('input', this.state);
        },
    }
</script>
