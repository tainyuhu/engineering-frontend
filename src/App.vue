<template>
  <v-app id="inspire">
    <!-- 側邊欄 -->
    <v-navigation-drawer v-if="isAuthenticated" v-model="drawer" permanent>
      <Navigation />
    </v-navigation-drawer>

    <!-- 頂端 -->
    <v-app-bar :style="{ backgroundImage: 'linear-gradient(to left, #FFA726, #FFD54F)', color: '#5A5A5A'}">
      <v-app-bar-nav-icon @click="drawer = !drawer"> </v-app-bar-nav-icon>

      <!-- Bar Title -->
      <v-app-bar-title class="text-h5 font-weight-bold app-name-spacing" >{{ app_name }}</v-app-bar-title>
      <v-icon class="icon-behind-title">
        mdi-hammer-screwdriver
      </v-icon>
    </v-app-bar>

    <!-- 主頁面 -->
    <v-main :style="{ backgroundColor: '#f5f5f5' }">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </v-main>
  </v-app>
</template>


<script>
import Navigation from "@/components/Navigation.vue"
export default {
  name: 'Navigation',
  components: {
    Navigation
  },
  created() {
    // 從 localStorage 獲取 token
    const token = localStorage.getItem('access_token');
    if (token) {
      // 使用 Vuex 更新 token 狀態
      this.$store.commit('auth/setToken', token);
    }
  },
  computed: {
  isAuthenticated() {
    return this.$store.getters['auth/isAuthenticated'];
  }
}
}
</script>

<script setup>
import { ref } from 'vue';

const drawer = ref(false); 
const app_name = ref("工程進度系統")
</script>

<style>
.pointer {
  /* 點擊按鈕變換(通常都會使用到) => 放置在全域 */
  cursor: pointer;
}

/* 卷軸樣式變更 */
::-webkit-scrollbar {
  width: 4px;
}
 
::-webkit-scrollbar-thumb {
   border-radius: 2px;
  background-color: #bdc3c7;
  color: #bdc3c7;
  -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}

.icon-behind-title {
  font-size: 120px; 
  position: relative; 
  top: 20px;
  right: 0px;
  color: #ffffff;
}

.app-name-spacing {
  letter-spacing: 60em;
}

</style>
