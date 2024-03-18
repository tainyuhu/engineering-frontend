<template>
  <div class="container">
    <div class="card">
      <h1>PV 工程進度填寫</h1>
      <div class="form-group">
        <label for="site-name">迴路名稱</label>
        <select id="site-name" v-model="siteName">
          <option value="" disabled>選擇一個迴路</option>
        </select>
      </div>
      <div class="form-group">
        <label for="site-name">案場名稱</label>
        <select id="site-name" v-model="siteName">
          <option value="" disabled>選擇一個案場</option>
        </select>
      </div>
      <div class="form-group">
        <label>週間</label>
        <VueDatePicker v-model="date" week-picker />
      </div>
      <div class="form-group">
        <label for="person-in-charge">負責人</label>
        <input type="text" id="person-in-charge" v-model="personInCharge" />
      </div>
      <div class="form-group">
        <input type="checkbox" id="not-finished" v-model="notFinished" />
        <label for="not-finished">未施工</label>
      </div>
      <div v-if="notFinished" class="form-group">
        <label for="reason">未施工原因</label>
        <input type="text" id="reason" v-model="reasonForNotStarting" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const siteName = ref('');
const date = ref(null);
const personInCharge = ref('');
const notFinished = ref(false);
const reasonForNotStarting = ref('');
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.card {
  width: 90%;
  max-width: 600px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input[type="text"],
.form-group select {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
}

.form-group input[type="checkbox"] {
  margin-right: 10px;
}
</style>
