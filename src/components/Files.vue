<template>
    <v-container fluid>
        <h1 class="headline pb-3">{{ $t('fileManager') }}</h1>
        <v-card>
            <v-card-text>
                <file-manager @input="select" ref="file-manager"></file-manager>
            </v-card-text>
        </v-card>

        <v-dialog v-model="showSelectionDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    {{ $t('fileManager') }}
                </v-card-title>
                <v-card-text>
                    {{ selection }}
                </v-card-text>
                <v-card-actions>
                    <!--TODO-->
                    <!--<v-btn color="primary" flat @click.stop="showSelectionDialog = false">{{ $t('rename' )}}</v-btn>-->
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.stop="close">
                        {{ $t('close') }}
                    </v-btn>
                    <v-btn color="red" flat @click.stop="remove">
                        {{ $t('delete' )}}
                        <v-icon right>delete</v-icon>
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import FileManager from '@/components/fields/helpers/FileManager';

    export default {
        components: {
            FileManager
        },

        data() {
            return {
                loading: false,

                showSelectionDialog: false,
                selection: null
            }
        },

        methods: {
            select(selection) {
                this.showSelectionDialog = true;
                this.selection = selection;
            },

            remove() {
                let ok = confirm(this.$t('confirmDeleteMessage'));
                if (!ok) {
                    this.close();
                    return;
                }

                this.loading = true;
                this.$http.delete('/files/' + this.selection).then(response => {
                    this.$refs['file-manager'].loadFiles();
                    this.close();
                    this.loading = false;
                }).catch(response => {
                    console.log('fail');
                    this.loading = false;
                });
            },

            close() {
                this.showSelectionDialog = false;
                this.selection = null;
            }
        }
    }
</script>
