import { createRouter, createWebHistory } from 'vue-router';
import axios from 'axios';
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
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: loadView("Login"),
  },
  { // 工程進度瀏覽
    path: '/Browse_Project_Progress',
    name: 'Browse_Project_Progress',
    component: loadView("Browse_Project_Progress"),
    meta: { requiresAuth: true },
  },
  { // 工程進度填寫
    path: '/Fillin_Project_Progress',
    name: 'Fillin_Project_Progress',
    component: loadView("Fillin_Project_Progress"),
    meta: { requiresAuth: true },
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

router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');

  // 如果是登入頁面並且用戶已經擁有 token，重定向到首頁
  if (to.name === 'Login' && accessToken) {
    next({ name: 'home' });
    return; // 提前結束函數
  }

  // 需要身份驗證
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 檢查用戶是否已登錄
    if (!accessToken) {
      next({ name: 'Login' });  // 未登入，重定向到登錄頁
    } else {
      // 進行 Casbin 權限檢查
      axios.get('/api/check_permission/', {
        params: {
          auth: user,
          resource: to.path,
          action: 'read'
        }
      }).then(response => {
        console.log("response:", response.data.permission);
        if (response.data.permission) {
          next({ path: to.path });
        } else {
          next({ name: 'Login' }) // 權限檢查未通過
        }
      });
    }
  }

  next() // 最終要加
});


export default router;



