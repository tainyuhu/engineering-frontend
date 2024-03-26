<template>
  <v-container>
    <!-- 標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽總迴路工程進度：</span>
    </div>

    <!-- 功能列 -->
    <div class="function-row">
      <!-- 第一個區塊 -->
      <div class="status-and-page-size-selector">
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
      <div>
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
    <div class="div-container" v-if="timeMode === 'week' && showDetails">
      <v-table>
        <thead>
          <tr>
            <th>迴路 / 週間</th>
            <th
              v-for="(dateRange, index) in paginatedDateRanges"
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
          <tr v-for="item in paginatedData" :key="item.loop_name">
            <td class="font-weight-bold">{{ item.loop_name }}</td>
            <template v-for="dateRange in item.date_ranges">
              <td>{{ formatPercentage(dateRange.records[0].actual) }}</td>
              <td class="expected">{{ formatPercentage(dateRange.records[0].expected) }}</td>
            </template>
          </tr>
        </tbody>
      </v-table>
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
    </div>

    <!-- 季數據展示 -->
    <div class="div-container" v-if="timeMode === 'quarter' && showDetails">
      <v-table>
        <thead>
          <tr>
            <th rowspan="2">迴路 / 週間</th>
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
              v-for="(dateRange, index) in paginatedDateRanges"
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
          <tr v-for="item in paginatedData" :key="item.loop_name">
            <td class="font-weight-bold">{{ item.loop_name }}</td>
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
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
    </div>

    <!-- 季數據展示 -->
    <div class="div-container" v-if="!showDetails && displayMode === 'table'">
      <v-table>
        <thead>
          <tr>
            <th rowspan="2">迴路 / 週間</th>
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
              v-for="(dateRange, index) in paginatedDateRanges"
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
          <tr v-for="item in paginatedData" :key="item.loop_name">
            <td class="font-weight-bold">{{ item.loop_name }}</td>
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
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
    </div>
  </v-container>
</template>

<script>
import Chart from "@/components/chart/Chart.vue";

export default {
  components: {
    Chart,
  },
  data() {
    return {
      timeMode: "week",
      displayMode: "table",
      projectType: "engineering",
      showDetails: false,
      weekTableData: [
        {
          actual: 0.0053,
          date_range: "2023-12-31 - 2024-01-06",
          expected: 0,
          loop_name: "SN2",
        },

        {
          actual: 0.0053,
          date_range: "2024-01-07 - 2024-01-13",
          expected: 0,
          loop_name: "SN2",
        },

        {
          actual: 0.0257,
          date_range: "2024-01-14 - 2024-01-20",
          expected: 0,
          loop_name: "SN2",
        },

        {
          actual: 0.0312,
          date_range: "2024-01-21 - 2024-01-27",
          expected: 0,
          loop_name: "SN2",
        },

        {
          actual: 0.0312,
          date_range: "2024-01-28 - 2024-02-03",
          expected: 0,
          loop_name: "SN2",
        },

        {
          actual: 0.0312,
          date_range: "2024-02-04 - 2024-02-10",
          expected: 0,
          loop_name: "SN2",
        },

        {
          actual: 0.0312,
          date_range: "2024-02-11 - 2024-02-17",
          expected: 0.0124,
          loop_name: "SN2",
        },

        {
          actual: 0.0312,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0.0187,
          loop_name: "SN2",
        },
        {
          actual: 0.0109,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0,
          loop_name: "SN1",
        },

        {
          actual: 0.0312,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0279,
          loop_name: "SN2",
        },
        {
          actual: 0.0109,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0,
          loop_name: "SN1",
        },
      ], //周數據
      quarterTableData: [
        {
          actual: 0.0109,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0,
          loop_name: "SN1",
          year: 2024,
          quarter: 1,
          week: 9,
        },
        {
          actual: 0.0312,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0279,
          loop_name: "SN2",
          year: 2024,
          quarter: 1,
          week: 9,
        },
      ], //季數據
      TableData: [
        {
          actual: 0.0109,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0,
          loop_name: "SN1",
          year: 2024,
          quarter: 1,
          week: 9,
        },
        {
          actual: 0.0312,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0279,
          loop_name: "SN2",
          year: 2024,
          quarter: 1,
          week: 9,
        },
      ],
      currentPage: 1,
      perPage: 3,
    };
  },
  watch: {},
  async created() {
    this.selectedPlan = this.$route.query.Plan;
    this.selectedProject = this.$route.query.Project;
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
      this.organizedLoopsData.forEach((item) => {
        item.date_ranges.forEach((range) => {
          ranges.add(range.date_range);
        });
      });

      return Array.from(ranges);
    },
    quarterSummary() {
      let data = this.organizedLoopsData;
      console.log(data);
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
    totalPages() {
      const totalItems = this.allDateRanges.length;
      return Math.ceil(totalItems / this.perPage);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      const data = this.organizedLoopsData.map((loop) => ({
        ...loop,
        date_ranges: loop.date_ranges.slice(start, end),
      }));
      console.log(data);
      return data;
    },
    paginatedDateRanges() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.allDateRanges.slice(start, end);
    },
    organizedLoopsData() {
      const organizedData = [];
      const tempMap = new Map();

      let dataSource = [];
      if (!this.showDetails) {
        dataSource = this.TableData;
      } else {
        if (this.timeMode === "quarter") {
          dataSource = this.quarterTableData;
        } else if (this.timeMode === "week") {
          dataSource = this.weekTableData;
        }
      }

      dataSource.forEach((item) => {
        const { loop_name, date_range, actual, expected, year, quarter, week } = item;

        if (!tempMap.has(loop_name)) {
          tempMap.set(loop_name, { loop_name, date_ranges: [] });
        }

        const currentLoop = tempMap.get(loop_name);
        let dateRangeObj = currentLoop.date_ranges.find((dr) => dr.date_range === date_range);
        if (!dateRangeObj) {
          dateRangeObj = { date_range, records: [], year, quarter, week };
          currentLoop.date_ranges.push(dateRangeObj);
        }

        dateRangeObj.records.push({ actual, expected });
      });

      tempMap.forEach((value) => {
        value.date_ranges.sort((a, b) => {
          const aDate = new Date(a.date_range.split(" - ")[0]);
          const bDate = new Date(b.date_range.split(" - ")[0]);
          return aDate - bDate;
        });
        organizedData.push(value);
      });

      return organizedData;
    },
  },
  methods: {
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
