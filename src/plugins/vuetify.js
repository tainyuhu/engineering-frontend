import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// 未完全完成的Component(測試用)
import * as labsComponents from 'vuetify/labs/components'

/* 使用圖案(Material Design Icon) */
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
const icons = {
  defaultSet: 'mdi',
  aliases,
  sets: { mdi },
}


/* 日期 Adapter (Vuetify內建) */
import { VuetifyDateAdapter } from 'vuetify/labs/date/adapters/vuetify'

/* i18n (Translations provided by Vuetify) */
// 繁體中文
import { zhHant } from 'vuetify/locale'

export const vuetify = createVuetify({
  components: { // 組件
    ...components,
    ...labsComponents,
  },
  date: { // 日期
    adapter: VuetifyDateAdapter,
  },
  locale: { // 語言
    locale: 'zhHant',
    fallback: 'zhHant',
    messages: { zhHant },
  },
  directives,
  icons,
  theme: {
    // defaultTheme: 'light', // light / dark
    defaultTheme: 'myCustomTheme', // light / dark

    themes: {
      myCustomTheme: {
        dark: false,
        colors: {
          primary: '#0984e3',
          secondary: '#FB8C00',
          pvgreen: '#00b894',
          breeding: '#0984e3',
        },
      },
    },
  },

})