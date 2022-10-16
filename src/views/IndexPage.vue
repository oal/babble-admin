<template>
  <div>
    <MainToolbar>
      <template #title>
        {{ $t('manageContent') }}
      </template>
    </MainToolbar>
    <v-progress-circular
      v-if="loading"
      :indeterminate="true"
    />
    <v-container
      v-if="!loading"
      fluid
      grid-list-md
    >
      <v-row>
        <v-col
          v-for="model in models"
          :key="model.type"
          d-flex
          :xs="12"
          :sm="6"
          :md="4"
        >
          <v-card
            outlined
            class="grow"
            :prepend-icon="model.options?.admin?.icon"
          >
            <template #title>
              {{ model.name }}
            </template>
            <v-card-actions class="grey lighten-4">
              <v-btn
                v-if="!model.single"
                color="green"
                :to="{name: 'Create', params: {modelType: model.type}}"
                prepend-icon="add"
              >
                {{ $t('addRecord') }}
              </v-btn>

              <v-btn
                v-if="model.single"
                color="green"
                :to="{name: 'EditSingle', params: {modelType: model.type}}"
                prepend-icon="edit"
              >
                {{ $t('edit') }}
              </v-btn>
              <v-btn
                v-else
                color="primary"
                :to="{name: 'List', params: {modelType: model.type}}"
                prepend-icon="view_list"
              >
                {{ $t('viewAll') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import MainToolbar from '../components/MainToolbar.vue'
import { defineComponent } from 'vue'
import { AxiosResponse } from 'axios'
import api from '@/api'

export default defineComponent({
  name: 'IndexPage',
  components: {
    MainToolbar
  },

  data () {
    return {
      loading: false,
      models: []
    }
  },

  created () {
    this.loading = true
    api.options('/models').then((response: AxiosResponse) => {
      this.models = response.data
      this.loading = false
    })
  }
})
</script>
