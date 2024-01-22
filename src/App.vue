<template>
  <v-app id="inspire">
    <!-- 側邊欄 -->
    <v-navigation-drawer v-if="isAuthenticated" v-model="drawer" >
      <Navigation />
    </v-navigation-drawer>

    <!-- 頂端 -->
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <!-- Bar Title -->
      <v-app-bar-title class="text-h4 font-weight-bold">{{ app_name }}</v-app-bar-title>
    </v-app-bar>

    <!-- 主頁面 -->
    <v-main>
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

const drawer = ref(null)
const app_name = ref("工程進度系統")
</script>

<style>
.pointer {
  /* 點擊按鈕變換(通常都會使用到) => 放置在全域 */
  cursor: pointer;
}
</style>
