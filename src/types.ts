export interface Field {
    key: string
    name: string
    type: string
    options: Record<string, any>
}

export interface AugmentedField extends Field {
    classes: string
}

export interface Model {
    name: string
    name_plural: string
    fields: Field[]
    options: Record<string, any>
    single: boolean
    type: string,
    hierarchical?: boolean
}

export interface ModelInstance {
    id: string
    _permalink?: string
    [key: string]: any
}

export interface FieldError {
    property: string
    message: string
}

export type ToastType = 'info' | 'success' | 'error'

export interface Toast {
    key: string
    message: string
    type: ToastType
    visible: boolean
}
