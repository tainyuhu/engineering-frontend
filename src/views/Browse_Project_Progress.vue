<template>
  <div class="background-card">
    <!-- 標題 -->
    <v-col cols="12" class="title">
      <div class="blue-rectangle"></div>
      <span class="span_title">PV工程進度總覽</span>
    </v-col>

    <!-- 計畫選擇 -->
    <v-col cols="12" class="flex-container">
      <div class="orange-rectangle"></div>
      <span class="span_label">計畫名稱：</span>
      <v-select :items="plans" item-title="plan_name" item-value="id" v-model="selectedPlan" variant="underlined"></v-select>
    </v-col>

    <!-- 迴路選擇 -->
    <!-- 網頁全按鈕顯示 -->
    <div class="tabs-container"  v-if="!is_mobile">
      <v-col cols="9" class="loop_tabs" v-for="loop in loopsOfSelectedPlan" :key="loop.id">
        <v-btn block variant="text" @click="selectLoop(loop)">
          <span class="span">{{ loop.loop_name }}</span>
        </v-btn>
      </v-col>
      <v-col cols="3" class="status-container">
        <div v-if="selectedLoop" class="span_loop_label">狀態：</div>
        <v-btn v-if="selectedLoop" variant="text" :class="currentView === 'table' ? 'table-btn' : 'report-btn'" @click="toggleView">{{ currentView === 'table' ? '表格' : '報表' }}</v-btn>
      </v-col>
    </div>
    <!-- 手機下拉選單 -->
    <div class="tabs-container"  v-else>
      <v-col cols="8">
        <v-select label="選擇迴路" :items="loopsOfSelectedPlan" item-title="loop_name" item-value="id" v-model="selectedLoopId"  variant="underlined"></v-select>
      </v-col>
      <v-col cols="4" class="status-container" >
        <div v-if="selectedLoop && !is_mobile" class="span_loop_label">狀態：</div>
        <v-btn v-if="selectedLoop" variant="text" :class="currentView === 'table' ? 'table-btn' : 'report-btn'" @click="toggleView">{{ currentView === 'table' ? '表格' : '報表' }}</v-btn>
      </v-col>
    </div>

    <!-- 顯示所選擇迴路與其功能鍵 -->
    <div v-if="selectedLoop" class="loop-selection-container">
      <v-col cols="12" md="4" class="span_loop_label">目前瀏覽迴路：{{ selectedLoop.loop_name }}</v-col>
      <v-col cols="12" md="4" class="py-2 d-flex justify-center" v-if="activeTab === 'details' && currentView === 'table'">
        <v-btn-toggle v-model="currentSelection" group color="primary" variant="outlined">
          <v-btn value="season" @click="setCurrentSelection('season')"> 季 </v-btn>
          <v-btn value="week" @click="setCurrentSelection('week')"> 週 </v-btn>
        </v-btn-toggle>
      </v-col>

      <v-col cols="12" md="4" class="py-2 d-flex justify-center" v-if="currentView === 'report'">
        <v-btn-toggle v-model="currentChartSelection" group color="primary" variant="outlined">
          <v-btn value="loops" @click="setCurrentChartSelection('loops')"> 迴路 </v-btn>
          <v-btn value="cases" @click="setCurrentChartSelection('cases')"> 案場 </v-btn>
        </v-btn-toggle>
      </v-col>

      <v-col cols="12" md="4" class="status-container" v-if="selectedLoop">
        <div class="tabs" v-if="currentSelection === 'week' && activeTab === 'details' && currentView === 'table'">
          <v-btn v-if="isBankMode" color="#FF6F00" @click="toggleMode">銀行模式</v-btn>
          <v-btn v-else color="#0984e3" @click="toggleMode">工程模式</v-btn>
        </div>
        <div class="tabs" v-if="currentView === 'table'">
          <v-btn :class="{ 'active': activeTab === 'overview' }" @click="toggleTab('overview')">
            <span class="span">總覽</span>
          </v-btn>
        </div>
        <div class="tabs" v-if="currentView === 'table'">
          <v-btn :class="{ 'active': activeTab === 'details' }" @click="toggleTab('details')">
            <span class="span">詳情</span>
          </v-btn>
        </div> 
      </v-col>
    </div>

    <!-- 引用 SeasonWeekProgressTable 組件 -->
    <div class="table-container" v-if="activeTab === 'overview'&& currentView === 'table'&& selectedLoop">
      <!-- 加載器 -->
      <loader :isLoading="isLoading" :elapsedSeconds="elapsedSeconds"></loader>
      <v-skeleton-loader v-if="isLoading" type="table"></v-skeleton-loader>
      <div v-else>
        <season-week-progress-table :headers="seasonWeekData.headers" :rows="seasonWeekData.rows"></season-week-progress-table>
      </div>
    </div> 
    
    <div class="table-container" v-if="activeTab === 'details' && currentView === 'table'">
      <!-- 引用 WeekProgressTable 組件 -->
      <div v-if="selectedLoop && currentSelection === 'week'">
        <!-- 加載器 -->
        <loader :isLoading="isLoading" :elapsedSeconds="elapsedSeconds"></loader>
        <v-skeleton-loader v-if="isLoading" type="table"></v-skeleton-loader>
        <div v-else>
          <week-progress-table :tableData="tableData" :tableBankData="tableBankData" :isBankMode="isBankMode"></week-progress-table>
        </div>
      </div>
      <!-- 引用 SeasonProgressTable 組件 -->
      <div v-else-if="selectedLoop && currentSelection === 'season'">
        <!-- 加載器 -->
        <loader :isLoading="isLoading" :elapsedSeconds="elapsedSeconds"></loader>
        <v-skeleton-loader v-if="isLoading" type="table"></v-skeleton-loader>
        <div v-else>
          <season-progress-table :seasonTableData="seasonTableData"></season-progress-table>
        </div>
      </div>
    </div>

    <div v-show="currentView === 'report' && selectedLoop && chartData && currentChartSelection==='cases'">
      <V-row>
        <v-col cols="2">
          <div class="green-rectangle"></div>
          <span class="span_project_label">案場選擇：</span>
          <div class="d-flex flex-wrap justify-content-center project-btn-container">
            <div v-for="item in pVProjectByLoopsList" :key="item.project_name">
              <v-btn variant="outlined" class=" project-btn" :class="{ 'selected': isSelected(item.project_name) }" :style="getButtonStyle(item.project_name)" @click="toggleProjectSelection(item.project_name)">
                {{ item.project_name }}
              </v-btn>
            </div>
          </div> 
        </v-col>
        <v-col cols="10">
          <!-- 引用 SeasonProjectChart 組件 -->
          <season-project-chart v-if="chartData" :chart-data="chartData" :chart-options="chartOptions"/>
        </v-col>
      </V-row> 
    </div>

    <div v-show="currentView === 'report' && selectedLoop && chartData && currentChartSelection==='loops'">
      <V-row>
        <v-col cols="2">
          <div class="green-rectangle"></div>
          <span class="span_project_label">迴路進度：</span>
        </v-col>
        <v-col cols="10">
          <!-- 引用 SeasonProjectChart 組件 -->
          <season-project-chart v-if="chartData" :chart-data="chartData" :chart-options="chartOptions"/>
        </v-col>
      </V-row> 
    </div>
    
    <div class="spacing"></div>
  </div>
</template>

<script setup >
  import SeasonProjectChart from '../components/chart/SeasonProjectChart.vue'
  import SeasonWeekProgressTable from '../components/table/SeasonWeekProgressTable.vue';
  import WeekProgressTable from '@/components/table/WeekProgressTable.vue';
  import SeasonProgressTable from '../components/table/SeasonProgressTable.vue';
  import Loader from '../components/loading/Loader.vue';
</script>

<script>
import { fetchPlans, fetchLoopByPlan, fetchLoops } from '@/api/planService';
import { fetchSeasonWeekTableData, fetchWeekTableData, fetchWeekBankTableData, fetchSeasonTableData, fetchSeasonProjectChartData, fetchPVProjectByLoopList} from '@/api/pvProjectService';

export default {

  data() {
    return {
      plans: [], // 所有計畫
      loops: [], // 所有迴路
      loopsOfSelectedPlan:[],
      selectedPlan: null, // 目前選定的計畫
      selectedLoop: null, //目前選中的迴路
      selectedLoopId: null, // 選中的迴路 ID
      activeTab: 'overview', // 預設選擇 "總覽"
      currentSelection: 'week', // 預設選擇 '週'
      currentChartSelection: 'loops', // 預設選擇 '週'
      isBankMode: true, // 預設選擇為"銀行"
      currentView: 'table',
      tableData: { headers: [], rows: [] }, // 初始化 tableData
      tableBankData: { headers: [], rows: [] }, // 初始化 tableData
      seasonWeekData: { headers: [], rows: [] }, // 初始化 seasonWeekData
      seasonTableData: { headers: [], rows: [] }, // 季表格
      pVProjectByLoopsList:[],
      isLoading: false, // 加載器
      elapsedSeconds: 0,
      timer: null,
      apiError: null,
      seasonProjectChartData: null,
      chartData: { labels: [], datasets: [] },
      originalChartData: null,
      assignedHues: new Set(),
      stringColorMap: {}, // 儲存字符串對應顏色的對象
      selectedProjects:[],
    };
  },
  methods: {
    isSelected(projectName) {
      return this.selectedProjects.includes(projectName);
    },
    getButtonStyle(projectName) {
      const color = this.hashStringToColor(projectName);
      if (this.isSelected(projectName)) {
        return {
          backgroundColor: color,
          color: 'white'
        };
      } else {
        return {
          borderColor: color,
          borderWidth: '2px',
        };
      }
    },
    toggleProjectSelection(projectName) {
      const index = this.selectedProjects.indexOf(projectName);
      if (index > -1) {
        this.selectedProjects.splice(index, 1);
      } else {
        this.selectedProjects.push(projectName);
      }
    },
    async loadDataBasedOnTab() {
      this.startLoading();
      await this.fetchDataForLoop(this.selectedLoop.id);
      this.stopLoading();
    },
    // 統一處理 API 錯誤的方法
    handleApiError(error) {
      console.error('API Error:', error);
    },
    resetTableData() {
      this.tableData = { headers: [], rows: [] };
      this.tableBankData = { headers: [], rows: [] };
      this.seasonTableData = { headers: [], rows: [] };
      this.seasonWeekData = { headers: [], rows: [] };
    },
    startLoading() {
      this.isLoading = true;
      this.elapsedSeconds = 0;
      this.timer = setInterval(() => {
        this.elapsedSeconds++;
      }, 1000);
    },
    stopLoading() {
      this.isLoading = false;
      clearInterval(this.timer);
    },
    async fetchData() {
      try {
        const plansResponse = await fetchPlans();
        this.plans = plansResponse.data;

        const loopsResponse = await fetchLoops();
        this.loops = loopsResponse.data;
      } catch (error) {
          this.handleApiError(error);
      }
    },
    async fetchSeasonWeekTableData(loopId) {
        try {
            const response = await fetchSeasonWeekTableData(loopId);
            this.seasonWeekData = response.data;
        } catch (error) {
            this.handleApiError(error);
        }
    },
    async fetchWeekTableData(loopId) {
        try {
            const response = await fetchWeekTableData(loopId);
            this.tableData = response.data;
        } catch (error) {
            this.handleApiError(error);
        }
    },
    async fetchWeekBankTableData(loopId) {
        try {
            const response = await fetchWeekBankTableData(loopId);
            this.tableBankData = response.data;
        } catch (error) {
            this.handleApiError(error);
        }
    },
    async fetchSeasonTableData(loopId) {
        try {
            const response = await fetchSeasonTableData(loopId);
            this.seasonTableData = response.data;
        } catch (error) {
          this.handleApiError(error);
        }
    },
    async fetchSeasonProjectsChartData(loopId) {
      try {
        const response = await fetchSeasonProjectChartData(loopId);
        if (response && response.data && Array.isArray(response.data.datasets)) {
          this.originalChartData = JSON.parse(JSON.stringify(response.data)); // 存取原始資料，以因應資料比對
          this.chartData = this.processChartData(response.data);
          console.log('chartData', this.chartData);
        } else {
          console.error('Invalid data structure received from API:', response);
          this.chartData = { labels: [], datasets: [] }; 
        }
      } catch (error) {
        console.error('Error fetching project chart data:', error);
        this.chartData = { labels: [], datasets: [] }; 
        this.handleApiError(error);
      }
    },
    async fetchPVProjectByLoopsList(loopId) {
      try {
        const response = await fetchPVProjectByLoopList(loopId);
        this.pVProjectByLoopsList = response.data;

        this.selectedProjects = this.pVProjectByLoopsList.map(item => item.project_name);
      } catch (error) {
        this.handleApiError(error);
      }
    },
    async fetchDataForLoop(loopId) {
      if (this.activeTab === 'overview') {
        await this.fetchSeasonWeekTableData(loopId);
      } else if (this.activeTab === 'details') {
        if (this.currentSelection === 'week') {
          await this.fetchWeekTableData(loopId);
          await this.fetchWeekBankTableData(loopId);
        } else if (this.currentSelection === 'season') {
          await this.fetchSeasonTableData(loopId);
        }
      }
    },
    selectLoop(loop) {
      this.selectedLoop = loop;
    },
    toggleTab(tabName) {
      this.activeTab = tabName;
    },
    toggleMode() {
      this.isBankMode = !this.isBankMode;
    },
    toggleView() {
      this.currentView = this.currentView === 'table' ? 'report' : 'table';
    },
    setCurrentView(view) {
      this.currentView = view;
    },
    setCurrentSelection(value) {
      this.currentSelection = value;
    },
    setCurrentChartSelection(value) {
      this.currentChartSelection = value;
    },
    hashStringToColor(str) {
        if (this.stringColorMap[str]) {
        return this.stringColorMap[str];
      }
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 7) - hash);
      }
      hash = Math.abs(hash);

      let hue = hash % 360;
      let saturation = 45 + (hash % 50); // 飽和度在50%至100%之間
      let lightness = 25 + (hash % 50); // 亮度在25%至75%之間

      // 確保顏色的獨特性
      while (this.assignedHues.has(hue)) {
        hue = (hue + 1) % 360;
        saturation = (saturation + 1) % 50 + 50;
        lightness = (lightness + 1) % 50 + 25;
      }
      this.assignedHues.add(hue);

      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      this.stringColorMap[str] = color;
      return color;
    },
    assignColorsToProjects(projectNames) {
      const colorMap = {};
      projectNames.forEach(name => {
        colorMap[name] = this.hashStringToColor(name);
      });
      return colorMap;
    },
    processChartData(rawData) {
      const uniqueProjects = new Set(rawData.datasets.map(d => d.label.split(' ')[0]));
      const colorMap = this.assignColorsToProjects(uniqueProjects);

      const processedData = {
        labels: rawData.labels,
        datasets: rawData.datasets.map(dataset => {
          const projectName = dataset.label.split(' ')[0];
          return {
            ...dataset,
            borderColor: colorMap[projectName],
            backgroundColor: colorMap[projectName],
            borderWidth: 2,
            lineTension: 0.4,
            fill: false,
            borderDash: dataset.label.includes('預計') ? [5, 5] : []
          };
        })
      }
      console.log('Processed Data in Method:', processedData);
      return processedData;
    },
  },
  computed: {
    is_mobile() {
      return this.$vuetify.display.xs
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            max: 1,
            min: 0,
            beginAtZero: true,
            ticks: {
              stepSize: 0.1,
              callback: function(value) {
                return (value * 100).toFixed(0) + '%';
              }
            },
            scaleLabel: {
              display: true,
              labelString: 'Progress (%)'
            },
            
          }
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: 'nearest',
            intersect: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += `${(context.parsed.y * 100).toFixed(2)}%`;
                return label;
              }
            }
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          
        }
      };
    }
  },
  watch: {
    selectedLoopId: function(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.selectedLoop = this.loops.find(loop => loop.id === newVal) || null;
      }
    },
    selectedLoop: function(newVal) {
      if (newVal) {
        if (newVal !== null) {
          this.selectedProjects = [];
          this.selectedProjects = this.pVProjectByLoopsList.map(item => item.project_name);
        } else {
          this.selectedProjects = [];
        }
        this.startLoading();
        this.fetchDataForLoop(newVal.id)
        this.fetchSeasonProjectsChartData(newVal.id)
        this.fetchPVProjectByLoopsList(newVal.id)
        this.stopLoading();
      }
    },
    selectedProjects: {
      deep: true,
      handler(newVal) {
        if (this.chartData && this.originalChartData && Array.isArray(this.originalChartData.datasets)) {
          const filteredData = {
            ...this.originalChartData,
            datasets: this.originalChartData.datasets.filter(dataset => {
              return newVal.some(projectName => dataset.label.includes(projectName));
            })
          };
          this.chartData = this.processChartData(filteredData); // 重新處理數據集來更新線條顏色
        }
      }
    },
    // 獲取該計畫所有迴路
    async selectedPlan(newValue) {
      if (newValue) {
        try {
          const response = await fetchLoopByPlan(newValue);
          this.loopsOfSelectedPlan = response.data;
          // 默認選擇第一迴路（如果有的话）
          if (this.loopsOfSelectedPlan.length > 0) {
            this.selectLoop(this.loopsOfSelectedPlan[0]);
          }
        } catch (error) {
          console.error('Error fetching loops for the plan:', error);
        }
      } else {
        this.loopsOfSelectedPlan = [];
        this.selectedLoop = null;
        this.selectedLoopId = null;
      }
    },
    activeTab:{
      immediate: true, // 進入頁面就讀
      handler(newVal, oldVal) {
        if (newVal !== oldVal && this.selectedLoop) {
          this.loadDataBasedOnTab();
        }
      },
    },
    // 當 currentSelection 改變時，重新加載數據
    currentSelection(newVal, oldVal) {
      if (newVal !== oldVal && this.selectedLoop) {
        this.loadDataBasedOnTab();
      }
    },
    selectedDatasetsLabel(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.filterChartData();
      }
    },
  },
  async mounted() {
    this.fetchData();
    // 設置默認迴路（如果有的话）
    this.$nextTick(() => {
      if (this.loopsOfSelectedPlan.length > 0) {
        this.selectLoop(this.loopsOfSelectedPlan[0]);
      }
    });

    this.$nextTick(() => {
      if (this.selectedLoop) {
        this.selectedProjects = this.pVProjectByLoopsList.map(item => item.project_name);
        this.fetchSeasonWeekTableData(this.selectedLoop.id);
        this.fetchWeekTableData(this.selectedLoop.id);
        this.fetchWeekBankTableData(this.selectedLoop.id);
        this.fetchSeasonTableData(this.selectedLoop.id);
        this.fetchSeasonProjectsChartData(this.selectedLoop.id);
      }
    });
  },
}
</script>

<style scoped>
.span{
  font-size: 10pt;
}
.title {
  margin: 15px;
}
.blue-rectangle {
  background-color: #0984e3;
  width: 10px;
  height: 30px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 10px;
}

.span_title {
  display: inline-block;
  vertical-align: middle;
  margin: 0;
  font-size: 16pt;
  font-weight: bold;
  margin-left: 10px;
  margin-bottom: 10px;
}

.flex-container {
    margin: 25px;
    display: flex;
    align-items: center;
}
.orange-rectangle {
  background-color: #FF6F00;
  width: 10px;            
  height: 20px;           
  display: inline-block;  
  vertical-align: middle; 
  margin-right: 10px;
}
.green-rectangle {
  background-color: #00b894;
  width: 10px;            
  height: 20px;           
  display: inline-block;  
  vertical-align: middle; 
  margin-right: 10px;
  margin-left: 50px;
  margin-bottom: 10px;
}
.span_label{
    display: inline-block; 
    vertical-align: middle;
    font-size: 16pt; 
    font-weight: bold; 
    margin:10px;
}

.span_loop_label{
    display: inline-block; 
    vertical-align: middle;
    font-size: 12pt; 
    font-weight: bold; 
    color: #272828;
    margin:10px;
}

.span_project_label{
    display: inline-block; 
    vertical-align: middle;
    font-size: 12pt; 
    font-weight: bold; 
    color: #272828;
    margin-bottom: 10px;
}

.tabs-container {
  display: flex;
  flex-wrap: nowrap; 
  margin-left: 25px;
  align-items: center;
}

.status-container {
  display: flex;
  justify-content: flex-end; /* 使所有元素靠右對齊 */
  align-items: center; /* 垂直居中對齊 */
}

.report-btn {
  background-color: #ff7675;
  color: #fff; 
}

.table-btn {
  background-color:#a29bfe;
  color: #fff; 
}

.loop_tabs {
  border-top: 1px solid #ccc;
  flex-grow: 0; 
  flex-shrink: 1; 
}

.loop_tabs .v-btn:hover{
  font-weight: bold;
  border-bottom: 5px solid #FF6F00; 
  border-radius: 0;
}

.tabs {
  margin-right: 10px;
  font-size: 12px;
}

.tabs .v-btn:hover{
  font-weight: bold;
  color: #fff;
  background: #00b894; 
  border-radius: 0;
}

.active {
    background-color: #00b894; 
    color: white; 
}


.loop-selection-container {
  margin-left: 25px;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 600px) {
  .loop-selection-container {
    flex-direction: column;
  }
}

:deep(.v-btn-toggle){
    padding: 2px 30px;
    min-height: auto;
    height: auto;
}
.spacing{
 height: 50px;
}

.table-container {
  position: relative;
  max-width: 100vw;
  max-height: 50vh;
  margin-left: 35px;
  margin-right: 25px;
  padding: 10px;
  overflow-x: auto;
  overflow-y: auto;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8); /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

::-webkit-scrollbar {
  width: 4px;
}
 
::-webkit-scrollbar-thumb {
   border-radius: 2px;
  background-color: #bdc3c7;
  color: #bdc3c7;
  -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}
.project-btn-container{
  position: relative;
  max-width: 100vw;
  max-height: 75vh;
  margin-left: 50px;
  padding: 5px;
  background-color: #fff; /* 背景顏色 */
  border: 1px solid #ddd; /* 邊框 */
  border-radius: 10px; /* 圓角邊框 */
  overflow-y: auto;
  overflow-x: hidden;
}

.project-btn {
  margin-bottom: 5px; /* 下边距 */
  font-size: 8pt; /* 字体大小 */
  padding: 5px 10px; /* 内部填充 (垂直方向和水平方向) */
  width: 120px; /* 固定宽度 */
  text-align: center; /* 文本居中 */
}

</style>


