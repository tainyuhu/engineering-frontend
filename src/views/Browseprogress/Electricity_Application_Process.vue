<template>
  <v-container>
    <div
      class="mb-3"
      style="padding-left: 20px; display: flex; align-items: center; justify-content: space-between"
    >
      <div>
        <v-icon color="blue" @click="goBack">mdi-chevron-left-box</v-icon>
        <span class="title">瀏覽電業申辦進度：</span>
      </div>
      <v-btn style="margin-right: 40px" color="indigo-darken-4" @click="showStepInstructions">
        步驟說明
      </v-btn>
    </div>

    <v-table dense striped>
      <thead>
        <tr>
          <th><v-icon style="margin: 5px">mdi-folder</v-icon>迴路名稱</th>
          <th><v-icon style="margin: 5px">mdi-play-circle-outline</v-icon>當前執行步驟</th>
          <th><v-icon style="margin: 5px">mdi-format-list-checks</v-icon>待辦事項</th>
          <th class="th-color">
            <v-icon style="margin: 5px">mdi-check-circle-outline</v-icon>目前步驟
          </th>
          <th class="th-color"><v-icon style="margin: 5px">mdi-progress-clock</v-icon>目前進度</th>
          <th class="th-color"><v-icon style="margin: 5px">mdi-calendar-check</v-icon>完成日期</th>
          <th class="th-color-1">
            <v-icon style="margin: 5px">mdi-arrow-left-bold</v-icon>上一步驟
          </th>
          <th class="th-color-1">
            <v-icon style="margin: 5px">mdi-format-list-checks</v-icon>總體進度
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="project in projects" :key="project.name">
          <td>{{ project.name }}</td>
          <td>
            {{ project.nextStep }}
          </td>
          <td>
            <v-expansion-panels>
              <v-expansion-panel elevation="0">
                <v-expansion-panel-title>
                  <v-icon color="orange" style="margin: 5px"> mdi-check-circle </v-icon>
                  完成狀況
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div v-for="todo in project.todos" :key="todo">
                    <v-checkbox
                      v-model="project.selected"
                      color="success"
                      :label="todo"
                      :value="todo"
                      readonly
                      density="compact"
                      hide-details
                    >
                    </v-checkbox>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </td>
          <td>{{ project.currentStep }}</td>
          <td>{{ project.progress }}%</td>
          <td>{{ project.doneDate }}</td>
          <td>{{ project.prevStep }}</td>
          <td>
            <v-btn color="light-green-darken-3" @click="showProgress(project)">進度條</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="showInstructionsDialog" persistent max-width="400px">
      <v-card>
        <v-card-title class="font-weight-bold bg-indigo-darken-4 card-text" style="color: #fff"
          >步驟說明</v-card-title
        >
        <v-card-text>
          <div class="timeiine">
            <v-timeline dense side="end">
              <v-timeline-item
                v-for="(percentage, stage) in steps"
                :key="stage"
                dot-color="indigo-lighten-1"
                size="small"
              >
                <v-card class="custom-card">
                  <v-card-title class="bg-indigo-lighten-1 step-card font-weight-bold">
                    {{ stage }}
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text class="percentage-text"> {{ percentage }}% </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="indigo-darken-3" block text @click="showInstructionsDialog = false"
            >關閉</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="progressDialog" persistent max-width="400px">
      <v-card>
        <v-card-title
          class="font-weight-bold bg-light-green-darken-1 card-text"
          style="color: #fff"
        >
          進度詳情
        </v-card-title>
        <v-card-text>
          <div class="timeiine">
            <v-timeline dense side="end">
              <v-timeline-item
                v-for="(percentage, stage) in steps"
                :key="stage"
                :dot-color="this.progress >= percentage ? 'green' : 'grey'"
                size="small"
              >
                <v-card class="custom-card">
                  <v-card-title
                    :class="`step-card font-weight-bold ${
                      this.progress >= percentage ? 'bg-green' : 'bg-grey'
                    }`"
                  >
                    {{ stage }}
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text class="percentage-text"> {{ percentage }}% </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="light-green-lighten-1" block text @click="progressDialog = false"
            >關閉</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { fetchStageData, fetchElectricalProgressData } from "@/api/electricalProjectService";
export default {
  data() {
    return {
      progress: null,
      progressDialog: false,
      selectedPlan: null, //所選中計畫
      selectedProject: null,
      showInstructionsDialog: false,
      steps: {},
      projects: [],
    };
  },
  watch: {
    selectedProject(newValue, oldValue) {
      this.fetchStagesData();
      this.fetchData();
    },
  },
  async created() {
    this.selectedPlan = this.$route.query.Plan;
    this.selectedProject = this.$route.query.Project;
  },
  methods: {
    goBack() {
      this.$router.push({
        name: "Browse_Progress",
        query: { planId: this.selectedPlan },
      });
    },
    showStepInstructions() {
      this.showInstructionsDialog = true;
    },
    showProgress(project) {
      this.progress = project.progress;
      this.progressDialog = true;
    },
    async fetchStagesData() {
      this.isLoading = true;
      console.log(this.selectedProject);
      try {
        const stepDataresponse = await fetchStageData(this.selectedProject);
        this.steps = stepDataresponse.data;
        console.log(this.steps);
      } catch (error) {
        console.error("Error fetching stage data:", error);
        this.steps = {};
      } finally {
        this.isLoading = false;
      }
    },
    async fetchData() {
      this.isLoading = true;
      console.log(this.selectedProject);
      try {
        const projectsDataresponse = await fetchElectricalProgressData(this.selectedProject);
        this.projects = projectsDataresponse.data;
        console.log(this.projects);
      } catch (error) {
        console.error("Error fetching projects data:", error);
        this.projects = [];
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style>
.v-container {
  max-width: 100%;
  margin: auto;
  padding: 20px;
}

.icon {
  font-size: 35px;
}

.step-card {
  color: white !important;
  font-size: medium !important;
  width: 250px;
}

.percentage-text {
  text-align: center;
  font-size: 20px;
}

.card-text {
  text-align: center;
}

.v-expansion-panels {
  border: none;
}

.v-table {
  border-collapse: separate;
  border: none;
  background-color: white;
  margin: 20px;
}

.v-table th {
  padding: 8px !important;
  font-weight: bold !important;
  text-align: center !important;
  background-color: #00b894;
  color: white !important;
  border-left: 1px solid #e0e0e0;
}

.th-color {
  background-color: #0769c1 !important;
}

.th-color-1 {
  background-color: #ff9800 !important;
}

.v-table td {
  border-bottom: 1px solid #e0e0e0;
  text-align: center !important;
  padding: 8px;
  border-left: 1px solid #e0e0e0;
}

.v-table tr {
  border-bottom: 1px solid #c4c4c4;
}

.v-checkbox {
  border-bottom: 1px dotted #c4c4c4;
}

.v-checkbox .v-icon {
  font-size: 20px;
}

.v-checkbox .v-label {
  font-size: 16px;
  margin-left: 10px;
  color: black;
}

.timeiine {
  max-height: 400px;
  overflow-y: auto;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: #bdc3c7;
  color: #bdc3c7;
  -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}
</style>
