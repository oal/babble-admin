/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
    "root": true,
    "env": {
        "node": true
    },
    "extends": [
        "plugin:vue/vue3-recommended",
        "eslint:recommended",
        "@vue/eslint-config-typescript/recommended"
    ],
    "rules": {
        "vue/require-default-prop": "off"
    },
    "parserOptions": {
        //"parser": "@babel/eslint-parser",
        "requireConfigFile": false
    }
}
