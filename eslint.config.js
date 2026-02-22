// eslint.config.js
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
    { ignores: ['dist', 'node_modules'] },

    // Preset FLAT de Vue
    ...vue.configs['flat/recommended'],

    // Apaga reglas de estilo que chocan con Prettier
    eslintConfigPrettier,

    // Capa de proyecto
    {
        files: ['**/*.vue', '**/*.js'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                extraFileExtensions: ['.vue'],
            },
        },
        plugins: { vue, prettier },
        rules: {
            // Prettier se valida contra .prettierrc
            'prettier/prettier': 'error',

            // Calidad (no son de Prettier)
            'no-console': 'warn',
            'no-debugger': 'warn',
            'vue/no-reserved-component-names': 'off',
            'vue/prop-name-casing': 'off',
            'vue/attribute-hyphenation': 'off',
            'vue/no-v-html': 'off',
            'vue/v-on-event-hyphenation': 'off',
        },
    },
]
