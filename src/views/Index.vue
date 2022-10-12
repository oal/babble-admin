<template>
  <div>
    <MainToolbar>
      <template slot="title">
        {{ $t('manageContent') }}
      </template>
    </MainToolbar>
    <v-progress-circular
      v-if="loading"
      indeterminate
    />
    <v-container
      v-if="!loading"
      fluid
      grid-list-md
    >
      <v-layout
        row
        wrap
      >
        <v-flex
          v-for="model in models"
          :key="model.type"
          d-flex
          xs12
          sm6
          md4
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
                left
                class="hidden-sm-and-down"
              >
                {{ model.options.admin.icon }}
              </v-icon>
              <span>{{ model.name }}</span>
            </v-card-title>
            <v-card-actions class="grey lighten-4">
              <v-btn
                v-if="!model.single"
                color="green"
                dark
                :to="{name: 'Create', params: {modelType: model.type}}"
              >
                <v-icon left>
                  add
                </v-icon>
                {{ $t('addRecord') }}
              </v-btn>

              <v-btn
                v-if="model.single"
                color="green"
                dark
                :to="{name: 'EditSingle', params: {modelType: model.type}}"
              >
                <v-icon left>
                  edit
                </v-icon>
                {{ $t('edit') }}
              </v-btn>
              <v-btn
                v-else
                color="primary"
                text
                :to="{name: 'List', params: {modelType: model.type}}"
              >
                <v-icon left>
                  view_list
                </v-icon>
                {{ $t('viewAll') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
    import MainToolbar from '../components/MainToolbar.vue';

    export default {
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
