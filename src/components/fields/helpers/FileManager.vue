<template>
    <div>
        <v-layout wrap align-center>
            <v-breadcrumbs large>
                <v-icon slot="divider">chevron_right</v-icon>
                <v-breadcrumbs-item @click.native="popToDir(0)">
                    {{ $t('uploads') }}
                </v-breadcrumbs-item>
                <v-breadcrumbs-item v-for="(dir, $index) in path" :key="dir" @click.native="popToDir($index+1)">
                    {{ dir }}
                </v-breadcrumbs-item>
            </v-breadcrumbs>

            <v-spacer></v-spacer>

            <div class="pr-1">
                <v-btn color="secondary" @click="onRenameDirectory(path.length)" :disabled="!path.length || loading">
                    {{ $t('renameDirectory') }}
                    <v-icon right>edit</v-icon>
                </v-btn>

                <v-btn class="cursor-pointer" tag="label" :for="uploadId" dark color="blue-grey" :disabled="loading">
                    {{ $t('uploadFile') }}
                    <v-icon right>file_upload</v-icon>
                </v-btn>

                <v-btn dark color="green" @click="onCreateDirectory" :disabled="loading">
                    {{ $t('createDirectory') }}
                    <v-icon right>create_new_folder</v-icon>
                </v-btn>
            </div>
        </v-layout>

        <v-progress-linear v-model="progress" v-if="progress < 100"></v-progress-linear>

        <v-layout justify-center class="pa-4" v-if="loading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-layout>
        <v-list two-line v-else>
            <template v-for="file in allFiles">
                <v-list-tile avatar v-bind:key="file.title" @click="selectFile(file)" :disabled="!file.type">
                    <v-list-tile-avatar v-if="file.type">
                        <img v-bind:src="`/uploads/${getURL(file)}`" v-if="file.type.indexOf('image') === 0"/>
                        <v-icon v-else>{{ getIconClass(file.type) }}</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                        <v-list-tile-title v-html="file.name"></v-list-tile-title>
                        <v-list-tile-sub-title>
                            <span v-if="file.type == 'directory'">{{ $t('directory') }}</span>
                            <span v-else-if="file.size">{{ prettyBytes(file.size) }}</span>
                        </v-list-tile-sub-title>
                    </v-list-tile-content>
                </v-list-tile>
            </template>
        </v-list>

        <!-- Triggered by file upload button. -->
        <input type="file" multiple :id="uploadId" @change="onUploadChange"
               style="position: absolute; top: -99999px">
    </div>
</template>

<script>
    import prettyBytes from 'pretty-bytes';

    export default {
        name: 'file-manager',

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

        created() {
            this.loadFiles();
        },

        watch: {
            path() {
                this.files = [];
                this.loadFiles();
                console.log(this.path);
            }
        },

        methods: {
            prettyBytes,
            loadFiles() {
                this.loading = true;
                let path = '/files';
                if (this.path.length) {
                    path += '/' + this.path.join('/');
                }
                this.$http.get(path).then(response => {
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
                this.$emit('input', this.selection);
            },

            onUploadChange(event) {
                let files = event.target.files;

                let formData = new FormData();
                for (let i = 0; i < files.length; i++) {
                    formData.append('file-' + i, files[i]);
                }

                let apiPath = ['/files', ...this.path].join('/');
                this.$http.post(apiPath, formData, {
                    onUploadProgress: event => {
                        this.progress = (event.loaded / event.total) * 100;
                    }
                }).then(response => {
                    event.target.value = '';
                    this.loadFiles();
                }).catch(response => {
                    console.log('fail');
                });
            },

            onCreateDirectory() {
                let name = prompt('Directory name:');
                if (!name) return;

                let apiPath = ['/files', ...this.path].join('/');

                this.$http.post(apiPath, {name: name}).then(response => {
                    this.loadFiles();
                }).catch(response => {
                    console.log('fail');
                });
            },

            onRenameDirectory(index) {
                let name = prompt(this.$t('newDirectoryName') + ':');
                if (!name) return;

                let apiPath = ['/files', ...this.path.slice(0, index + 1)].join('/');

                this.$http.put(apiPath, {name: name}).then(response => {
                    this.path = [...this.path.slice(0, index), name]; // Move up to the directory that contains the renamed directory.
                    this.loadFiles();
                }).catch(response => {
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
        },

        computed: {
            uploadId() {
                return 'upload-' + ((Math.random() * 99999) | 0).toString(16);
            },

            allFiles() {
                if (this.files.length) return this.files;
                return [{name: this.$t('noFilesFound')}]
            }
        }
    }
</script>


<style lang="scss" type="text/scss" scoped>
    .cursor-pointer {
        cursor: pointer;
    }
</style>
