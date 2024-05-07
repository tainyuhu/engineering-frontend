<template>
  <v-container>
    <!-- 瀏覽計畫標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue">mdi-chevron-down-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽計畫概要：</span>
      <span class="ml-1 note-span">※在下方選擇一項計畫後，才會顯示計畫內容</span>
    </div>

    <!-- 選擇計畫 -->
    <div class="mb-3" style="padding-left: 40px; display: flex; align-items: center">
      <v-icon color="orange">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">選擇計畫：</span>
      <v-select
        label="選擇欲瀏覽的計畫"
        variant="underlined"
        class="ml-3"
        :items="plans"
        item-text="plan_name"
        item-value="plan_id"
        v-model="selectedPlan"
        style="flex-grow: 1"
      ></v-select>
    </div>

    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title> 計畫概要 </v-expansion-panel-title>
        <v-expansion-panel-text>
          <!-- 顯示計畫資訊表格 -->
          <v-table>
            <template v-slot:default>
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
                  <th class="text-left">Phase2</th>
                  <th class="text-left">2024/01/01</th>
                  <th class="text-left">2025/12/31</th>
                  <th class="text-left">2024/01/01</th>
                  <th class="text-left">-</th>
                  <th class="text-left">施工中</th>
                </tr>
              </tbody>
            </template>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card>
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="one">發電量</v-tab>
        <v-tab value="two">施工時程</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="one">
            <v-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">迴路名稱</th>
                    <th class="text-left">容量 (kW)</th>
                    <th class="text-left">比例 (%)</th>
                    <th class="text-left">併聯時間</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-left">SN1</td>
                    <td class="text-left">11628</td>
                    <td class="text-left">9.91</td>
                    <td class="text-left">2024/06/30</td>
                  </tr>
                </tbody>
              </template>
            </v-table>
          </v-window-item>

          <v-window-item value="two"> Two </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    tab: null,
  }),
};
</script>

<style scoped>
.v-container {
  padding-left: 0px;
  max-width: 100%;
}

.v-icon {
  font-size: 35px;
}

.note-span {
  color: #6c757d;
  font-size: 11px;
}

.v-expansion-panels {
  margin: 20px auto;
  max-width: 95%;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-card {
  margin: 20px auto;
  max-width: 95%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-table thead th {
  color: #495057;
  font-weight: bold;
  padding: 10px 0;
}

.v-table tbody th {
  color: #212529;
}
</style>
