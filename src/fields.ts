import {defineAsyncComponent} from "vue";

export const fields = {
    TextField: defineAsyncComponent(() => import('@/components/fields/TextField.vue')),
    BooleanField: defineAsyncComponent(() => import('@/components/fields/BooleanField.vue')),
    DatetimeField: defineAsyncComponent(() => import('@/components/fields/DatetimeField.vue')),
    FileField: defineAsyncComponent(() => import('@/components/fields/FileField.vue')),
    ImageField: defineAsyncComponent(() => import('@/components/fields/ImageField.vue')),
    PasswordField: defineAsyncComponent(() => import('@/components/fields/PasswordField.vue')),
    ListField: defineAsyncComponent(() => import('@/components/fields/ListField.vue')),
    HtmlField: defineAsyncComponent(() => import('@/components/fields/HtmlField.vue')),
    MarkdownField: defineAsyncComponent(() => import('@/components/fields/MarkdownField.vue')),
    ChoiceField: defineAsyncComponent(() => import('@/components/fields/ChoiceField.vue')),
    TagsField: defineAsyncComponent(() => import('@/components/fields/TagsField.vue'))
}

export const previews = {
    IdPreview: defineAsyncComponent(() => import('@/components/previews/IdPreview.vue')),
    BooleanPreview: defineAsyncComponent(() => import('@/components/previews/BooleanPreview.vue')),
    DatetimePreview: defineAsyncComponent(() => import('@/components/previews/DatetimePreview.vue')),
    ChoicePreview: defineAsyncComponent(() => import('@/components/previews/ChoicePreview.vue')),
    TagsPreview: defineAsyncComponent(() => import('@/components/previews/TagsPreview.vue')),
    ImagePreview: defineAsyncComponent(() => import('@/components/previews/ImagePreview.vue')),
    FilePreview: defineAsyncComponent(() => import('@/components/previews/FilePreview.vue')),
}
