<template>
  <div>
    <button @click="goBack" class="back-button font-weight-bold">返回</button>
    <span class="ml-3 note-span"
      >※以下檔案僅供瀏覽，不提供修改功能。因是外連到Google試算表，故載入速度會比較緩慢，請耐心等候。</span
    >
    <iframe :src="sheetsUrl" width="90%" height="600" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sheetsUrl: "",
    };
  },
  created() {
    this.sheetsUrl = this.$route.query.fileLink;
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

.back-button:hover {
  background-color: #1976d2;
}

.note-span {
  color: #6c757d;
  font-size: 11px;
}

iframe {
  margin: 20px;
  padding: 20px;
}
</style>
