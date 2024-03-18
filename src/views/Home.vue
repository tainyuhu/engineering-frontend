<template>
  <div class="background-card">
    <v-container>
      <h6 class="text-h6 text-md-h5 font-weight-black">
        公告欄
      </h6>

      <v-list class="custom-list">
        <v-list-item 
          v-for="(item, index) in bulletinItems" 
          :key="index"
          @click="showDetails(item)"
        >
        </v-list-item>
      </v-list>

      <v-dialog
        v-model="detailsDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            {{ selectedItem.title }}
          </v-card-title>
          <v-card-text>
            {{ selectedItem.content }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="detailsDialog = false">關閉</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bulletinItems: [
        { title: '公告 1', content: '這是公告 1 的內容...' },
        { title: '公告 2', content: '這是公告 2 的內容...' },
        // ...更多公告
      ],
      selectedItem: null,
      detailsDialog: false
    }
  },
  methods: {
    showDetails(item) {
      this.selectedItem = item;
      this.detailsDialog = true;
    }
  }
}
</script>

<style scoped>

.background-card {
    background-color: #fcfcfc;
    height: 100vh;
    width: 100%;
}

.custom-list {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 陰影效果 */
  border-radius: 10px; /* 若需要圓角 */
  padding: 10px; /* 若需要內部間距 */
}
</style>