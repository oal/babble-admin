<template>
  <div>
    <MainToolbar>
      <template #title>
        {{ $t('fileManager') }}
      </template>
    </MainToolbar>
    <v-container
      fluid
      class="pa-0"
    >
      <file-manager
        ref="file-manager"
        @update:model-value="select"
      />

      <v-dialog
        v-model="showSelectionDialog"
        max-width="500px"
      >
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
            <v-spacer />
            <v-btn
              color="primary"
              text
              @click.stop="close"
            >
              {{ $t('close') }}
            </v-btn>
            <v-btn
              color="green"
              text
              tag="a"
              download
              :href="`/uploads/${selection}`"
              prepend-icon="file_download"
            >
              {{ $t('download') }}
            </v-btn>
            <v-btn
              color="red"
              text
              prepend-icon="delete"
              @click.stop="remove"
            >
              {{ $t('delete') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script lang="ts">
import MainToolbar from '../components/MainToolbar.vue';
import FileManager from '../components/fields/helpers/FileManager.vue';
import {defineComponent} from "vue";

export default defineComponent({
  name: 'FilePage',
  components: {
    MainToolbar,
    FileManager
  },

  data() {
    return {
      loading: false,

      showSelectionDialog: false,
      selection: null as string|null
    }
  },

  methods: {
    select(selection: string) {
      this.showSelectionDialog = true;
      this.selection = selection;
    },

    remove() {
      const ok = confirm(this.$t('confirmDeleteMessage'));
      if (!ok) {
        this.close();
        return;
      }

      this.loading = true;
      this.axios.delete('/files/' + this.selection).then(() => {
        this.$refs['file-manager'].loadFiles();
        this.close();
        this.loading = false;
      }).catch(() => {
        console.log('fail');
        this.loading = false;
      });
    },

    close() {
      this.showSelectionDialog = false;
      this.selection = null;
    }
  }
})
</script>
