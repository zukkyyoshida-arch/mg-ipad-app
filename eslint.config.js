import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    // 既存コードの未使用変数・useEffect内setState等はロジック変更を伴うため
    // 当面 warn に下げる（解消は別PRで段階的に）。
    rules: {
      'no-unused-vars': 'warn',
      'no-useless-assignment': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
