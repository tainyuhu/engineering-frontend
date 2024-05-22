<template>
  <v-container>
    <!-- 標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue" @click="goBack">mdi-chevron-left-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽PV工程進度：</span>
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
      <div v-if="showDetails && displayMode === 'table'" class="py-2 d-flex justify-center">
        <v-btn-toggle mandatory v-model="timeMode" class="time-toggle" variant="outlined">
          <v-btn class="time-btn" value="quarter">季</v-btn>
          <v-btn class="time-btn" value="week">週</v-btn>
        </v-btn-toggle>
      </div>

      <!-- 第三個區塊 -->
      <div v-if="selectedLoopId && displayMode === 'table'">
        <v-btn
          :class="projectType === 'engineering' ? 'bank-btn' : 'engineering-btn'"
          @click="toggleProjectType"
          >{{ projectTypeText }}</v-btn
        >
        <v-btn
          class="overview-btn"
          :class="{ 'btn-active': !showDetails }"
          rounded="0"
          variant="outlined"
          @click="showDetails = false"
        >
          即時
        </v-btn>
        <v-btn
          class="details-btn"
          :class="{ 'btn-active': showDetails }"
          rounded="0"
          variant="outlined"
          @click="showDetails = true"
        >
          詳情
        </v-btn>
      </div>
    </div>

    <!-- 周數據展示 -->
    <div
      class="div-container"
      v-if="selectedLoopId && timeMode === 'week' && showDetails && displayMode === 'table'"
    >
      <WeekTable
        :percentagedata="percentageData"
        :allDateRanges="allDateRanges"
        :weekTableData="weekTableData"
      />

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
      <AllQuarterTable
        :percentagedata="percentageData"
        :allDateRanges="allDateRanges"
        :quarterSummary="quarterSummary"
        :quarterTableData="quarterTableData"
      />
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
      <QuarterTable
        :percentagedata="percentageData"
        :allDateRanges="allDateRanges"
        :quarterSummary="quarterSummary"
        :TableData="TableData"
      />
      <!-- 分頁組件 -->
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        @input="fetchData"
      ></v-pagination>
    </div>

    <!-- 案場即時報表展示 -->
    <div
      class="div-container report-container"
      v-if="selectedLoopId && displayMode === 'report' && !showDetails"
      style="background-color: white; display: flex; height: 100%"
    >
      <SiteSelectionChart :chartData="chartData" />
    </div>

    <!-- 案場所有季報表展示 -->
    <div
      class="div-container report-container"
      v-if="selectedLoopId && displayMode === 'report' && showDetails && timeMode === 'quarter'"
      style="background-color: white; display: flex; height: 100%"
    >
      <SiteSelectionChart :chartData="chartData" />
    </div>

    <!-- 案場所有周報表展示 -->
    <div
      class="div-container report-container"
      v-if="selectedLoopId && displayMode === 'report' && showDetails && timeMode === 'week'"
      style="background-color: white; display: flex; height: 100%"
    >
      <SiteSelectionChart :chartData="chartData" />
    </div>
  </v-container>
</template>

<script>
import SiteSelectionChart from "@/components/chart/SiteSelectionChart.vue";
import WeekTable from "@/components/table/weekTable.vue";
import AllQuarterTable from "@/components/table/allQuarterTable.vue";
import QuarterTable from "@/components/table/quarterTable.vue";
import { fetchLoopsByProject, fetchGetLoopPercentageData } from "@/api/planService";
import {
  fetchWeekTableData,
  fetchQuarterTableData,
  fetchTableData,
  fetchQuarterChartData,
  fetchWeekChartData,
  fetchAllQuarterChartData,
} from "@/api/pvProjectService";

export default {
  components: {
    WeekTable,
    AllQuarterTable,
    QuarterTable,
    SiteSelectionChart,
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
      projectType: "bank",
      previousTimeMode: null,
      previousShowDetails: null,
      showDetails: false,
      weekTableData: [], //周數據
      quarterTableData: [], //季數據
      TableData: [], //總數據
      itemsPerPage: 3, //一次只要顯示兩筆
      currentPage: 1, //當前頁面
      totalPages: 0, // 總頁數
      chartData: {}, // 圖表內容
      percentageData: [],
    };
  },
  watch: {
    selectedLoopId: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.fetchData();
        this.displayMode = "table";
      }
    },
    showDetails: "fetchData",
    currentPage: "fetchData",
    projectType: "fetchData",
    timeMode: "fetchData",
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
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "Browse_Progress",
        query: { planId: this.selectedPlan },
      });
    },
    toggleDisplayMode() {
      if (this.displayMode === "table") {
        this.previousTimeMode = this.timeMode;
        this.previousShowDetails = this.showDetails;

        this.displayMode = "report";
      } else {
        this.displayMode = "table";

        this.timeMode = this.previousTimeMode;
        this.showDetails = this.previousShowDetails;
      }
    },
    organizeTableData(flatData) {
      const organizedData = [];
      const tempMap = new Map();

      flatData.forEach((item) => {
        const {
          vb_name,
          date_range,
          construction_status,
          actual,
          expected,
          year,
          quarter,
          week,
          actual_lag_status,
          expected_lag_status,
        } = item;

        if (!tempMap.has(vb_name)) {
          tempMap.set(vb_name, { vb_name, construction_status, date_ranges: [] });
        }

        const currentPv = tempMap.get(vb_name);

        let dateRangeObj = currentPv.date_ranges.find((dr) => dr.date_range === date_range);
        if (!dateRangeObj) {
          dateRangeObj = { date_range, records: [], year, quarter, week };
          currentPv.date_ranges.push(dateRangeObj);
        }

        dateRangeObj.records.push({ actual, expected });

        if (year !== undefined) dateRangeObj.year = year;
        if (quarter !== undefined) dateRangeObj.quarter = quarter;
        if (week !== undefined) dateRangeObj.week = week;
        if (actual_lag_status !== undefined) dateRangeObj.actual_lag_status = actual_lag_status;
        if (expected_lag_status !== undefined)
          dateRangeObj.expected_lag_status = expected_lag_status;
      });

      tempMap.forEach((value) => organizedData.push(value));

      organizedData.sort((a, b) => {
        const aHasProgress = a.date_ranges.some((dr) =>
          dr.records.some((r) => r.actual > 0 || r.expected > 0)
        );
        const bHasProgress = b.date_ranges.some((dr) =>
          dr.records.some((r) => r.actual > 0 || r.expected > 0)
        );
        return bHasProgress - aHasProgress;
      });

      console.log("organizedData", organizedData);
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
        let responsechart;
        let percentageDataresponse;

        percentageDataresponse = await fetchGetLoopPercentageData(this.selectedLoopId);
        this.percentageData = percentageDataresponse.data;
        console.log("percentageData", this.percentageData);
        if (!this.showDetails) {
          response = await fetchTableData(
            this.selectedLoopId,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          this.TableData = this.organizeTableData(response.data.results);
          responsechart = await fetchQuarterChartData(this.selectedLoopId, this.projectType);
          this.chartData = responsechart.data;
          console.log("chartData", this.chartData);
        } else if (this.showDetails && this.timeMode === "week") {
          response = await fetchWeekTableData(
            this.selectedLoopId,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          this.weekTableData = this.organizeTableData(response.data.results);
          responsechart = await fetchWeekChartData(
            this.selectedLoopId,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          this.chartData = responsechart.data;
          console.log("chartData", this.chartData);
        } else if (this.showDetails && this.timeMode === "quarter") {
          response = await fetchQuarterTableData(
            this.selectedLoopId,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          this.quarterTableData = this.organizeTableData(response.data.results);
          responsechart = await fetchAllQuarterChartData(this.selectedLoopId, this.projectType);
          this.chartData = responsechart.data;
          console.log("chartData", this.chartData);
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
    // 切換項目類型
    toggleProjectType() {
      this.projectType = this.projectType === "engineering" ? "bank" : "engineering";
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
