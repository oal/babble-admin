<template>
    <v-card outlined>
        <div class="image-field-preview grey darken-4" v-if="previewImage">
            <img :src="previewImage" class="elevation-3">
        </div>

        <div class="grey lighten-5">
            <v-card-actions v-if="croppedImage && selection">
                <v-btn text color="primary" @click="onReCrop" v-if="croppedImage && hasCropper">
                    <v-icon left>crop</v-icon>
                    {{ $t('reCrop') }} {{ label }}
                </v-btn>
                <v-btn text color="blue-grey" dark @click="onDeselectFile">
                    <v-icon left>folder</v-icon>
                    {{ $t('chooseAnotherFile') }}
                </v-btn>
            </v-card-actions>

            <v-card-actions v-else>
                <v-btn dark color="blue-grey" @click="onOpenFileManager">
                    <v-icon left>add_a_photo</v-icon>
                    <span v-if="selection">{{ $t('chooseAnotherFile') }}</span>
                    <span v-else>{{ $t('choose') }} {{ label }}</span>
                </v-btn>
            </v-card-actions>
        </div>

        <v-dialog fullscreen transition="dialog-bottom-transition" v-model="showFileManager">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon @click.native="showFileManager = false" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ $t('fileManager') }}</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <file-manager @input="onSelectFile" :directory="directory" v-if="showFileManager"></file-manager>
                </v-card-text>
            </v-card>
        </v-dialog>

        <image-editor-dialog @preview="croppedImage = $event" v-model="showImageEditor" :image="value"
                             @image="syncInput" :options="options"/>
    </v-card>
</template>

<script>
    import FileManager from './helpers/FileManager';
    import ImageCropper from './helpers/ImageCropper';
    import ImageEditorDialog from './helpers/ImageEditorDialog';

    export default {
        name: 'image-field',
        props: [
            'value',
            'name',
            'label',
            'options'
        ],
        components: {
            FileManager,
            ImageCropper,
            ImageEditorDialog
        },
        data() {
            return {
                showFileManager: false,
                showImageEditor: false,
                selection: null,
                directory: null,
                croppedImage: null,
            }
        },
        created() {
            this.reset();
        },
        methods: {
            reset() {
                let croppedImage = null;
                if (this.value && this.value.url) {
                    croppedImage = this.value.url;
                }
                let filename = (this.value ? this.value.filename : null) || null;
                let directory = '/';
                if (filename) directory = '/' + filename.split('/').slice(0, -1).join('/');

                this.selection = filename;
                this.directory = directory;
                this.croppedImage = croppedImage;
            },
            syncInput(value) {
                this.$emit('input', value);
            },
            setFile(filename) {
                this.$emit('input', {
                    filename: filename
                });
            },
            onOpenFileManager() {
                this.showFileManager = true;
            },
            closeImageEditor() {
                this.showImageEditor = false;
                // If no cropped version was already set, unset selection as cropped version is still missing.
                if (!this.croppedImage) {
                    this.setFile(null);
                }
            },
            onSelectFile(file) {
                this.croppedImage = null;
                this.setFile(file);
                this.showFileManager = false;
                if (this.hasCropper) {
                    this.showImageEditor = true;
                }
            },
            onDeselectFile() {
                this.croppedImage = null;
                this.showFileManager = true;
                this.setFile(null);
            },
            onReCrop() {
                this.showImageEditor = true;
            },
        },

        watch: {
            value() {
                if (!this.value) {
                    // Reset state when value is set to null or undefined (happens in ListField when moved).
                    this.reset();
                }
            }
        },

        computed: {
            hasCropper() {
                return this.options && this.options.admin && this.options.admin.crop;
            },
            previewImage() {
                if (this.croppedImage) {
                    return this.croppedImage;
                }
                if (this.value && this.value.filename) {
                    if (this.value.url) {
                        return `/uploads/${this.value.url}`;
                    }
                    return `/uploads/${this.value.filename}`;
                }
                return null;
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .image-field-preview {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.8rem;

        img {
            max-width: 100%;
            max-height: 320px;
            display: block;
            border: 1px solid rgba(#fff, 0.2);
            background-clip: padding-box;
        }
    }
</style>