<template>
  <v-container>
    <!-- 瀏覽計畫標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue">mdi-chevron-down-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽計畫概要：</span>
      <span class="ml-1 note-span">※在下方選擇一項總體計畫後，才會顯示計畫內容</span>
    </div>

    <!-- 選擇計畫 -->
    <div class="mb-3" style="padding-left: 40px; display: flex; align-items: center">
      <v-icon color="orange">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">選擇總體計畫：</span>
      <v-select
        label="選擇欲瀏覽的計畫"
        variant="underlined"
        class="ml-3"
        :items="plans"
        item-title="plan_name"
        item-value="plan_id"
        v-model="selectedPlan"
        style="flex-grow: 1"
      ></v-select>
    </div>

    <v-card v-if="selectedPlan == 1">
      <v-card-title class="font-weight-bold" style="color: #0769c1; padding: 0px, 50px">
        <v-icon class="mr-2">mdi-information</v-icon>
        總體計畫說明
      </v-card-title>
      <v-tabs v-model="tab" bg-color="primary" color="#ffc107">
        <v-tab value="outline" class="font-weight-bold">計畫概要</v-tab>
        <v-tab value="content" class="font-weight-bold">計畫內容</v-tab>
        <v-tab value="information" class="font-weight-bold">相關文件</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="outline">
            <v-table>
              <thead>
                <tr>
                  <th class="text-left">計畫名稱</th>
                  <th class="text-left">預計開始日期</th>
                  <th class="text-left">預計結束日期</th>
                  <th class="text-left">實際開始日期</th>
                  <th class="text-left">實際結束日期</th>
                  <th class="text-left">計畫狀態</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-left">Re-financing</td>
                  <td class="text-left">-</td>
                  <td class="text-left">2025/12/31</td>
                  <td class="text-left">-</td>
                  <td class="text-left">-</td>
                  <td class="text-left">施工中</td>
                </tr>
              </tbody>
            </v-table>
          </v-window-item>

          <v-window-item value="content">
            <v-data-table
              v-model:expanded="expanded"
              item-value="name"
              show-expand
              :headers="planHeaders"
              :items="plan"
            >
              <template v-slot:[`item.data-table-expand`]="{ item }">
                <v-btn
                  @click="navigateToPlanList(item.id, selectedPlan)"
                  color="orange-darken-1"
                  variant="tonal"
                  elevation="0"
                  >了解詳情</v-btn
                >
              </template>
            </v-data-table>
          </v-window-item>

          <v-window-item value="information">
            <v-data-table
              v-model:expanded="expanded"
              item-value="name"
              show-expand
              :headers="fileHeaders"
              :items="files"
            >
              <template v-slot:[`item.data-table-expand`]="{ item }">
                <v-btn @click="openUrl(item)" color="orange-darken-1" variant="tonal" elevation="0"
                  >前往瀏覽</v-btn
                >
              </template>
            </v-data-table>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    tab: "outline",
    tab_sub: "table",
    selectedPlan: null,
    expanded: [],
    plans: [{ plan_id: 1, plan_name: "Re-financing" }],
    planHeaders: [
      { title: "計畫名稱", align: "start", key: "name" },
      { title: "預計施工時間", key: "expectedConstructionTime" },
      { title: "預計完工時間", key: "expectedCompletionTime" },
      { title: "", key: "data-table-expand" },
    ],
    plan: [
      {
        id: 3,
        name: "Phase1",
        expectedConstructionTime: "2021-01-01",
        expectedCompletionTime: "2025-12-31",
        url: "Plan_List",
      },
      {
        id: 1,
        name: "Phase2",
        expectedConstructionTime: "2024-01-01",
        expectedCompletionTime: "2025-12-31",
        url: "Plan_List",
      },
      {
        id: 4,
        name: "三小案",
        expectedConstructionTime: "2024-01-01",
        expectedCompletionTime: "2024-06-30",
        url: "Plan_List",
      },
    ],
    fileHeaders: [
      { title: "", key: "data-table-expand" },
      {
        title: "檔案名稱",
        align: "start",
        key: "name",
      },
      { title: "檔案描述", key: "type", sortable: false },
      { title: "更新時間", key: "updateTime" },
    ],
    files: [
      {
        name: "與成本相關資料",
        type: "施工進度比例計算的相關文件",
        updateTime: "2024-05-13",
        url: "https://docs.google.com/spreadsheets/d/1rvzxp4QPyPnj6Q4qe68DKm12xp3EYuSf/edit?usp=sharing&ouid=100002892372171714788&rtpof=true&sd=true",
      },
    ],
  }),
  async created() {
    if (this.$route.query.master_planid && !isNaN(parseInt(this.$route.query.master_planid))) {
      this.selectedPlan = parseInt(this.$route.query.master_planid);
    } else {
      this.selectedPlan = null;
    }
  },
  methods: {
    navigateToPlanList(id, selectedPlan) {
      this.$router.push({
        name: "Plan_List",
        query: { planId: id, master_planid: selectedPlan },
      });
    },
    openUrl(item) {
      if (item && item.url) {
        window.open(item.url, "_blank");
      }
    },
  },
};
</script>

<style scoped>
@import "@/assets/style/browseprogress.css";

.v-card {
  margin: 20px auto;
  max-width: 95%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.gantt-chart-container {
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.flex-row-container {
  display: flex;
  width: 100%;
}

.tabs-container {
  flex: 1;
}

.window-container {
  flex: 10;
}

.data-table-fullwidth {
  width: 100%; /* Ensure table fills the container */
}

.collapse_row {
  background-color: #f0f0f0;
  margin-bottom: 10px;
  margin-top: 10px;
}
</style>
