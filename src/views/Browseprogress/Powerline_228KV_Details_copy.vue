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
        <v-btn
          v-if="projectType === 'engineering'"
          class="custom-btn"
          @click="scrollToSection('engineeringSection')"
        >
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
      <WeekLoopTable :allDateRanges="allDateRanges" :weekTableData="weekTableData" />
      <!-- 分頁組件 -->
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        :total-visible="7"
        @input="fetchData"
      ></v-pagination>
    </div>

    <!-- 季數據展示 -->
    <!-- <div
      class="div-container"
      v-if="timeMode === 'quarter' && showDetails && displayMode === 'table'"
    >
      <AllQuarterLoopTable
        :allDateRanges="paginatedDateRanges"
        :quarterSummary="quarterSummary"
        :quarterTableData="paginatedData"
      />
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
    </div> -->

    <!-- 即時數據展示 -->
    <!-- <div class="div-container" v-if="!showDetails && displayMode === 'table'">
      <QuarterLoopTable
        :allDateRanges="paginatedDateRanges"
        :quarterSummary="quarterSummary"
        :TableData="paginatedData"
      />
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
    </div> -->

    <!-- 案場即時報表展示 -->
    <!-- <div
      class="div-container report-container"
      v-if="displayMode === 'report' && !showDetails"
      style="background-color: white; display: flex; height: 100%"
    >
      <SiteSelectionChart :chartData="chartData" />
    </div> -->

    <!-- 案場所有季報表展示 -->
    <!-- <div
      class="div-container report-container"
      v-if="displayMode === 'report' && showDetails && timeMode === 'quarter'"
      style="background-color: white; display: flex; height: 100%"
    >
      <SiteSelectionChart :chartData="chartData" />
    </div> -->

    <!-- 案場所有周報表展示 -->
    <!-- <div
      class="div-container report-container"
      v-if="displayMode === 'report' && showDetails && timeMode === 'week'"
      style="background-color: white; display: flex; height: 100%"
    >
      <SiteSelectionChart :chartData="chartData" />
    </div> -->

    <!-- 子標題 -->
    <!-- <div
      class="mb-3"
      ref="engineeringSection"
      style="padding-left: 20px; display: flex; align-items: center"
    >
      <v-icon color="blue">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽土木/纜線工程進度：</span>
    </div> -->

    <!-- <v-card v-if="displayMode === 'table'" class="div-container-1" outlined>
      <v-tabs v-model="tab" bg-color="indigo-darken-2" slider-color="yellow" show-arrows>
        <v-tab style="font-weight: bold" value="civil">土木工程</v-tab>
        <v-tab style="font-weight: bold" value="cable">纜線工程</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="civil">
            <div class="function-row">
              <div class="status-and-page-size-selector">
                <span>狀態：</span>
                <v-btn
                  :class="endisplayMode === 'table' ? 'report-btn' : 'table-btn'"
                  @click="toggleEnDisplayMode"
                  >{{ endisplayModeText }}</v-btn
                >
              </div>

              <div
                v-if="enshowDetails && endisplayMode === 'table'"
                class="py-2 d-flex justify-center"
              >
                <v-btn-toggle mandatory v-model="entimeMode" class="time-toggle" variant="outlined">
                  <v-btn value="quarter">季</v-btn>
                  <v-btn value="week">週</v-btn>
                </v-btn-toggle>
              </div>

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
            </div> -->
    <!-- <div
              class="div-container"
              v-if="entimeMode === 'week' && enshowDetails && endisplayMode === 'table'"
            >
              <WeekLoopTable
                :allDateRanges="enpaginatedDateRanges"
                :weekTableData="enpaginatedData"
              />
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="7"
                @input="fetchenData"
              ></v-pagination>
            </div> -->

    <!-- <div
              class="div-container"
              v-if="entimeMode === 'quarter' && enshowDetails && endisplayMode === 'table'"
            >
              <AllQuarterLoopTable
                :allDateRanges="enpaginatedDateRanges"
                :quarterSummary="enquarterSummary"
                :quarterTableData="enpaginatedData"
              />
              <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
            </div> -->

    <!-- 即時數據展示 -->
    <!-- <div class="div-container" v-if="!enshowDetails && endisplayMode === 'table'">
              <QuarterLoopTable
                :allDateRanges="enpaginatedDateRanges"
                :quarterSummary="enquarterSummary"
                :TableData="enpaginatedData"
              />
              <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
            </div> -->

    <!-- 案場即時報表展示 -->
    <!-- <div
              class="div-container report-container"
              v-if="endisplayMode === 'report' && !enshowDetails"
              style="background-color: white; display: flex; height: 100%"
            >
              <SiteSelectionChart :chartData="enchartData" />
            </div> -->

    <!-- 案場所有季報表展示 -->
    <!-- <div
              class="div-container report-container"
              v-if="endisplayMode === 'report' && enshowDetails && entimeMode === 'quarter'"
              style="background-color: white; display: flex; height: 100%"
            >
              <SiteSelectionChart :chartData="enchartData" />
            </div> -->

    <!-- 案場所有周報表展示 -->
    <!-- <div
              class="div-container report-container"
              v-if="endisplayMode === 'report' && enshowDetails && entimeMode === 'week'"
              style="background-color: white; display: flex; height: 100%"
            >
              <SiteSelectionChart :chartData="enchartData" />
            </div> -->
    <!-- </v-window-item>
          <v-window-item value="cable">
            <div class="function-row">
              <div class="status-and-page-size-selector">
                <span>狀態：</span>
                <v-btn
                  :class="endisplayMode === 'table' ? 'report-btn' : 'table-btn'"
                  @click="toggleEnDisplayMode"
                  >{{ endisplayModeText }}</v-btn
                >
              </div>

              <div
                v-if="enshowDetails && endisplayMode === 'table'"
                class="py-2 d-flex justify-center"
              >
                <v-btn-toggle mandatory v-model="entimeMode" class="time-toggle" variant="outlined">
                  <v-btn value="quarter">季</v-btn>
                  <v-btn value="week">週</v-btn>
                </v-btn-toggle>
              </div>

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
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card> -->
  </v-container>
</template>

<script>
import SiteSelectionChart from "@/components/chart/SiteSelectionChart.vue";
import WeekLoopTable from "@/components/table/weekLoopTable.vue";
import AllQuarterLoopTable from "@/components/table/allQuarterLoopTable.vue";
import QuarterLoopTable from "@/components/table/quarterLoopTable.vue";
import { fetchCivilWeekTableData, fetchWeekTableData } from "@/api/voltage228kProjectService";

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
      selectedProject: null,
      showDetails: false,
      enshowDetails: false,
      weekTableData: [],
      quarterTableData: [],
      TableData: [],
      civilWeekTableData: [],
      civilQuarterTableData: [],
      civilTableData: [],
      cableWeekTableData: [],
      cableQuarterTableData: [],
      cableTableData: [],
      itemsPerPage: 3,
      currentPage: 1, //當前頁面
      totalPages: 0, // 總頁數
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
    showDetails: "fetchData",
    currentPage: "fetchData",
    projectType: "fetchData",
    timeMode: "fetchData",
    displayMode: "fetchData",
  },
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
      this.$router.go(-1);
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
        const { loop_name, date_range, actual, expected, year, quarter, week } = item;

        if (!tempMap.has(loop_name)) {
          tempMap.set(loop_name, { loop_name, date_ranges: [] });
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

      tempMap.forEach((value) => {
        organizedData.push(value);
      });
      console.log(organizedData);
      return organizedData;
    },
    async fetchData() {
      try {
        console.log(this.selectedProject, this.currentPage, this.itemsPerPage, this.projectType);

        let response;
        let responsechart;
        if (!this.showDetails) {
        } else if (this.showDetails && this.timeMode === "week") {
          response = await fetchWeekTableData(
            this.selectedProject,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          console.log(response.data.results);
          this.weekTableData = this.organizeTableData(response.data.results);
        } else if (this.showDetails && this.timeMode === "quarter") {
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
    async fetchData() {
      try {
        console.log(this.selectedProject, this.currentPage, this.itemsPerPage, this.projectType);

        let response;
        let responsechart;
        if (!this.showDetails) {
        } else if (this.showDetails && this.timeMode === "week") {
          response = await fetchWeekTableData(
            this.selectedProject,
            this.currentPage,
            this.itemsPerPage,
            this.projectType
          );
          console.log(response.data.results);
          this.weekTableData = this.organizeTableData(response.data.results);
        } else if (this.showDetails && this.timeMode === "quarter") {
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
