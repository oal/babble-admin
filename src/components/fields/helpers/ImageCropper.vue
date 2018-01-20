<template>
    <div style="width: 100%">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/0.8.1/cropper.css">
        <img ref="image" :src="src" style="max-width: 100%">

        <div class="ui basic segment">
            <div class="ui menu">
                <a class="item" @click="flipHorizontal">
                    <i class="resize horizontal icon"></i>
                    {{ $t('flipHorizontal') }}
                </a>
                <a class="item" @click="flipVertical">
                    <i class="resize vertical icon"></i>
                    {{ $t('flipVertical') }}
                </a>
                <a class="item" @click="rotateLeft">
                    <i class="level up icon"></i>
                    {{ $t('rotateLeft') }}
                </a>
                <a class="item" @click="rotateRight">
                    <i class="level down icon"></i>
                    {{ $t('rotateRight') }}
                </a>
                <a class="right active blue item" @click="onConfirmCrop">
                    <i class="crop icon"></i>
                    <strong>{{ $t('confirmCrop') }}</strong>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
    import Cropper from 'cropperjs';

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

        mounted() {
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
        },

        computed: {
            aspectRatio() {
                if (!this.width || !this.height) return 0;
                return this.width / this.height;
            }
        }
    }
</script>

<style scoped>
    .segment {
        margin-top: 0;
    }
</style>
