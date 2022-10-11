<template>
  <v-combobox
    v-model="tags"
    :label="label"
    chips
    multiple
  />
</template>

<script>
    export default {
        name: 'TagsField',
        props: {
            options: Object,
            value: [String, Array],
            label: String
        },
        data() {
            return {
                tags: []
            }
        },
        watch: {
            value(value) {
                this.$emit('input', value);
            },
            tags(value) {
                this.$emit('input', value);
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
        }
    }
</script>
