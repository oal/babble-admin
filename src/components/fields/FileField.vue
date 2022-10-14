<template>
  <div>
    <v-chip
      v-if="value"
      close
      @click:close="onDeselectFile"
    >
      {{ label }}:&nbsp;
      <a
        :href="'/uploads/' + value"
        target="_blank"
        download
        class="blue-grey--text text--darken-2"
      >
        {{ value }}
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
            @input="onSelectFile"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
    import FileManager from '../fields/helpers/FileManager.vue';

    export default {
        name: 'FileField',

        components: {
            FileManager
        },

        props: {
            value: String,
            name: String,
            label: String,
            options: Object
        },

        data() {
            return {
                showFileManager: false
            }
        },

        methods: {
            onOpenFileManager() {
                this.showFileManager = true;
            },

            onSelectFile(file) {
                this.$emit('input', file);
                this.showFileManager = false;
            },

            onDeselectFile() {
                this.$emit('input', null);
            },
        }
    }
</script>
