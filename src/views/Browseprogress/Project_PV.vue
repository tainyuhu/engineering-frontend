<template>
    <v-container>
        <!-- 標題 -->
        <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center;">
            <v-icon color="blue">mdi-chevron-right-box</v-icon>
            <span class="font-weight-bold ml-2">瀏覽PV工程進度：</span>
        </div>
        <!-- 迴路選擇 -->
        <div class="mb-3" style="padding-left: 40px; display: flex; align-items: center;">
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
            <div v-if="selectedLoopId" class="status-section">
                <span>狀態：</span>
                <v-btn :class="displayMode === 'table' ? 'report-btn' : 'table-btn'" @click="toggleDisplayMode">{{ displayModeText }}</v-btn>
            </div>

            <!-- 第二個區塊 -->
            <div v-if="showDetails" class="time-section py-2 d-flex justify-center">
                <v-btn-toggle v-model="timeMode" class="time-toggle" variant="outlined">
                    <v-btn class="time-btn" value="quarter">季</v-btn>
                    <v-btn class="time-btn" value="week">週</v-btn>
                </v-btn-toggle>
            </div>

            <!-- 第三個區塊 -->
            <div v-if="selectedLoopId && displayMode === 'table'" class="action-section">
                <v-btn v-if="showDetails" :class="projectType === 'engineering' ? 'bank-btn' : 'engineering-btn'" @click="toggleProjectType">{{ projectTypeText }}</v-btn>
                <v-btn class="overview-btn" @click="showDetails = false">總覽</v-btn>
                <v-btn class="details-btn" @click="showDetails = true">詳情</v-btn>
            </div>
        </div>
        
        <!-- 表格 -->
        
    </v-container>
</template>

<script>
import { fetchLoopsByProject } from '@/api/planService';
import { fetchWeekTableData} from '@/api/pvProjectService';

export default {
    data() {
        return {
            loops: [],
            cases: [],
            selectedProject:[],
            selectedPlan: null, //所選中計畫
            selectedLoopId: null, //所選中之迴路
            displayMode: 'table',
            projectType: 'engineering',
            showDetails: false,
            weekTableData: [], //周數據
        };
    },
    watch: {
        selectedLoopId(newVal) {
            if(newVal && this.showDetails && this.timeMode === 'week') {
                this.fetchWeekData();
            }
        },
        // 当展示详情和时间模式变化时，重新获取数据
        showDetails(newVal) {
            if(newVal && this.selectedLoopId && this.timeMode === 'week') {
                this.fetchWeekData();
            }
        },
        timeMode(newVal) {
            if(newVal === 'week' && this.selectedLoopId && this.showDetails) {
                this.fetchWeekData();
            }
        }
    },
    async created() {
        this.selectedPlan = this.$route.query.Plan;
        this.selectedProject = this.$route.query.Project;
        console.log('api response:', this.selectedProject);
        await this.fetchLoops();
    },
    computed: {
        displayModeText() {
            return this.displayMode === 'table' ? '表格' : '報表';
        },
        projectTypeText() {
            return this.projectType === 'engineering' ? '工程' : '銀行';
        },
    },
    methods: {
        async fetchLoops() {
            try {
                console.log('api response:', this.selectedProject);
                const { data } = await fetchLoopsByProject(this.selectedProject);
                console.log('loopsdata:', data); 
                this.loops = data;
            } catch (error) {
                console.error("Error fetching loops:", error);
            }
        },
        async fetchWeekData() {
            if(this.selectedLoopId) {
                try {
                    const response = await fetchWeekTableData(this.selectedLoopId);
                    console.log('weekTableData:', response.data); 
                    this.weekTableData = response.data;
                } catch (error) {
                    console.error("Error fetching week table data:", error);
                    this.weekTableData = [];
                }
            }
        },
        selectLoop(loopId) {
            this.selectedLoopId = loopId; 
            this.fetchWeekData();
        },
        // 切換顯示模式
        toggleDisplayMode() {
            this.displayMode = this.displayMode === 'table' ? 'report' : 'table';
            this.showDetails = false;
        },
        // 切換項目類型
        toggleProjectType() {
            this.projectType = this.projectType === 'engineering' ? 'bank' : 'engineering';
        },
    }
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

.note-span{
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
    border-top: 1px solid #CCCCCC;
    border-bottom: 1px solid #CCCCCC;
    text-transform: none;
    color:#404040;
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
    border-top: 1px solid #CCCCCC;
    border-bottom: 1px solid #CCCCCC;
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

.engineering-btn, .bank-btn, .table-btn, .report-btn, .overview-btn, .details-btn {
    text-transform: none;
    font-weight: bold;
}

.table-btn {
    background-color: #1976D2;
    color: white;
}

.table-btn:hover {
    background-color: #1565C0;
}

.report-btn {
    background-color: #4CAF50; 
    color: white;
}

.report-btn:hover {
    background-color: #43A047;
}

.engineering-btn {
    margin-right: 5px;
    background-color: #FFC107;
    color: white;
}

.engineering-btn:hover {
    background-color: #FFB300;
}

.bank-btn {
    margin-right: 5px;
    background-color: #0984e3;
    color: white;
}


.bank-btn:hover {
    background-color: #0769c1;
}

.overview-btn {
    margin-right: 5px;
    background-color: #9C27B0;
    color: white;
}

.overview-btn:hover {
    background-color: #8E24AA;
}

.details-btn {
    margin-right: 5px;
    background-color: #E91E63;
    color: white;
}

.details-btn:hover {
    background-color: #D81B60;
}

.time-toggle .v-btn--active {
    background-color: #CCCCCC;
    color: #404040;
}

:deep(.v-btn-toggle){
    padding: 2px 30px;
    min-height: auto;
    height: auto;
}
</style>
