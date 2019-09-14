<template>
    <div>
        {{ preview }}
    </div>
</template>

<script>
    export default {
        props: [
            'value',
            'field'
        ],

        computed: {
            preview() {
                let choices = this.field.options.choices;
                if(!choices) return this.value;
                if(Array.isArray(choices)) return this.value;

                return choices[this.value];
            }
        }
    }
</script>
