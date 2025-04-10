module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@next/next/no-img-element': 'off',
    'react/no-unescaped-entities': 'off'
  },
  // Отключаем проверку линтера для определенных файлов
  ignorePatterns: [
    'src/app/components/BeatPlayer.tsx',
    'src/app/components/ContactSection.tsx',
    'src/app/components/Hero.tsx',
    'src/app/components/SakuraBackground.tsx',
    'src/app/components/SoundSection.tsx',
    'src/app/components/TeamSection.tsx'
  ]
}; 