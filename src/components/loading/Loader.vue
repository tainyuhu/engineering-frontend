<template>
    <div class="overlay" v-if="isLoading">
      <v-progress-circular indeterminate color="#FF6F00"></v-progress-circular>
      <div> 已加载 {{ elapsedSeconds }} 秒</div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isLoading: {
        type: Boolean,
        required: true
      },
      elapsedSeconds: {
        type: Number,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
  }
  </style>
  