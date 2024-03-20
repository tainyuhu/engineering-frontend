<template>
    <div>
        <v-sheet color="grey-lighten-4" class="px-6 py-8 v-sheet-custom" >
          <div class="extra-decor"></div>
            <v-row align="center" style="column-gap: 0.5rem;">
                <v-avatar color="grey-darken-2" size="48">
                  <v-icon icon="mdi-account"></v-icon>
                </v-avatar>
                <h6 class="font-weight-black text-black text-h6">{{user.firstName}}{{user.lastName}}</h6>
            </v-row>
        </v-sheet>
        <v-divider></v-divider>
        <v-list>
            <v-list-item prepend-icon="mdi-home" title="首頁" :to="{ name: 'home' }" active-class="selected-item"></v-list-item>

            <!--進度管理-->
            <v-list-group no-action sub-group>
              <template v-slot:activator="{ props }">
                <v-list-item prepend-icon="mdi-progress-check" v-bind="props" title="進度管理" ></v-list-item>
              </template>

              <!-- 進度管理子項目 -->
              <v-list-item
                v-for="([title, icon, routeName], i) in progress"
                :key="i"
                :title="title"
                :prepend-icon="icon"
                :to="{ name: routeName }"
                active-class="selected-item"
              ></v-list-item>
            </v-list-group>

            <!--文件管理-->
            <v-list-group v-if="userHasGroup(['admin', 'manager', 'power_user', 'test'])" no-action sub-group>
              <template v-slot:activator="{ props }">
                <v-list-item prepend-icon="mdi-file-clock-outline" v-bind="props" title="文件管理" ></v-list-item>
              </template>

              <!-- 文件管理子項目 -->
              <v-list-item
                v-for="([title, icon, routeName], i) in file"
                :key="i"
                :title="title"
                :prepend-icon="icon"
                :to="{ name: routeName }"
                active-class="selected-item"
              ></v-list-item>
            </v-list-group>

            <!--會議記錄-->
            <v-list-group v-if="userHasGroup(['admin', 'manager', 'power_user', 'test'])" no-action sub-group>
              <template v-slot:activator="{ props }">
                <v-list-item prepend-icon="mdi-file-document-outline" v-bind="props" title="會議記錄"></v-list-item>
              </template>

              <!-- 會議記錄子項目 -->
              <v-list-item
                v-for="([title, icon, routeName], i) in meeting"
                :key="i"
                :title="title"
                :prepend-icon="icon"
                :to="{ name: routeName }"
                active-class="selected-item"
              ></v-list-item>
            </v-list-group>

            <!--計劃管理-->
            <v-list-group v-if="userHasGroup(['admin', 'manager', 'power_user'])" no-action sub-group>
              <template v-slot:activator="{ props }">
                <v-list-item prepend-icon="mdi-calendar-text" v-bind="props" title="計畫管理"></v-list-item>
              </template>

              <!-- 計劃管理子項目 -->
              <v-list-item
                v-for="([title, icon, routeName], i) in plan"
                :key="i"
                :title="title"
                :prepend-icon="icon"
                :to="{ name: routeName }"
                active-class="selected-item"
              ></v-list-item>
            </v-list-group>

            <!--總體計劃管理-->
            <v-list-group v-if="userHasGroup(['admin','manager','power_user'])" no-action sub-group>
              <template v-slot:activator="{ props }">
                <v-list-item prepend-icon="mdi-sitemap" v-bind="props" title="總體計劃管理"></v-list-item>
              </template>

              <!-- 總體計劃管理子項目 -->
              <v-list-item
                v-for="([title, icon, routeName], i) in master"
                :title="title"
                :prepend-icon="icon"
                :to="{ name: routeName }"
                active-class="selected-item"
              ></v-list-item>
            </v-list-group>

            <!--系統設定-->
            <v-list-group v-if="userHasGroup(['admin','manager'])"  no-action sub-group>
              <template v-slot:activator="{ props }">
                <v-list-item prepend-icon="mdi-cog-outline" v-bind="props" title="系統設定"></v-list-item>
              </template>

              <!-- 系統設定子項目 -->
              <v-list-item
                v-for="([title, icon, routeName], i) in setting"
                :key="i"
                :title="title"
                :prepend-icon="icon"
                :to="{ name: routeName }"
                active-class="selected-item"
              ></v-list-item>
            </v-list-group>

            <!--幫助與支持-->
            <v-list-group no-action sub-group>
              <template v-slot:activator="{ props }">
                <v-list-item prepend-icon="mdi-help-circle-outline" v-bind="props" title="幫助與支持"></v-list-item>
              </template>

              <!-- 幫助與支持子項目 -->
              <v-list-item
                v-for="([title, icon, routeName], i) in help"
                :key="i"
                :title="title"
                :prepend-icon="icon"
                :to="{ name: routeName }"
                active-class="selected-item"
              ></v-list-item>
            </v-list-group>
            <v-divider></v-divider>
            <v-list-item prepend-icon="mdi-logout" title="登出" @click="logout"></v-list-item>
          </v-list>
          <v-dialog v-model="showDialog" persistent width="300">
            <v-card>
              <v-card-title class="text-h5">確認登出</v-card-title>
              <v-card-text>即將登出，確定要登出嗎？</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="showDialog = false">取消</v-btn>
                <v-btn color="blue darken-1" text @click="confirmLogout">確認</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const userString = localStorage.getItem('user');
const user = ref(userString ? JSON.parse(userString) : { firstName: '', lastName: '', groups: [] });

const userHasGroup = (groupsToCheck) => {
  const groupsArray = Array.isArray(groupsToCheck) ? groupsToCheck : [groupsToCheck];
  return groupsArray.some(group => user.value.groups.includes(group));
};

// 進度管理
const progress = computed(() => {
  const baseItems = [
    ['瀏覽計畫進度', 'mdi-eye', 'Browse_Progress']
  ];

  if (userHasGroup(['admin', 'power_user', 'user', 'test'])) {
    baseItems.unshift(['填寫計畫進度', 'mdi-pencil', 'Fillin_Progress']);
  }

  if (userHasGroup(['admin', 'manager', 'power_user'])) {
    baseItems.push(['瀏覽總體進度', 'mdi-view-dashboard', 'Browse_Master_Progress']);
  }

  return baseItems;
});


// 文件管理
const file = computed(() => {
  const baseItems = [
    ['瀏覽文件進度', 'mdi-file-eye-outline', 'View_File_Progress']
  ];

  // if (userHasGroup('admin', 'manager', 'power_user')) {
  //   baseItems.unshift(['上傳記錄','mdi-upload','Upload_Meeting_Record' ]);
  // }
  // ['上傳文件', 'mdi-help-circle', 'FAQ'],
  // ['更新文件', 'mdi-lifebuoy', 'Contact_Support'],

  return baseItems;
});

// 會議記錄管理
const meeting = computed(() => {
  const baseItems = [
    ['查詢紀錄','mdi-magnify','Search_Meeting_Record']
  ];

  if (userHasGroup('admin')) {
    baseItems.unshift(['上傳記錄','mdi-upload','Upload_Meeting_Record' ]);
  }

  return baseItems;
});

// 計劃管理
const plan = computed(() => {
  const baseItems = [
    ['計畫列表', 'mdi-format-list-bulleted', 'Plan_List']
  ];

  if (userHasGroup('admin')) {
    baseItems.unshift(
      ['新增計畫', 'mdi-plus-box', 'Add_New_Plan'],
      ['修改計畫', 'mdi-file-document-edit', 'Edit_Plan']
    );
  }

  return baseItems;
});

// 總體計劃管理
const master = computed(() => {
  const baseItems = [
    ['總體計畫列表', 'mdi-view-list', 'Master_Plan_List']
  ];

  if (userHasGroup('admin')) {
    baseItems.unshift( 
      ['新增計畫組合', 'mdi-playlist-plus', 'Add_Master_Plan'],
      ['修改計畫組合', 'mdi-playlist-edit', 'Edit_Master_Plan']
    );
  }

  return baseItems;
});

</script>
<script>
  export default {
    name: 'Navigation',
    data: () => ({
      showDialog: false,
      setting: [
        ['通知設定', 'mdi-bell-ring', 'Notification_Settings'], 
        ['帳戶管理', 'mdi-account-circle', 'Account_Management'],
      ],
      help: [
        ['使用指南', 'mdi-book-open-page-variant', 'User_Guide'], 
        ['常見問題', 'mdi-help-circle', 'FAQ'],
        ['聯繫支持', 'mdi-lifebuoy', 'Contact_Support'],
      ],
    }),
  methods: {
    logout() {
    this.showDialog = true;
    },
    confirmLogout() {
      this.$store.dispatch('auth/logout'); 
      this.$router.push({ name: 'Login' });
      this.showDialog = false;
    }
  }
}
</script>

<style scoped>
/* 定義被選中項目的顏色 */
.selected-item {
  background-color: #E65100; 
  color: white !important; 
  transition: background-color 0.3s ease; 
}

/* 定義被選中的圖標與文字色彩 */
.selected-item .v-list-item-title,
.selected-item .v-icon {
  color: white !important;
}

/* 添加鼠標懸停的色彩變化 */
.v-list-item--link:hover {
  background-color: #FF9800;
  color: white;
  transition: background-color 0.3s ease;
}

.v-sheet-custom {
  background: linear-gradient(to right, #FFA726, #FFD54F);
  position: relative;
  color: white;
  padding: 20px;
  overflow: hidden;
}

.v-sheet-custom::before {
  content: '';
  position: absolute;
  right: 1%;
  top: 50%;
  transform: translateY(-50%);
  width: 100px;
  height: 100px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
}

.v-sheet-custom::after {
  content: '';
  position: absolute;
  right: 0.5%; 
  top: 20px; 
  width: 20px; 
  height: 20px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

.v-sheet-custom .extra-decor {
  content: '';
  position: absolute;
  right: 30%; 
  top: 60px; 
  width: 30px; 
  height: 30px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
}

</style>