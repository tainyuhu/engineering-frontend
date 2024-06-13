<template>
  <v-container>
    <!-- 標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue" @click="goBack">mdi-chevron-left-box</v-icon>
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
        <v-btn class="custom-btn" @click="scrollToSection('engineeringSection')">
          土木/纜線進度
        </v-btn>
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

    <!-- 子標題 -->
    <div
      class="mb-3"
      ref="engineeringSection"
      style="padding-left: 20px; display: flex; align-items: center"
      v-if="displayMode === 'table'"
    >
      <v-icon color="blue">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽土木/纜線工程進度：</span>
    </div>

    <v-card v-if="displayMode === 'table'" class="div-container-1" outlined>
      <v-tabs v-model="tab" bg-color="indigo-darken-2" color="#ffc107" show-arrows>
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
                <v-btn
                  :class="projectType === 'engineering' ? 'bank-btn' : 'engineering-btn'"
                  @click="toggleProjectType"
                  >{{ projectTypeText }}</v-btn
                >
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
                :weekTableData="enweekTableData"
                :percentagedata="percentageData"
              />

              <!-- 分頁組件 -->
              <v-pagination
                v-model="encurrentPage"
                :length="entotalPages"
                :total-visible="7"
                @input="fetchenData"
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
                :quarterTableData="enquarterTableData"
                :percentagedata="percentageData"
              />
              <!-- 分頁組件 -->
              <v-pagination
                v-model="encurrentPage"
                :length="entotalPages"
                :total-visible="7"
                @input="fetchenData"
              ></v-pagination>
            </div>

            <!-- 即時數據展示 -->
            <div class="div-container" v-if="!enshowDetails && endisplayMode === 'table'">
              <QuarterLoopTable
                :allDateRanges="enallDateRanges"
                :quarterSummary="enquarterSummary"
                :TableData="enTableData"
                :percentagedata="percentageData"
              />
              <!-- 分頁組件 -->
              <v-pagination
                v-model="encurrentPage"
                :length="entotalPages"
                :total-visible="7"
                @input="fetchenData"
              ></v-pagination>
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
                :weekTableData="enweekTableData"
                :percentagedata="percentageData"
              />

              <!-- 分頁組件 -->
              <v-pagination
                v-model="encurrentPage"
                :length="entotalPages"
                :total-visible="7"
                @input="fetchenData"
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
                :quarterTableData="enquarterTableData"
                :percentagedata="percentageData"
              />

              <!-- 分頁組件 -->
              <v-pagination
                v-model="encurrentPage"
                :length="entotalPages"
                :total-visible="7"
                @input="fetchenData"
              ></v-pagination>
            </div>

            <!-- 即時數據展示 -->
            <div class="div-container" v-if="!enshowDetails && endisplayMode === 'table'">
              <QuarterLoopTable
                :allDateRanges="enallDateRanges"
                :quarterSummary="enquarterSummary"
                :TableData="enTableData"
                :percentagedata="percentageData"
              />
              <!-- 分頁組件 -->
              <v-pagination
                v-model="encurrentPage"
                :length="entotalPages"
                :total-visible="7"
                @input="fetchenData"
              ></v-pagination>
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
import { fetchGetProjectPercentageDataView } from "@/api/planService";
import {
  fetchWeekTableData,
  fetchQuarterTableData,
  fetchTableData,
  fetchQuarterChartData,
  fetchAllQuarterChartData,
  fetchWeekChartData,
  fetchCivilWeekTableData,
  fetchCivilAllQuarterTableData,
  fetchCivilQuarterTableData,
  fetchCivilQuarterChartData,
  fetchCivilAllQuarterChartData,
  fetchCivilWeekChartData,
  fetchCableWeekTableData,
  fetchCableAllQuarterTableData,
  fetchCableQuarterTableData,
  fetchCableQuarterChartData,
  fetchCableAllQuarterChartData,
  fetchCableWeekChartData,
} from "@/api/voltage228kProjectService";

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
      selectedPlan: null,
      selectedProject: null,
      projectType: "bank",
      showDetails: false,
      enshowDetails: false,
      weekTableData: [], //周數據
      quarterTableData: [], //季數據
      TableData: [],
      enweekTableData: [], //周數據
      enquarterTableData: [], //季數據
      enTableData: [], //即時數據
      currentPage: 1,
      perPage: 3,
      itemsPerPage: 3,
      totalPages: 0, // 總頁數
      encurrentPage: 1,
      enperPage: 3,
      enitemsPerPage: 3,
      entotalPages: 0, // 總頁數
      chartData: {
        labels: [],
        datasets: [],
      },
      enchartData: {
        labels: [],
        datasets: [],
      },
      percentageData: [],
    };
  },
  watch: {
    tab: "fetchenData",
    enshowDetails: "fetchenData",
    encurrentPage: "fetchenData",
    enprojectType: "fetchenData",
    entimeMode: "fetchenData",

    showDetails: "fetchData",
    currentPage: "fetchData",
    projectType: "fetchData",
    timeMode: "fetchData",
  },
  async created() {
    this.selectedPlan = this.$route.query.Plan;
    this.selectedProject = this.$route.query.Project;

    await this.fetchData();
    await this.fetchenData();
  },
  computed: {
    displayModeText() {
      return this.displayMode === "table" ? "表格" : "報表";
    },
    projectTypeText() {
      return this.projectType === "engineering" ? "工程" : "銀行";
    },
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
        this.enweekTableData.forEach((item) => {
          item.date_ranges.forEach((range) => {
            ranges.add(range.date_range);
          });
        });
      } else if (this.entimeMode === "quarter") {
        this.enquarterTableData.forEach((item) => {
          item.date_ranges.forEach((range) => {
            ranges.add(range.date_range);
          });
        });
      }
      return Array.from(ranges);
    },
    enquarterSummary() {
      let data = this.enshowDetails ? this.enquarterTableData : this.enTableData;
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
          actual_lag_status,
          expected_lag_status,
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

      console.log(organizedData);
      return organizedData;
    },
    async fetchenData() {
      if (!this.selectedProject) return;
      this.isLoading = true;
      try {
        let response;
        let responsechart;
        const fetchDataFunc =
          this.tab === "civil"
            ? {
                quarterTableData: fetchCivilQuarterTableData,
                weekTableData: fetchCivilWeekTableData,
                allQuarterTableData: fetchCivilAllQuarterTableData,
                quarterChartData: fetchCivilQuarterChartData,
                allQuarterChartData: fetchCivilAllQuarterChartData,
                weekChartData: fetchCivilWeekChartData,
              }
            : {
                quarterTableData: fetchCableQuarterTableData,
                weekTableData: fetchCableWeekTableData,
                allQuarterTableData: fetchCableAllQuarterTableData,
                quarterChartData: fetchCableQuarterChartData,
                allQuarterChartData: fetchCableAllQuarterChartData,
                weekChartData: fetchCableWeekChartData,
              };

        if (!this.enshowDetails) {
          response = await fetchDataFunc.quarterTableData(
            this.selectedProject,
            this.encurrentPage,
            this.enitemsPerPage,
            this.projectType
          );
          this.enTableData = this.organizeTableData(response.data.results);
          responsechart = await fetchDataFunc.quarterChartData(
            this.selectedProject,
            this.projectType
          );
          this.enchartData = responsechart.data;
        } else if (this.enshowDetails && this.entimeMode === "week") {
          response = await fetchDataFunc.weekTableData(
            this.selectedProject,
            this.encurrentPage,
            this.enitemsPerPage,
            this.projectType
          );
          this.enweekTableData = this.organizeTableData(response.data.results);
          responsechart = await fetchDataFunc.weekChartData(
            this.selectedProject,
            this.encurrentPage,
            this.enitemsPerPage,
            this.projectType
          );
          this.enchartData = responsechart.data;
        } else if (this.enshowDetails && this.entimeMode === "quarter") {
          response = await fetchDataFunc.allQuarterTableData(
            this.selectedProject,
            this.encurrentPage,
            this.enitemsPerPage,
            this.projectType
          );
          this.enquarterTableData = this.organizeTableData(response.data.results);
          responsechart = await fetchDataFunc.allQuarterChartData(
            this.selectedProject,
            this.projectType
          );
          this.enchartData = responsechart.data;
        } else {
          console.error("Invalid time mode:", this.entimeMode);
          return;
        }
        this.entotalPages = response.data.totalPages;
      } catch (error) {
        console.error("Error fetching data:", error);
        this.enweekTableData = [];
        this.enquarterTableData = [];
        this.enTableData = [];
      } finally {
        this.isLoading = false;
      }
    },
    async fetchData() {
      if (!this.selectedProject) return;
      this.isLoading = true;
      try {
        let response;
        let responsechart;
        let percentageDataresponse;

        percentageDataresponse = await fetchGetProjectPercentageDataView(this.selectedProject);
        this.percentageData = percentageDataresponse.data;
        if (!this.showDetails) {
          response = await fetchTableData(
            this.selectedProject,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          this.TableData = this.organizeTableData(response.data.results);
          responsechart = await fetchQuarterChartData(this.selectedProject, this.projectType);
          this.chartData = responsechart.data;
        } else if (this.showDetails && this.timeMode === "week") {
          response = await fetchWeekTableData(
            this.selectedProject,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          this.weekTableData = this.organizeTableData(response.data.results);
          console.log("weekTableData", this.weekTableData);
          responsechart = await fetchWeekChartData(
            this.selectedProject,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          this.chartData = responsechart.data;
        } else if (this.showDetails && this.timeMode === "quarter") {
          response = await fetchQuarterTableData(
            this.selectedProject,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          this.quarterTableData = this.organizeTableData(response.data.results);
          responsechart = await fetchAllQuarterChartData(this.selectedProject, this.projectType);
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
        this.TableData = [];
      } finally {
        this.isLoading = false;
      }
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
