import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // 🧹 Global ignores
  globalIgnores(['dist', 'node_modules', '.vite', './components/ui']),

  {
    files: ['**/*.{ts,tsx,js,jsx}'],

    // 🧠 Combine all base configs
    extends: [
      js.configs.recommended,

      // TypeScript (spread = critical ⚠️)
      ...tseslint.configs.recommended,

      // React hooks (proper flat config)
      reactHooks.configs.flat.recommended,

      // React refresh (Vite safe)
      reactRefresh.configs.vite,

      // 🚫 Must be LAST (disables conflicts)
      prettierConfig,
    ],

    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,

      // 🧬 Explicit parser = stability
      parser: tseslint.parser,
    },

    plugins: {
      prettier: prettierPlugin,
    },

    rules: {
      // 🎨 Prettier enforcement
      'prettier/prettier': 'error',

      // ⚛️ React refresh safety
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // 🧠 TypeScript tuning
      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // 🚀 General JS improvements
      'prefer-const': 'error',
      'no-unused-vars': 'off', // handled by TS
    },
  },
]);
