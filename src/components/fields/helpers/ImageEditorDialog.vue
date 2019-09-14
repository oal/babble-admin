<template>
    <v-dialog fullscreen transition="dialog-bottom-transition" :value="value">
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon @click.native="close" dark>
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>{{ $t('imageEditor') }}</v-toolbar-title>
            </v-toolbar>
            <image-cropper :src="`/uploads/${image.filename}`" :width="width"
                           :height="height" @crop="onCrop" :crop-data="cropData"
                           v-if="image && image.filename" style="height: calc(100vh - 64px)">
            </image-cropper>
        </v-card>
    </v-dialog>
</template>

<script>
    import ImageCropper from './ImageCropper';

    export default {
        components: {
            ImageCropper,
        },
        props: {
            value: Boolean,
            image: Object,
            options: Object
        },
        methods: {
            close() {
                this.$emit('input', false);
            },

            onCrop(previewCanvas, cropData) {
                previewCanvas.toBlob(blob => {
                    let reader = new FileReader();
                    reader.onload = () => {
                        this.$emit('image', {
                            ...this.image,
                            crop: cropData
                        });
                        this.$emit('preview', reader.result);
                        this.close();
                    };
                    reader.readAsDataURL(blob);
                });
            }
        },

        computed: {
            cropData() {
                if (this.value && this.value.crop) return this.value.crop;
                return null;
            },
            width() {
                if (this.options && this.options.width) return this.options.width;
                return null;
            },
            height() {
                if (this.options && this.options.height) return this.options.height;
                return null;
            },
        }
    }
</script>