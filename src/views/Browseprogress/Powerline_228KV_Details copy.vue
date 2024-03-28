<template>
  <v-container>
    <!-- 標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽22.8KV工程進度：</span>
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
          <v-btn value="quarter">季</v-btn>
          <v-btn value="week">週</v-btn>
        </v-btn-toggle>
      </div>

      <!-- 第三個區塊 -->
      <div v-if="displayMode === 'table'">
        <v-btn
          :class="projectType === 'engineering' ? 'bank-btn' : 'engineering-btn'"
          @click="toggleProjectType"
          >{{ projectTypeText }}</v-btn
        >
        <v-btn
          v-if="projectType === 'engineering'"
          class="custom-btn"
          @click="scrollToSection('engineeringSection')"
        >
          土木/纜線進度
        </v-btn>
        <v-btn class="overview-btn" rounded="0" @click="showDetails = false">即時</v-btn>
        <v-btn class="details-btn" rounded="0" @click="showDetails = true">詳情</v-btn>
      </div>
    </div>

    <!-- 周數據展示 -->
    <div class="div-container" v-if="timeMode === 'week' && showDetails && displayMode === 'table'">
      <WeekLoopTable :allDateRanges="paginatedDateRanges" :weekTableData="paginatedData" />
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
    </div>

    <!-- 季數據展示 -->
    <div
      class="div-container"
      v-if="timeMode === 'quarter' && showDetails && displayMode === 'table'"
    >
      <AllQuarterLoopTable
        :allDateRanges="paginatedDateRanges"
        :quarterSummary="quarterSummary"
        :quarterTableData="paginatedData"
      />
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
    </div>

    <!-- 即時數據展示 -->
    <div class="div-container" v-if="!showDetails && displayMode === 'table'">
      <QuarterLoopTable
        :allDateRanges="paginatedDateRanges"
        :quarterSummary="quarterSummary"
        :TableData="paginatedData"
      />
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
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

    <!-- 子標題 -->
    <div
      class="mb-3"
      ref="engineeringSection"
      style="padding-left: 20px; display: flex; align-items: center"
    >
      <v-icon color="blue">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽土木/纜線工程進度：</span>
    </div>

    <v-card v-if="displayMode === 'table'" class="div-container-1" outlined>
      <v-tabs v-model="tab" bg-color="indigo-darken-2" slider-color="yellow" show-arrows>
        <v-tab style="font-weight: bold" value="civil">土木工程</v-tab>
        <v-tab style="font-weight: bold" value="cable">纜線工程</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="civil">
            <div class="function-row">
              <!-- 第一個區塊 -->
              <div class="status-and-page-size-selector">
                <span>狀態：</span>
                <v-btn
                  :class="endisplayMode === 'table' ? 'report-btn' : 'table-btn'"
                  @click="toggleEnDisplayMode"
                  >{{ endisplayModeText }}</v-btn
                >
              </div>

              <!-- 第二個區塊 -->
              <div
                v-if="enshowDetails && endisplayMode === 'table'"
                class="py-2 d-flex justify-center"
              >
                <v-btn-toggle mandatory v-model="entimeMode" class="time-toggle" variant="outlined">
                  <v-btn value="quarter">季</v-btn>
                  <v-btn value="week">週</v-btn>
                </v-btn-toggle>
              </div>

              <!-- 第三個區塊 -->
              <div v-if="endisplayMode === 'table'">
                <v-btn class="overview-btn" rounded="0" @click="enshowDetails = false">即時</v-btn>
                <v-btn class="details-btn" rounded="0" @click="enshowDetails = true">詳情</v-btn>
              </div>
            </div>
            <!-- 周數據展示 -->
            <div
              class="div-container"
              v-if="entimeMode === 'week' && enshowDetails && endisplayMode === 'table'"
            >
              <WeekLoopTable
                :allDateRanges="enpaginatedDateRanges"
                :weekTableData="enpaginatedData"
              />
              <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
            </div>

            <!-- 季數據展示 -->
            <div
              class="div-container"
              v-if="entimeMode === 'quarter' && enshowDetails && endisplayMode === 'table'"
            >
              <AllQuarterLoopTable
                :allDateRanges="enpaginatedDateRanges"
                :quarterSummary="enquarterSummary"
                :quarterTableData="enpaginatedData"
              />
              <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
            </div>

            <!-- 即時數據展示 -->
            <div class="div-container" v-if="!enshowDetails && endisplayMode === 'table'">
              <QuarterLoopTable
                :allDateRanges="enpaginatedDateRanges"
                :quarterSummary="enquarterSummary"
                :TableData="enpaginatedData"
              />
              <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
            </div>

            <!-- 案場即時報表展示 -->
            <div
              class="div-container report-container"
              v-if="endisplayMode === 'report' && !enshowDetails"
              style="background-color: white; display: flex; height: 100%"
            >
              <SiteSelectionChart :chartData="enchartData" />
            </div>

            <!-- 案場所有季報表展示 -->
            <div
              class="div-container report-container"
              v-if="endisplayMode === 'report' && enshowDetails && entimeMode === 'quarter'"
              style="background-color: white; display: flex; height: 100%"
            >
              <SiteSelectionChart :chartData="enchartData" />
            </div>

            <!-- 案場所有周報表展示 -->
            <div
              class="div-container report-container"
              v-if="endisplayMode === 'report' && enshowDetails && entimeMode === 'week'"
              style="background-color: white; display: flex; height: 100%"
            >
              <SiteSelectionChart :chartData="enchartData" />
            </div>
          </v-window-item>
          <v-window-item value="cable">
            <div class="function-row">
              <!-- 第一個區塊 -->
              <div class="status-and-page-size-selector">
                <span>狀態：</span>
                <v-btn
                  :class="endisplayMode === 'table' ? 'report-btn' : 'table-btn'"
                  @click="toggleEnDisplayMode"
                  >{{ endisplayModeText }}</v-btn
                >
              </div>

              <!-- 第二個區塊 -->
              <div
                v-if="enshowDetails && endisplayMode === 'table'"
                class="py-2 d-flex justify-center"
              >
                <v-btn-toggle mandatory v-model="entimeMode" class="time-toggle" variant="outlined">
                  <v-btn value="quarter">季</v-btn>
                  <v-btn value="week">週</v-btn>
                </v-btn-toggle>
              </div>

              <!-- 第三個區塊 -->
              <div v-if="endisplayMode === 'table'">
                <v-btn class="overview-btn" rounded="0" @click="enshowDetails = false">即時</v-btn>
                <v-btn class="details-btn" rounded="0" @click="enshowDetails = true">詳情</v-btn>
              </div>
            </div>
            <!-- 周數據展示 -->
            <div class="div-container" v-if="entimeMode === 'week' && enshowDetails">
              <WeekLoopTable
                :allDateRanges="enpaginatedDateRanges"
                :weekTableData="enpaginatedData"
              />
              <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
            </div>

            <!-- 季數據展示 -->
            <div class="div-container" v-if="entimeMode === 'quarter' && enshowDetails">
              <AllQuarterLoopTable
                :allDateRanges="enpaginatedDateRanges"
                :quarterSummary="enquarterSummary"
                :quarterTableData="enpaginatedData"
              />
              <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
            </div>

            <!-- 即時數據展示 -->
            <div class="div-container" v-if="!enshowDetails && endisplayMode === 'table'">
              <QuarterLoopTable
                :allDateRanges="enpaginatedDateRanges"
                :quarterSummary="enquarterSummary"
                :TableData="enpaginatedData"
              />
              <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import SiteSelectionChart from "@/components/chart/SiteSelectionChart.vue";
import WeekLoopTable from "@/components/table/weekLoopTable.vue";
import AllQuarterLoopTable from "@/components/table/allQuarterLoopTable.vue";
import QuarterLoopTable from "@/components/table/quarterLoopTable.vue";

export default {
  components: {
    WeekLoopTable,
    AllQuarterLoopTable,
    QuarterLoopTable,
    SiteSelectionChart,
  },
  data() {
    return {
      tab: "civil",
      timeMode: "week",
      entimeMode: "week",
      displayMode: "table",
      endisplayMode: "table",
      projectType: "engineering",
      showDetails: false,
      enshowDetails: false,
      weekTableData: [
        { actual: 0, date_range: "2024-01-07 - 2024-01-13", expected: 0.0238, loop_name: "SN1" },
        { actual: 0, date_range: "2024-01-07 - 2024-01-13", expected: 0.0238, loop_name: "SN2" },
        { actual: 0, date_range: "2024-01-14 - 2024-01-20", expected: 0.0476, loop_name: "SN1" },
        { actual: 0, date_range: "2024-01-14 - 2024-01-20", expected: 0.0476, loop_name: "SN2" },
        {
          actual: 0.441,
          date_range: "2024-01-21 - 2024-01-27",
          expected: 0.0714,
          loop_name: "SN1",
        },
        {
          actual: 0.4007,
          date_range: "2024-01-21 - 2024-01-27",
          expected: 0.0714,
          loop_name: "SN2",
        },
        {
          actual: 0.441,
          date_range: "2024-01-28 - 2024-02-03",
          expected: 0.0952,
          loop_name: "SN1",
        },
        {
          actual: 0.4007,
          date_range: "2024-01-28 - 2024-02-03",
          expected: 0.0952,
          loop_name: "SN2",
        },
        { actual: 0.441, date_range: "2024-02-04 - 2024-02-10", expected: 0.119, loop_name: "SN1" },
        {
          actual: 0.4007,
          date_range: "2024-02-04 - 2024-02-10",
          expected: 0.119,
          loop_name: "SN2",
        },
        {
          actual: 0.441,
          date_range: "2024-02-11 - 2024-02-17",
          expected: 0.1429,
          loop_name: "SN1",
        },
        {
          actual: 0.4007,
          date_range: "2024-02-11 - 2024-02-17",
          expected: 0.1429,
          loop_name: "SN2",
        },
        {
          actual: 0.441,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0.1667,
          loop_name: "SN1",
        },
        {
          actual: 0.4007,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0.1667,
          loop_name: "SN2",
        },
        {
          actual: 0.4463,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.1905,
          loop_name: "SN1",
        },
        {
          actual: 0.4081,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.1905,
          loop_name: "SN2",
        },
      ], //周數據
      quarterTableData: [
        {
          actual: 0.4463,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.1905,
          loop_name: "SN1",
          year: 2024,
          quarter: 1,
          week: 9,
        },
        {
          actual: 0.4081,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.1905,
          loop_name: "SN2",
          year: 2024,
          quarter: 1,
          week: 9,
        },
      ], //季數據
      TableData: [
        {
          actual: 0.4463,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.1905,
          loop_name: "SN1",
          year: 2024,
          quarter: 1,
          week: 9,
        },
        {
          actual: 0.4081,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.1905,
          loop_name: "SN2",
          year: 2024,
          quarter: 1,
          week: 9,
        },
      ],
      civilweekTableData: [
        { actual: 0, date_range: "2024-01-07 - 2024-01-13", expected: 0.0476, loop_name: "SN1" },
        { actual: 0, date_range: "2024-01-07 - 2024-01-13", expected: 0.0476, loop_name: "SN2" },
        { actual: 0, date_range: "2024-01-14 - 2024-01-20", expected: 0.0952, loop_name: "SN1" },
        { actual: 0, date_range: "2024-01-14 - 2024-01-20", expected: 0.0952, loop_name: "SN2" },
        {
          actual: 0.8819,
          date_range: "2024-01-21 - 2024-01-27",
          expected: 0.1429,
          loop_name: "SN1",
        },
        {
          actual: 0.8013,
          date_range: "2024-01-21 - 2024-01-27",
          expected: 0.1429,
          loop_name: "SN2",
        },
        {
          actual: 0.8819,
          date_range: "2024-01-28 - 2024-02-03",
          expected: 0.1905,
          loop_name: "SN1",
        },
        {
          actual: 0.8013,
          date_range: "2024-01-28 - 2024-02-03",
          expected: 0.1905,
          loop_name: "SN2",
        },
        {
          actual: 0.8819,
          date_range: "2024-02-04 - 2024-02-10",
          expected: 0.2381,
          loop_name: "SN1",
        },
        {
          actual: 0.8013,
          date_range: "2024-02-04 - 2024-02-10",
          expected: 0.2381,
          loop_name: "SN2",
        },
        {
          actual: 0.8819,
          date_range: "2024-02-11 - 2024-02-17",
          expected: 0.2857,
          loop_name: "SN1",
        },
        {
          actual: 0.8013,
          date_range: "2024-02-11 - 2024-02-17",
          expected: 0.2857,
          loop_name: "SN2",
        },
        {
          actual: 0.8819,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0.3333,
          loop_name: "SN1",
        },
        {
          actual: 0.8013,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0.3333,
          loop_name: "SN2",
        },
        {
          actual: 0.8926,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.381,
          loop_name: "SN1",
        },
        {
          actual: 0.8162,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.381,
          loop_name: "SN2",
        },
      ], //周數據
      civilquarterTableData: [
        {
          actual: 0.8926,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.381,
          loop_name: "SN1",
          year: 2024,
          quarter: 1,
          week: 9,
        },
        {
          actual: 0.8162,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.381,
          loop_name: "SN2",
          year: 2024,
          quarter: 1,
          week: 9,
        },
      ], //季數據
      civilTableData: [
        {
          actual: 0.8926,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.381,
          loop_name: "SN1",
          year: 2024,
          quarter: 1,
          week: 9,
        },
        {
          actual: 0.8162,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.381,
          loop_name: "SN2",
          year: 2024,
          quarter: 1,
          week: 9,
        },
      ],
      currentPage: 1,
      perPage: 3,
      chartData: {
        labels: [],
        datasets: [],
      },
      enchartData: {
        labels: [],
        datasets: [],
      },
    };
  },
  watch: {
    endisplayMode() {
      this.enupdateChartData();
    },
    entimeMode() {
      this.enupdateChartData();
    },
    enshowDetails() {
      this.enupdateChartData();
    },
    displayMode() {
      this.updateChartData();
    },
    timeMode() {
      this.updateChartData();
    },
    showDetails() {
      this.updateChartData();
    },
  },
  async created() {
    this.selectedPlan = this.$route.query.Plan;
    this.selectedProject = this.$route.query.Project;
  },
  mounted() {
    this.updateChartData();
    this.enupdateChartData();
  },
  computed: {
    displayModeText() {
      return this.displayMode === "table" ? "表格" : "報表";
    },
    endisplayModeText() {
      return this.endisplayMode === "table" ? "表格" : "報表";
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
    enorganizedLoopsData() {
      const enorganizedData = [];
      const tempMap = new Map();

      let dataSource = [];
      if (this.tab === "civil") {
        if (!this.enshowDetails) {
          dataSource = this.civilTableData;
        } else {
          if (this.entimeMode === "quarter") {
            dataSource = this.civilquarterTableData;
          } else if (this.entimeMode === "week") {
            dataSource = this.civilweekTableData;
          }
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
        enorganizedData.push(value);
      });

      return enorganizedData;
    },
    enallDateRanges() {
      const ranges = new Set();
      this.enorganizedLoopsData.forEach((item) => {
        item.date_ranges.forEach((range) => {
          ranges.add(range.date_range);
        });
      });

      return Array.from(ranges);
    },
    enpaginatedDateRanges() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.enallDateRanges.slice(start, end);
    },
    enquarterSummary() {
      let data = this.enorganizedLoopsData;
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
    enpaginatedData() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      const data = this.enorganizedLoopsData.map((loop) => ({
        ...loop,
        date_ranges: loop.date_ranges.slice(start, end),
      }));
      console.log(data);
      return data;
    },
  },
  methods: {
    scrollToSection(refName) {
      const element = this.$refs[refName];
      if (element) {
        const top = element.offsetTop - 100; // 减去50像素的偏移量
        window.scrollTo({
          top: top,
          behavior: "smooth",
        });
      }
    },
    // 切換顯示模式
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
    // 切換項目類型
    toggleProjectType() {
      this.projectType = this.projectType === "engineering" ? "bank" : "engineering";
    },
    formatPercentage(value) {
      return `${(Number(value) * 100).toFixed(2)}%`;
    },
    toggleEnDisplayMode() {
      if (this.endisplayMode === "table") {
        this.enpreviousTimeMode = this.entimeMode;
        this.enpreviousShowDetails = this.enshowDetails;

        this.endisplayMode = "report";
      } else {
        this.endisplayMode = "table";

        this.entimeMode = this.enpreviousTimeMode;
        this.enshowDetails = this.enpreviousShowDetails;
      }
    },
    generateChartData() {
      const currentYear = new Date().getFullYear();
      const filteredData = this.TableData.filter((item) => item.year === currentYear);

      const uniqueQuarters = new Set(filteredData.map((item) => `Q${item.quarter}`));
      const labels = Array.from(uniqueQuarters).sort();

      const datasetMap = new Map();

      filteredData.forEach((item) => {
        const label = `Q${item.quarter}`;
        const loopName = item.loop_name;

        if (!datasetMap.has(loopName)) {
          datasetMap.set(loopName, {
            actual: Array(labels.length).fill(null),
            expected: Array(labels.length).fill(null),
          });
        }

        const loopData = datasetMap.get(loopName);

        const index = labels.indexOf(label);
        if (index !== -1) {
          loopData.actual[index] = item.actual * 100;
          loopData.expected[index] = item.expected * 100;
        }
      });

      const colorPairs = [
        { color: "rgba(255, 99, 132, 0.2)" },
        { color: "rgba(75, 192, 192, 0.2)" },
        { color: "rgba(255, 206, 86, 0.2)" },
      ];
      let colorIndex = 0;

      const datasets = [];
      datasetMap.forEach((data, loopName) => {
        const color = colorPairs[colorIndex++ % colorPairs.length].color;
        datasets.push({
          label: `${loopName} Actual`,
          data: data.actual,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderWidth: 5,
        });
        datasets.push({
          label: `${loopName} Expected`,
          data: data.expected,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderDash: [5, 5],
        });
      });

      return {
        labels,
        datasets,
      };
    },
    generateyearChartData() {
      const currentYear = new Date().getFullYear();
      const filteredData = this.quarterTableData.filter((item) => item.year === currentYear);

      const labels = [
        ...new Set(filteredData.map((item) => `${item.year}Q${item.quarter}`)),
      ].sort();

      const datasetMap = new Map();

      filteredData.forEach((item) => {
        const label = `${item.year}Q${item.quarter}`;
        const loopName = item.loop_name;

        if (!datasetMap.has(loopName)) {
          datasetMap.set(loopName, {
            actual: Array(labels.length).fill(null),
            expected: Array(labels.length).fill(null),
          });
        }

        const loopData = datasetMap.get(loopName);

        const index = labels.indexOf(label);
        if (index !== -1) {
          loopData.actual[index] = item.actual * 100;
          loopData.expected[index] = item.expected * 100;
        }
      });

      const colorPairs = [
        { color: "rgba(255, 99, 132, 0.2)" },
        { color: "rgba(75, 192, 192, 0.2)" },
        { color: "rgba(255, 206, 86, 0.2)" },
      ];
      let colorIndex = 0;

      const datasets = [];
      datasetMap.forEach((data, loopName) => {
        const color = colorPairs[colorIndex++ % colorPairs.length].color;
        datasets.push({
          label: `${loopName} Actual`,
          data: data.actual,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderWidth: 5,
        });
        datasets.push({
          label: `${loopName} Expected`,
          data: data.expected,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderDash: [5, 5],
        });
      });

      return {
        labels,
        datasets,
      };
    },
    generatedaterangeChartData() {
      const currentYear = new Date().getFullYear();
      const filteredData = this.weekTableData;

      const labels = [...new Set(filteredData.map((item) => item.date_range))].sort();

      const datasetMap = new Map();

      filteredData.forEach((item) => {
        const label = item.date_range;
        const loopName = item.loop_name;

        if (!datasetMap.has(loopName)) {
          datasetMap.set(loopName, {
            actual: Array(labels.length).fill(null),
            expected: Array(labels.length).fill(null),
          });
        }

        const loopData = datasetMap.get(loopName);
        const index = labels.indexOf(label);
        if (index !== -1) {
          loopData.actual[index] = item.actual * 100;
          loopData.expected[index] = item.expected * 100;
        }
      });

      const colorPairs = [
        { color: "rgba(255, 99, 132, 0.2)" }, // Red
        { color: "rgba(75, 192, 192, 0.2)" }, // Green
        { color: "rgba(255, 206, 86, 0.2)" }, // Yellow
        { color: "rgba(153, 102, 255, 0.2)" }, // Purple
        { color: "rgba(255, 159, 64, 0.2)" }, // Orange
        { color: "rgba(54, 162, 235, 0.2)" }, // Blue
        { color: "rgba(104, 132, 245, 0.2)" }, // Light blue
        { color: "rgba(164, 206, 78, 0.2)" }, // Light green
        { color: "rgba(215, 86, 255, 0.2)" }, // Magenta
      ];
      let colorIndex = 0;

      const datasets = [];
      datasetMap.forEach((data, loopName) => {
        const color = colorPairs[colorIndex++ % colorPairs.length].color;
        datasets.push({
          label: `${loopName} Actual`,
          data: data.actual,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderWidth: 5,
        });
        datasets.push({
          label: `${loopName} Expected`,
          data: data.expected,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderDash: [5, 5],
        });
      });

      return {
        labels,
        datasets,
      };
    },
    updateChartData() {
      if (!this.showDetails) {
        this.chartData = this.generateChartData();
      } else {
        if (this.timeMode === "quarter") {
          this.chartData = this.generateyearChartData();
        } else if (this.timeMode === "week") {
          this.chartData = this.generatedaterangeChartData();
        }
      }
    },
    engenerateChartData() {
      const currentYear = new Date().getFullYear();
      const filteredData = this.civilTableData.filter((item) => item.year === currentYear);

      const uniqueQuarters = new Set(filteredData.map((item) => `Q${item.quarter}`));
      const labels = Array.from(uniqueQuarters).sort();

      const datasetMap = new Map();

      filteredData.forEach((item) => {
        const label = `Q${item.quarter}`;
        const loopName = item.loop_name;

        if (!datasetMap.has(loopName)) {
          datasetMap.set(loopName, {
            actual: Array(labels.length).fill(null),
            expected: Array(labels.length).fill(null),
          });
        }

        const loopData = datasetMap.get(loopName);

        const index = labels.indexOf(label);
        if (index !== -1) {
          loopData.actual[index] = item.actual * 100;
          loopData.expected[index] = item.expected * 100;
        }
      });

      const colorPairs = [
        { color: "rgba(255, 99, 132, 0.2)" },
        { color: "rgba(75, 192, 192, 0.2)" },
        { color: "rgba(255, 206, 86, 0.2)" },
      ];
      let colorIndex = 0;

      const datasets = [];
      datasetMap.forEach((data, loopName) => {
        const color = colorPairs[colorIndex++ % colorPairs.length].color;
        datasets.push({
          label: `${loopName} Actual`,
          data: data.actual,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderWidth: 5,
        });
        datasets.push({
          label: `${loopName} Expected`,
          data: data.expected,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderDash: [5, 5],
        });
      });

      return {
        labels,
        datasets,
      };
    },
    engenerateyearChartData() {
      const currentYear = new Date().getFullYear();
      const filteredData = this.civilquarterTableData.filter((item) => item.year === currentYear);

      const labels = [
        ...new Set(filteredData.map((item) => `${item.year}Q${item.quarter}`)),
      ].sort();

      const datasetMap = new Map();

      filteredData.forEach((item) => {
        const label = `${item.year}Q${item.quarter}`;
        const loopName = item.loop_name;

        if (!datasetMap.has(loopName)) {
          datasetMap.set(loopName, {
            actual: Array(labels.length).fill(null),
            expected: Array(labels.length).fill(null),
          });
        }

        const loopData = datasetMap.get(loopName);

        const index = labels.indexOf(label);
        if (index !== -1) {
          loopData.actual[index] = item.actual * 100;
          loopData.expected[index] = item.expected * 100;
        }
      });

      const colorPairs = [
        { color: "rgba(255, 99, 132, 0.2)" },
        { color: "rgba(75, 192, 192, 0.2)" },
        { color: "rgba(255, 206, 86, 0.2)" },
      ];
      let colorIndex = 0;

      const datasets = [];
      datasetMap.forEach((data, loopName) => {
        const color = colorPairs[colorIndex++ % colorPairs.length].color;
        datasets.push({
          label: `${loopName} Actual`,
          data: data.actual,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderWidth: 5,
        });
        datasets.push({
          label: `${loopName} Expected`,
          data: data.expected,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderDash: [5, 5],
        });
      });

      return {
        labels,
        datasets,
      };
    },
    engeneratedaterangeChartData() {
      const currentYear = new Date().getFullYear();
      const filteredData = this.civilweekTableData;

      const labels = [...new Set(filteredData.map((item) => item.date_range))].sort();

      const datasetMap = new Map();

      filteredData.forEach((item) => {
        const label = item.date_range;
        const loopName = item.loop_name;

        if (!datasetMap.has(loopName)) {
          datasetMap.set(loopName, {
            actual: Array(labels.length).fill(null),
            expected: Array(labels.length).fill(null),
          });
        }

        const loopData = datasetMap.get(loopName);
        const index = labels.indexOf(label);
        if (index !== -1) {
          loopData.actual[index] = item.actual * 100;
          loopData.expected[index] = item.expected * 100;
        }
      });

      const colorPairs = [
        { color: "rgba(255, 99, 132, 0.2)" }, // Red
        { color: "rgba(75, 192, 192, 0.2)" }, // Green
        { color: "rgba(255, 206, 86, 0.2)" }, // Yellow
        { color: "rgba(153, 102, 255, 0.2)" }, // Purple
        { color: "rgba(255, 159, 64, 0.2)" }, // Orange
        { color: "rgba(54, 162, 235, 0.2)" }, // Blue
        { color: "rgba(104, 132, 245, 0.2)" }, // Light blue
        { color: "rgba(164, 206, 78, 0.2)" }, // Light green
        { color: "rgba(215, 86, 255, 0.2)" }, // Magenta
      ];
      let colorIndex = 0;

      const datasets = [];
      datasetMap.forEach((data, loopName) => {
        const color = colorPairs[colorIndex++ % colorPairs.length].color;
        datasets.push({
          label: `${loopName} Actual`,
          data: data.actual,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderWidth: 5,
        });
        datasets.push({
          label: `${loopName} Expected`,
          data: data.expected,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderDash: [5, 5],
        });
      });

      return {
        labels,
        datasets,
      };
    },
    enupdateChartData() {
      if (!this.enshowDetails) {
        this.enchartData = this.engenerateChartData();
      } else {
        if (this.entimeMode === "quarter") {
          this.enchartData = this.engenerateyearChartData();
        } else if (this.timeMode === "week") {
          this.enchartData = this.engeneratedaterangeChartData();
        }
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
