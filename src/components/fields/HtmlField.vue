<template>
    <div class="input-group input-group--text-field input-group--textarea primary--text"><label>{{ label }}</label>
        <div class="input-group__input">
            <textarea ref="editor" v-bind:value="value"></textarea>
        </div>
        <div class="input-group__details">
            <div class="input-group__messages"></div>
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
            if (this.getOption('admin.wysiwyg')) {
                let mediumEditor = new MediumEditor(this.$refs.editor, {
                    toolbar: {
                        buttons: [
                            'bold', 'italic', 'anchor',
                            'h2', 'h3', 'h4', 'h5', 'quote',
                            'orderedlist', 'unorderedlist'
                        ]
                    }
                });

                // Remove style attributes inserted by the browser in the contenteditable element.
                mediumEditor.subscribe('blur', (event, editable) => {
                    let value = $('<div>' + mediumEditor.getContent() + '</div>');
                    value.find('*').removeAttr('style');
                    this.$emit('input', value.html());
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
            if (this.mediumEditor) {
                this.mediumEditor.destroy();
            } else if (this.codemirrorEditor) {
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
