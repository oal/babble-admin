<template>
  <v-layout column>
    <v-card style="flex: 0">
      <v-layout wrap>
        <v-btn
          text
          color="teal"
          @click="flipHorizontal"
        >
          <v-icon left>
            swap_horiz
          </v-icon>
          {{ $t('flipHorizontal') }}
        </v-btn>
        <v-btn
          text
          color="teal"
          @click="flipVertical"
        >
          <v-icon left>
            swap_vert
          </v-icon>
          {{ $t('flipVertical') }}
        </v-btn>
        <v-btn
          text
          color="indigo"
          @click="rotateRight"
        >
          <v-icon left>
            rotate_right
          </v-icon>
          {{ $t('rotateRight') }}
        </v-btn>
        <v-btn
          text
          color="indigo"
          @click="rotateLeft"
        >
          <v-icon left>
            rotate_left
          </v-icon>
          {{ $t('rotateLeft') }}
        </v-btn>
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="onConfirmCrop"
        >
          <v-icon left>
            crop
          </v-icon>
          {{ $t('confirmCrop') }}
        </v-btn>
      </v-layout>
    </v-card>

    <v-flex>
      <img
        ref="image"
        :src="src"
        class="editor-target"
      >
    </v-flex>
  </v-layout>
</template>

<script>
    import Cropper from 'cropperjs';
    import 'cropperjs/dist/cropper.min.css';
 
    export default {
        props: [
            'src',
            'width',
            'height',
            'cropData' // Cropping information.
        ],

        data() {
            return {
                cropper: null,
            }
        },

        computed: {
            aspectRatio() {
                if (!this.width || !this.height) return 0;
                return this.width / this.height;
            }
        },

        mounted() {
            console.log('Mounted cropper!');
            // setTimeout so that the cropper gets initialized to the correct size.
            setTimeout(() => {
                this.cropper = new Cropper(this.$refs.image, {
                    rotatable: true,
                    zoomable: true,
                    scalable: true,
                    viewMode: 2,
                    aspectRatio: this.aspectRatio,
                    data: this.cropData || null
                });
            }, 0);
        },

        beforeDestroy() {
            this.cropper.destroy();
        },

        methods: {
            onConfirmCrop() {
                let canvas = this.cropper.getCroppedCanvas({
                    width: this.width,
                    height: this.height
                });
                this.$emit('crop', canvas, this.cropper.getData());
            },
            flipHorizontal() {
                let data = this.cropper.getImageData();
                let flip = data.scaleX === 1 ? -1 : 1;
                this.cropper.scale(flip, 1);
            },
            flipVertical() {
                let data = this.cropper.getImageData();
                let flip = data.scaleY === 1 ? -1 : 1;
                this.cropper.scale(1, flip);
            },
            rotateLeft() {
                this.cropper.rotate(-90);
                this.cropper.move(0);
            },
            rotateRight() {
                this.cropper.rotate(90);
                this.cropper.move(0);
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
