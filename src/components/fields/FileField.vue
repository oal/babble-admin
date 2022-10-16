<template>
  <div>
    <v-chip
      v-if="modelValue"
      close
      @click:close="onDeselectFile"
    >
      {{ label }}:&nbsp;
      <a
        :href="'/uploads/' + modelValue"
        target="_blank"
        download
        class="blue-grey--text text--darken-2"
      >
        {{ modelValue }}
      </a>
    </v-chip>

    <v-btn
      v-else
      dark
      color="blue-grey"
      @click="onOpenFileManager"
    >
      <v-icon
        icon="insert_drive_file"
        left
      />
      {{ $t('choose') }} {{ label }}
    </v-btn>

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
            @update:model-value="onSelectFile"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FileManager from '../fields/helpers/FileManager.vue'

export default {
  name: 'FileField',

  components: {
    FileManager
  },

  props: {
    modelValue: String,
    name: String,
    label: String,
    options: Object
  },
  emits: ['update:modelValue'],

  data () {
    return {
      showFileManager: false
    }
  },

  methods: {
    onOpenFileManager () {
      this.showFileManager = true
    },

    onSelectFile (file) {
      this.$emit('update:modelValue', file)
      this.showFileManager = false
    },

    onDeselectFile () {
      this.$emit('update:modelValue', null)
    }
  }
}
</script>
