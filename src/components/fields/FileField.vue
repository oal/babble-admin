<template>
    <div>
        <v-chip close v-if="value" @click:close="onDeselectFile">
            {{ label }}:&nbsp;
            <a :href="'/uploads/' + value" target="_blank" download class="blue-grey--text text--darken-2">
                {{ value }}
            </a>
        </v-chip>

        <v-btn dark color="blue-grey" v-else @click="onOpenFileManager">
            <v-icon left>insert_drive_file</v-icon>
            {{ $t('choose') }} {{ label }}
        </v-btn>

        <v-dialog fullscreen transition="dialog-bottom-transition" v-model="showFileManager">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon @click.native="showFileManager = false" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ $t('fileManager') }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <file-manager @input="onSelectFile" v-if="showFileManager"></file-manager>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import FileManager from '../fields/helpers/FileManager';

    export default {
        name: 'file-field',

        props: [
            'value',
            'name',
            'label',
            'options'
        ],

        components: {
            FileManager
        },

        data() {
            return {
                showFileManager: false
            }
        },

        methods: {
            onOpenFileManager() {
                this.showFileManager = true;
            },

            onSelectFile(file) {
                this.$emit('input', file);
                this.showFileManager = false;
            },

            onDeselectFile() {
                this.$emit('input', null);
            },
        }
    }
</script>
