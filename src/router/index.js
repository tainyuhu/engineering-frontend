import { createRouter, createWebHistory } from "vue-router";

// 用來載入 view的函式
function loadView(view) {
  return () => import(`@/views/${view}.vue`);
}

function loadBrowseProgressView(view) {
  return () => import(`@/views/Browseprogress/${view}.vue`);
}

function loadViewFileProgressView(view) {
  return () => import(`@/views/Viewfileprogress/${view}.vue`);
}

function loadViewProgressView(view) {
  return () => import(`@/views/Progress/${view}.vue`);
}

function loadToolView(view) {
  return () => import(`@/views/tools/${view}.vue`);
}

const routes = [
  // 主要頁面
  {
    // 首頁
    path: "/",
    name: "home",
    component: loadView("Home"),
    meta: { requiresAuth: true },
  },
  {
    // 登入
    path: "/login",
    name: "Login",
    component: loadView("Login"),
  },
  {
    // 無權限
    path: "/No_Permission",
    name: "No_Permission",
    component: loadToolView("No_Permission"),
  },
  {
    // 填寫計畫進度
    path: "/Fillin_Progress",
    name: "Fillin_Progress",
    component: loadView("Fillin_Progress"),
    meta: { requiresAuth: true, allowedGroups: ["admin"] },
    //  "power_user", "user", "test"
  },
  {
    // 瀏覽計畫進度
    path: "/Browse_Progress",
    name: "Browse_Progress",
    component: loadView("Browse_Progress"),
    meta: { requiresAuth: true },
  },
  {
    // 瀏覽文件進度
    path: "/View_File_Progress",
    name: "View_File_Progress",
    component: loadView("View_File_Progress"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "manager", "power_user", "test"] },
  },
  {
    // 瀏覽總體進度
    path: "/Browse_Master_Progress",
    name: "Browse_Master_Progress",
    component: loadView("Browse_Master_Progress"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "manager", "power_user", "test"] },
  },
  {
    // 上傳紀錄
    path: "/Upload_Meeting_Record",
    name: "Upload_Meeting_Record",
    component: loadView("Upload_Meeting_Record"),
    meta: { requiresAuth: true, allowedGroups: ["admin"] },
  },
  {
    // 查詢紀錄
    path: "/Search_Meeting_Record",
    name: "Search_Meeting_Record",
    component: loadView("Search_Meeting_Record"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "manager", "power_user", "test"] },
  },
  {
    // 計畫列表
    path: "/Plan_List",
    name: "Plan_List",
    component: loadView("Plan_List"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "manager", "power_user", "test"] },
  },
  {
    // 新增計畫
    path: "/Add_New_Plan",
    name: "Add_New_Plan",
    component: loadView("Add_New_Plan"),
    meta: { requiresAuth: true, allowedGroups: ["admin"] },
  },
  {
    // 修改計畫
    path: "/Edit_Plan",
    name: "Edit_Plan",
    component: loadView("Edit_Plan"),
    meta: { requiresAuth: true, allowedGroups: ["admin"] },
  },
  {
    // 總體計畫列表
    path: "/Master_Plan_List",
    name: "Master_Plan_List",
    component: loadView("Master_Plan_List"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "manager", "power_user", "test"] },
  },
  {
    // 新增計畫組合
    path: "/Add_Master_Plan",
    name: "Add_Master_Plan",
    component: loadView("Add_Master_Plan"),
    meta: { requiresAuth: true, allowedGroups: ["admin"] },
  },
  {
    // 修改計畫組合
    path: "/Edit_Master_Plan",
    name: "Edit_Master_Plan",
    component: loadView("Edit_Master_Plan"),
    meta: { requiresAuth: true, allowedGroups: ["admin"] },
  },
  {
    // 通知設定
    path: "/Notification_Settings",
    name: "Notification_Settings",
    component: loadView("Notification_Settings"),
    meta: { requiresAuth: true, allowedGroups: ["admin"] },
  },
  {
    // 帳戶管理
    path: "/Account_Management",
    name: "Account_Management",
    component: loadView("Account_Management"),
    meta: { requiresAuth: true, allowedGroups: ["admin"] },
  },
  {
    // 使用指南
    path: "/User_Guide",
    name: "User_Guide",
    component: loadView("User_Guide"),
    meta: { requiresAuth: true, allowedGroups: ["admin"] },
  },
  {
    // 常見問題
    path: "/FAQ",
    name: "FAQ",
    component: loadView("FAQ"),
    meta: { requiresAuth: true, allowedGroups: ["admin"] },
  },
  {
    // 聯繫支持
    path: "/Contact_Support",
    name: "Contact_Support",
    component: loadView("Contact_Support"),
    meta: { requiresAuth: true, allowedGroups: ["admin"] },
  },
  // 瀏覽計畫進度子頁面 loadBrowseProgressView
  {
    // 案場
    path: "/Project_Site_Overview",
    name: "Project_Site_Overview",
    component: loadBrowseProgressView("Project_Site_Overview"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "power_user", "user", "test"] },
  },
  {
    // General_Loop_Photoelectric_Engineering
    path: "/General_Loop_Photoelectric_Engineering",
    name: "General_Loop_Photoelectric_Engineering",
    component: loadBrowseProgressView("General_Loop_Photoelectric_Engineering"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "power_user", "user", "test"] },
  },
  {
    // Loop_Photoelectric_Engineering
    path: "/Loop_Photoelectric_Engineering",
    name: "Loop_Photoelectric_Engineering",
    component: loadBrowseProgressView("Loop_Photoelectric_Engineering"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "power_user", "user", "test"] },
  },
  {
    // PV
    path: "/Project_PV",
    name: "Project_PV",
    component: loadBrowseProgressView("Project_PV"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "power_user", "user", "test"] },
  },
  {
    // PV
    path: "/Project_PV",
    name: "Project_PV",
    component: loadBrowseProgressView("Project_PV"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "power_user", "user", "test"] },
  },
  {
    // 養殖
    path: "/Project_Breeding",
    name: "Project_Breeding",
    component: loadBrowseProgressView("Project_Breeding"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "power_user", "user", "test"] },
  },
  {
    // 22.8KV
    path: "/Powerline_228KV_Details",
    name: "Powerline_228KV_Details",
    component: loadBrowseProgressView("Powerline_228KV_Details"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "power_user", "user", "test"] },
  },
  {
    // 電業申辦
    path: "/Electricity_Application_Process",
    name: "Electricity_Application_Process",
    component: loadBrowseProgressView("Electricity_Application_Process"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "power_user", "user", "test"] },
  },
  {
    // 161KV
    path: "/High-Voltage-161KV-Info",
    name: "High-Voltage-161KV-Info",
    component: loadBrowseProgressView("High-Voltage-161KV-Info"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "power_user", "user", "test"] },
  },
  {
    // 升壓站
    path: "/Booster_Station_Progress",
    name: "Booster_Station_Progress",
    component: loadBrowseProgressView("Booster_Station_Progress"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "power_user", "user", "test"] },
  },
  // 瀏覽文件進度子頁面 loadViewFileProgressView
  {
    path: "/File_Progress",
    name: "File_Progress",
    component: loadViewFileProgressView("File_Progress"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "power_user", "manager", "test"] },
  },
  // 進度填寫子頁面
  // PV工程
  {
    path: "/PV_Progress",
    name: "PV_Progress",
    component: loadViewProgressView("PV_Progress"),
    meta: { requiresAuth: true, allowedGroups: ["admin", "power_user", "user", "test"] },
  },

  // 404 Not Found
  // /:pathMatch(.*)*: 最終都會指向該Component，上面路由條件都沒達到時
  {
    path: "/:pathMatch(.*)*",
    name: "404NotFound",
    component: loadView("404NotFound"),
  },
];

// Hisotry API
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const accessToken = localStorage.getItem("access_token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !accessToken) {
    return { name: "Login", query: { redirect: to.fullPath } };
  }

  if (requiresAuth && accessToken && user) {
    const allowedGroups = to.meta.allowedGroups || [];
    const userGroups = Array.isArray(user.groups) ? user.groups : [user.group];
    const hasPermission =
      allowedGroups.length === 0 || userGroups.some((group) => allowedGroups.includes(group));

    if (!hasPermission) {
      return { name: "No_Permission" };
    }
  }
});

export default router;
