<template>
  <v-container>
    <!-- 標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue" @click="goBack">mdi-chevron-left-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽Re-financing工程進度：</span>
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
      <WeekProjectTable
        :allDateRanges="paginatedDateRanges"
        :weekTableData="paginatedData"
        :percentagedata="percentageData"
      />
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
    </div>

    <!-- 季數據展示 -->
    <div
      class="div-container"
      v-if="timeMode === 'quarter' && showDetails && displayMode === 'table'"
    >
      <AllQuarterProjectTable
        :allDateRanges="paginatedDateRanges"
        :quarterSummary="quarterSummary"
        :quarterTableData="paginatedData"
        :percentagedata="percentageData"
      />
      <v-pagination v-model="currentPage" :length="totalPages"></v-pagination>
    </div>

    <!-- 即時數據展示 -->
    <div class="div-container" v-if="!showDetails && displayMode === 'table'">
      <QuarterProjectTable
        :allDateRanges="paginatedDateRanges"
        :quarterSummary="quarterSummary"
        :TableData="paginatedData"
        :percentagedata="percentageData"
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
  </v-container>
</template>

<script>
import SiteSelectionChart from "@/components/chart/SiteSelectionChart.vue";
import WeekProjectTable from "@/components/table/weekProjectTable.vue";
import AllQuarterProjectTable from "@/components/table/allQuarterProjectTable.vue";
import QuarterProjectTable from "@/components/table/quarterProjectTable.vue";

export default {
  props: ["masterId"],
  components: {
    SiteSelectionChart,
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
          actual: 0.8257,
          construction_status: 2,
          date_range: "2023-12-30 - 2024-01-06",
          expected: 0.75,
          project_name: "Phase1",
        },
        {
          actual: 0.0153,
          construction_status: 2,
          date_range: "2023-12-30 - 2024-01-06",
          expected: 0.0093,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2023-12-30 - 2024-01-06",
          expected: 0.9048,
          project_name: "三小案",
        },

        {
          actual: 0.8342,
          construction_status: 2,
          date_range: "2024-01-07 - 2024-01-13",
          expected: 0.8175,
          project_name: "Phase1",
        },
        {
          actual: 0.0153,
          construction_status: 2,
          date_range: "2024-01-07 - 2024-01-13",
          expected: 0.0103,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-01-07 - 2024-01-13",
          expected: 0.95,
          project_name: "三小案",
        },

        {
          actual: 0.8462,
          construction_status: 2,
          date_range: "2024-01-14 - 2024-01-20",
          expected: 0.87,
          project_name: "Phase1",
        },
        {
          actual: 0.0175,
          construction_status: 2,
          date_range: "2024-01-14 - 2024-01-20",
          expected: 0.0113,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-01-14 - 2024-01-20",
          expected: 0.9743,
          project_name: "三小案",
        },

        {
          actual: 0.863,
          construction_status: 2,
          date_range: "2024-01-21 - 2024-01-27",
          expected: 0.909,
          project_name: "Phase1",
        },
        {
          actual: 0.0273,
          construction_status: 2,
          date_range: "2024-01-21 - 2024-01-27",
          expected: 0.0124,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-01-21 - 2024-01-27",
          expected: 0.987,
          project_name: "三小案",
        },

        {
          actual: 0.8735,
          construction_status: 2,
          date_range: "2024-01-28 - 2024-02-03",
          expected: 0.9372,
          project_name: "Phase1",
        },
        {
          actual: 0.0273,
          construction_status: 2,
          date_range: "2024-01-28 - 2024-02-03",
          expected: 0.0134,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-01-28 - 2024-02-03",
          expected: 0.9935,
          project_name: "三小案",
        },

        {
          actual: 0.8746,
          construction_status: 2,
          date_range: "2024-02-04 - 2024-02-10",
          expected: 0.9571,
          project_name: "Phase1",
        },
        {
          actual: 0.0273,
          construction_status: 2,
          date_range: "2024-02-04 - 2024-02-10",
          expected: 0.0144,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-02-04 - 2024-02-10",
          expected: 0.9967,
          project_name: "三小案",
        },

        {
          actual: 0.8859,
          construction_status: 2,
          date_range: "2024-02-11 - 2024-02-17",
          expected: 0.9708,
          project_name: "Phase1",
        },
        {
          actual: 0.0273,
          construction_status: 2,
          date_range: "2024-02-11 - 2024-02-17",
          expected: 0.0167,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-02-11 - 2024-02-17",
          expected: 0.9984,
          project_name: "三小案",
        },

        {
          actual: 0.8884,
          construction_status: 2,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0.9803,
          project_name: "Phase1",
        },
        {
          actual: 0.0281,
          construction_status: 2,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0.0183,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-02-18 - 2024-02-24",
          expected: 0.9992,
          project_name: "三小案",
        },

        {
          actual: 0.8925,
          construction_status: 2,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.9867,
          project_name: "Phase1",
        },
        {
          actual: 0.038,
          construction_status: 2,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.0203,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-02-25 - 2024-03-02",
          expected: 0.9996,
          project_name: "三小案",
        },

        {
          actual: 0.8932,
          construction_status: 2,
          date_range: "2024-03-03 - 2024-03-09",
          expected: 0.9911,
          project_name: "Phase1",
        },
        {
          actual: 0.038,
          construction_status: 2,
          date_range: "2024-03-03 - 2024-03-09",
          expected: 0.0227,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-03-03 - 2024-03-09",
          expected: 0.9998,
          project_name: "三小案",
        },

        {
          actual: 0.8944,
          construction_status: 2,
          date_range: "2024-03-10 - 2024-03-16",
          expected: 0.994,
          project_name: "Phase1",
        },
        {
          actual: 0.0421,
          construction_status: 2,
          date_range: "2024-03-10 - 2024-03-16",
          expected: 0.0258,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-03-10 - 2024-03-16",
          expected: 0.9999,
          project_name: "三小案",
        },
        {
          actual: 0.8954,
          construction_status: 2,
          date_range: "2024-03-17 - 2024-03-23",
          expected: 0.996,
          project_name: "Phase1",
        },
        {
          actual: 0.0421,
          construction_status: 2,
          date_range: "2024-03-17 - 2024-03-23",
          expected: 0.0295,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-03-17 - 2024-03-23",
          expected: 0.9999,
          project_name: "三小案",
        },

        {
          actual: 0.8959,
          construction_status: 2,
          date_range: "2024-03-24 - 2024-03-30",
          expected: 0.9973,
          project_name: "Phase1",
        },
        {
          actual: 0.0489,
          construction_status: 2,
          date_range: "2024-03-24 - 2024-03-30",
          expected: 0.0347,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-03-24 - 2024-03-30",
          expected: 0.9999,
          project_name: "三小案",
        },

        {
          actual: 0.8971,
          construction_status: 2,
          date_range: "2024-03-31 - 2024-04-06",
          expected: 0.9982,
          project_name: "Phase1",
        },
        {
          actual: 0.0501,
          construction_status: 2,
          date_range: "2024-03-31 - 2024-04-06",
          expected: 0.0433,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-03-31 - 2024-04-06",
          expected: 0.9999,
          project_name: "三小案",
        },

        {
          actual: 0.8991,
          construction_status: 2,
          date_range: "2024-04-07 - 2024-04-13",
          expected: 0.9988,
          project_name: "Phase1",
        },
        {
          actual: 0.0522,
          construction_status: 2,
          date_range: "2024-04-07 - 2024-04-13",
          expected: 0.0517,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-04-07 - 2024-04-13",
          expected: 0.9999,
          project_name: "三小案",
        },

        {
          actual: 0.8999,
          construction_status: 2,
          date_range: "2024-04-14 - 2024-04-20",
          expected: 0.9992,
          project_name: "Phase1",
        },
        {
          actual: 0.0537,
          construction_status: 2,
          date_range: "2024-04-14 - 2024-04-20",
          expected: 0.0613,
          project_name: "Phase2",
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-04-14 - 2024-04-20",
          expected: 0.9999,
          project_name: "三小案",
        },
      ], //周數據
      quarterTableData: [
        {
          actual: 0.8999,
          construction_status: 2,
          date_range: "2024-04-14 - 2024-04-20",
          expected: 0.9992,
          project_name: "Phase1",
          year: 2024,
          quarter: 2,
          week: 3,
        },
        {
          actual: 0.0537,
          construction_status: 2,
          date_range: "2024-04-14 - 2024-04-20",
          expected: 0.0613,
          project_name: "Phase2",
          year: 2024,
          quarter: 2,
          week: 3,
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-04-14 - 2024-04-20",
          expected: 0.9999,
          project_name: "三小案",
          year: 2024,
          quarter: 2,
          week: 3,
        },
      ], //季數據
      TableData: [
        {
          actual: 0.8999,
          construction_status: 2,
          date_range: "2024-04-14 - 2024-04-20",
          expected: 0.9992,
          project_name: "Phase1",
          year: 2024,
          quarter: 2,
          week: 3,
        },
        {
          actual: 0.0537,
          construction_status: 2,
          date_range: "2024-04-14 - 2024-04-20",
          expected: 0.0613,
          project_name: "Phase2",
          year: 2024,
          quarter: 2,
          week: 3,
        },
        {
          actual: 0.972,
          construction_status: 2,
          date_range: "2024-04-14 - 2024-04-20",
          expected: 0.9999,
          project_name: "三小案",
          year: 2024,
          quarter: 2,
          week: 3,
        },
      ],
      currentPage: 1,
      perPage: 3,
      chartData: {
        labels: [],
        datasets: [],
      },
      percentageData: [
        { project_name: "Phase1", percentage: 0.523622301467742 },
        { project_name: "Phase2", percentage: 0.463854310305556 },
        { project_name: "三小案", percentage: 0.0125233882267015 },
      ],
    };
  },
  watch: {
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
      this.organizedLoopsData.forEach((project) => {
        project.date_ranges.sort(
          (a, b) => new Date(b.date_range.split(" - ")[0]) - new Date(a.date_range.split(" - ")[0])
        );
      });

      const paginatedEntries = this.organizedLoopsData.map((project) => {
        const latestDateRange = [project.date_ranges[0]];

        let additionalDateRanges = [];
        if (this.currentPage === 1) {
          additionalDateRanges = project.date_ranges.slice(1, 3);
        } else {
          const startIndex = 1 + (this.currentPage - 2) * 3 + 2;
          const endIndex = startIndex + 3;
          additionalDateRanges = project.date_ranges.slice(startIndex, endIndex);
        }

        return {
          project_name: project.project_name,
          date_ranges: [...latestDateRange, ...additionalDateRanges],
        };
      });

      return paginatedEntries;
    },
    paginatedDateRanges() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      const dateRanges = this.allDateRanges.sort((a, b) => {
        return new Date(b.split(" - ")[0]) - new Date(a.split(" - ")[0]);
      });

      const latestDateRange = dateRanges[0];
      let paginatedRanges = dateRanges.slice(start, end);

      if (!paginatedRanges.includes(latestDateRange)) {
        paginatedRanges = [latestDateRange, ...paginatedRanges].slice(0, end - start + 1);
      }

      return paginatedRanges;
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
        const {
          project_name,
          construction_status,
          date_range,
          actual,
          expected,
          year,
          quarter,
          week,
        } = item;

        if (!tempMap.has(project_name)) {
          tempMap.set(project_name, { project_name, date_ranges: [] });
        }

        const currentLoop = tempMap.get(project_name);
        let dateRangeObj = currentLoop.date_ranges.find((dr) => dr.date_range === date_range);
        if (!dateRangeObj) {
          dateRangeObj = { date_range, construction_status, records: [], year, quarter, week };
          currentLoop.date_ranges.push(dateRangeObj);
        }

        dateRangeObj.records.push({ actual, expected });
      });

      tempMap.forEach((value) => {
        value.date_ranges.sort((a, b) => {
          const aDate = new Date(a.date_range.split(" - ")[0]);
          const bDate = new Date(b.date_range.split(" - ")[0]);
          return bDate - aDate;
        });
        organizedData.push(value);
      });

      return organizedData;
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
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
    generateChartData() {
      const currentYear = new Date().getFullYear();
      const filteredData = this.TableData.filter((item) => item.year === currentYear);

      const uniqueQuarters = new Set(filteredData.map((item) => `Q${item.quarter}`));
      const labels = Array.from(uniqueQuarters).sort();

      const datasetMap = new Map();

      filteredData.forEach((item) => {
        const label = `Q${item.quarter}`;
        const projectName = item.project_name;

        if (!datasetMap.has(projectName)) {
          datasetMap.set(projectName, {
            actual: Array(labels.length).fill(null),
            expected: Array(labels.length).fill(null),
          });
        }

        const projectData = datasetMap.get(projectName);

        const index = labels.indexOf(label);
        if (index !== -1) {
          projectData.actual[index] = item.actual * 100;
          projectData.expected[index] = item.expected * 100;
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
      datasetMap.forEach((data, projectName) => {
        const color = colorPairs[colorIndex++ % colorPairs.length].color;
        datasets.push({
          label: `${projectName} Actual`,
          data: data.actual,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderWidth: 5,
        });
        datasets.push({
          label: `${projectName} Expected`,
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
        const projectName = item.project_name;

        if (!datasetMap.has(projectName)) {
          datasetMap.set(projectName, {
            actual: Array(labels.length).fill(null),
            expected: Array(labels.length).fill(null),
          });
        }

        const projectData = datasetMap.get(projectName);

        const index = labels.indexOf(label);
        if (index !== -1) {
          projectData.actual[index] = item.actual * 100;
          projectData.expected[index] = item.expected * 100;
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
      datasetMap.forEach((data, projectName) => {
        const color = colorPairs[colorIndex++ % colorPairs.length].color;
        datasets.push({
          label: `${projectName} Actual`,
          data: data.actual,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderWidth: 5,
        });
        datasets.push({
          label: `${projectName} Expected`,
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
        const projectName = item.project_name;

        if (!datasetMap.has(projectName)) {
          datasetMap.set(projectName, {
            actual: Array(labels.length).fill(null),
            expected: Array(labels.length).fill(null),
          });
        }

        const projectData = datasetMap.get(projectName);
        const index = labels.indexOf(label);
        if (index !== -1) {
          projectData.actual[index] = item.actual * 100;
          projectData.expected[index] = item.expected * 100;
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
      datasetMap.forEach((data, projectName) => {
        const color = colorPairs[colorIndex++ % colorPairs.length].color;
        datasets.push({
          label: `${projectName} Actual`,
          data: data.actual,
          backgroundColor: color,
          borderColor: color.replace("0.2", "1"),
          borderWidth: 5,
        });
        datasets.push({
          label: `${projectName} Expected`,
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
