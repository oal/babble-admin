<template>
  <td>
    <div class="model-table-cell">
      <component
        :is="column.type + 'Preview'"
        v-if="hasPreviewComponent"
        :value="value"
        :field="column"
      />
      <div v-else>
        {{ value }}
      </div>
      <v-edit-dialog
        large
        :cancel-text="$t('close')"
        :save-text="$t('save')"
        @save="save"
        @cancel="cancel"
        @open="open"
        @close="close"
      >
        <v-btn
          v-if="column.type !== 'id'"
          icon
          color="orange"
          class="model-table-cell-edit"
        >
          <v-icon>edit</v-icon>
        </v-btn>
        <template v-slot:input>
          <field-wrapper
            :type="column.type"
            :label="column.name"
            :name="column.key"
            :options="column.options"
            :class="column.classes"
            :blocks="[]"
            :error="errors['fields.' + column.key]"

            :value="changedValue"
            class="pt-3"
            @input="onInput"
          />
        </template>
      </v-edit-dialog>
    </div>
  </td>
</template>

<script>
    import {camelCase, upperFirst} from 'lodash';
    import IdPreview from '../components/previews/IdPreview';
    import BooleanPreview from '../components/previews/BooleanPreview';
    import DatetimePreview from '../components/previews/DatetimePreview';
    import ChoicePreview from '../components/previews/ChoicePreview';
    import TagsPreview from '../components/previews/TagsPreview';
    import ImagePreview from "./previews/ImagePreview";
    import FilePreview from "./previews/FilePreview";

    export default {
        components: {
            IdPreview,
            BooleanPreview,
            DatetimePreview,
            ChoicePreview,
            TagsPreview,
            ImagePreview,
            FilePreview
        },

        props: {
            model: Object,
            record: Object,
            column: Object
        },


        data() {
            return {
                changedValue: null,
                errors: {}
            }
        },

        computed: {
            hasPreviewComponent() {
                let componentName = upperFirst(`${camelCase(this.column.type)}Preview`);
                return !!this.$options.components[componentName];
            },
            value() {
                return this.record[this.column.key];
            }
        },

        methods: {
            onInput(value) {
                console.log(value);
                this.changedValue = value;
            },
            save() {
                console.log(this.changedValue);
                let key = this.column.key;
                let partialData = {};
                partialData[key] = this.changedValue;
                this.axios.patch(`models/${this.model.type}/${this.record.id}`, partialData).then(response => {
                    this.record[key] = response.data[key];
                    this.close();
                }).catch(error => {
                    console.log(error);
                })
            },
            cancel() {
            },
            open() {
                // Deep copy
                this.changedValue = JSON.parse(JSON.stringify(this.value));
            },
            close() {
                this.changedValue = null;
            }
        }

    }
</script>

<style lang="scss">
    .model-table-cell {
        display: flex;
        align-items: center;

        .model-table-cell-edit {
            opacity: 0;
            transition: opacity 0.2s;
            margin-left: 0.5rem;
        }

        &:hover {
            .model-table-cell-edit {
                opacity: 1;
            }
        }
    }
</style>
