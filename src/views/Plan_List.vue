<template>
  <v-container>
    <!-- 瀏覽計畫標題 -->
    <div
      class="mb-3"
      style="padding-left: 20px; display: flex; align-items: center; justify-content: space-between"
    >
      <div>
        <v-icon color="blue" @click="goBack">mdi-chevron-down-box</v-icon>
        <span class="font-weight-bold ml-2">瀏覽計畫概要：</span>
        <span class="ml-1 note-span">※在下方選擇一項計畫後，才會顯示計畫內容</span>
      </div>
      <v-btn style="margin-right: 40px" color="indigo-darken-4" @click="navigateToPlanList()">
        前往總體計畫
      </v-btn>
    </div>

    <!-- 選擇計畫 -->
    <div class="mb-3" style="padding-left: 40px; display: flex; align-items: center">
      <v-icon color="orange">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">選擇計畫：</span>
      <v-select
        label="選擇欲瀏覽的計畫"
        variant="underlined"
        class="ml-3"
        :items="allplan"
        item-title="plan_name"
        item-value="plan_id"
        v-model="selectedPlan"
        style="flex-grow: 1"
      ></v-select>
    </div>

    <v-card v-if="selectedPlan !== null">
      <v-card-title class="font-weight-bold" style="color: #0769c1; padding: 0px, 50px">
        <v-icon class="mr-2">mdi-information</v-icon>
        計畫說明
      </v-card-title>
      <v-tabs v-model="tab" bg-color="primary" color="#ffc107">
        <v-tab value="outline" class="font-weight-bold">計畫概要</v-tab>
        <v-tab value="content" class="font-weight-bold">計畫內容</v-tab>
        <v-tab value="information" class="font-weight-bold">相關文件</v-tab>
      </v-tabs>
      <div v-if="selectedPlan !== 3 && selectedPlan !== 4">
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
                    <td class="text-left">Phase2</td>
                    <td class="text-left">2024/01/01</td>
                    <td class="text-left">2025/12/31</td>
                    <td class="text-left">2024/01/01</td>
                    <td class="text-left">-</td>
                    <td class="text-left">施工中</td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>

            <v-window-item value="content">
              <div class="flex-row-container">
                <v-tabs
                  v-model="tab_sub"
                  color="primary"
                  direction="vertical"
                  class="tabs-container"
                >
                  <v-tab value="V161K">161KV</v-tab>
                  <v-tab value="V228K">22.8KV</v-tab>
                  <v-tab value="project">案場</v-tab>
                </v-tabs>

                <v-window v-model="tab_sub" class="window-container">
                  <v-window-item value="project">
                    <v-tabs
                      v-model="project_sub"
                      align-tabs="center"
                      bg-color="teal-darken-3"
                      color="#ffc107"
                    >
                      <v-tab value="table">總表</v-tab>
                      <v-tab value="loop_report">迴路施工時程</v-tab>
                      <v-tab value="project_report">案場施工時程</v-tab>
                    </v-tabs>
                    <v-window v-model="project_sub">
                      <v-window-item value="table">
                        <v-data-table
                          v-model:expanded="expanded"
                          :headers="planHeaders"
                          :items="plans"
                          item-value="name"
                          show-expand
                          class="data-table-fullwidth"
                          @update:expanded="onExpand"
                        >
                          <template v-slot:expanded-row="{ columns, item }">
                            <tr style="background-color: #fbfffd">
                              <td :colspan="columns.length">
                                <div
                                  class="mb-3"
                                  style="
                                    padding-left: 20px;
                                    padding-top: 20px;
                                    display: flex;
                                    align-items: center;
                                  "
                                >
                                  <v-icon color="pink">mdi-chevron-down-box</v-icon>
                                  <span class="font-weight-bold ml-2"
                                    >瀏覽{{ item.name }}案場：</span
                                  >
                                </div>
                                <v-data-table
                                  :headers="loopHeaders"
                                  :items="item.loops"
                                ></v-data-table>
                                <div
                                  class="mb-3"
                                  style="
                                    padding-left: 20px;
                                    padding-top: 20px;
                                    display: flex;
                                    align-items: center;
                                  "
                                >
                                  <v-icon color="purple">mdi-chevron-down-box</v-icon>
                                  <span class="font-weight-bold ml-2">瀏覽施工時程：</span>
                                </div>
                                <div class="gantt-chart-container">
                                  <GanttChart :chartData="chartData"></GanttChart>
                                </div>
                                <v-btn
                                  variant="text"
                                  @click="collapseRow(item)"
                                  block
                                  class="collapse_row"
                                  ><v-icon>mdi-chevron-up</v-icon>收回</v-btn
                                >
                                <div class="mb-3"></div>
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-window-item>

                      <v-window-item value="loop_report">
                        <div
                          class="mb-3"
                          style="
                            padding-left: 20px;
                            padding-top: 20px;
                            display: flex;
                            align-items: center;
                          "
                        >
                          <v-icon color="purple">mdi-chevron-down-box</v-icon>
                          <span class="font-weight-bold ml-2">瀏覽施工時程：</span>
                        </div>
                        <div class="gantt-chart-container">
                          <GanttChart :chartData="updateLoopChartData()"></GanttChart>
                        </div>
                      </v-window-item>

                      <v-window-item value="project_report">
                        <div
                          class="mb-3"
                          style="
                            padding-left: 20px;
                            padding-top: 20px;
                            display: flex;
                            align-items: center;
                          "
                        >
                          <v-icon color="purple">mdi-chevron-down-box</v-icon>
                          <span class="font-weight-bold ml-2">瀏覽施工時程：</span>
                        </div>
                        <div class="gantt-chart-container">
                          <v-col class="py-2 d-flex justify-center">
                            <v-btn-toggle v-model="toggle_one" mandatory shaped>
                              <v-btn value="first_half">上半年 </v-btn>
                              <v-btn value="second_half">下半年 </v-btn>
                            </v-btn-toggle>
                          </v-col>
                          <GanttChart :chartData="updateProjectChartData()"></GanttChart>
                        </div>
                      </v-window-item>
                    </v-window>
                  </v-window-item>

                  <v-window-item value="V228K">
                    <v-tabs
                      v-model="v228K_sub"
                      align-tabs="center"
                      bg-color="teal-darken-3"
                      color="#ffc107"
                    >
                      <v-tab value="table">總表</v-tab>
                      <v-tab value="report">施工時程</v-tab>
                    </v-tabs>
                    <v-window v-model="v228K_sub">
                      <v-window-item value="table">
                        <v-data-table
                          :headers="v228KHeaders"
                          :items="v228K"
                          item-value="name"
                          class="data-table-fullwidth"
                        >
                        </v-data-table>
                      </v-window-item>

                      <v-window-item value="report">
                        <div
                          class="mb-3"
                          style="
                            padding-left: 20px;
                            padding-top: 20px;
                            display: flex;
                            align-items: center;
                          "
                        >
                          <v-icon color="purple">mdi-chevron-down-box</v-icon>
                          <span class="font-weight-bold ml-2">瀏覽施工時程：</span>
                        </div>
                        <div class="gantt-chart-container">
                          <v-col class="py-2 d-flex justify-center">
                            <v-btn-toggle v-model="toggle_228k" mandatory shaped>
                              <v-btn value="civil">土木工程</v-btn>
                              <v-btn value="cable">電纜工程</v-btn>
                            </v-btn-toggle>
                          </v-col>
                          <GanttChart :chartData="updateV228KChartData()"></GanttChart>
                        </div>
                      </v-window-item>
                    </v-window>
                  </v-window-item>

                  <v-window-item value="V161K">
                    <v-data-table
                      :headers="v161KHeaders"
                      :items="v161K"
                      item-value="name"
                      class="data-table-fullwidth"
                    >
                    </v-data-table>
                  </v-window-item>
                </v-window>
              </div>
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
                  <v-btn
                    @click="openUrl(item)"
                    color="orange-darken-1"
                    variant="tonal"
                    elevation="0"
                    >前往瀏覽</v-btn
                  >
                </template>
              </v-data-table>
            </v-window-item>
          </v-window>
        </v-card-text>
      </div>
      <div v-if="selectedPlan !== 1 && selectedPlan !== 4">
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
                    <td class="text-left">Phase1</td>
                    <td class="text-left">2021/01/01</td>
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
                :headers="planHeaders"
                :items="phase1_plans"
                item-value="name"
                show-expand
                class="data-table-fullwidth"
                @update:expanded="onExpand"
              >
                <template v-slot:expanded-row="{ columns, item }">
                  <tr style="background-color: #fbfffd">
                    <td :colspan="columns.length">
                      <div
                        class="mb-3"
                        style="
                          padding-left: 20px;
                          padding-top: 20px;
                          display: flex;
                          align-items: center;
                        "
                      >
                        <v-icon color="pink">mdi-chevron-down-box</v-icon>
                        <span class="font-weight-bold ml-2">瀏覽{{ item.name }}案場：</span>
                      </div>
                      <v-data-table :headers="loopHeaders" :items="item.loops"></v-data-table>
                      <v-btn variant="text" @click="collapseRow(item)" block class="collapse_row"
                        ><v-icon>mdi-chevron-up</v-icon>收回</v-btn
                      >
                      <div class="mb-3"></div>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-window-item>

            <v-window-item value="information">
              <v-data-table
                v-model:expanded="expanded"
                item-value="name"
                show-expand
                :headers="fileHeaders"
                :items="phase1_files"
              >
                <template v-slot:[`item.data-table-expand`]="{ item }">
                  <v-btn
                    @click="openUrl(item)"
                    color="orange-darken-1"
                    variant="tonal"
                    elevation="0"
                    >前往瀏覽</v-btn
                  >
                </template>
              </v-data-table>
            </v-window-item>
          </v-window>
        </v-card-text>
      </div>
      <div v-if="selectedPlan !== 1 && selectedPlan !== 3">
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
                    <td class="text-left">三小案</td>
                    <td class="text-left">-</td>
                    <td class="text-left">2024/6/30</td>
                    <td class="text-left">-</td>
                    <td class="text-left">-</td>
                    <td class="text-left">施工中</td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>

            <v-window-item value="content"> 暫無內容 </v-window-item>

            <v-window-item value="information"> 暫無內容 </v-window-item>
          </v-window>
        </v-card-text>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import GanttChart from "@/components/chart/GanttChart.vue";
import { fetchPlans } from "@/api/planService";
export default {
  components: {
    GanttChart,
  },
  data: () => ({
    tab: "outline",
    tab_sub: "project",
    project_sub: "table",
    v228K_sub: "table",
    v161K_sub: "table",
    toggle_228k: "civil",
    toggle_one: "first_half",
    allplan: [], //所有計畫
    project: [], //所有專案
    selectedPlan: null, //所選中計畫
    master_planid: null,
    chartData: {},
    loopchartData: {},
    expanded: [],

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
        name: "Phase2 預計進度推算之依據",
        type: "預計進度推算的方式",
        updateTime: "2024-05-13",
        url: "https://docs.google.com/spreadsheets/d/1kzFNChYkmCNg9GKPCu0BbyHSiYu4R8xf/edit?usp=sharing&ouid=100002892372171714788&rtpof=true&sd=true",
      },
      {
        name: "Phase2 施工順序及配置工區",
        type: "施工順序及配置工區的詳細說明",
        updateTime: "2024-05-13",
        url: "https://docs.google.com/spreadsheets/d/1K8HHjYZtGxCkFuGIbTV6mIGqA8uMvgy5/edit?usp=sharing&ouid=100002892372171714788&rtpof=true&sd=true",
      },
      {
        name: "Phase2 與成本相關資料",
        type: "施工進度比例計算的相關文件",
        updateTime: "2024-05-13",
        url: "https://docs.google.com/spreadsheets/d/1rvzxp4QPyPnj6Q4qe68DKm12xp3EYuSf/edit?usp=sharing&ouid=100002892372171714788&rtpof=true&sd=true",
      },
      {
        name: "Phase2 預計工期",
        type: "施工預期進的時程表",
        updateTime: "2024-05-13",
        url: "https://docs.google.com/spreadsheets/d/1XfE-SyXXPobvBhFzcsLJ_JXtQp3RqRP5/edit?usp=sharing&ouid=100002892372171714788&rtpof=true&sd=true",
      },
    ],
    planHeaders: [
      {
        title: "迴路名稱",
        align: "start",
        key: "name",
      },
      { title: "容量", key: "capacity" },
      { title: "比例(%)", key: "percentage" },
      { title: "並聯時間", key: "connectionTime" },
      { title: "預計施工時間", key: "expectedConstructionTime" },
      { title: "預計完工時間", key: "expectedCompletionTime" },
      { title: "", key: "data-table-expand" },
    ],
    loopHeaders: [
      {
        title: "案場名稱",
        align: "start",
        key: "name",
      },
      { title: "容量", key: "capacity" },
      { title: "比例(%)", key: "percentage" },
      { title: "預計施工時間", key: "expectedConstructionTime" },
      { title: "預計完工時間", key: "expectedCompletionTime" },
    ],
    v228KHeaders: [
      {
        title: "迴路名稱",
        align: "start",
        key: "name",
      },
      { title: "電纜預計施工時間", key: "cableexpectedConstructionTime" },
      { title: "電纜預計完工時間", key: "cableexpectedCompletionTime" },
      { title: "土木預計施工時間", key: "civilexpectedConstructionTime" },
      { title: "土木預計完工時間", key: "civilexpectedCompletionTime" },
    ],
    v228K: [
      {
        name: "SN1",
        civilexpectedConstructionTime: "2024-01-10",
        civilexpectedCompletionTime: "2024-05-31",
        cableexpectedConstructionTime: "2024-06-01",
        cableexpectedCompletionTime: "2024-06-30",
      },
      {
        name: "SN2",
        civilexpectedConstructionTime: "2024-01-11",
        civilexpectedCompletionTime: "2024-05-31",
        cableexpectedConstructionTime: "2024-06-01",
        cableexpectedCompletionTime: "2024-06-30",
      },
      {
        name: "SN3",
        civilexpectedConstructionTime: "2024-04-01",
        civilexpectedCompletionTime: "2024-08-31",
        cableexpectedConstructionTime: "2024-09-01",
        cableexpectedCompletionTime: "2024-09-30",
      },
      {
        name: "SN4",
        civilexpectedConstructionTime: "2024-04-01",
        civilexpectedCompletionTime: "2024-08-31",
        cableexpectedConstructionTime: "2024-09-01",
        cableexpectedCompletionTime: "2024-09-30",
      },
      {
        name: "SN5",
        civilexpectedConstructionTime: "2024-07-01",
        civilexpectedCompletionTime: "2024-11-30",
        cableexpectedConstructionTime: "2024-12-01",
        cableexpectedCompletionTime: "2024-12-31",
      },
      {
        name: "SN6",
        civilexpectedConstructionTime: "2024-07-01",
        civilexpectedCompletionTime: "2024-11-30",
        cableexpectedConstructionTime: "2024-12-01",
        cableexpectedCompletionTime: "2024-12-31",
      },
      {
        name: "SN7",
        civilexpectedConstructionTime: "2024-07-01",
        civilexpectedCompletionTime: "2024-11-30",
        cableexpectedConstructionTime: "2024-12-01",
        cableexpectedCompletionTime: "2024-12-31",
      },
      {
        name: "SN8",
        civilexpectedConstructionTime: "2024-10-01",
        civilexpectedCompletionTime: "2025-02-28",
        cableexpectedConstructionTime: "2025-03-01",
        cableexpectedCompletionTime: "2025-03-31",
      },
      {
        name: "SN9",
        civilexpectedConstructionTime: "2024-10-01",
        civilexpectedCompletionTime: "2025-02-28",
        cableexpectedConstructionTime: "2025-03-01",
        cableexpectedCompletionTime: "2025-03-31",
      },
    ],
    plans: [
      {
        name: "SN1",
        capacity: 11628,
        percentage: 9.91,
        connectionTime: "2024-06-30",
        expectedConstructionTime: "2024-04-01",
        expectedCompletionTime: "2024-10-30",
        loops: [
          {
            name: "升三-A03區",
            capacity: 738.72,
            percentage: 6.35,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升四-K02區",
            capacity: 674.88,
            percentage: 5.8,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升三-I02區",
            capacity: 647.52,
            percentage: 5.57,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升三-A02區-A棟",
            capacity: 437.76,
            percentage: 3.76,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升三-A02區-B棟",
            capacity: 437.76,
            percentage: 3.76,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升三-F01區",
            capacity: 1751.04,
            percentage: 15.06,
            expectedConstructionTime: "2024-04-01",
            expectedCompletionTime: "2024-10-30",
          },
          {
            name: "升四-K01區",
            capacity: 1532.16,
            percentage: 13.18,
            expectedConstructionTime: "2024-04-01",
            expectedCompletionTime: "2024-10-30",
          },
          {
            name: "升三-B01區",
            capacity: 1504.8,
            percentage: 12.94,
            expectedConstructionTime: "2024-04-01",
            expectedCompletionTime: "2024-10-30",
          },
          {
            name: "升三-I01區",
            capacity: 1413.6,
            percentage: 12.16,
            expectedConstructionTime: "2024-04-01",
            expectedCompletionTime: "2024-10-30",
          },
          {
            name: "升三-E01區",
            capacity: 1340.64,
            percentage: 11.53,
            expectedConstructionTime: "2024-04-01",
            expectedCompletionTime: "2024-10-30",
          },
          {
            name: "升三-F02區",
            capacity: 1149.12,
            percentage: 9.88,
            expectedConstructionTime: "2024-04-01",
            expectedCompletionTime: "2024-10-30",
          },
        ],
      },
      {
        name: "SN2",
        capacity: 15020.64,
        percentage: 12.8,
        connectionTime: "2024-06-30",
        expectedConstructionTime: "2024-02-15",
        expectedCompletionTime: "2024-11-30",
        loops: [
          {
            name: "升三-D01區",
            capacity: 802.56,
            percentage: 5.34,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升四-D03區",
            capacity: 811.68,
            percentage: 5.4,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升四-D04區",
            capacity: 738.72,
            percentage: 4.92,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升四-G01區",
            capacity: 492.48,
            percentage: 3.28,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升四-G02區",
            capacity: 802.56,
            percentage: 5.34,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升四-H03區",
            capacity: 538.08,
            percentage: 3.58,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升四-H06區",
            capacity: 629.28,
            percentage: 4.19,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升三-H01區",
            capacity: 793.44,
            percentage: 5.28,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2024-09-30",
          },
          {
            name: "升三-H02區",
            capacity: 2015.52,
            percentage: 13.42,
            expectedConstructionTime: "2024-02-15",
            expectedCompletionTime: "2024-11-30",
          },
          {
            name: "升四-H04區",
            capacity: 4660.32,
            percentage: 31.03,
            expectedConstructionTime: "2024-02-15",
            expectedCompletionTime: "2024-11-30",
          },
          {
            name: "升四-H05區",
            capacity: 2736.0,
            percentage: 18.21,
            expectedConstructionTime: "2024-02-15",
            expectedCompletionTime: "2024-11-30",
          },
        ],
      },
      {
        name: "SN3",
        capacity: 13440.96,
        percentage: 11.45,
        connectionTime: "2024-09-30",
        expectedConstructionTime: "2024-05-15",
        expectedCompletionTime: "2025-02-28",
        loops: [
          {
            name: "升三-C09區",
            capacity: 982.8,
            percentage: 7.31,
            expectedConstructionTime: "2024-08-01",
            expectedCompletionTime: "2024-12-31",
          },
          {
            name: "升三-B02區",
            capacity: 973.44,
            percentage: 7.24,
            expectedConstructionTime: "2024-08-01",
            expectedCompletionTime: "2024-12-31",
          },
          {
            name: "升三-C01區",
            capacity: 823.68,
            percentage: 6.13,
            expectedConstructionTime: "2024-08-01",
            expectedCompletionTime: "2024-12-31",
          },
          {
            name: "升三-C07區",
            capacity: 3154.32,
            percentage: 23.47,
            expectedConstructionTime: "2024-05-15",
            expectedCompletionTime: "2025-02-28",
          },
          {
            name: "升三-C03區",
            capacity: 2995.2,
            percentage: 22.28,
            expectedConstructionTime: "2024-05-15",
            expectedCompletionTime: "2025-02-28",
          },
          {
            name: "升三-C08區",
            capacity: 2508.48,
            percentage: 18.66,
            expectedConstructionTime: "2024-05-15",
            expectedCompletionTime: "2025-02-28",
          },
          {
            name: "升三-C02區",
            capacity: 2003.04,
            percentage: 14.9,
            expectedConstructionTime: "2024-05-15",
            expectedCompletionTime: "2025-02-28",
          },
        ],
      },
      {
        name: "SN4",
        capacity: 13789.44,
        percentage: 11.75,
        connectionTime: "2024-09-30",
        expectedConstructionTime: "2024-05-15",
        expectedCompletionTime: "2025-02-28",
        loops: [
          {
            name: "升四-E05區-A棟",
            capacity: 583.68,
            percentage: 4.23,
            expectedConstructionTime: "2024-08-01",
            expectedCompletionTime: "2024-12-31",
          },
          {
            name: "升四-E05區-B棟",
            capacity: 565.44,
            percentage: 4.1,
            expectedConstructionTime: "2024-08-01",
            expectedCompletionTime: "2024-12-31",
          },
          {
            name: "升四-E06區",
            capacity: 492.48,
            percentage: 3.57,
            expectedConstructionTime: "2024-08-01",
            expectedCompletionTime: "2024-12-31",
          },
          {
            name: "升四-J01區",
            capacity: 1915.2,
            percentage: 13.89,
            expectedConstructionTime: "2024-07-01",
            expectedCompletionTime: "2025-01-30",
          },
          {
            name: "升三-E02區",
            capacity: 1641.6,
            percentage: 11.9,
            expectedConstructionTime: "2024-07-01",
            expectedCompletionTime: "2025-01-30",
          },
          {
            name: "升三-E04區-A棟",
            capacity: 1605.12,
            percentage: 11.64,
            expectedConstructionTime: "2024-07-01",
            expectedCompletionTime: "2025-01-30",
          },
          {
            name: "升三-E04區-B棟",
            capacity: 1459.2,
            percentage: 10.58,
            expectedConstructionTime: "2024-07-01",
            expectedCompletionTime: "2025-01-30",
          },
          {
            name: "升三-E03區",
            capacity: 2927.52,
            percentage: 21.23,
            expectedConstructionTime: "2024-05-15",
            expectedCompletionTime: "2025-02-28",
          },
          {
            name: "升三-F03區",
            capacity: 2599.2,
            percentage: 18.85,
            expectedConstructionTime: "2024-05-15",
            expectedCompletionTime: "2025-02-28",
          },
        ],
      },
      {
        name: "SN5",
        capacity: 11750.46,
        percentage: 10.01,
        connectionTime: "2024-12-31",
        expectedConstructionTime: "2024-08-15",
        expectedCompletionTime: "2025-05-31",
        loops: [
          {
            name: "升四-D02區",
            capacity: 635.16,
            percentage: 5.41,
            expectedConstructionTime: "2024-11-01",
            expectedCompletionTime: "2025-03-31",
          },
          {
            name: "升四-A04區",
            capacity: 535.62,
            percentage: 4.56,
            expectedConstructionTime: "2024-11-01",
            expectedCompletionTime: "2025-03-31",
          },
          {
            name: "升四-H10區-B棟",
            capacity: 502.44,
            percentage: 4.28,
            expectedConstructionTime: "2024-11-01",
            expectedCompletionTime: "2025-03-31",
          },
          {
            name: "升四-H08區",
            capacity: 312.84,
            percentage: 2.66,
            expectedConstructionTime: "2024-11-01",
            expectedCompletionTime: "2025-03-31",
          },
          {
            name: "升三-A01區",
            capacity: 1516.8,
            percentage: 12.91,
            expectedConstructionTime: "2024-10-01",
            expectedCompletionTime: "2025-04-30",
          },
          {
            name: "升四-G06區",
            capacity: 1450.44,
            percentage: 12.34,
            expectedConstructionTime: "2024-10-01",
            expectedCompletionTime: "2025-04-30",
          },
          {
            name: "升四-H09區",
            capacity: 1251.36,
            percentage: 10.65,
            expectedConstructionTime: "2024-10-01",
            expectedCompletionTime: "2025-04-30",
          },
          {
            name: "升四-G05區",
            capacity: 1156.56,
            percentage: 9.84,
            expectedConstructionTime: "2024-10-01",
            expectedCompletionTime: "2025-04-30",
          },
          {
            name: "升四-G07區",
            capacity: 1156.56,
            percentage: 9.84,
            expectedConstructionTime: "2024-10-01",
            expectedCompletionTime: "2025-04-30",
          },
          {
            name: "升四-H10區-A棟",
            capacity: 3232.68,
            percentage: 27.51,
            expectedConstructionTime: "2024-08-15",
            expectedCompletionTime: "2025-05-31",
          },
        ],
      },
      {
        name: "SN6",
        capacity: 9489.48,
        percentage: 8.08,
        connectionTime: "2024-12-31",
        expectedConstructionTime: "2024-08-15",
        expectedCompletionTime: "2025-05-31",
        loops: [
          {
            name: "升四-G04區",
            capacity: 720.48,
            percentage: 7.59,
            expectedConstructionTime: "2024-11-01",
            expectedCompletionTime: "2025-03-31",
          },
          {
            name: "升四-H07區",
            capacity: 587.76,
            percentage: 6.19,
            expectedConstructionTime: "2024-11-01",
            expectedCompletionTime: "2025-03-31",
          },
          {
            name: "升四-G03區",
            capacity: 1668.48,
            percentage: 17.58,
            expectedConstructionTime: "2024-10-01",
            expectedCompletionTime: "2025-04-30",
          },
          {
            name: "升四-L02區",
            capacity: 1365.12,
            percentage: 14.39,
            expectedConstructionTime: "2024-10-01",
            expectedCompletionTime: "2025-04-30",
          },
          {
            name: "升四-L03區",
            capacity: 1213.44,
            percentage: 12.79,
            expectedConstructionTime: "2024-10-01",
            expectedCompletionTime: "2025-04-30",
          },
          {
            name: "升四-L01區",
            capacity: 3934.2,
            percentage: 41.46,
            expectedConstructionTime: "2024-08-15",
            expectedCompletionTime: "2025-05-31",
          },
        ],
      },
      {
        name: "SN7",
        capacity: 16680.48,
        percentage: 14.21,
        connectionTime: "2024-12-31",
        expectedConstructionTime: "2024-08-15",
        expectedCompletionTime: "2025-05-31",
        loops: [
          {
            name: "升四-C15區",
            capacity: 1951.68,
            percentage: 11.7,
            expectedConstructionTime: "2024-10-01",
            expectedCompletionTime: "2025-04-30",
          },
          {
            name: "升三-C05區-A棟",
            capacity: 3483.84,
            percentage: 20.89,
            expectedConstructionTime: "2024-08-15",
            expectedCompletionTime: "2025-05-31",
          },
          {
            name: "升三-C06區",
            capacity: 3374.4,
            percentage: 20.23,
            expectedConstructionTime: "2024-08-15",
            expectedCompletionTime: "2025-05-31",
          },
          {
            name: "升三-C04區-A棟",
            capacity: 3146.4,
            percentage: 18.86,
            expectedConstructionTime: "2024-08-15",
            expectedCompletionTime: "2025-05-31",
          },
          {
            name: "升三-C04區-B棟",
            capacity: 2517.12,
            percentage: 15.09,
            expectedConstructionTime: "2024-08-15",
            expectedCompletionTime: "2025-05-31",
          },
          {
            name: "升三-C05區-B棟",
            capacity: 2207.04,
            percentage: 13.23,
            expectedConstructionTime: "2024-08-15",
            expectedCompletionTime: "2025-05-31",
          },
        ],
      },
      {
        name: "SN8",
        capacity: 14227.2,
        percentage: 12.12,
        connectionTime: "2025-03-31",
        expectedConstructionTime: "2024-11-15",
        expectedCompletionTime: "2025-08-31",
        loops: [
          {
            name: "升四-C13區",
            capacity: 930.24,
            percentage: 6.54,
            expectedConstructionTime: "2025-02-01",
            expectedCompletionTime: "2025-06-30",
          },
          {
            name: "升四-F04區",
            capacity: 1860.48,
            percentage: 13.08,
            expectedConstructionTime: "2025-01-01",
            expectedCompletionTime: "2025-07-31",
          },
          {
            name: "升四-F05區",
            capacity: 1203.84,
            percentage: 8.46,
            expectedConstructionTime: "2025-01-01",
            expectedCompletionTime: "2025-07-31",
          },
          {
            name: "升四-C11區",
            capacity: 3146.4,
            percentage: 22.12,
            expectedConstructionTime: "2024-11-15",
            expectedCompletionTime: "2025-08-31",
          },
          {
            name: "升四-C10區",
            capacity: 2480.64,
            percentage: 17.44,
            expectedConstructionTime: "2024-11-15",
            expectedCompletionTime: "2025-08-31",
          },
          {
            name: "升四-C14區",
            capacity: 2453.28,
            percentage: 17.24,
            expectedConstructionTime: "2024-11-15",
            expectedCompletionTime: "2025-08-31",
          },
          {
            name: "升四-C12區",
            capacity: 2152.32,
            percentage: 15.13,
            expectedConstructionTime: "2024-11-15",
            expectedCompletionTime: "2025-08-31",
          },
        ],
      },
      {
        name: "SN9",
        capacity: 11366.52,
        percentage: 9.68,
        connectionTime: "2025-03-31",
        expectedConstructionTime: "2024-11-15",
        expectedCompletionTime: "2025-08-31",
        loops: [
          {
            name: "升四-F06區",
            capacity: 720.48,
            percentage: 6.34,
            expectedConstructionTime: "2025-02-01",
            expectedCompletionTime: "2025-06-30",
          },
          {
            name: "升四-F07區-C棟",
            capacity: 3820.44,
            percentage: 33.61,
            expectedConstructionTime: "2024-11-15",
            expectedCompletionTime: "2025-08-31",
          },
          {
            name: "升四-F07區-A棟",
            capacity: 3754.08,
            percentage: 33.03,
            expectedConstructionTime: "2024-11-15",
            expectedCompletionTime: "2025-08-31",
          },
          {
            name: "升四-F07區-B棟",
            capacity: 3071.52,
            percentage: 27.02,
            expectedConstructionTime: "2024-11-15",
            expectedCompletionTime: "2025-08-31",
          },
        ],
      },
    ],
    v161KHeaders: [
      {
        title: "項目名稱",
        align: "start",
        key: "name",
      },
      { title: "預計施工時間", key: "expectedConstructionTime" },
      { title: "預計完工時間", key: "expectedCompletionTime" },
    ],
    v161K: [
      {
        name: "管理中心及勤務中心",
        expectedConstructionTime: "2024-07-01",
        expectedCompletionTime: "2025-12-31",
      },
    ],
    phase1_plans: [
      {
        name: "S02",
        capacity: 12852,
        percentage: 10.63,
        connectionTime: "2023-10-31",
        expectedConstructionTime: "2022-04-01",
        expectedCompletionTime: "2023-12-31",
        loops: [
          {
            name: "2-10",
            capacity: 1719.0,
            percentage: 0.2135,
            expectedConstructionTime: "2022-04-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "2-101",
            capacity: 4347.0,
            percentage: 0.1108,
            expectedConstructionTime: "2022-04-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "2-11",
            capacity: 1575.0,
            percentage: 0.0674,
            expectedConstructionTime: "2022-04-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "2-12",
            capacity: 720.0,
            percentage: 0.1511,
            expectedConstructionTime: "2022-04-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "2-30",
            capacity: 594.0,
            percentage: 0.153,
            expectedConstructionTime: "2022-04-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "2-8",
            capacity: 2358.0,
            percentage: 0.1134,
            expectedConstructionTime: "2022-04-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "2-9",
            capacity: 1539.0,
            percentage: 0.1908,
            expectedConstructionTime: "2022-04-01",
            expectedCompletionTime: "2023-12-31",
          },
        ],
      },
      {
        name: "S03",
        capacity: 15330.72,
        percentage: 12.68,
        connectionTime: "2023-09-30",
        expectedConstructionTime: "2022-09-01",
        expectedCompletionTime: "2023-12-31",
        loops: [
          {
            name: "3-103",
            capacity: 2152.32,
            percentage: 0.140393,
            expectedConstructionTime: "2022-09-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "3-104",
            capacity: 802.56,
            percentage: 0.0523498,
            expectedConstructionTime: "2022-09-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "3-105",
            capacity: 747.84,
            percentage: 0.0487805,
            expectedConstructionTime: "2022-09-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "3-106",
            capacity: 528.96,
            percentage: 0.0345033,
            expectedConstructionTime: "2022-09-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "3-107",
            capacity: 684.0,
            percentage: 0.0446163,
            expectedConstructionTime: "2022-09-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "3-108",
            capacity: 1112.64,
            percentage: 0.0725758,
            expectedConstructionTime: "2022-09-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "3-15",
            capacity: 3119.04,
            percentage: 0.20345,
            expectedConstructionTime: "2022-09-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "3-16",
            capacity: 2480.64,
            percentage: 0.161808,
            expectedConstructionTime: "2022-09-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "3-17",
            capacity: 2799.84,
            percentage: 0.182629,
            expectedConstructionTime: "2022-09-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "3-18",
            capacity: 902.88,
            percentage: 0.0588935,
            expectedConstructionTime: "2022-09-01",
            expectedCompletionTime: "2023-12-31",
          },
        ],
      },
      {
        name: "S04",
        capacity: 16348.8,
        percentage: 13.52,
        connectionTime: "2023-02-31",
        expectedConstructionTime: "2022-03-01",
        expectedCompletionTime: "2023-12-31",
        loops: [
          {
            name: "4-13",
            capacity: 4171.8,
            percentage: 0.255175,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "4-14",
            capacity: 2313.0,
            percentage: 0.141478,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "4-19",
            capacity: 2394.0,
            percentage: 0.146433,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "4-20",
            capacity: 1755.0,
            percentage: 0.107347,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "4-21",
            capacity: 1539.0,
            percentage: 0.0941354,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "4-6",
            capacity: 2070.0,
            percentage: 0.126615,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "4-7",
            capacity: 2106.0,
            percentage: 0.128817,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
        ],
      },
      {
        name: "S05",
        capacity: 17036.16,
        percentage: 14.09,
        connectionTime: "2023-11-30",
        expectedConstructionTime: "2022-03-01",
        expectedCompletionTime: "2023-12-31",
        loops: [
          {
            name: "5-201",
            capacity: 3210.24,
            percentage: 0.151619,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "5-202",
            capacity: 1997.28,
            percentage: 0.100211,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "5-203",
            capacity: 1541.28,
            percentage: 0.0787376,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "5-204",
            capacity: 1240.32,
            percentage: 0.241256,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "5-207",
            capacity: 1495.68,
            percentage: 0.0666992,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "5-22",
            capacity: 2927.52,
            percentage: 0.130145,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "5-23",
            capacity: 1778.4,
            percentage: 0.0860582,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "5-24",
            capacity: 2845.44,
            percentage: 0.145274,
            expectedConstructionTime: "2022-03-01",
            expectedCompletionTime: "2023-12-31",
          },
        ],
      },
      {
        name: "S06",
        capacity: 14208.96,
        percentage: 11.75,
        connectionTime: "2023-12-31",
        expectedConstructionTime: "2023-03-01",
        expectedCompletionTime: "2023-12-31",
        loops: [
          {
            name: "6-208",
            capacity: 2061.12,
            percentage: 0.1451,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "6-209",
            capacity: 1422.72,
            percentage: 0.1001,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "6-210",
            capacity: 3119.04,
            percentage: 0.2195,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "6-211",
            capacity: 1039.68,
            percentage: 0.0732,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "6-212",
            capacity: 3237.6,
            percentage: 0.2279,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "6-213",
            capacity: 3328.8,
            percentage: 0.2343,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
        ],
      },
      {
        name: "S07",
        capacity: 14292,
        percentage: 11.82,
        connectionTime: "2023-04-30",
        expectedConstructionTime: "2022-03-01",
        expectedCompletionTime: "2023-12-31",
        loops: [
          {
            name: "7-214",
            capacity: 1584.0,
            percentage: 0.110831,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "7-25",
            capacity: 2727.0,
            percentage: 0.190806,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "7-26",
            capacity: 3051.0,
            percentage: 0.213476,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "7-27",
            capacity: 963.0,
            percentage: 0.0673804,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "7-28",
            capacity: 2160.0,
            percentage: 0.151134,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "7-29",
            capacity: 2187.0,
            percentage: 0.153023,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "7-5",
            capacity: 1620.0,
            percentage: 0.11335,
            expectedConstructionTime: "2023-03-01",
            expectedCompletionTime: "2023-12-31",
          },
        ],
      },
      {
        name: "S09",
        capacity: 14077.44,
        percentage: 11.64,
        connectionTime: "2024-01-31",
        expectedConstructionTime: "2023-01-01",
        expectedCompletionTime: "2023-12-31",
        loops: [
          {
            name: "9-402A",
            capacity: 3004.56,
            percentage: 0.331612,
            expectedConstructionTime: "2023-10-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "9-402B",
            capacity: 2246.4,
            percentage: 0.247934,
            expectedConstructionTime: "2023-10-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "9-403",
            capacity: 1937.52,
            percentage: 0.213843,
            expectedConstructionTime: "2023-10-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "9-410",
            capacity: 664.56,
            percentage: 0.0733471,
            expectedConstructionTime: "2023-10-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "9-411",
            capacity: 814.32,
            percentage: 0.089876,
            expectedConstructionTime: "2023-10-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "9-412",
            capacity: 393.12,
            percentage: 0.0433884,
            expectedConstructionTime: "2023-10-01",
            expectedCompletionTime: "2023-12-31",
          },
        ],
      },
      {
        name: "S10",
        capacity: 9060.48,
        percentage: 7.49,
        connectionTime: "2024-02-28",
        expectedConstructionTime: "2023-10-1",
        expectedCompletionTime: "2023-12-31",
        loops: [
          {
            name: "10-301",
            capacity: 1095.12,
            percentage: 0.0778,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "10-406",
            capacity: 3042.0,
            percentage: 0.2161,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "10-407",
            capacity: 3472.56,
            percentage: 0.2467,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "10-408",
            capacity: 3023.28,
            percentage: 0.2148,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2023-12-31",
          },
          {
            name: "10-409",
            capacity: 3444.48,
            percentage: 0.2447,
            expectedConstructionTime: "2024-05-01",
            expectedCompletionTime: "2023-12-31",
          },
        ],
      },
    ],
    phase1_files: [
      {
        name: "Phase1 與成本相關資料",
        type: "施工進度比例計算的相關文件",
        updateTime: "2024-05-13",
        url: "https://docs.google.com/spreadsheets/d/1rvzxp4QPyPnj6Q4qe68DKm12xp3EYuSf/edit?usp=sharing&ouid=100002892372171714788&rtpof=true&sd=true",
      },
      {
        name: "向陽-多元案場總彙(農業養殖工程)",
        type: "建管竣工期限",
        updateTime: "2024-05-13",
        url: "https://docs.google.com/spreadsheets/d/1qFUPP2uATG19y4E4lZE1V3IFYO0domH2/edit?usp=sharing&ouid=100002892372171714788&rtpof=true&sd=true",
      },
    ],
  }),
  async created() {
    if (
      this.$route.query.planId &&
      this.$route.query.master_planid &&
      !isNaN(parseInt(this.$route.query.master_planid)) &&
      !isNaN(parseInt(this.$route.query.planId))
    ) {
      this.selectedPlan = parseInt(this.$route.query.planId);
      this.master_planid = parseInt(this.$route.query.master_planid);
    } else {
      this.selectedPlan = null;
    }
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const plansResponse = await fetchPlans();
        console.log("api response:", plansResponse.data);
        this.allplan = plansResponse.data;
      } catch (error) {}
    },
    navigateToPlanList() {
      this.$router.push({
        name: "Master_Plan_List",
        query: { master_planid: this.master_planid },
      });
    },
    onExpand(expanded) {
      if (expanded.length > 1) {
        this.expanded = [expanded[1]];
      } else {
        this.expanded = expanded;
      }

      if (this.expanded.length > 0) {
        const expandedItem = this.plans.find((plan) => plan.name === this.expanded[0]);
        this.updateChartData(expandedItem);
      } else {
        this.chartData = {};
      }
    },
    updateLoopChartData() {
      const sortedPlans = this.plans
        .slice()
        .sort(
          (a, b) => new Date(a.expectedConstructionTime) - new Date(b.expectedConstructionTime)
        );

      if (sortedPlans) {
        const loopchartData = {
          labels: sortedPlans.map((plan) => plan.name),
          datasets: [
            {
              label: "施工時程",
              barPercentage: 0.5,
              barThickness: 6,
              maxBarThickness: 8,
              minBarLength: 2,
              data: sortedPlans.map((plan) => [
                plan.expectedConstructionTime,
                plan.expectedCompletionTime,
              ]),
            },
          ],
        };
        return loopchartData;
      } else {
        return {};
      }
    },
    updateProjectChartData() {
      const allLoops = this.plans.flatMap((plan) => plan.loops);

      const filteredLoops = allLoops.filter((loop) => {
        const constructionDate = new Date(loop.expectedConstructionTime);
        if (this.toggle_one === "first_half") {
          return constructionDate <= new Date("2024-06-30");
        } else if (this.toggle_one === "second_half") {
          return constructionDate > new Date("2024-06-30");
        }
        return true;
      });

      const sortedLoops = filteredLoops.sort(
        (a, b) => new Date(a.expectedConstructionTime) - new Date(b.expectedConstructionTime)
      );

      if (sortedLoops.length) {
        return {
          labels: sortedLoops.map((loop) => loop.name),
          datasets: [
            {
              label: "施工時程",
              barPercentage: 0.5,
              barThickness: 6,
              maxBarThickness: 8,
              minBarLength: 2,
              data: sortedLoops.map((loop) => [
                loop.expectedConstructionTime,
                loop.expectedCompletionTime,
              ]),
            },
          ],
        };
      } else {
        return {
          labels: [],
          datasets: [],
        };
      }
    },
    updateChartData(item) {
      if (item && item.loops) {
        const sortedLoops = item.loops
          .slice()
          .sort(
            (a, b) => new Date(a.expectedConstructionTime) - new Date(b.expectedConstructionTime)
          );
        this.chartData = {
          labels: sortedLoops.map((loop) => loop.name),
          datasets: [
            {
              label: "施工時程",
              barPercentage: 0.5,
              barThickness: 6,
              maxBarThickness: 8,
              minBarLength: 2,
              data: sortedLoops.map((loop) => [
                loop.expectedConstructionTime,
                loop.expectedCompletionTime,
              ]),
            },
          ],
        };
      } else {
        this.chartData = {};
      }
    },
    updateV228KChartData() {
      const dataKeyPrefix = this.toggle_228k === "civil" ? "civil" : "cable";
      const filteredData = this.v228K.map((item) => ({
        name: item.name,
        expectedConstructionTime: item[`${dataKeyPrefix}expectedConstructionTime`],
        expectedCompletionTime: item[`${dataKeyPrefix}expectedCompletionTime`],
      }));

      const sortedData = filteredData.sort(
        (a, b) => new Date(a.expectedConstructionTime) - new Date(b.expectedConstructionTime)
      );

      return {
        labels: sortedData.map((item) => item.name),
        datasets: [
          {
            label: "施工時程",
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            data: sortedData.map((item) => [
              item.expectedConstructionTime,
              item.expectedCompletionTime,
            ]),
          },
        ],
      };
    },
    collapseRow(item) {
      this.expanded = this.expanded.filter((expandedItem) => expandedItem !== item.name);
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
