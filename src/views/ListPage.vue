<template>
  <v-layout
    v-if="loading"
    fill-height
    justify-center
    align-center
  >
    <v-progress-circular
      :indeterminate="true"
      color="primary"
    />
  </v-layout>
  <div v-else>
    <MainToolbar>
      <template #title>
        {{ model.name_plural }}
      </template>

      <v-btn
        variant="flat"
        color="green"
        :to="{name: 'Create', params: {modelType: model.type}}"
        prepend-icon="add"
      >
        <span class="hidden-xs-only">{{ $t('addRecord') }} {{ model.name }}</span>
      </v-btn>
    </MainToolbar>
    <v-container
      fluid
      class="pa-0"
    >
      <v-table
        :sort-by="sortColumn"
        :sort-desc="sortDesc"
        hide-default-footer
        @update:sort-by="updateSortBy"
        @update:sort-desc="updateSortDesc"
      >
        <thead>
          <tr>
            <th
              v-for="column in headers"
              :key="column.value"
              :class="column.align ? `text-sm-${column.align}` : null"
            >
              {{ column.text }}
            </th>
            <th style="width: 1px; white-space: nowrap" />
          </tr>
        </thead>
        <tbody>
          <ModelTableRow
            v-for="item in models"
            :key="item.id"
            :record="item"
            :list-display="listDisplay"
            :model="model"
            @remove="remove(item)"
          />
        </tbody>
      </v-table>
    </v-container>
  </div>
</template>

<script lang="ts">
import MainToolbar from '../components/MainToolbar.vue'
import ModelTableRow from '../components/ModelTableRow.vue'
import { useDisplay } from 'vuetify'
import { defineComponent } from 'vue'
import { Field, Model, ModelInstance } from '@/types'
import { AxiosResponse } from 'axios'
import api from '@/api'

export default defineComponent({
  name: 'ListPage',

  components: {
    MainToolbar,
    ModelTableRow
  },

  props: {
    modelType: String
  },

  setup () {
    const { smAndUp } = useDisplay()
    return {
      smAndUp
    }
  },

  data () {
    return {
      loading: true,
      model: {} as Model,
      models: []as ModelInstance[],
      sort: 'id'
    }
  },

  computed: {
    options: function () {
      const options = this.model.options.admin || {}
      if (!options.list_display) {
        options.list_display = [this.model.fields[0].key]
      }
      if (!options.sort) {
        options.sort = this.model.fields[0].key
      }
      return options
    },
    fieldsByKey () {
      const fields: Record<string, Field> = {}
      this.model.fields.forEach(field => fields[field.key] = field)
      return fields
    },
    listDisplay () {
      const columnKeys = this.options.list_display

      let columns = columnKeys
        .filter((fieldKey: string) => fieldKey !== 'id')
        .map((fieldKey: string) => this.fieldsByKey[fieldKey])

      const idIndex = columnKeys.indexOf('id')
      if (idIndex !== -1) {
        columns = [
          {
            key: 'id',
            name: 'ID',
            type: 'id',
            options: []
          },
          ...columns
        ]
      }

      return columns
    },
    headers () {
      return this.listDisplay.map((column: Field) => {
        return {
          text: column.name,
          value: column.key,
          align: 'left'
        }
      })
    },
    sortColumn () {
      if (this.sort && this.sort.substr(0, 1) === '-') {
        return this.sort.substr(1, this.sort.length)
      }
      return this.sort
    },
    sortDesc () {
      if (!this.sort) return false
      return this.sort.substr(0, 1) === '-'
    }
  },

  watch: {
    $route: 'fetchData',
    sort () {
      this.fetchData()
    }
  },

  created () {
    this.fetchData()
  },

  methods: {
    fetchData () {
      this.loading = true

      const modelPromise = api.options('/models/' + this.modelType).then((response: AxiosResponse) => {
        this.model = response.data.model
        this.sort = this.options.sort || 'id'
      })

      Promise.all([modelPromise, this.fetchRecords()]).then(() => {
        // Redirect if single instance model.
        if (this.model.single) {
          this.$router.replace({ name: 'EditSingle', params: { modelType: this.model.type } })
          return
        }
        this.loading = false
      })
    },
    fetchRecords () {
      const wasLoading = this.loading
      this.loading = true

      const params = {
        sort: this.sort
      }
      return api.get('/models/' + this.modelType, { params }).then((response: AxiosResponse) => {
        this.models = response.data

        // If fetchRecords is called outside of fetchData, and it wasn't already loading,
        // there is no more requests waiting at this time.
        if (!wasLoading) this.loading = false
      })
    },
    remove (record: ModelInstance) {
      const ok = confirm('Do you really want to delete this item?')
      if (!ok) return

      api.delete('/models/' + this.modelType + '/' + record.id).then((response: AxiosResponse) => {
        console.log(response)
        this.fetchData()
      })
    },
    updateSortBy (column: string|string[]) {
      if (Array.isArray(column)) {
        column = column[0]
      }
      this.sort = column
    },
    updateSortDesc (desc: boolean) {
      if (desc) {
        this.sort = `-${this.sort}`
      } else {
        this.sort = this.sortColumn // Without - prefix.
      }
    },
    sortBy (columnKey: string) {
      if (this.sort === columnKey) {
        this.sort = '-' + columnKey
      } else {
        this.sort = columnKey
      }
      this.fetchRecords()
    }
  }
})
</script>
