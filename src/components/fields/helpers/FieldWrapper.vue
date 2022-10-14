<template>
  <v-col
    v-if="hasTypeComponent()"
    :cols="options?.admin?.columns ?? 12"
  >
    <component
      :is="type + 'Field'"
      :model-value="modelValue"
      :label="label"
      :name="name"
      :options="options"
      :error="error"
      :blocks="blocks"
      @update:model-value="onFieldInput"
    />
  </v-col>
</template>

<script>
import {camelCase, upperFirst} from 'lodash';

import TextField from '@/components/fields/TextField.vue';
import BooleanField from '@/components/fields/BooleanField.vue';
import DatetimeField from '@/components/fields/DatetimeField.vue';
import FileField from '@/components/fields/FileField.vue';
import ImageField from '@/components/fields/ImageField.vue';
import PasswordField from '@/components/fields/PasswordField.vue';
import ListField from '@/components/fields/ListField.vue';
import HtmlField from '@/components/fields/HtmlField.vue';
import MarkdownField from '@/components/fields/MarkdownField.vue';
import ChoiceField from '@/components/fields/ChoiceField.vue';
import TagsField from '@/components/fields/TagsField.vue';

export default {
  name: 'FieldWrapper',

  components: {
    BooleanField,
    DatetimeField,
    TextField,
    FileField,
    ImageField,
    PasswordField,
    ListField,
    HtmlField,
    MarkdownField,
    ChoiceField,
    TagsField
  },

  props: {
    type: String,
    label: String,
    name: String,
    modelValue: {},
    options: Object,
    blocks: Object,
    error: String
  },
  emits: ['update:modelValue'],

  methods: {
    hasTypeComponent() {
      let componentName = upperFirst(`${camelCase(this.type)}Field`);
      return !!this.$options.components[componentName];
    },
    onFieldInput(value) {
      this.$emit('update:modelValue', value);
    },
  }
}
</script>
