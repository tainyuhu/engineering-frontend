import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './assets/style/globalStyles.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

// 导入 Axios 配置
import http from './http' // 假设你的 Axios 配置文件名为 http.js

// 导入 Vuetify
import { vuetify } from '@/plugins/vuetify'

// 创建 Vue 应用
const app = createApp(App)

// 使用路由器
app.use(router)

// 使用 Vuex 状态管理
app.use(store)

// 使用 Vuetify
app.use(vuetify)

app.component('VueDatePicker', VueDatePicker);

// 设置全局配置
app.config.productionTip = false // 设置为 false 以阻止在启动时生成生产提示
app.config.devtools = true // 启用 Vue Devtools

// 使用 Axios
app.config.globalProperties.$http = http


// 挂载 Vue 应用
app.mount('#app')


/* 【Vue-Sweetalert2】 */
// import VueSweetalert2  from 'vue-sweetalert2'
// import 'sweetalert2/dist/sweetalert2.min.css';
// app.use(VueSweetalert2);

// 【發布 - Production】
// app.config.productionTip = true // true: 線上發布 / false: 測試
// app.config.devtools = false // true: 開啟Devtool / false: 關閉devtool