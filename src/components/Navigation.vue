<template>
    <div>
        <v-sheet color="grey-lighten-4" class="px-6 py-8">
            <v-row align="center" style="column-gap: 0.5rem;">
                <v-avatar color="grey-darken-2" size="48">
                  <v-icon icon="mdi-account"></v-icon>
                </v-avatar>
                <h6 class="font-weight-black text-black text-h6">{{user}}</h6>
            </v-row>
        </v-sheet>

          <v-divider></v-divider>

          <v-list>
              <v-list-item   link nav
                v-for="route in routes" :key="route['title']" 
                :to="{name: route['routeName']}"
                :value="route['routeName']"
                active-class="bg-primary white--text font-weight-black"
                >
                <template v-slot:prepend>
                  <svg-icon type="mdi" :path="route['icon']" class="mr-2"></svg-icon>
                </template>

                <h3 class="font-weight-bold">{{ route['title'] }}</h3>
              </v-list-item>
          </v-list>

          <v-divider></v-divider>
          <div>
            <button @click="logout">登出</button>
          </div>
          
    </div>
</template>

<script>
  export default {
    name: 'Navigation',
    methods: {
    logout() {
      this.$store.dispatch('auth/logout'); // 调用 Vuex 中的 logout action
      this.$router.push({ name: 'Login' }); // 重定向到登录页面
    }
  }
}
</script>

<script setup>
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiSquareEditOutline,mdiHome } from '@mdi/js';

import { ref } from 'vue'

  const user = localStorage.getItem('user');
  // 前綴
  const icon_prefix = ref('mdi')

  // 路由列表 (標題內容、圖案、連結)
  const routes = ref([
    { title: '首頁', icon: mdiHome, routeName: 'home' },
    { title: '工程進度總覽', icon: mdiSquareEditOutline, routeName: 'Browse_Project_Progress' },
    { title: '工程進度填寫', icon: mdiSquareEditOutline, routeName: 'Fillin_Project_Progress' },
    // Fillin_Project_Progress
    // { title: '表格', icon: 'table', routeName: 'Table' },
  ])
</script>

<style scoped>

</style>