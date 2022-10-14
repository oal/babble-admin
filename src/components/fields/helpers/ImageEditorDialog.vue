<template>
  <v-dialog
    fullscreen
    transition="dialog-bottom-transition"
    :model-value="value"
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click.native="close"
        >
          <v-icon icon="close" />
        </v-btn>
        <v-toolbar-title>{{ $t('imageEditor') }}</v-toolbar-title>
      </v-toolbar>
      <image-cropper
        v-if="image && image.filename"
        :src="`/uploads/${image.filename}`"
        :width="width"
        :height="height"
        :crop-data="cropData"
        style="height: calc(100vh - 64px)"
        @crop="onCrop"
      />
    </v-card>
  </v-dialog>
</template>

<script>
    import ImageCropper from './ImageCropper.vue';

    export default {
        components: {
            ImageCropper,
        },
        props: {
            value: Boolean,
            image: Object,
            options: Object
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
        },
        methods: {
            close() {
                this.$emit('update:modelValue', false);
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
        }
    }
</script>