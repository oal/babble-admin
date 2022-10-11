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
      <v-icon left>
        insert_drive_file
      </v-icon>
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
            <v-icon>close</v-icon>
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
    import FileManager from '../fields/helpers/FileManager';

    export default {
        name: 'FileField',

        components: {
            FileManager
        },

        props: [
            'value',
            'name',
            'label',
            'options'
        ],

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
