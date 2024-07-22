<template>
  <v-container>
    <!-- 標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue" @click="goBack">mdi-chevron-left-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽總迴路工程進度：</span>
    </div>

    <!-- 功能列 -->
    <div class="function-row">
      <!-- 第一個區塊 -->
      <div class="status-and-page-size-selector">
        <span>狀態：</span>
        <v-btn
          :class="endisplayMode === 'table' ? 'report-btn' : 'table-btn'"
          @click="entoggleDisplayMode"
          >{{ endisplayModeText }}</v-btn
        >
      </div>

      <!-- 第二個區塊 -->
      <div v-if="enshowDetails && endisplayMode === 'table'" class="py-2 d-flex justify-center">
        <v-btn-toggle mandatory v-model="entimeMode" class="time-toggle" variant="outlined">
          <v-btn class="time-btn" value="quarter">季</v-btn>
          <v-btn class="time-btn" value="week">週</v-btn>
        </v-btn-toggle>
      </div>

      <!-- 第三個區塊 -->
      <div v-if="endisplayMode === 'table'">
        <v-btn
          class="overview-btn"
          :class="{ 'btn-active': !enshowDetails }"
          rounded="0"
          variant="outlined"
          @click="enshowDetails = false"
        >
          即時
        </v-btn>
        <v-btn
          class="details-btn"
          :class="{ 'btn-active': enshowDetails }"
          rounded="0"
          variant="outlined"
          @click="enshowDetails = true"
        >
          詳情
        </v-btn>
      </div>
    </div>

    <!-- 周數據展示 -->
    <div
      class="div-container"
      v-if="entimeMode === 'week' && enshowDetails && endisplayMode === 'table'"
    >
      <WeekLoopTable
        :allDateRanges="enallDateRanges"
        :enweekenTableData="enweekenTableData"
        :percentagedata="enpercentageData"
      />
      <!-- 分頁組件 -->
      <v-pagination
        v-model="encurrentPage"
        :length="entotalPages"
        :total-visible="7"
        @input="enfetchData"
      ></v-pagination>
    </div>

    <!-- 季數據展示 -->
    <div
      class="div-container"
      v-if="entimeMode === 'quarter' && enshowDetails && endisplayMode === 'table'"
    >
      <AllQuarterLoopTable
        :allDateRanges="enallDateRanges"
        :quarterSummary="enquarterSummary"
        :enquarterenTableData="enquarterenTableData"
        :percentagedata="enpercentageData"
      />
      <!-- 分頁組件 -->
      <v-pagination
        v-model="encurrentPage"
        :length="entotalPages"
        :total-visible="7"
        @input="enfetchData"
      ></v-pagination>
    </div>

    <!-- 即時數據展示 -->
    <div class="div-container" v-if="!enshowDetails && endisplayMode === 'table'">
      <QuarterLoopTable
        :allDateRanges="enallDateRanges"
        :quarterSummary="enquarterSummary"
        :enTableData="enTableData"
        :percentagedata="enpercentageData"
      />
      <!-- 分頁組件 -->
      <v-pagination
        v-model="encurrentPage"
        :length="entotalPages"
        :total-visible="7"
        @input="enfetchData"
      ></v-pagination>
    </div>

    <!-- 案場即時報表展示 -->
    <div
      class="div-container report-container"
      v-if="endisplayMode === 'report' && !enshowDetails"
      style="background-color: white; display: flex; height: 100%"
    >
      <SiteSelectionChart :enchartData="enchartData" />
    </div>

    <!-- 案場所有季報表展示 -->
    <div
      class="div-container report-container"
      v-if="endisplayMode === 'report' && enshowDetails && entimeMode === 'quarter'"
      style="background-color: white; display: flex; height: 100%"
    >
      <SiteSelectionChart :enchartData="enchartData" />
    </div>

    <!-- 案場所有周報表展示 -->

    <div
      class="div-container report-container"
      v-if="endisplayMode === 'report' && enshowDetails && entimeMode === 'week'"
      style="background-color: white; display: flex; height: 100%"
    >
      <SiteSelectionChart :enchartData="enchartData" />
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
  fetchGLoopWeekenTableData,
  fetchGLoopQuarterenTableData,
  fetchGLoopenTableData,
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
      selectedPlan: null,
      selectedProject: null,
      enshowDetails: false,
      entimeMode: "",
      endisplayMode: "table",
      enweekenTableData: [], //周數據
      enquarterenTableData: [], //季數據
      enTableData: [],
      encurrentPage: 1,
      enperPage: 3,
      entotalPages: 0,
      enitemsPerPage: 3,
      enchartData: {
        labels: [],
        datasets: [],
      },
      enpercentageData: [],
    };
  },
  watch: {
    selectedProject: "enfetchData",
    enshowDetails: "enfetchData",
    encurrentPage: "enfetchData",
    entimeMode: "enfetchData",
  },
  async created() {
    this.selectedPlan = this.$route.query.Plan;
    this.selectedProject = this.$route.query.Project;
  },
  computed: {
    endisplayModeText() {
      return this.endisplayMode === "table" ? "表格" : "報表";
    },
    enallDateRanges() {
      const ranges = new Set();
      if (!this.enshowDetails) {
        this.enTableData.forEach((item) => {
          item.date_ranges.forEach((range) => {
            ranges.add(range.date_range);
          });
        });
      } else if (this.entimeMode === "week") {
        this.enweekenTableData.forEach((item) => {
          item.date_ranges.forEach((range) => {
            ranges.add(range.date_range);
          });
        });
      } else if (this.entimeMode === "quarter") {
        this.enquarterenTableData.forEach((item) => {
          item.date_ranges.forEach((range) => {
            ranges.add(range.date_range);
          });
        });
      }
      return Array.from(ranges);
    },
    enquarterSummary() {
      let data = this.enshowDetails ? this.enquarterenTableData : this.enTableData;
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
    entoggleDisplayMode() {
      if (this.endisplayMode === "table") {
        this.previousTimeMode = this.entimeMode;
        this.previousShowDetails = this.enshowDetails;

        this.endisplayMode = "report";
      } else {
        this.endisplayMode = "table";

        this.entimeMode = this.previousTimeMode;
        this.enshowDetails = this.previousShowDetails;
      }
    },
    enorganizeenTableData(flatData) {
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

      return organizedData;
    },
    async enfetchData() {
      this.isLoading = true;
      try {
        let response;
        let responsechart;
        let enpercentageDataresponse;

        enpercentageDataresponse = await fetchGetProjectPercentageDataView(this.selectedProject);
        this.enpercentageData = enpercentageDataresponse.data;

        if (!this.enshowDetails) {
          response = await fetchGLoopenTableData(
            this.selectedProject,
            this.encurrentPage,
            this.enitemsPerPage
          );
          this.enTableData = this.enorganizeenTableData(response.data.results);
          responsechart = await fetchGLoopQuarterChartData(this.selectedProject);
          this.enchartData = responsechart.data;
        } else if (this.enshowDetails && this.entimeMode === "week") {
          response = await fetchGLoopWeekenTableData(
            this.selectedProject,
            this.encurrentPage,
            this.enitemsPerPage
          );
          this.enweekenTableData = this.enorganizeenTableData(response.data.results);
          responsechart = await fetchGLoopWeekChartData(
            this.selectedProject,
            this.encurrentPage,
            this.enitemsPerPage
          );
          this.enchartData = responsechart.data;
        } else if (this.enshowDetails && this.entimeMode === "quarter") {
          response = await fetchGLoopQuarterenTableData(
            this.selectedProject,
            this.encurrentPage,
            this.enitemsPerPage
          );
          this.enquarterenTableData = this.enorganizeenTableData(response.data.results);
          responsechart = await fetchGLoopAllQuarterChartData(this.selectedProject);
          this.enchartData = responsechart.data;
        } else {
          console.error("Invalid time mode:", this.entimeMode);
          return;
        }
        this.entotalPages = response.data.entotalPages;
      } catch (error) {
        console.error("Error fetching data:", error);
        this.enweekenTableData = [];
        this.enquarterenTableData = [];
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
