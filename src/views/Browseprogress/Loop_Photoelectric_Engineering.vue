<template>
  <v-container>
    <!-- 標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽迴路工程進度：</span>
    </div>
    <!-- 迴路選擇 -->
    <div class="mb-3" style="padding-left: 40px; display: flex; align-items: center">
      <v-icon color="orange">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">選擇迴路：</span>
      <span class="ml-1 note-span">※在下方選擇一個迴路後，才會顯示迴路的進度內容</span>
    </div>

    <div class="loops-selection">
      <v-btn
        v-for="loop in loops"
        :key="loop.loop_id"
        :class="['loop-button', { 'loop-button--active': loop.loop_id === selectedLoopId }]"
        @click="selectLoop(loop.loop_id)"
      >
        {{ loop.loop_name }}
      </v-btn>
    </div>

    <!-- 功能列 -->
    <div class="function-row">
      <!-- 第一個區塊 -->
      <div v-if="selectedLoopId" class="status-and-page-size-selector">
        <span>狀態：</span>
        <v-btn
          :class="displayMode === 'table' ? 'report-btn' : 'table-btn'"
          @click="toggleDisplayMode"
          >{{ displayModeText }}</v-btn
        >
      </div>

      <!-- 第二個區塊 -->
      <div v-if="showDetails" class="py-2 d-flex justify-center">
        <v-btn-toggle mandatory v-model="timeMode" class="time-toggle" variant="outlined">
          <v-btn class="time-btn" value="quarter">季</v-btn>
          <v-btn class="time-btn" value="week">週</v-btn>
        </v-btn-toggle>
      </div>

      <!-- 第三個區塊 -->
      <div v-if="selectedLoopId">
        <v-btn
          :class="projectType === 'engineering' ? 'bank-btn' : 'engineering-btn'"
          @click="toggleProjectType"
          >{{ projectTypeText }}</v-btn
        >
        <v-btn class="overview-btn" rounded="0" @click="showDetails = false">即時</v-btn>
        <v-btn class="details-btn" rounded="0" @click="showDetails = true">詳情</v-btn>
      </div>
    </div>

    <!-- 周數據展示 -->
    <div
      class="div-container"
      v-if="selectedLoopId && timeMode === 'week' && showDetails && displayMode === 'table'"
    >
      <v-table>
        <thead>
          <tr>
            <th>案場 / 週間</th>
            <th
              v-for="(dateRange, index) in allDateRanges"
              :key="index"
              :class="{ 'special-bg': index === 0, 'normal-bg': index !== 0 }"
              colspan="2"
            >
              {{ dateRange }}
              <v-icon v-if="index === 0" color="yellow">mdi-new-box</v-icon>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in weekTableData" :key="item.pv_name">
            <td class="font-weight-bold">{{ item.pv_name }}</td>
            <template v-for="dateRange in item.date_ranges">
              <td
                :style="
                  dateRange.records[0].expected > dateRange.records[0].actual
                    ? { 'font-weight': 'bold', color: 'red' }
                    : {}
                "
              >
                {{ formatPercentage(dateRange.records[0].actual) }}
              </td>
              <td class="expected">{{ formatPercentage(dateRange.records[0].expected) }}</td>
            </template>
          </tr>
        </tbody>
      </v-table>
      <!-- 分頁組件 -->
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        @input="fetchData"
      ></v-pagination>
    </div>

    <!-- 季數據展示 -->
    <div
      class="div-container"
      v-if="selectedLoopId && timeMode === 'quarter' && showDetails && displayMode === 'table'"
    >
      <v-table>
        <thead>
          <tr>
            <th rowspan="2">案場 / 週間</th>
            <th
              v-for="(summary, index) in quarterSummary"
              :key="index"
              :class="{ 'special-bg': index === 0, 'normal-bg': index !== 0 }"
              colspan="2"
            >
              【{{ summary.year }} Q{{ summary.quarter }}】 第{{ summary.week }}周
            </th>
          </tr>
          <tr>
            <th
              v-for="(dateRange, index) in allDateRanges"
              :key="index"
              :class="{ 'special-bg': index === 0, 'normal-bg': index !== 0 }"
              colspan="2"
            >
              {{ dateRange }}
              <v-icon v-if="index === 0" color="yellow">mdi-new-box</v-icon>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in quarterTableData" :key="item.pv_name">
            <td class="font-weight-bold">{{ item.pv_name }}</td>
            <template v-for="dateRange in item.date_ranges">
              <td
                :style="
                  dateRange.records[0].expected > dateRange.records[0].actual
                    ? { 'font-weight': 'bold', color: 'red' }
                    : {}
                "
              >
                {{ formatPercentage(dateRange.records[0].actual) }}
              </td>
              <td class="expected">{{ formatPercentage(dateRange.records[0].expected) }}</td>
            </template>
          </tr>
        </tbody>
      </v-table>
      <!-- 分頁組件 -->
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        @input="fetchData"
      ></v-pagination>
    </div>
    <!-- 即時表格展示 -->
    <div class="div-container" v-if="selectedLoopId && !showDetails && displayMode === 'table'">
      <v-table>
        <thead>
          <tr>
            <th rowspan="2">案場 / 週間</th>
            <th
              v-for="(summary, index) in quarterSummary"
              :key="index"
              :class="{ 'special-bg': index === 0, 'normal-bg': index !== 0 }"
              colspan="2"
            >
              【{{ summary.year }} Q{{ summary.quarter }}】 第{{ summary.week }}周
            </th>
          </tr>
          <tr>
            <th
              v-for="(dateRange, index) in allDateRanges"
              :key="index"
              :class="{ 'special-bg': index === 0, 'normal-bg': index !== 0 }"
              colspan="2"
            >
              {{ dateRange }}
              <v-icon v-if="index === 0" color="yellow">mdi-new-box</v-icon>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in TableData" :key="item.pv_name">
            <td class="font-weight-bold">{{ item.pv_name }}</td>
            <template v-for="dateRange in item.date_ranges">
              <td
                :style="
                  dateRange.records[0].expected > dateRange.records[0].actual
                    ? { 'font-weight': 'bold', color: 'red' }
                    : {}
                "
              >
                {{ formatPercentage(dateRange.records[0].actual) }}
              </td>
              <td class="expected">{{ formatPercentage(dateRange.records[0].expected) }}</td>
            </template>
          </tr>
        </tbody>
      </v-table>
      <!-- 分頁組件 -->
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        @input="fetchData"
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
import Chart from "@/components/chart/Chart.vue";
import { fetchLoopsByProject } from "@/api/planService";
import {
  fetchLoopWeekTableData,
  fetchLoopQuarterTableData,
  fetchLoopTableData,
} from "@/api/pvProjectService";

export default {
  components: {
    Chart,
  },
  data() {
    return {
      loops: [],
      cases: [],
      selectedProject: [],
      selectedPlan: null, //所選中計畫
      selectedLoopId: null, //所選中之迴路
      timeMode: "week",
      displayMode: "table",
      projectType: "engineering",
      showDetails: false,
      weekTableData: [], //周數據
      quarterTableData: [], //季數據
      TableData: [], //總數據
      itemsPerPage: 3, //一次只要顯示兩筆
      currentPage: 1, //當前頁面
      totalPages: 0, // 總頁數
    };
  },
  watch: {
    selectedLoopId: "fetchData",
    showDetails: "fetchData",
    currentPage: "fetchData",
    projectType: "fetchData",
    timeMode: "fetchData",
    displayMode: "fetchData",
  },
  async created() {
    this.selectedPlan = this.$route.query.Plan;
    this.selectedProject = this.$route.query.Project;
    await this.fetchLoops();
  },
  computed: {
    displayModeText() {
      return this.displayMode === "table" ? "表格" : "報表";
    },
    projectTypeText() {
      return this.projectType === "engineering" ? "工程" : "銀行";
    },
    allDateRanges() {
      const ranges = new Set();
      if (!this.showDetails) {
        this.TableData.forEach((item) => {
          item.date_ranges.forEach((range) => {
            ranges.add(range.date_range);
          });
        });
      } else if (this.timeMode === "week") {
        this.weekTableData.forEach((item) => {
          item.date_ranges.forEach((range) => {
            ranges.add(range.date_range);
          });
        });
      } else if (this.timeMode === "quarter") {
        this.quarterTableData.forEach((item) => {
          item.date_ranges.forEach((range) => {
            ranges.add(range.date_range);
          });
        });
      }
      return Array.from(ranges);
    },
    quarterSummary() {
      let data = this.showDetails ? this.quarterTableData : this.TableData;
      if (!data.length) return [];

      const summaries = new Set();

      data.forEach((item) => {
        item.date_ranges.forEach((range) => {
          const identifier = `${range.year}-Q${range.quarter}-${range.week}`;

          summaries.add(identifier);
        });
      });

      return Array.from(summaries).map((summary) => {
        const [year, quarter, week] = summary.split("-");
        return { year, quarter: quarter.replace("Q", ""), week };
      });
    },
    uniquePvNames() {
      const uniqueNames = new Map();
      if (this.chartData.datasets) {
        this.chartData.datasets.forEach((dataset) => {
          const name = dataset.label.split(" ")[0];
          const color = dataset.borderColor;
          if (!uniqueNames.has(name)) {
            uniqueNames.set(name, color);
          }
        });
      }
      return Array.from(uniqueNames).map(([name, color]) => ({ name, color }));
    },
  },
  methods: {
    organizeTableData(flatData) {
      const organizedData = [];
      const tempMap = new Map();

      flatData.forEach((item) => {
        const { pv_name, date_range, actual, expected, year, quarter, week } = item;

        if (!tempMap.has(pv_name)) {
          tempMap.set(pv_name, { pv_name, date_ranges: [] });
        }

        const currentPv = tempMap.get(pv_name);

        let dateRangeObj = currentPv.date_ranges.find((dr) => dr.date_range === date_range);
        if (!dateRangeObj) {
          dateRangeObj = { date_range, records: [], year, quarter, week };
          currentPv.date_ranges.push(dateRangeObj);
        }

        dateRangeObj.records.push({ actual, expected });

        if (year !== undefined) dateRangeObj.year = year;
        if (quarter !== undefined) dateRangeObj.quarter = quarter;
        if (week !== undefined) dateRangeObj.week = week;
      });

      tempMap.forEach((value) => {
        organizedData.push(value);
      });
      console.log(organizedData);
      return organizedData;
    },
    async fetchLoops() {
      try {
        console.log("api response:", this.selectedProject);
        const { data } = await fetchLoopsByProject(this.selectedProject);
        this.loops = data;
      } catch (error) {
        console.error("Error fetching loops:", error);
      }
    },
    async fetchData() {
      if (!this.selectedLoopId) return;
      this.isLoading = true;
      try {
        console.log(this.selectedLoopId, this.currentPage, this.itemsPerPage, this.projectType);

        let response;
        if (!this.showDetails) {
          response = await fetchLoopTableData(
            this.selectedLoopId,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          this.TableData = this.organizeTableData(response.data.results);
          console.log("chartData", this.chartData);
        } else if (this.showDetails && this.timeMode === "week") {
          response = await fetchLoopWeekTableData(
            this.selectedLoopId,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          this.weekTableData = this.organizeTableData(response.data.results);
        } else if (this.showDetails && this.timeMode === "quarter") {
          response = await fetchLoopQuarterTableData(
            this.selectedLoopId,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          this.quarterTableData = this.organizeTableData(response.data.results);
        } else {
          console.error("Invalid time mode:", this.timeMode);
          return;
        }
        console.log(response.data.results);
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error("Error fetching data:", error);
        this.weekTableData = [];
        this.quarterTableData = [];
      } finally {
        this.isLoading = false;
      }
    },
    selectLoop(loopId) {
      this.selectedLoopId = loopId;
    },
    // 切換顯示模式
    toggleDisplayMode() {
      this.displayMode = this.displayMode === "table" ? "report" : "table";
      this.showDetails = false;
    },
    // 切換項目類型
    toggleProjectType() {
      this.projectType = this.projectType === "engineering" ? "bank" : "engineering";
    },
    formatPercentage(value) {
      return `${(Number(value) * 100).toFixed(2)}%`;
    },
    selectPv(pvName) {
      console.log(`Selected PV: ${pvName}`);
      // 選擇案場後的邏輯
    },
  },
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

.loops-selection {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  overflow-x: auto;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 40px;
  margin-right: 40px;
}

.loop-button {
  border-top: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  text-transform: none;
  color: #404040;
  background-color: transparent;
  padding: 5px 10px;
  box-shadow: none;
  white-space: nowrap;
  border-radius: 0;
}

.loop-button:hover {
  background-color: #b2dfdb;
}

.loop-button:last-child {
  margin-right: 0;
}
.loop-button--active {
  border-top: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  background-color: #00b894;
  color: white;
  font-weight: bold;
}

.function-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 40px;
}

.engineering-btn,
.bank-btn,
.table-btn,
.report-btn,
.overview-btn,
.details-btn {
  text-transform: none;
  font-weight: bold;
}

.table-btn {
  background-color: #1976d2;
  color: white;
}

.table-btn:hover {
  background-color: #1565c0;
}

.report-btn {
  background-color: #4caf50;
  color: white;
}

.report-btn:hover {
  background-color: #43a047;
}

.engineering-btn {
  margin-right: 5px;
  background-color: #ffc107;
  color: white;
}

.engineering-btn:hover {
  background-color: #ffb300;
}

.bank-btn {
  margin-right: 5px;
  background-color: #0984e3;
  color: white;
}

.bank-btn:hover {
  background-color: #0769c1;
}

.overview-btn,
.details-btn {
  transition: background-color 0.3s, box-shadow 0.3s;
}

.overview-btn.selected,
.details-btn.selected {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
}

.overview-btn {
  background-color: #9c27b0;
  color: white;
}

.overview-btn:hover,
.overview-btn.selected {
  background-color: #65197a;
}

.details-btn {
  margin-right: 5px;
  background-color: #e91e63;
  color: white;
}

.details-btn:hover,
.details-btn.selected {
  background-color: #ae174e;
}

.time-toggle .v-btn--active {
  background-color: #cccccc;
  color: #404040;
}

:deep(.v-btn-toggle) {
  padding: 2px 30px;
  min-height: auto;
  height: auto;
}

.div-container {
  margin: 20px;
  height: 600px;
}

.report-container {
  display: flex;
}

.v-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
}

.v-table th,
.v-table td {
  padding: 8px;
  border: 1px solid #e8e8e8 !important;
}

.v-table th {
  padding: 8px !important;
  font-weight: bold !important;
  text-align: center !important;
  background-color: #00b894;
  color: white !important;
}

.expected {
  background-color: #fafaea;
}

.status-and-page-size-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.normal-bg {
  background-color: #00b894;
}

.special-bg {
  background-color: #0769c1 !important;
}
</style>
