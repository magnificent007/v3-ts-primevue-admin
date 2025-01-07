import { defineConfig, presetUno, presetAttributify } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'
import presetChinese, { chineseTypography } from "unocss-preset-chinese";

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno({
      dark: {
        dark: '[class="v3-app-dark"]',
        light: '[class=""]'
      }
    }),
    presetAttributify(),
    presetScrollbar({
      /**
       * options visit in https://github.com/unocss-community/unocss-preset-scrollbar/blob/main/README.zh-CN.md
       * scrollbar-(radius|w|h|track-radius|thumb-radius)
       */
    }),
    chineseTypography(),
    presetChinese({
      // 扩展主题
      extendTheme: true,
      // 主题key，默认值为fontFamily
      themeKey: 'fontFamily',
      // 字体配置
      fonts: {},
      // 用于中文字符的备选字体
      fallbackFont: [],
      // 声明英文字体
      declareEnglishFont: [],
      // 中文类型，默认值为simplified
      chineseType: 'traditional'
    }),
  ]
})