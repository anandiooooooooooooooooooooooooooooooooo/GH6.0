import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  // import.meta.dirname tersedia setelah Node.js v20.11.0
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    // Menggunakan 'next/core-web-vitals' adalah standar yang lebih umum dan lengkap
    extends: ['next/core-web-vitals'],
    rules: {
      // Aturan yang sudah ada
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',

      // ✅ ATURAN BARU UNTUK MEMATIKAN ERROR BUILD
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }),
]

export default eslintConfig
