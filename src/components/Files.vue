<template>
    <div>
        <h1>{{ $t('fileManager') }}</h1>
        <div class="file-manager">
            <file-manager @input="select" ref="file-manager"></file-manager>
            <div v-if="selection" class="selected-file">

                <h3>{{ selection }}</h3>
                <div class="ui basic loading segment" v-if="loading"></div>
                <div v-else>
                    <div class="labeled icon button" @click="close">
                        <i class="remove icon"></i>
                        {{ $t('close') }}
                    </div>

                    <div class="red labeled icon button" @click="remove">
                        <i class="trash icon"></i>
                        {{ $t('delete') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
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
            selection: null
        }
    },

    methods: {
        select(selection) {
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
            this.selection = null;
        }
    }
}
</script>

<style scoped>
.file-manager {
    position: relative;
}

.selected-file {
    background-color: rgba(255, 255, 255, 0.95);
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.selected-file>* {
    padding: 0.5rem;
}
</style>
