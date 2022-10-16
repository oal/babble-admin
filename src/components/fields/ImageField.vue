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
          prepend-icon="crop"
          @click="onReCrop"
        >
          {{ $t('reCrop') }} {{ label }}
        </v-btn>
        <v-btn
          text
          color="blue-grey"
          dark
          prepend-icon="folder"
          @click="onDeselectFile"
        >
          {{ $t('chooseAnotherFile') }}
        </v-btn>
      </v-card-actions>

      <v-card-actions v-else>
        <v-btn
          dark
          color="blue-grey"
          prepend-icon="add_a_photo"
          @click="onOpenFileManager"
        >
          <template v-if="selection">
            {{ $t('chooseAnotherFile') }}
          </template>
          <template v-else>
            {{ $t('choose') }} {{ label }}
          </template>
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
            icon="close"
            @click="showFileManager = false"
          />
          <v-toolbar-title>{{ $t('fileManager') }}</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <file-manager
            v-if="showFileManager"
            :directory="directory"
            @update:model-value="onSelectFile"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <ImageEditorDialog
      v-model="showImageEditor"
      :image="modelValue"
      :options="options"
      @preview="croppedImage = $event"
      @image="syncInput"
    />
  </v-card>
</template>

<script>
import FileManager from './helpers/FileManager.vue'
import ImageEditorDialog from './helpers/ImageEditorDialog.vue'

export default {
  name: 'ImageField',
  components: {
    FileManager,
    ImageEditorDialog
  },
  props: {
    modelValue: Object,
    name: String,
    label: String,
    options: Object
  },
  emits: ['update:modelValue'],
  data () {
    return {
      showFileManager: false,
      showImageEditor: false,
      selection: null,
      directory: null,
      croppedImage: null
    }
  },

  computed: {
    hasCropper () {
      return this.options && this.options.admin && this.options.admin.crop
    },
    previewImage () {
      if (this.croppedImage) {
        return this.croppedImage
      }
      if (this.modelValue && this.modelValue.filename) {
        if (this.modelValue.url) {
          return `/uploads/${this.modelValue.url}`
        }
        return `/uploads/${this.modelValue.filename}`
      }
      return null
    }
  },

  watch: {
    modelValue () {
      if (!this.modelValue) {
        // Reset state when value is set to null or undefined (happens in ListField when moved).
        this.reset()
      }
    }
  },
  created () {
    this.reset()
  },
  methods: {
    reset () {
      let croppedImage = null
      if (this.modelValue && this.modelValue.url) {
        croppedImage = this.modelValue.url
      }
      const filename = (this.modelValue ? this.modelValue.filename : null) || null
      let directory = '/'
      if (filename) directory = '/' + filename.split('/').slice(0, -1).join('/')

      this.selection = filename
      this.directory = directory
      this.croppedImage = croppedImage
    },
    syncInput (modelValue) {
      this.$emit('update:modelValue', modelValue)
    },
    setFile (filename) {
      this.$emit('update:modelValue', {
        filename
      })
    },
    onOpenFileManager () {
      this.showFileManager = true
    },
    closeImageEditor () {
      this.showImageEditor = false
      // If no cropped version was already set, unset selection as cropped version is still missing.
      if (!this.croppedImage) {
        this.setFile(null)
      }
    },
    onSelectFile (file) {
      this.croppedImage = null
      this.setFile(file)
      this.showFileManager = false
      if (this.hasCropper) {
        this.showImageEditor = true
      }
    },
    onDeselectFile () {
      this.croppedImage = null
      this.showFileManager = true
      this.setFile(null)
    },
    onReCrop () {
      this.showImageEditor = true
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
