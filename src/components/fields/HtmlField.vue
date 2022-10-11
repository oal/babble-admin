<template>
  <div class="html-field">
    <div class="input-group">
      <label>{{ label }}</label>
    </div>

    <textarea
      ref="editor"
      :value="value"
    />
  </div>
</template>

<script>
    // Editors
    import MediumEditor from 'medium-editor';
    import CodeMirror from 'codemirror';
    import 'codemirror/mode/htmlmixed/htmlmixed.js';

    // Styles
    import 'medium-editor/src/sass/medium-editor.scss';
    import 'medium-editor/src/sass/themes/flat.scss';
    import 'codemirror/lib/codemirror.css';

    // Other imports
    import {get} from 'lodash';

    export default {
        name: 'HtmlField',

        props: {
            options: Object,
            value: String,
            label: String
        },

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

                let removeSpans = (element) => {
                    var spans = element.getElementsByTagName('span');
                    for (var i = 0; i < spans.length; i++) {
                        spans[i].outerHTML = spans[i].innerHTML
                    }
                };

                // Remove style attributes inserted by the browser in the contenteditable element.
                mediumEditor.subscribe('blur', (event, editable) => {
                    removeSpans(editable);
                    this.$emit('input', editable.innerHTML);
                });

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

<style>
    .html-field {
        min-width: 240px;
    }

    .html-field .CodeMirror, .html-field .medium-editor-element {
        border-radius: 2px;
        border: 2px solid rgba(0, 0, 0, .54);
        height: auto;
        min-height: 50px;
    }

    .html-field .medium-editor-element {
        padding: 0.9rem 1.25rem;
    }

    .html-field .CodeMirror-gutters {
        background-color: rgba(0, 0, 0, .54);
    }

    .html-field .CodeMirror-linenumber {
        color: #e0e0e0
    }
</style>
