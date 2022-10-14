<template>
  <v-card outlined>
    <div
      v-if="previewImage"
      class="image-field-preview grey darken-4"
    >
      <img
        :src="previewImage"
        class="elevation-3"
      >
    </div>

    <div class="grey lighten-5">
      <v-card-actions v-if="croppedImage && selection">
        <v-btn
          v-if="croppedImage && hasCropper"
          text
          color="primary"
          @click="onReCrop"
        >
          <v-icon
            icon="crop"
            left
          />
          {{ $t('reCrop') }} {{ label }}
        </v-btn>
        <v-btn
          text
          color="blue-grey"
          dark
          @click="onDeselectFile"
        >
          <v-icon
            icon="folder"
            left
          />
          {{ $t('chooseAnotherFile') }}
        </v-btn>
      </v-card-actions>

      <v-card-actions v-else>
        <v-btn
          dark
          color="blue-grey"
          @click="onOpenFileManager"
        >
          <v-icon
            icon="add_a_photo"
            left
          />
          <span v-if="selection">{{ $t('chooseAnotherFile') }}</span>
          <span v-else>{{ $t('choose') }} {{ label }}</span>
        </v-btn>
      </v-card-actions>
    </div>

    <v-dialog
      v-model="showFileManager"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar
          dark
          color="primary"
        >
          <v-btn
            icon
            dark
            @click.native="showFileManager = false"
          >
            <v-icon icon="close" />
          </v-btn>
          <v-toolbar-title>{{ $t('fileManager') }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <file-manager
            v-if="showFileManager"
            :directory="directory"
            @input="onSelectFile"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <ImageEditorDialog
      v-model="showImageEditor"
      :image="value"
      :options="options"
      @preview="croppedImage = $event"
      @image="syncInput"
    />
  </v-card>
</template>

<script>
    import FileManager from './helpers/FileManager.vue';
    import ImageEditorDialog from './helpers/ImageEditorDialog.vue';

    export default {
        name: 'ImageField',
        components: {
            FileManager,
            ImageEditorDialog
        },
        props: {
            value: Object,
            name: String,
            label: String,
            options: Object
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
        },

        watch: {
            value() {
                if (!this.value) {
                    // Reset state when value is set to null or undefined (happens in ListField when moved).
                    this.reset();
                }
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
