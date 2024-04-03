<template>
  <div class="login-background">
    <div class="login-container">
      <form @submit.prevent="login" class="login-form">
        <h2>登入</h2>
        <div v-if="loginSuccess" class="alert alert-success">登入成功！</div>
        <div v-if="loginError" class="alert alert-danger">{{ errorMessage }}</div>
        <div class="form-group">
          <input
            v-model="username"
            type="text"
            placeholder="帳號"
            class="form-control"
            autocomplete="username"
          />
        </div>
        <div class="form-group">
          <input
            v-model="password"
            type="password"
            placeholder="密碼"
            class="form-control"
            autocomplete="current-password"
          />
        </div>
        <button type="submit" class="btn-login">登入</button>
      </form>
    </div>
  </div>
</template>

<script>
import http from "@/http";

export default {
  data() {
    return {
      // username: 'pp',
      // password: 'mirdcUC',
      username: "",
      password: "",
      loginSuccess: false,
      loginError: false,
    };
  },
  methods: {
    async login() {
      this.loginSuccess = false;
      this.loginError = false;
      try {
        const response = await http.post("api/token/", {
          username: this.username,
          password: this.password,
        });

        this.loginSuccess = true;
        this.loginError = false;

        console.log("Request:", response);
        const user = {
          username: response.data.username,
          firstName: response.data.first_name || "",
          lastName: response.data.last_name || "",
          email: response.data.email || "",
          isStaff: response.data.is_staff || false,
          isActive: response.data.is_active || false,
          groups: response.data.groups || [],
        };
        this.$store.commit("setUser", user);

        localStorage.setItem("access_token", response.data.access);
        this.$store.commit("auth/setToken", response.data.access);

        if (this.$route.query.redirect) {
          this.$router.push(this.$route.query.redirect);
        } else {
          this.$router.push("/");
        }
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error(error);
        this.loginError = true;
        this.loginSuccess = false;
        this.errorMessage = "登入失敗，請檢查您的帳號或密碼。";
      }
    },
  },
};
</script>

<style>
.login-background {
  background-image: url("~@/assets/image/system-background.jpg");
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

.alert {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid transparent;
  border-radius: 4px;
  color: #fff;
  text-align: center;
}

.alert-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}
</style>
