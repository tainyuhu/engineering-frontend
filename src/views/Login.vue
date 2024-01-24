<template>
  <div class="login-background">
    <div class="login-container">
      <form @submit.prevent="login" class="login-form">
        <h2>登入</h2>
        <div class="form-group">
          <input v-model="username" type="text" placeholder="帳號" class="form-control">
        </div>
        <div class="form-group">
          <input v-model="password" type="password" placeholder="密碼" class="form-control">
        </div>
        <button type="submit" class="btn-login">登入</button>
      </form>
    </div>
  </div>
</template>

<script>
import http from '@/http'; // 导入 Axios 实例

export default {
  data() {
    return {
      //username: 'pp',
      //password: 'mirdcUC',
      username: '',
      password: '',
    };
  },
  methods: {
    async login() {
      try {
        const response = await http.post('api/token/', {
          username: this.username,
          password: this.password
        });
        console.log("Request:", this.username);
        // 存储 JWT 令牌
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('user',this.username);
        // 更新 Vuex Store 的登录状态
        this.$store.commit('auth/setToken', response.data.access);
        // 跳转到受保护的页面
        this.$router.push({ name: 'Fillin_Project_Progress' });
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style>
.login-background{
  background-image: url('~@/assets/image/system-background.jpg');
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 90vh;
  background-repeat: no-repeat; 
  display: flex; 
  justify-content: center; 
  align-items: center;
}

.login-container {
  width: 100%;
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  /* border-radius: 10px; */
}

.login-form h2 {
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.btn-login {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

.btn-login:hover {
  background-color: #0056b3;
}
</style>