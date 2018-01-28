<template>
    <v-layout wrap>
        <v-flex>
            <v-text-field :label="label" type="password" v-model="value">
            </v-text-field>
        </v-flex>
        <v-flex>
            <v-text-field :label="$t('confirm')" type="password" v-model="confirmValue" :rules="[validate]">
            </v-text-field>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: 'password-field',

        props: [
            'label'
        ],

        data() {
            return {
                value: '',
                confirmValue: ''
            }
        },

        watch: {
            value() {
                this.emit();
            },
            confirmValue() {
                this.emit();
            }
        },

        methods: {
            emit() {
                this.$emit('input', this.value);
            },
            validate() {
                if(this.value === this.confirmValue) return true;

                return this.$t('invalidPassword');
            }
        }
    }
</script>