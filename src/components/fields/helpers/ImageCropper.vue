<template>
  <v-layout column>
    <v-card style="flex: 0">
      <v-layout wrap>
        <v-btn
          color="teal"
          prepend-icon="swap_horiz"
          @click="flipHorizontal"
        >
          {{ $t('flipHorizontal') }}
        </v-btn>
        <v-btn
          color="teal"
          prepend-icon="swap_vert"
          @click="flipVertical"
        >
          {{ $t('flipVertical') }}
        </v-btn>
        <v-btn

          color="indigo"
          prepend-icon="rotate_right"
          @click="rotateRight"
        >
          {{ $t('rotateRight') }}
        </v-btn>
        <v-btn
          color="indigo"
          prepend-icon="rotate_left"
          @click="rotateLeft"
        >
          {{ $t('rotateLeft') }}
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          prepend-icon="crop"
          @click="onConfirmCrop"
        >
          {{ $t('confirmCrop') }}
        </v-btn>
      </v-layout>
    </v-card>

    <div style="width: 100%">
      <img
        ref="image"
        :src="src"
        class="editor-target"
      >
    </div>
  </v-layout>
</template>

<script lang="ts">
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'
import { PropType } from 'vue'

export default {
  props: {
    src: String,
    width: Number,
    height: Number,
    cropData: {
      type: Object as PropType<Cropper.SetDataOptions> // Cropping information.
    }
  },
  emits: ['crop'],

  data () {
    return {
      cropper: null
    }
  },

  computed: {
    aspectRatio () {
      if (!this.width || !this.height) return 0
      return this.width / this.height
    }
  },

  mounted () {
    console.log('Mounted cropper!')
    // setTimeout so that the cropper gets initialized to the correct size.
    setTimeout(() => {
      this.cropper = new Cropper(this.$refs.image, {
        rotatable: true,
        zoomable: true,
        scalable: true,
        viewMode: 2,
        aspectRatio: this.aspectRatio,
        data: this.cropData || null
      })
    }, 0)
  },

  beforeUnmount () {
    this.cropper.destroy()
  },

  methods: {
    onConfirmCrop () {
      const canvas = this.cropper.getCroppedCanvas({
        width: this.width,
        height: this.height
      })
      this.$emit('crop', canvas, this.cropper.getData())
    },
    flipHorizontal () {
      const data = this.cropper.getImageData()
      const flip = data.scaleX === 1 ? -1 : 1
      this.cropper.scale(flip, 1)
    },
    flipVertical () {
      const data = this.cropper.getImageData()
      const flip = data.scaleY === 1 ? -1 : 1
      this.cropper.scale(1, flip)
    },
    rotateLeft () {
      this.cropper.rotate(-90)
      this.cropper.move(0)
    },
    rotateRight () {
      this.cropper.rotate(90)
      this.cropper.move(0)
    }
  }
}
</script>

<style scoped>
.editor-target {
  height: 0;
  width: 0;
}
</style>
