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
  { // 填寫計畫進度
    path: '/Fillin_Progress',
    name: 'Fillin_Progress',
    component: loadView("Fillin_Progress"),
    meta: { requiresAuth: true },
  },
  { // 瀏覽計畫進度
    path: '/Browse_Progress',
    name: 'Browse_Progress',
    component: loadView("Browse_Progress"),
    meta: { requiresAuth: true },
  },
  { // 瀏覽總體進度
    path: '/Browse_Master_Progress',
    name: 'Browse_Master_Progress',
    component: loadView("Browse_Master_Progress"),
    meta: { requiresAuth: true },
  },
  { // 上傳紀錄
    path: '/Upload_Meeting_Record',
    name: 'Upload_Meeting_Record',
    component: loadView("Upload_Meeting_Record"),
    meta: { requiresAuth: true },
  },
  { // 查詢紀錄
    path: '/Search_Meeting_Record',
    name: 'Search_Meeting_Record',
    component: loadView("Search_Meeting_Record"),
    meta: { requiresAuth: true },
  },
  { // 計畫列表
    path: '/Plan_List',
    name: 'Plan_List',
    component: loadView("Plan_List"),
    meta: { requiresAuth: true },
  },
  { // 新增計畫
    path: '/Add_New_Plan',
    name: 'Add_New_Plan',
    component: loadView("Add_New_Plan"),
    meta: { requiresAuth: true },
  },
  { // 修改計畫
    path: '/Edit_Plan',
    name: 'Edit_Plan',
    component: loadView("Edit_Plan"),
    meta: { requiresAuth: true },
  },
  { // 總體計畫列表
    path: '/Master_Plan_List',
    name: 'Master_Plan_List',
    component: loadView("Master_Plan_List"),
    meta: { requiresAuth: true },
  },
  { // 新增計畫組合
    path: '/Add_Master_Plan',
    name: 'Add_Master_Plan',
    component: loadView("Add_Master_Plan"),
    meta: { requiresAuth: true },
  },
  { // 修改計畫組合
    path: '/Edit_Master_Plan',
    name: 'Edit_Master_Plan',
    component: loadView("Edit_Master_Plan"),
    meta: { requiresAuth: true },
  },
  { // 通知設定
    path: '/Notification_Settings',
    name: 'Notification_Settings',
    component: loadView("Notification_Settings"),
    meta: { requiresAuth: true },
  },
  { // 帳戶管理
    path: '/Account_Management',
    name: 'Account_Management',
    component: loadView("Account_Management"),
    meta: { requiresAuth: true },
  },
  { // 使用指南
    path: '/User_Guide',
    name: 'User_Guide',
    component: loadView("User_Guide"),
    meta: { requiresAuth: true },
  },
  { // 常見問題
    path: '/FAQ',
    name: 'FAQ',
    component: loadView("FAQ"),
    meta: { requiresAuth: true },
  },
  { // 聯繫支持
    path: '/Contact_Support',
    name: 'Contact_Support',
    component: loadView("Contact_Support"),
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
          next();
        } else {
          next({ name: 'Login' }) // 權限檢查未通過
        }
      });
    }
  }

  next() // 最終要加
});


export default router;



