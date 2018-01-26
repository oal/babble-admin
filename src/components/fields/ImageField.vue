<template>
    <div class="field">
        <div v-if="selection">
            <div class="field">
                <div class="ui fluid card">
                    <div class="image">
                        <img :src="croppedImage" v-if="croppedImage" class="ui image">
                        <img :src="'/uploads/' + selection" v-else-if="!hasCropper" class="ui image">
                        <image-cropper v-else :src="'/uploads/' + selection" :width="width"
                                       :height="height" @crop="onCrop" :crop-data="cropData"></image-cropper>
                    </div>
                    <div class="extra content" v-if="selection">
                        <a class="right floated" @click="onDeselectFile">
                            <i class="folder icon"></i>
                            {{ $t('chooseAnotherFile') }}
                        </a>
                        <a @click="onReCrop" v-if="croppedImage && hasCropper">
                            <i class="crop icon"></i>
                            {{ $t('reCrop') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <v-btn dark color="blue-grey" v-else-if="!openFileManager" @click="onOpenFileManager">
            {{ $t('choose') }} {{ label }}
            <v-icon right>add_a_photo</v-icon>
        </v-btn>

        <v-dialog fullscreen transition="dialog-bottom-transition" v-model="openFileManager">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon @click.native="openFileManager = false" dark>
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>{{ $t('fileManager') }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat @click.native="dialog = false">Save</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    <file-manager @input="onSelectFile" :directory="directory"></file-manager>
                </v-card-text>
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
                openFileManager: false,
                selection: filename,
                directory: directory,
                croppedImage: croppedImage,
            }
        },

        methods: {
            onOpenFileManager() {
                this.openFileManager = true;
            },

            onSelectFile(file) {
                this.selection = file;
                this.croppedImage = null;
                this.$emit('input', {
                    filename: this.selection
                });
                this.openFileManager = false;
            },

            onDeselectFile() {
                this.selection = null;
                this.croppedImage = null;
                this.openFileManager = true;
                this.$emit('input', {
                    filename: this.selection
                });
            },

            onReCrop() {
                this.croppedImage = null;
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
    .card {
        overflow: hidden;
    }

    .card .image {
        background: #333 url('/static/checkerboard.png');

        img {
            width: auto;
            max-width: 100%;
            margin: auto;
            border-radius: 0;
            box-shadow: 0 0 25px rgba(#000, 0.25);
        }
    }
</style>
