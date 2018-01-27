<template>
    <div class="markdown-field">
        <div class="input-group">
            <label>{{ label }}</label>
        </div>

        <textarea ref="editor" v-bind:value="value"></textarea>
    </div>
</template>

<script>
    // Editor
    import CodeMirror from 'codemirror';
    import 'codemirror/mode/markdown/markdown.js';

    // Style
    import 'codemirror/lib/codemirror.css';

    // Other imports
    import {get} from 'lodash';

    export default {
        name: 'markdown-field',

        props: [
            'options',
            'value',
            'label'
        ],

        data() {
            return {
                codemirrorEditor: null
            }
        },

        mounted() {
            let codemirrorEditor = CodeMirror.fromTextArea(this.$refs.editor, {
                lineNumbers: false,
                mode: 'markdown',
                lineWrapping: true,
                viewportMargin: Infinity
            });
            codemirrorEditor.on('change', () => {
                let value = codemirrorEditor.getValue();
                this.$emit('input', value);
            });
            this.codemirrorEditor = codemirrorEditor;
        },

        beforeDestroy() {
            if (this.codemirrorEditor) {
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
    .markdown-field {
        min-width: 240px;
    }
    .markdown-field .CodeMirror {
        border-radius: 2px;
        border: 2px solid rgba(0, 0, 0, .54);
        height: auto;
        min-height: 50px;
    }

    .markdown-field .CodeMirror-gutters {
        background-color: rgba(0, 0, 0, .54);
    }

    .markdown-field .CodeMirror-linenumber {
        color: #e0e0e0
    }
</style>