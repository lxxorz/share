import { defineMonacoSetup } from '@slidev/types'

export default defineMonacoSetup(async () => {
  // 使用 `monaco` 配置
  return {
    theme: {
      dark: 'vs-dark',
      light: 'vs',
    },
  }
})