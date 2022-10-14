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
          >
            <v-card-title
              v-if="model.options && model.options.admin && model.options.admin.icon"
              class="title py-3"
            >
              <v-icon
                :icon="model.options.admin.icon"
                left
                class="hidden-sm-and-down"
              />
              <span>{{ model.name }}</span>
            </v-card-title>
            <v-card-actions class="grey lighten-4">
              <v-btn
                v-if="!model.single"
                color="green"
                dark
                :to="{name: 'Create', params: {modelType: model.type}}"
              >
                <v-icon
                  icon="add"
                  left
                />
                {{ $t('addRecord') }}
              </v-btn>

              <v-btn
                v-if="model.single"
                color="green"
                dark
                :to="{name: 'EditSingle', params: {modelType: model.type}}"
              >
                <v-icon
                  icon="edit"
                  left
                />
                {{ $t('edit') }}
              </v-btn>
              <v-btn
                v-else
                color="primary"
                text
                :to="{name: 'List', params: {modelType: model.type}}"
              >
                <v-icon
                  icon="view_list"
                  left
                />
                {{ $t('viewAll') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import MainToolbar from '../components/MainToolbar.vue';

export default {
  name: 'IndexPage',
  components: {
    MainToolbar
  },
  data() {
    return {
      loading: false,
      models: []
    }
  },

  created() {
    this.loading = true;
    this.axios.options('/models').then(response => {
      this.models = response.data;
      this.loading = false;
    });
  }
}
</script>
