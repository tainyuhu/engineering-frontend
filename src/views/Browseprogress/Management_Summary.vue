<template>
  <v-container>
    <!-- 標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽管理總表工程進度：</span>
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
      <WeekProjectTable :allDateRanges="paginatedDateRanges" :weekTableData="paginatedData" />
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
    </div>

    <!-- 季數據展示 -->
    <div class="div-container" v-if="timeMode === 'quarter' && showDetails">
      <v-table>
        <thead>
          <tr>
            <th rowspan="2">工程 / 週間</th>
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
          <tr v-for="item in paginatedData" :key="item.project_name">
            <td class="font-weight-bold">{{ item.project_name }}</td>
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
            <th rowspan="2">工程 / 週間</th>
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
          <tr v-for="item in paginatedData" :key="item.project_name">
            <td class="font-weight-bold">{{ item.project_name }}</td>
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
import WeekProjectTable from "@/components/table/weekProjectTable.vue";
import AllQuarterProjectTable from "@/components/table/allQuarterProjectTable.vue";
import QuarterProjectTable from "@/components/table/quarterProjectTable.vue";

export default {
  components: {
    Chart,
    WeekProjectTable,
    AllQuarterProjectTable,
    QuarterProjectTable,
  },
  data() {
    return {
      timeMode: "week",
      displayMode: "table",
      projectType: "engineering",
      showDetails: false,
      weekTableData: [
        {
          actual: 0.3317,
          date_range: "2023-12-30 - 2024-01-06",
          expected: 0.3317,
          project_name: "161KV",
        },
        {
          actual: 0,
          date_range: "2023-12-30 - 2024-01-06",
          expected: 0.0007,
          project_name: "案場",
        },
        {
          actual: 0.1181,
          date_range: "2023-12-30 - 2024-01-06",
          expected: 0.0095,
          project_name: "電業申辦",
        },

        {
          actual: 0.3317,
          date_range: "2024-01-07 - 2024-01-13",
          expected: 0.3317,
          project_name: "161KV",
        },
        {
          actual: 0,
          date_range: "2024-01-07 - 2024-01-13",
          expected: 0.0054,
          project_name: "22.8KV",
        },
        {
          actual: 0,
          date_range: "2024-01-07 - 2024-01-13",
          expected: 0.0007,
          project_name: "案場",
        },
        {
          actual: 0.1181,
          date_range: "2024-01-07 - 2024-01-13",
          expected: 0.019,
          project_name: "電業申辦",
        },

        {
          actual: 0.3317,
          date_range: "2024-01-14 - 2024-01-20",
          expected: 0.3317,
          project_name: "161KV",
        },
        {
          actual: 0,
          date_range: "2024-01-14 - 2024-01-20",
          expected: 0.0108,
          project_name: "22.8KV",
        },
        {
          actual: 0,
          date_range: "2024-01-14 - 2024-01-20",
          expected: 0.0033,
          project_name: "案場",
        },
        {
          actual: 0.1181,
          date_range: "2024-01-14 - 2024-01-20",
          expected: 0.0286,
          project_name: "電業申辦",
        },

        {
          actual: 0.3317,
          date_range: "2024-01-21 - 2024-01-27",
          expected: 0.3317,
          project_name: "161KV",
        },
        {
          actual: 0.0949,
          date_range: "2024-01-21 - 2024-01-27",
          expected: 0.0162,
          project_name: "22.8KV",
        },
        {
          actual: 0,
          date_range: "2024-01-21 - 2024-01-27",
          expected: 0.004,
          project_name: "案場",
        },
        {
          actual: 0.1181,
          date_range: "2024-01-21 - 2024-01-27",
          expected: 0.0381,
          project_name: "電業申辦",
        },

        {
          actual: 0.3317,
          date_range: "2024-01-28 - 2024-02-03",
          expected: 0.3317,
          project_name: "161KV",
        },
        {
          actual: 0.0949,
          date_range: "2024-01-28 - 2024-02-03",
          expected: 0.0216,
          project_name: "22.8KV",
        },
        {
          actual: 0,
          date_range: "2024-01-28 - 2024-02-03",
          expected: 0.004,
          project_name: "案場",
        },
        {
          actual: 0.1181,
          date_range: "2024-01-28 - 2024-02-03",
          expected: 0.0476,
          project_name: "電業申辦",
        },

        {
          actual: 0.3317,
          date_range: "2024-02-04 - 2024-02-10",
          expected: 0.3317,
          project_name: "161KV",
        },
        {
          actual: 0.0949,
          date_range: "2024-02-04 - 2024-02-10",
          expected: 0.027,
          project_name: "22.8KV",
        },
        {
          actual: 0,
          date_range: "2024-02-04 - 2024-02-10",
          expected: 0.004,
          project_name: "案場",
        },
        {
          actual: 0.1181,
          date_range: "2024-02-04 - 2024-02-10",
          expected: 0.0571,
          project_name: "電業申辦",
        },

        {
          actual: 0.3317,
          date_range: "2024-02-11 - 2024-02-17",
          expected: 0.3317,
          project_name: "161KV",
        },
        {
          actual: 0.0949,
          date_range: "2024-02-11 - 2024-02-17",
          expected: 0.0324,
          project_name: "22.8KV",
        },
        {
          actual: 0.0016,
          date_range: "2024-02-11 - 2024-02-17",
          expected: 0.004,
          project_name: "案場",
        },
        {
          actual: 0.1181,
          date_range: "2024-02-11 - 2024-02-17",
          expected: 0.0667,
          project_name: "電業申辦",
        },

        {
          actual: 0.3317,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0.3317,
          project_name: "161KV",
        },
        {
          actual: 0.0949,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0.0378,
          project_name: "22.8KV",
        },
        {
          actual: 0.0024,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0.005,
          project_name: "案場",
        },
        {
          actual: 0.1181,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0.0762,
          project_name: "電業申辦",
        },

        {
          actual: 0.3317,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.3317,
          project_name: "161KV",
        },
        {
          actual: 0.0964,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0432,
          project_name: "22.8KV",
        },
        {
          actual: 0.0036,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0051,
          project_name: "案場",
        },
        {
          actual: 0.3114,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0857,
          project_name: "電業申辦",
        },
      ], //周數據
      quarterTableData: [
        {
          actual: 0.3317,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.3317,
          project_name: "161KV",
          year: 2024,
          quarter: 1,
          week: 9,
        },
        {
          actual: 0.0964,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0432,
          project_name: "22.8KV",
          year: 2024,
          quarter: 1,
          week: 9,
        },
        {
          actual: 0.0036,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0051,
          project_name: "案場",
          year: 2024,
          quarter: 1,
          week: 9,
        },
        {
          actual: 0.3114,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0857,
          project_name: "電業申辦",
          year: 2024,
          quarter: 1,
          week: 9,
        },
      ], //季數據
      TableData: [
        {
          actual: 0.3317,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.3317,
          project_name: "161KV",
          year: 2024,
          quarter: 1,
          week: 9,
        },
        {
          actual: 0.0964,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0432,
          project_name: "22.8KV",
          year: 2024,
          quarter: 1,
          week: 9,
        },
        {
          actual: 0.0036,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0051,
          project_name: "案場",
          year: 2024,
          quarter: 1,
          week: 9,
        },
        {
          actual: 0.3114,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0857,
          project_name: "電業申辦",
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
        const { project_name, date_range, actual, expected, year, quarter, week } = item;

        if (!tempMap.has(project_name)) {
          tempMap.set(project_name, { project_name, date_ranges: [] });
        }

        const currentLoop = tempMap.get(project_name);
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
@import "@/assets/style/browseprogress.css";

:deep(.v-btn-toggle) {
  padding: 2px 30px;
  min-height: auto;
  height: auto;
}
</style>
