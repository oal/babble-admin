<template>
    <div class="field">
        <label>{{ label }}</label>
        <select v-model="choice">
            <option v-for="choice in choices" :value="choice.value" :key="choice.key">{{ choice.label }}</option>
        </select>
    </div>
</template>

<script>
import { get } from 'lodash';
export default {
    name: 'choice-field',

    props: [
        'options',
        'value',
        'label'
    ],

    data() {
        return {
            choice: this.value
        };
    },

    watch: {
        choice(value) {
            this.$emit('input', value);
        }
    },

    computed: {
        choices() {
            let choices = this.options.choices;
            // Array (use values as keys as well)
            if (Array.isArray(choices)) {
                return choices.map(choice => {
                    return {
                        value: choice,
                        label: choice,
                        key: choice
                    }
                });
            }
            // An object (keys and values)
            return Object.keys(choices).map((value) => {
                return {
                    value: value,
                    label: choices[value],
                    key: value
                }
            });
        }
    }
}
</script>
