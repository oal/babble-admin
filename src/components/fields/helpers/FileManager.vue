<template>
  <v-container
    grid-list-md
    class="pa-0"
  >
    <div class="pr-3 d-flex align-center">
      <v-breadcrumbs
        divider="-"
        large
      >
        <v-icon
          slot="divider"
          icon="chevron_right"
        />
        <v-breadcrumbs-item @click="popToDir(0)">
          {{ $t('uploads') }}
        </v-breadcrumbs-item>
        <v-breadcrumbs-item
          v-for="(dir, $index) in path"
          :key="dir"
          @click="popToDir($index+1)"
        >
          {{ dir }}
        </v-breadcrumbs-item>
      </v-breadcrumbs>

      <v-spacer />

      <v-btn
        class="mr-3"
        :disabled="!path.length || loading"
        prepend-icon="edit"
        @click="onRenameDirectory(path.length)"
      >
        {{ $t('renameDirectory') }}
      </v-btn>
      <v-btn
        class="mr-3 cursor-pointer"
        tag="label"
        :for="uploadId"
        dark
        color="blue-grey"
        prepend-icon="file_upload"
        :disabled="loading"
      >
        {{ $t('uploadFile') }}
      </v-btn>
      <v-btn
        dark
        color="green"
        :disabled="loading"
        prepend-icon="create_new_folder"
        @click="onCreateDirectory"
      >
        {{ $t('createDirectory') }}
      </v-btn>
    </div>

    <v-divider />

    <v-progress-linear
      v-if="progress < 100"
      v-model="progress"
    />

    <v-layout
      v-if="loading"
      justify-center
      class="pa-4"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </v-layout>
    <v-list
      v-else
      two-line
    >
      <template
        v-for="file in allFiles"
        :key="file.title"
      >
        <v-list-item
          :disabled="!file.type"
          @click="selectFile(file)"
        >
          <v-list-item-avatar v-if="file.type">
            <img
              v-if="file.type.indexOf('image') === 0"
              :src="`/uploads/${getURL(file)}`"
            >
            <v-icon
              v-else
              :icon="getIconClass(file.type)"
            />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="file.name" />
            <v-list-item-subtitle>
              <span v-if="file.type == 'directory'">{{ $t('directory') }}</span>
              <span v-else-if="file.size">{{ prettyBytes(file.size) }}</span>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>

    <!-- Triggered by file upload button. -->
    <input
      :id="uploadId"
      type="file"
      multiple
      style="position: absolute; top: -99999px"
      @change="onUploadChange"
    >
  </v-container>
</template>

<script>
    import prettyBytes from 'pretty-bytes';

    export default {
        name: 'FileManager',

        props: [
            'directory'
        ],

        data() {
            let path = [];
            if (this.directory) path = this.directory.split('/').filter(dir => !!dir);

            return {
                'loading': false,
                'path': path,
                'files': [],
                'selection': null,
                'progress': 100,
            }
        },

        computed: {
            uploadId() {
                return 'upload-' + ((Math.random() * 99999) | 0).toString(16);
            },

            allFiles() {
                if (this.files.length) return this.files;
                return [{name: this.$t('noFilesFound')}]
            }
        },

        watch: {
            path() {
                this.files = [];
                this.loadFiles();
            }
        },

        created() {
            this.loadFiles();
        },

        methods: {
            prettyBytes,
            loadFiles() {
                this.loading = true;
                let path = '/files';
                if (this.path.length) {
                    path += '/' + this.path.join('/');
                }
                this.axios.get(path).then(response => {
                    this.files = response.data;
                    this.loading = false;
                });
            },

            getURL(file) {
                return [...this.path, file.name].join('/');
            },

            popToDir(index) {
                console.log(index);
                if (index === this.path.length) return; // No change.

                this.path = this.path.slice(0, index);
            },

            goToDir(dir) {
                if (dir.type !== 'directory') return false;
                this.path.push(dir.name);
            },

            selectFile(file) {
                if (!file.type) return;
                if (file.type === 'directory') return this.goToDir(file);

                this.selection = this.getURL(file);
                this.$emit('update:modelValue', this.selection);
            },

            onUploadChange(event) {
                let files = event.target.files;

                let formData = new FormData();
                for (let i = 0; i < files.length; i++) {
                    formData.append('file-' + i, files[i]);
                }

                let apiPath = ['/files', ...this.path].join('/');
                this.axios.post(apiPath, formData, {
                    onUploadProgress: event => {
                        this.progress = (event.loaded / event.total) * 100;
                    }
                }).then(() => {
                    event.target.value = '';
                    this.loadFiles();
                }).catch(() => {
                    console.log('fail');
                });
            },

            onCreateDirectory() {
                let name = prompt('Directory name:');
                if (!name) return;

                let apiPath = ['/files', ...this.path].join('/');

                this.axios.post(apiPath, {name: name}).then(() => {
                    this.loadFiles();
                }).catch(() => {
                    console.log('fail');
                });
            },

            onRenameDirectory(index) {
                let name = prompt(this.$t('newDirectoryName') + ':');
                if (!name) return;

                let apiPath = ['/files', ...this.path.slice(0, index + 1)].join('/');

                this.axios.put(apiPath, {name: name}).then(() => {
                    this.path = [...this.path.slice(0, index), name]; // Move up to the directory that contains the renamed directory.
                    this.loadFiles();
                }).catch(() => {
                    console.log('fail');
                });
                console.log('Rename ', this.path[index], apiPath);
            },

            getIconClass(contentType) {
                if (contentType === 'directory') return 'folder';
                if (contentType.indexOf('text') === 0) return 'text_format';
                if (contentType.indexOf('video') === 0) return 'ondemand_video';
                if (contentType.indexOf('audio') === 0) return 'audiotrack';
                if (contentType === 'application/pdf') return 'picture_as_pdf';
                return 'insert_drive_file';
            }
        }
    }
</script>


<style lang="scss" type="text/scss" scoped>
    .cursor-pointer {
        cursor: pointer;
    }
</style>
