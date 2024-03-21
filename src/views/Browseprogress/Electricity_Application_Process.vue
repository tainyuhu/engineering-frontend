<template>
  <v-container>
    <div
      class="mb-3"
      style="padding-left: 20px; display: flex; align-items: center; justify-content: space-between"
    >
      <div>
        <v-icon class="icon" color="blue">mdi-chevron-right-box</v-icon>
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
export default {
  data() {
    return {
      items: Array.from({ length: 16 }).map((_, i) => ({
        title: `Step ${i + 1}`,
        subtitle: `Step ${i + 1} subtitle`,
        value: i + 1,
      })),
      progress: null,
      progressDialog: false,
      showInstructionsDialog: false,
      steps: {
        第一步驟_併聯審查意見書: 5,
        第二步驟_地政機關意見書: 10,
        第三步驟_環境敏感地區調查: 15,
        第四步驟_地方政府同意: 20,
        第五步驟_電業籌設: 30,
        第六步驟_同意備案: 40,
        第七步驟_台電契約: 45,
        第八步驟_初步協商: 50,
        第九步驟_細部協商: 55,
        第十步驟_出流管制: 65,
        第十一步驟_施工許可: 70,
        第十二步驟_併聯完工: 80,
        第十三步驟_使照: 85,
        第十四步驟_附屬綠能: 90,
        第十五步驟_電業執照: 95,
        第十六步驟_正式購售電能: 100,
      },
      projects: [
        {
          name: "SN1",
          currentStep: "電業籌設",
          progress: 30,
          prevStep: "地方政府同意",
          nextStep: "同意備案",
          selected: ["整理文件"],
          todos: ["整理文件", "預約會議", "申請水權"],
          doneDate: "2024-03-16",
        },
        {
          name: "SN2",
          currentStep: "電業籌設",
          progress: 30,
          prevStep: "地方政府同意",
          nextStep: "同意備案",
          selected: ["整理文件"],
          todos: ["整理文件", "預約會議", "申請水權"],
          doneDate: "2024-03-16",
        },
        {
          name: "SN3",
          currentStep: "電業籌設",
          progress: 30,
          prevStep: "地方政府同意",
          nextStep: "同意備案",
          selected: ["整理文件"],
          todos: ["整理文件", "預約會議", "申請水權"],
          doneDate: "2024-03-16",
        },
        {
          name: "SN4",
          currentStep: "電業籌設",
          progress: 30,
          prevStep: "地方政府同意",
          nextStep: "同意備案",
          selected: ["整理文件"],
          todos: ["整理文件", "預約會議", "申請水權"],
          doneDate: "2024-03-16",
        },
        {
          name: "SN5",
          currentStep: "電業籌設",
          progress: 30,
          prevStep: "地方政府同意",
          nextStep: "同意備案",
          selected: ["整理文件"],
          todos: ["整理文件", "預約會議", "申請水權"],
          doneDate: "2024-03-16",
        },
        {
          name: "SN6",
          currentStep: "電業籌設",
          progress: 30,
          prevStep: "地方政府同意",
          nextStep: "同意備案",
          selected: ["整理文件"],
          todos: ["整理文件", "預約會議", "申請水權"],
          doneDate: "2024-03-16",
        },
        {
          name: "SN7",
          currentStep: "電業籌設",
          progress: 30,
          prevStep: "地方政府同意",
          nextStep: "同意備案",
          selected: ["整理文件"],
          todos: ["整理文件", "預約會議", "申請水權"],
          doneDate: "2024-03-16",
        },
        {
          name: "SN8",
          currentStep: "電業籌設",
          progress: 30,
          prevStep: "地方政府同意",
          nextStep: "同意備案",
          selected: ["整理文件"],
          todos: ["整理文件", "預約會議", "申請水權"],
          doneDate: "2024-03-16",
        },
        {
          name: "SN9",
          currentStep: "電業籌設",
          progress: 30,
          prevStep: "地方政府同意",
          nextStep: "同意備案",
          selected: ["整理文件"],
          todos: ["整理文件", "預約會議", "申請水權"],
          doneDate: "2024-03-16",
        },
      ],
    };
  },
  methods: {
    showStepInstructions() {
      this.showInstructionsDialog = true;
    },
    showProgress(project) {
      this.progress = project.progress;
      this.progressDialog = true;
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
