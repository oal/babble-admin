<template>
    <v-card-actions>
        <v-btn text dark color="green" v-on:click="save" v-if="!error">
            <v-icon left>save</v-icon>
            {{ $t('save') }} {{ model.name }}
        </v-btn>
        <v-tooltip right v-else>
            <template v-slot:activator="{ on }">
                <v-btn text dark color="red" v-on="on">
                    <v-icon left>error</v-icon>
                    {{ $t('save') }} {{ model.name }}
                </v-btn>
            </template>
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
