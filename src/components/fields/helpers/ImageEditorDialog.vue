<template>
  <v-dialog
    :fullscreen="true"
    transition="dialog-bottom-transition"
    :model-value="modelValue"
  >
    <v-card>
      <v-toolbar color="primary">
        <v-btn
          icon="close"
          @click="close"
        />
        <v-toolbar-title>{{ $t('imageEditor') }}</v-toolbar-title>
      </v-toolbar>
      <ImageCropper
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
import ImageCropper from './ImageCropper.vue'

export default {
  components: {
    ImageCropper
  },
  props: {
    modelValue: Boolean,
    image: Object,
    options: Object
  },
  emits: ['update:modelValue', 'image', 'preview'],

  computed: {
    cropData () {
      if (this.modelValue && this.modelValue.crop) return this.modelValue.crop
      return null
    },
    width () {
      if (this.options && this.options.width) return this.options.width
      return null
    },
    height () {
      if (this.options && this.options.height) return this.options.height
      return null
    }
  },
  methods: {
    close () {
      this.$emit('update:modelValue', false)
    },

    onCrop (previewCanvas, cropData) {
      previewCanvas.toBlob(blob => {
        const reader = new FileReader()
        reader.onload = () => {
          this.$emit('image', {
            ...this.image,
            crop: cropData
          })
          this.$emit('preview', reader.result)
          this.close()
        }
        reader.readAsDataURL(blob)
      })
    }
  }
}
</script>
