<template>
  <v-container fluid>
    <!-- 第一橫列 -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mb-4 info-card">
          <v-card-title class="orange-title font-weight-bold">目前資訊</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-card class="info-card">
                  <v-card-title class="blue-bg card-title font-weight-bold">目前日期</v-card-title>
                  <v-card-text class="card-content">{{ currentDate }}</v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-card class="info-card">
                  <v-card-title class="purple-bg card-title font-weight-bold"
                    >目前週數</v-card-title
                  >
                  <v-card-text class="card-content">{{ currentWeek }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="mb-4 info-card">
          <v-card-title class="orange-title font-weight-bold">紀錄資訊</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-card class="info-card">
                  <v-card-title class="pink-bg card-title font-weight-bold">紀錄日期</v-card-title>
                  <v-card-text class="card-content">2024/07/28</v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="info-card">
                  <v-card-title class="green-bg card-title font-weight-bold">紀錄季度</v-card-title>
                  <v-card-text class="card-content">3</v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="info-card">
                  <v-card-title class="brown-bg card-title font-weight-bold">紀錄週數</v-card-title>
                  <v-card-text class="card-content">4</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card class="mb-4 info-card">
          <v-card-title class="orange-title font-weight-bold">天氣狀況</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-card class="info-card">
                  <v-card-title class="green-bg-1 card-title font-weight-bold"
                    >目前天氣</v-card-title
                  >
                  <v-card-text class="card-content">晴</v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 第二橫列 -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card class="mb-4 info-card">
          <v-card-title class="orange-title font-weight-bold">布告欄</v-card-title>
          <v-card-text>
            <!-- 表格 -->
            <v-table class="elevated-table" width="100%" style="height: 350px">
              <thead>
                <tr class="table-header green-bg">
                  <th class="font-weight-bold sortable">分類</th>
                  <th class="font-weight-bold sortable">標題</th>
                  <th class="font-weight-bold sortable">發布時間</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(file, index) in paginatedFiles"
                  :key="index"
                  @click="viewFile(file)"
                  class="table-row"
                >
                  <td class="chip-cell">
                    <v-chip :color="getCategoryColor(file.category)" dark>{{
                      file.category
                    }}</v-chip>
                  </td>
                  <td class="title-cell">{{ file.file_name }}</td>
                  <td class="title-cell">{{ file.update }}</td>
                </tr>
              </tbody>
            </v-table>

            <!-- 分頁功能 -->
            <div class="pagination-container">
              <div class="pagination-actions">
                <v-btn icon small variant="text" @click="page = 1">
                  <v-icon>mdi-page-first</v-icon>
                </v-btn>
                <v-pagination
                  v-model="page"
                  :length="pages"
                  :total-visible="1"
                  class="pagination"
                  active-color="#00b894"
                  @input="page = $event"
                ></v-pagination>
                <v-btn icon small variant="text" @click="page = pages">
                  <v-icon>mdi-page-last</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="mb-4 info-card">
          <v-card-title class="orange-title font-weight-bold">即時進度</v-card-title>
          <v-card-text>
            <v-carousel hide-delimiters height="450">
              <template v-slot:prev="{ props }">
                <v-btn
                  density="compact"
                  variant="text"
                  @click="props.onClick"
                  icon="mdi-chevron-left"
                ></v-btn>
              </template>
              <template v-slot:next="{ props }">
                <v-btn
                  density="compact"
                  variant="text"
                  @click="props.onClick"
                  icon="mdi-chevron-right"
                ></v-btn>
              </template>
              <v-carousel-item v-for="(phase, index) in projects" :key="index">
                <v-card class="info-card">
                  <v-card-title class="pink-bg card-title font-weight-bold">
                    <v-icon class="mr-2">mdi-information</v-icon>
                    計畫名稱：{{ phase.planName }}
                  </v-card-title>
                  <v-card-text class="card-content">
                    <v-row>
                      <v-col v-for="(project, idx) in phase.project" :key="idx" cols="12" md="6">
                        <v-card class="mb-4 info-card">
                          <v-card-title
                            class="card-title font-weight-bold"
                            style="text-align: center"
                            >專案名稱：{{ project.projectName }}</v-card-title
                          >
                          <v-card-text class="card-content">
                            <v-progress-linear
                              rounded
                              v-model="project.progress"
                              height="20"
                              :color="getProgressColor(project.progress)"
                            >
                              <strong
                                :style="{ color: project.progress > 70 ? '#ffffff' : '#000000' }"
                                >{{ project.progress }}%</strong
                              >
                            </v-progress-linear>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-carousel-item>
            </v-carousel>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 彈跳視窗 -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="green-bg card-title font-weight-bold">{{
          selectedItem.file_name
        }}</v-card-title>
        <v-card-text>
          {{ selectedItem.content }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="selectedItem.link"
            :href="selectedItem.link"
            target="_blank"
            color="blue darken-1"
            text
          >
            附件
          </v-btn>
          <v-btn color="green darken-1" text @click="dialog = false">關閉</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      currentDate: new Date().toLocaleDateString(),
      currentQuarter: this.getQuarter(),
      currentWeek: this.getWeekNumber(new Date()),
      files: [
        {
          file_name: "更新計畫列表細項",
          content: "建立了計畫列表，可以由此查看計畫的基本資料。",
          category: "系統更新",
          update: "2024-05-29",
          link: "https://docs.google.com/document/d/1ABCDEFG/view",
        },
        {
          file_name: "增加圖表顯示功能",
          content: "改進了用戶界面，增加了新的圖表顯示功能。",
          category: "功能新增",
          update: "2024-05-28",
        },
        {
          file_name: "Q2W06進度已更新",
          content: "Q2W06進度已更新，部分預計進度已經超過實際進度。",
          category: "進度更新",
          update: "2024-05-28",
        },
      ],
      page: 1,
      itemsPerPage: 5,
      projects: [
        {
          planName: "Phase1",
          project: [
            { projectName: "22.8KV", progress: 100 },
            { projectName: "161KV", progress: 100 },
            { projectName: "案場", progress: 88.77 },
            { projectName: "升壓站", progress: 100 },
            { projectName: "電業申辦", progress: 85.64 },
          ],
        },
        {
          planName: "Phase2",
          project: [
            { projectName: "22.8KV", progress: 16.81 },
            { projectName: "161KV", progress: 33.17 },
            { projectName: "案場", progress: 3.57 },
            { projectName: "電業申辦", progress: 42.27 },
          ],
        },
      ],
      resources: [
        { name: "外部連結1", url: "https://example.com" },
        { name: "外部連結2", url: "https://example.com" },
      ],
      dialog: false,
      selectedItem: {},
    };
  },
  methods: {
    getProgressColor(progress) {
      if (progress >= 100) return "green";
      if (progress >= 95) return "blue";
      if (progress >= 50) return "orange";
      return "red";
    },
    getQuarter() {
      const month = new Date().getMonth() + 1;
      return Math.ceil(month / 3);
    },
    getWeekNumber(d) {
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    },
    viewFile(file) {
      this.selectedItem = file;
      this.dialog = true;
    },
    getCategoryColor(category) {
      switch (category) {
        case "系統更新":
          return "blue";
        case "功能新增":
          return "green";
        case "進度更新":
          return "orange";
        default:
          return "grey";
      }
    },
  },
  computed: {
    pages() {
      return Math.ceil(this.files.length / this.itemsPerPage);
    },
    paginatedFiles() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.files.slice(start, end);
    },
  },
};
</script>

<style scoped>
.v-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
}

.v-table th {
  padding: 8px;
  border: 1px solid #e8e8e8 !important;
}

.v-table td {
  padding: 8px;
}

.v-table th {
  padding: 8px !important;
  font-weight: bold !important;
  text-align: center !important;
  background-color: #00b894 !important;
  color: white !important;
}

.card-title {
  font-size: 16px;
}

.orange-bg {
  background-color: #ffa500;
  color: white;
}

.orange-title {
  color: #ffa500;
}

.blue-bg {
  background-color: #536dfe;
  color: white;
}

.blue-title {
  color: #536dfe;
}

.purple-bg {
  background-color: #a29bfe;
  color: white;
}

.green-bg {
  background-color: #00b894;
  color: white;
}

.green-bg-1 {
  background-color: #8bc34a;
  color: white;
}

.pink-bg {
  background-color: #ff7675;
  color: white;
}

.pink-title {
  color: #ff7675;
}

.pink-bg-1 {
  background-color: #ff80ab;
  color: white;
}

.brown-bg {
  background-color: #827717;
  color: white;
}

.info-card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 16px;
}

.v-card {
  margin-bottom: 20px;
}

.styled-table thead th {
  background-color: #ffa500;
  color: white;
}

.styled-table tbody tr:hover {
  background-color: #f5f5f5;
}

.styled-table {
  width: 100%;
}

.pagination-container {
  align-items: center;
  margin-top: 20px;
}

.select-actions {
  align-items: center;
}

.items-per-page-select {
  width: auto;
}

.pagination-actions {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination {
  margin-left: 20px;
  margin-right: 20px;
}

.sortable {
  cursor: pointer;
  justify-content: space-between;
  align-items: center;
}

.chip-cell {
  width: 100px; /* 或者你想要的其他寬度 */
  text-align: left;
}

.title-cell {
  text-align: left;
}

@media (max-width: 600px) {
  .styled-table {
    font-size: 14px;
  }

  .card-content {
    padding: 8px;
  }
}
</style>
