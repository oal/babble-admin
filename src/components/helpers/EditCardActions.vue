<template>
    <v-card-actions>
        <v-btn flat dark color="green" v-on:click="save" v-if="!error">
            <v-icon left>save</v-icon>
            {{ $t('save') }} {{ model.name }}
        </v-btn>
        <v-tooltip right v-else>
            <v-btn flat dark color="red" slot="activator">
                <v-icon left>error</v-icon>
                {{ $t('save') }} {{ model.name }}
            </v-btn>
            <span>{{ error }}</span>
        </v-tooltip>
    </v-card-actions>
</template>

<script>
    export default {
        props: [
            'model',
            'error'
        ],

        methods: {
            save() {
                this.$emit('save');
            }
        }
    }
</script>