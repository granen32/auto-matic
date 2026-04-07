import js from '@eslint/js'
import ts from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default ts.config(
  // 전역 무시
  {
    ignores: ['dist/', 'node_modules/', '*.config.js', '*.config.ts', '*.d.ts'],
  },

  // JS 기본 권장
  js.configs.recommended,

  // TypeScript 권장
  ...ts.configs.recommended,

  // Vue 3 권장 (flat config)
  ...pluginVue.configs['flat/recommended'],

  // Vue 파일에서 TypeScript 파서 사용
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },

  // 프로젝트 커스텀 규칙
  {
    rules: {
      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],

      // Vue
      'vue/multi-word-component-names': 'off',
      'vue/define-macros-order': [
        'error',
        { order: ['defineProps', 'defineEmits'] },
      ],
      'vue/block-order': [
        'error',
        { order: ['script', 'template', 'style'] },
      ],
      'vue/component-api-style': ['error', ['script-setup']],
      'vue/no-v-html': 'warn',

      // 일반
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
    },
  },

  // Prettier 충돌 방지 (반드시 마지막)
  prettier,
)
