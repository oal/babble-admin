<template>
    <div class="field">
        <label>{{ label }}</label>

        <div v-if="selection">
            <div class="field">
                <div class="ui buttons">
                    <a :href="'/uploads/' + selection" class="button" target="_blank">{{ selection }}</a>
                    <div class="blue icon button" @click="onOpenFileManager">
                        <i class="folder icon"></i>
                    </div>
                </div>
            </div>
        </div>

        <div class="blue labeled icon button" v-else-if="!openFileManager" @click="onOpenFileManager">
            <i class="folder icon"></i>
            {{ $t('chooseFile') }}
        </div>

        <v-dialog fullscreen transition="dialog-bottom-transition" v-model="openFileManager">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon @click.native="openFileManager = false" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ $t('fileManager') }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <file-manager @input="onSelectFile"></file-manager>
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

        methods: {
            onOpenFileManager() {
                this.selection = null;
                this.showFileManager = true;
            },

            onSelectFile(file) {
                this.selection = file;
                this.$emit('input', this.selection);
                this.croppedImage = null;
            },

            onDeselectFile() {
                this.selection = null;
            },
        }
    }
</script>
