<template>
  <v-layout wrap>
    <v-flex>
      <v-text-field
        v-model="value"
        :label="label"
        type="password"
      />
    </v-flex>
    <v-flex>
      <v-text-field
        v-model="confirmValue"
        :label="$t('confirm')"
        type="password"
        :rules="[validate]"
      />
    </v-flex>
  </v-layout>
</template>

<script>
    export default {
        name: 'PasswordField',

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
