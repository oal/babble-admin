<template>
    <div>
        <div v-if="croppedImage" class="image-card">
            <img :src="croppedImage">
            <v-layout wrap v-if="selection">
                <v-btn flat color="primary" @click="onReCrop" v-if="croppedImage && hasCropper">
                    <v-icon left>crop</v-icon>
                    {{ $t('reCrop') }} {{ label }}
                </v-btn>
                <v-btn flat color="blue-grey" dark @click="onDeselectFile">
                    <v-icon left>folder</v-icon>
                    {{ $t('chooseAnotherFile') }}
                </v-btn>
            </v-layout>
        </div>

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
                    <file-manager @input="onSelectFile" :directory="directory" v-if="showFileManager"></file-manager>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog fullscreen transition="dialog-bottom-transition" v-model="showImageEditor">
            <v-card style="display: flex; flex-direction: column">
                <v-toolbar dark color="primary">
                    <v-btn icon @click.native="closeImageEditor" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ $t('imageEditor') }}</v-toolbar-title>
                </v-toolbar>
                <image-cropper :src="'/uploads/' + selection" :width="width"
                               :height="height" @crop="onCrop" :crop-data="cropData"
                               v-if="showImageEditor && selection">
                </image-cropper>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import FileManager from '@/components/fields/helpers/FileManager';
    import ImageCropper from '@/components/fields/helpers/ImageCropper';

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
            ImageCropper
        },

        data() {
            let croppedImage = null;
            if (this.value && this.value.url) {
                croppedImage = this.value.url;
            }

            let filename = (this.value ? this.value.filename : null) || null;

            let directory = '/';
            if (filename) directory = '/' + filename.split('/').slice(0, -1).join('/');

            return {
                showFileManager: false,
                showImageEditor: false,
                selection: filename,
                directory: directory,
                croppedImage: croppedImage,
            }
        },

        methods: {
            onOpenFileManager() {
                this.showFileManager = true;
            },

            closeImageEditor() {
                this.showImageEditor = false;

                // If no cropped version was already set, unset selection as cropped version is still missing.
                if (!this.croppedImage) {
                    this.selection = null;
                }
            },

            onSelectFile(file) {
                this.selection = file;
                this.croppedImage = null;
                this.$emit('input', {
                    filename: this.selection
                });
                this.showFileManager = false;

                if (this.hasCropper) {
                    this.showImageEditor = true;
                }
            },

            onDeselectFile() {
                this.selection = null;
                this.croppedImage = null;
                this.showFileManager = true;
                this.$emit('input', {
                    filename: this.selection
                });
            },

            onReCrop() {
                this.showImageEditor = true;
            },

            onCrop(previewCanvas, cropData) {
                previewCanvas.toBlob(blob => {
                    let reader = new FileReader();
                    reader.onload = () => {
                        this.croppedImage = reader.result;
                        this.$emit('input', {
                            filename: this.selection,
                            crop: cropData
                        });
                        this.showImageEditor = false;
                    };
                    reader.readAsDataURL(blob);
                });
            }
        },

        computed: {
            hasCropper() {
                return this.options && this.options.admin && this.options.admin.crop;
            },
            width() {
                if (this.options && this.options.width) return this.options.width;
                return null;
            },
            height() {
                if (this.options && this.options.height) return this.options.height;
                return null;
            },
            cropData() {
                if (this.value && this.value.crop) return this.value.crop;
                return null;
            }
        }
    }
</script>

<style lang="scss" type="text/scss" scoped>
    .image-card {
        max-width: 500px;

        img {
            max-width: 100%;
        }
    }
</style>
