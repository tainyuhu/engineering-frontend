<template>
  <v-container>
    <!-- 標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue" @click="goBack">mdi-chevron-left-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽工程進度：</span>
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
      <div v-if="showDetails && displayMode === 'table'" class="py-2 d-flex justify-center">
        <v-btn-toggle mandatory v-model="timeMode" class="time-toggle" variant="outlined">
          <v-btn class="time-btn" value="quarter">季</v-btn>
          <v-btn class="time-btn" value="week">週</v-btn>
        </v-btn-toggle>
      </div>

      <!-- 第三個區塊 -->
      <div v-if="displayMode === 'table'">
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
    <div class="div-container" v-if="timeMode === 'week' && showDetails && displayMode === 'table'">
      <WeekLoopTable
        :allDateRanges="allDateRanges"
        :weekTableData="weekTableData"
        :percentagedata="percentageData"
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
      v-if="timeMode === 'quarter' && showDetails && displayMode === 'table'"
    >
      <AllQuarterLoopTable
        :allDateRanges="allDateRanges"
        :quarterSummary="quarterSummary"
        :quarterTableData="quarterTableData"
        :percentagedata="percentageData"
      />
      <!-- 分頁組件 -->
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        @input="fetchData"
      ></v-pagination>
    </div>

    <!-- 即時數據展示 -->
    <div class="div-container" v-if="!showDetails && displayMode === 'table'">
      <QuarterLoopTable
        :allDateRanges="allDateRanges"
        :quarterSummary="quarterSummary"
        :TableData="TableData"
        :percentagedata="percentageData"
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
      v-if="displayMode === 'report' && !showDetails"
      style="background-color: white; display: flex; height: 100%"
    >
      <SiteSelectionChart :chartData="chartData" />
    </div>

    <!-- 案場所有季報表展示 -->
    <div
      class="div-container report-container"
      v-if="displayMode === 'report' && showDetails && timeMode === 'quarter'"
      style="background-color: white; display: flex; height: 100%"
    >
      <SiteSelectionChart :chartData="chartData" />
    </div>

    <!-- 案場所有周報表展示 -->

    <div
      class="div-container report-container"
      v-if="displayMode === 'report' && showDetails && timeMode === 'week'"
      style="background-color: white; display: flex; height: 100%"
    >
      <SiteSelectionChart :chartData="chartData" />
    </div>
  </v-container>
</template>

<script>
import SiteSelectionChart from "@/components/chart/SiteSelectionChart.vue";
import WeekLoopTable from "@/components/table/weekLoopTable.vue";
import AllQuarterLoopTable from "@/components/table/allQuarterLoopTable.vue";
import QuarterLoopTable from "@/components/table/quarterLoopTable.vue";
import {
  fetchGetProjectPercentageDataView,
  fetchGLoopWeekTableData,
  fetchGLoopQuarterTableData,
  fetchGLoopTableData,
  fetchGLoopQuarterChartData,
  fetchGLoopAllQuarterChartData,
  fetchGLoopWeekChartData,
} from "@/api/planService";

export default {
  components: {
    WeekLoopTable,
    AllQuarterLoopTable,
    QuarterLoopTable,
    SiteSelectionChart,
  },
  data() {
    return {
      timeMode: "week",
      displayMode: "table",
      selectedPlan: null,
      selectedProject: null,
      showDetails: false,
      weekTableData: [], //周數據
      quarterTableData: [], //季數據
      TableData: [],
      currentPage: 1,
      totalPages: 0,
      itemsPerPage: 4,
      chartData: {
        labels: [],
        datasets: [],
      },
      percentageData: [],
    };
  },
  watch: {
    selectedProject: "fetchData",
    showDetails: "fetchData",
    currentPage: "fetchData",
    timeMode: "fetchData",
  },
  async created() {
    this.selectedPlan = this.$route.query.Plan;
    this.selectedProject = this.$route.query.Project;
  },
  computed: {
    displayModeText() {
      return this.displayMode === "table" ? "表格" : "報表";
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
          loop_name,
          date_range,
          construction_status,
          actual,
          expected,
          year,
          quarter,
          week,
        } = item;

        if (!tempMap.has(loop_name)) {
          tempMap.set(loop_name, { loop_name, construction_status, date_ranges: [] });
        }

        const currentPv = tempMap.get(loop_name);

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
    async fetchData() {
      this.isLoading = true;
      try {
        let response;
        let responsechart;
        let percentageDataresponse;

        percentageDataresponse = await fetchGetProjectPercentageDataView(this.selectedProject);
        this.percentageData = percentageDataresponse.data;

        if (!this.showDetails) {
          response = await fetchGLoopTableData(
            this.selectedProject,
            this.currentPage,
            this.itemsPerPage
          );
          this.TableData = this.organizeTableData(response.data.results);
          responsechart = await fetchGLoopQuarterChartData(this.selectedProject);
          this.chartData = responsechart.data;
        } else if (this.showDetails && this.timeMode === "week") {
          response = await fetchGLoopWeekTableData(
            this.selectedProject,
            this.currentPage,
            this.itemsPerPage
          );
          this.weekTableData = this.organizeTableData(response.data.results);
          responsechart = await fetchGLoopWeekChartData(
            this.selectedProject,
            this.currentPage,
            this.itemsPerPage
          );
          this.chartData = responsechart.data;
        } else if (this.showDetails && this.timeMode === "quarter") {
          response = await fetchGLoopQuarterTableData(
            this.selectedProject,
            this.currentPage,
            this.itemsPerPage
          );
          this.quarterTableData = this.organizeTableData(response.data.results);
          responsechart = await fetchGLoopAllQuarterChartData(this.selectedProject);
          this.chartData = responsechart.data;
        } else {
          console.error("Invalid time mode:", this.timeMode);
          return;
        }
        this.totalPages = response.data.totalPages;
      } catch (error) {
        console.error("Error fetching data:", error);
        this.weekTableData = [];
        this.quarterTableData = [];
      } finally {
        this.isLoading = false;
      }
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
