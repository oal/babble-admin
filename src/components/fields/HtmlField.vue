<template>
    <div class="field">
        <label>{{ label }}</label>
        <div class="ui segment">
            <textarea ref="editor" v-bind:value="value"></textarea>
        </div>
    </div>
</template>

<script>
    // Editors
    import MediumEditor from 'medium-editor';
    import CodeMirror from 'codemirror';
    import 'codemirror/mode/htmlmixed/htmlmixed.js';

    // Styles
    import 'medium-editor/src/sass/medium-editor.scss';
    import 'medium-editor/src/sass/themes/default.scss';
    import 'codemirror/lib/codemirror.css';

    // Other imports
    import {get} from 'lodash';

    export default {
        name: 'html-field',

        props: [
            'options',
            'value',
            'label'
        ],

        data() {
            return {
                mediumEditor: null,
                codemirrorEditor: null
            }
        },

        mounted() {
            if(this.getOption('admin.wysiwyg')) {
                let mediumEditor = new MediumEditor(this.$refs.editor);
                mediumEditor.subscribe('editableInput', (event, editable) => {
                    let value = mediumEditor.getContent();
                    this.$emit('input', value);
                })
                this.mediumEditor = mediumEditor;
            } else {
                let codemirrorEditor = CodeMirror.fromTextArea(this.$refs.editor, {
                    lineNumbers: true,
                    mode: 'htmlmixed'
                });
                codemirrorEditor.on('change', () => {
                    let value = codemirrorEditor.getValue();
                    this.$emit('input', value);
                });
                this.codemirrorEditor = codemirrorEditor;
            }
        },

        beforeDestroy() {
            if(this.mediumEditor) {
                this.mediumEditor.destroy();
            } else if(this.codemirrorEditor) {
                // No teardown needed?
            }
        },

        methods: {
            getOption(path) {
                return get(this.options, path, null)
            }
        }
    }
</script>