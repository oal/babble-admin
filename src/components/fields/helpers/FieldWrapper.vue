<template>
  <v-flex
    v-if="hasTypeComponent()"
    md12
  >
    <component
      :is="type + 'Field'"
      :value="value"
      :label="label"
      :name="name"
      :options="options"
      :error="error"
      :blocks="blocks"
      @input="onFieldInput"
    />
  </v-flex>
</template>

<script>
    import {camelCase, upperFirst} from 'lodash';

    import TextField from '@/components/fields/TextField';
    import BooleanField from '@/components/fields/BooleanField';
    import DatetimeField from '@/components/fields/DatetimeField';
    import FileField from '@/components/fields/FileField';
    import ImageField from '@/components/fields/ImageField';
    import PasswordField from '@/components/fields/PasswordField';
    import ListField from '@/components/fields/ListField';
    import HtmlField from '@/components/fields/HtmlField';
    import MarkdownField from '@/components/fields/MarkdownField';
    import ChoiceField from '@/components/fields/ChoiceField';
    import TagsField from '@/components/fields/TagsField';

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
          value: {},
          options: Object,
          blocks: Object,
          error: Object
        },

        methods: {
            hasTypeComponent() {
                let componentName = upperFirst(`${camelCase(this.type)}Field`);
                return !!this.$options.components[componentName];
            },
            onFieldInput(value) {
                this.$emit('input', value);
            },
        }
    }
</script>
