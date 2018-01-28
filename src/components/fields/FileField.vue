<template>
    <div>
        <v-chip :href="'/uploads/' + selection" close v-if="selection" @input="onDeselectFile">
            {{ label }}:
            {{ selection }}
        </v-chip>

        <v-btn dark color="blue-grey" v-else @click="onOpenFileManager">
            {{ $t('choose') }} {{ label }}
            <v-icon right>add_a_photo</v-icon>
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
    import FileManager from '@/components/fields/helpers/FileManager';

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
                showFileManager: false,
                selection: this.value || null
            }
        },

        watch: {
            selection() {
                this.$emit('input', this.selection);
            }
        },

        methods: {
            onOpenFileManager() {
                this.showFileManager = true;
            },

            onSelectFile(file) {
                this.selection = file;
                this.showFileManager = false;
            },

            onDeselectFile() {
                this.selection = null;
            },
        }
    }
</script>
