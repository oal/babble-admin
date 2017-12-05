<template>
    <div class="field">
        <label>{{ label }}</label>
        <div class="ui segment">
            <textarea ref="editor" v-bind:value="value"></textarea>
        </div>
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
                lineNumbers: true,
                mode: 'markdown',
                lineWrapping: true
            });
            codemirrorEditor.on('change', () => {
                let value = codemirrorEditor.getValue();
                this.$emit('input', value);
            });
            this.codemirrorEditor = codemirrorEditor;
        },

        beforeDestroy() {
            if(this.codemirrorEditor) {
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

<style scoped>
    .segment {
        padding: 0;
    }
</style>