<template>
    <div class="no-permission-container">
      <div class="content">
        <h1>很抱歉，您無權訪問此頁面</h1>
        <p>您可能需要相應的權限才能查看此內容。如果您認為這是一個錯誤，請聯繫開發人員。</p>
        <button @click="goBack">返回上一頁</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Nopermission",
    methods: {
      goBack() {
        this.$router.go(-1); // 使用Vue Router的go方法返回上一頁
      },
    },
  };
  </script>
  
  <style scoped>
  .no-permission-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .content {
    text-align: center;
  }
  
  h1 {
    color: #333;
    margin-bottom: 20px;
  }
  
  p {
    color: #666;
    margin-bottom: 30px;
  }
  
  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 16px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  