import { createRouter, createWebHistory } from 'vue-router';

import { h } from 'vue'
import { RouterView } from 'vue-router'

// 用來載入 view的函式
function loadView(view) {
  return () => import(`@/views/${view}.vue`);
}

const routes = [
  { // 首頁
    path: '/',
    name: 'home',
    component: loadView("Home"),
  },
  { // 首頁
    path: '/test',
    name: 'Test',
    component: loadView("Test"),
  },


  // 404 Not Found
  // /:pathMatch(.*)*: 最終都會指向該Component，上面路由條件都沒達到時
  { 
    path: '/:pathMatch(.*)*',
    name: '404NotFound',
    component: loadView("404NotFound"),
  },
];


// Hisotry API
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
