<template>
  <div>
    <button @click="goBack" class="back-button font-weight-bold">返回</button>
    <button @click="dialog = true" class="info-button font-weight-bold">瀏覽須知</button>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">瀏覽須知</v-card-title>
        <v-card-text>
          1. Google Sheet 載入可能需要一些時間，請耐心等候。<br />
          2. 檔案內容僅供瀏覽，不提供修改功能。<br />
          3. 內容過大，請將縮放 100% 的部分修改為 50% 。<br />
          4. 未見分頁，請善用卷軸滾動。
        </v-card-text>
        <v-card-actions>
          <v-btn color="deep-purple-darken-3" @click="dialog = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div v-if="loading" class="loading-style">
      <v-skeleton-loader type="table"></v-skeleton-loader>
    </div>
    <iframe v-show="!loading" :src="sheetsUrl" class="iframe-style" @load="iframeLoaded"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sheetsUrl: "",
      loading: true,
      dialog: false,
    };
  },
  created() {
    this.sheetsUrl = this.$route.query.fileLink;
    setTimeout(() => {
      this.loading = false;
    }, 3000);
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "View_File_Progress",
        query: {
          page: this.$route.query.page,
          itemsPerPage: this.$route.query.itemsPerPage,
        },
      });
    },
    iframeLoaded() {
      console.log("iframe has loaded");
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.back-button {
  margin: 10px;
  background-color: #2196f3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.info-button {
  margin: 10px;
  background-color: #7c4dff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #1976d2;
}

.info-button:hover {
  background-color: #5e35b1;
}

.iframe-style {
  display: block;
  width: 100%;
  height: 600px;
  margin: 20px auto;
  border: none;
  padding: 0 20px;
}

.loading-style {
  margin: 20px auto;
  padding: 0 20px;
}
</style>
