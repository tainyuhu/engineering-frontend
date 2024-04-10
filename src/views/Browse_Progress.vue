<template>
  <v-container>
    <!-- 瀏覽計畫進度標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue">mdi-chevron-down-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽計畫進度：</span>
      <span class="ml-1 note-span">※在下方選擇一項計畫後，才會顯示計畫內容</span>
    </div>

    <!-- 選擇計畫 -->
    <div class="mb-3" style="padding-left: 40px; display: flex; align-items: center">
      <v-icon color="orange">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">選擇計畫：</span>
      <v-select
        label="選擇欲瀏覽的計畫"
        variant="underlined"
        class="ml-3"
        :items="plan"
        item-title="plan_name"
        item-value="plan_id"
        v-model="selectedPlan"
        style="flex-grow: 1"
      ></v-select>
    </div>

    <div v-if="selectedPlan !== 3 && selectedPlan !== 4">
      <v-row v-if="selectedPlan && filteredProjects.length > 0" class="project-cards-row">
        <v-col cols="12">
          <v-card class="project-card" color="indigo-accent-2" dark>
            <v-card-title
              class="d-flex font-weight-bold flex-column align-items-center justify-content-center card-title-custom"
            >
              <v-icon class="icon-background mb-2" color="indigo-accent-2"
                >mdi-view-dashboard</v-icon
              >
              管理總表
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions class="justify-end">
              <v-btn
                class="mt-auto font-weight-bold btn-custom"
                color="indigo-accent-2"
                @click="navigateToManagement('Management_Summary')"
              >
                瀏覽
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col
          v-for="project in filteredProjects"
          :key="project.project_id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card :color="getProjectCardInfo(project.project_name).color" class="project-card" dark>
            <v-card-title
              class="d-flex font-weight-bold flex-column align-items-center justify-content-center card-title-custom"
            >
              <v-icon
                :icon="getProjectCardInfo(project.project_name).icon"
                class="icon-background mb-2"
                :color="getProjectCardInfo(project.project_name).color"
              ></v-icon>
              {{ getProjectCardInfo(project.project_name).title }}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions class="justify-end">
              <template v-if="project.project_name === '案場'">
                <v-btn
                  :color="getProjectCardInfo(project.project_name).color"
                  class="mt-auto font-weight-bold btn-custom"
                  @click="
                    navigateToProject(
                      getProjectCardInfo(project.project_name).routeName3,
                      project.project_id
                    )
                  "
                  >瀏覽總迴路</v-btn
                >
                <v-btn
                  :color="getProjectCardInfo(project.project_name).color"
                  class="mt-auto font-weight-bold btn-custom"
                  @click="
                    navigateToProject(
                      getProjectCardInfo(project.project_name).routeName2,
                      project.project_id
                    )
                  "
                  >瀏覽迴路</v-btn
                >
                <v-btn
                  :color="getProjectCardInfo(project.project_name).color"
                  class="mt-auto font-weight-bold btn-custom"
                  @click="
                    navigateToProject(
                      getProjectCardInfo(project.project_name).routeName,
                      project.project_id
                    )
                  "
                  >瀏覽 PV</v-btn
                >
                <v-btn
                  :color="getProjectCardInfo(project.project_name).color"
                  class="mt-auto font-weight-bold btn-custom"
                  @click="
                    navigateToProject(
                      getProjectCardInfo(project.project_name).routeName1,
                      project.project_id
                    )
                  "
                  >瀏覽養殖</v-btn
                >
              </template>
              <template v-else>
                <v-btn
                  :color="getProjectCardInfo(project.project_name).color"
                  class="mt-auto font-weight-bold btn-custom"
                  @click="
                    navigateToProject(
                      getProjectCardInfo(project.project_name).routeName,
                      project.project_id
                    )
                  "
                  >瀏覽</v-btn
                >
              </template>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else-if="selectedPlan" justify="center">
        <v-col cols="12">
          <v-alert
            style="margin: 10px 20px"
            title="該計畫沒有其他專案項目。"
            type="warning"
          ></v-alert>
          <v-alert
            style="margin: 10px 20px"
            title="請選擇其他計畫。"
            type="info"
            variant="outlined"
            prominent
          ></v-alert>
        </v-col>
      </v-row>
    </div>

    <div v-else-if="selectedPlan == 4">
      <v-row v-if="selectedPlan && filteredProjects.length > 0" class="project-cards-row">
        <v-col
          v-for="project in filteredProjects"
          :key="project.project_id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card :color="getProjectCardInfo(project.project_name).color" class="project-card" dark>
            <v-card-title
              class="d-flex font-weight-bold flex-column align-items-center justify-content-center card-title-custom"
            >
              <v-icon
                :icon="getProjectCardInfo(project.project_name).icon"
                class="icon-background mb-2"
                :color="getProjectCardInfo(project.project_name).color"
              ></v-icon>
              {{ getProjectCardInfo(project.project_name).title }}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions class="justify-end">
              <template v-if="project.project_name === '案場'">
                <v-btn
                  :color="getProjectCardInfo(project.project_name).color"
                  class="mt-auto font-weight-bold btn-custom"
                  @click="
                    navigateToProject(
                      getProjectCardInfo(project.project_name).routeName3,
                      project.project_id
                    )
                  "
                  >瀏覽總迴路</v-btn
                >
                <v-btn
                  :color="getProjectCardInfo(project.project_name).color"
                  class="mt-auto font-weight-bold btn-custom"
                  @click="
                    navigateToProject(
                      getProjectCardInfo(project.project_name).routeName2,
                      project.project_id
                    )
                  "
                  >瀏覽迴路</v-btn
                >
                <v-btn
                  :color="getProjectCardInfo(project.project_name).color"
                  class="mt-auto font-weight-bold btn-custom"
                  @click="
                    navigateToProject(
                      getProjectCardInfo(project.project_name).routeName,
                      project.project_id
                    )
                  "
                  >瀏覽 PV</v-btn
                >
                <v-btn
                  :color="getProjectCardInfo(project.project_name).color"
                  class="mt-auto font-weight-bold btn-custom"
                  @click="
                    navigateToProject(
                      getProjectCardInfo(project.project_name).routeName1,
                      project.project_id
                    )
                  "
                  >瀏覽養殖</v-btn
                >
              </template>
              <template v-else>
                <v-btn
                  :color="getProjectCardInfo(project.project_name).color"
                  class="mt-auto font-weight-bold btn-custom"
                  @click="
                    navigateToProject(
                      getProjectCardInfo(project.project_name).routeName,
                      project.project_id
                    )
                  "
                  >瀏覽</v-btn
                >
              </template>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else-if="selectedPlan" justify="center">
        <v-col cols="12">
          <v-alert
            style="margin: 10px 20px"
            title="該計畫沒有其他專案項目。"
            type="warning"
          ></v-alert>
          <v-alert
            style="margin: 10px 20px"
            title="請選擇其他計畫。"
            type="info"
            variant="outlined"
            prominent
          ></v-alert>
        </v-col>
      </v-row>
    </div>

    <div v-else>
      <v-row v-if="selectedPlan && filteredProjects.length > 0" class="project-cards-row">
        <v-col
          v-for="project in filteredProjects"
          :key="project.project_id"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            :color="getPhaseProjectCardInfo(project.project_name).color"
            class="project-card"
            dark
          >
            <v-card-title
              class="d-flex font-weight-bold flex-column align-items-center justify-content-center card-title-custom"
            >
              <div class="d-flex justify-content-between align-items-center">
                <v-icon
                  :icon="getPhaseProjectCardInfo(project.project_name).icon"
                  class="icon-background mb-2"
                  :color="getPhaseProjectCardInfo(project.project_name).color"
                ></v-icon>
                <v-chip
                  v-if="['22.8KV', '電業申辦', '161KV', '升壓站'].includes(project.project_name)"
                  color="green"
                  prepend-icon="mdi-check-circle"
                  variant="flat"
                  size="large"
                  class="ml-auto"
                >
                  已完工
                </v-chip>
              </div>
              {{ getPhaseProjectCardInfo(project.project_name).title }}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-actions class="justify-end">
              <template v-if="project.project_name === '案場'">
                <!-- <v-btn
                  :color="getPhaseProjectCardInfo(project.project_name).color"
                  class="mt-auto font-weight-bold btn-custom"
                  @click="
                    navigateToProject(getPhaseProjectCardInfo(project.project_name).routeName)
                  "
                >
                  瀏覽總迴路
                </v-btn> -->
              </template>
              <template v-else>
                <v-btn
                  :color="getPhaseProjectCardInfo(project.project_name).color"
                  class="mt-auto font-weight-bold btn-custom"
                  @click="viewFile(getPhaseProjectCardInfo(project.project_name))"
                  >瀏覽</v-btn
                >
              </template>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else-if="selectedPlan" justify="center">
        <v-col cols="12">
          <v-alert
            style="margin: 10px 20px"
            title="該計畫沒有其他專案項目。"
            type="warning"
          ></v-alert>
          <v-alert
            style="margin: 10px 20px"
            title="請選擇其他計畫。"
            type="info"
            variant="outlined"
            prominent
          ></v-alert>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import { fetchPlans, fetchProjects } from "@/api/planService";
export default {
  data() {
    return {
      plan: [], //所有計畫
      project: [], //所有專案
      selectedPlan: null, //所選中計畫
      currentDialog: null, //顯示當前對話框
    };
  },
  computed: {
    // 根據所選項目過濾專案
    filteredProjects() {
      // 如果沒有選中則回覆空數列
      console.log("api response:", this.selectedPlan);
      if (!this.selectedPlan) return [];
      // 返回有相同plan_id的專案項目
      return this.project.filter((projects) => projects.plan_id === this.selectedPlan);
    },
  },
  async created() {
    if (this.$route.query.planId && !isNaN(parseInt(this.$route.query.planId))) {
      this.selectedPlan = parseInt(this.$route.query.planId);
    } else {
      this.selectedPlan = null;
    }
    await this.fetchData();
  },
  methods: {
    viewFile(file) {
      this.$router.push({
        name: file.routeName,
        params: { fileId: file.fileId },
        query: {
          fileLink: file.url,
        },
      });
    },
    navigateToProject(projectRouteName, project) {
      console.log("api response:", this.selectedPlan);
      this.$router.push({
        name: projectRouteName,
        query: { Plan: this.selectedPlan, Project: project },
      });
    },
    navigateToManagement(projectRouteName) {
      console.log("api response:", this.selectedPlan);
      this.$router.push({
        name: projectRouteName,
        query: { Plan: this.selectedPlan },
      });
    },
    async fetchData() {
      try {
        const plansResponse = await fetchPlans();
        const projectsResponse = await fetchProjects();
        console.log("api response:", plansResponse.data);
        console.log("api response:", projectsResponse.data);
        this.plan = plansResponse.data;
        this.project = projectsResponse.data;
      } catch (error) {}
    },
    getProjectCardInfo(projectName) {
      // 根據項目名稱反應對應的名稱
      const projectInfo = {
        案場: {
          title: "案場工程進度",
          color: "#00b894",
          icon: "mdi-pier",
          routeName: "Project_PV",
          routeName1: "Project_Breeding",
          routeName2: "Loop_Photoelectric_Engineering",
          routeName3: "General_Loop_Photoelectric_Engineering",
        },
        "22.8KV": {
          title: "22.8KV工程進度",
          color: "#a29bfe",
          icon: "mdi-axis-arrow",
          routeName: "Powerline_228KV_Details",
        },
        電業申辦: {
          title: "電業申辦進度",
          color: "#FF6F00",
          icon: "mdi-flash-alert",
          routeName: "Electricity_Application_Process",
        },
        "161KV": {
          title: "161KV工程進度",
          color: "#ff7675",
          icon: "mdi-alpha-t-box-outline",
          routeName: "High-Voltage-161KV-Info",
        },
        升壓站: {
          title: "升壓站工程進度",
          color: "#38ada9",
          icon: "mdi-sprinkler-variant",
          routeName: "Booster_Station_Progress",
        },
        其他: {
          title: "工程進度",
          color: "#827717",
          icon: "mdi-help-box",
          routeName: "Other_Progress",
        },
      };
      return projectInfo[projectName] || {};
    },
    getPhaseProjectCardInfo(projectName) {
      // 根據項目名稱反應對應的名稱
      const projectInfo = {
        案場: {
          title: "案場工程進度",
          color: "#00b894",
          icon: "mdi-pier",
          routeName: "File_Progress",
          url: "",
        },
        "22.8KV": {
          title: "22.8KV工程進度",
          color: "#a29bfe",
          icon: "mdi-axis-arrow",
          routeName: "File_Progress",
          fileId: 5,
          url: "https://docs.google.com/spreadsheets/d/1XrJln7GXJbmOEjgMZdhaBN2ntU-KAV9L/edit?usp=sharing%26ouid=100002892372171714788%26rtpof=true%26sd=true",
        },
        電業申辦: {
          title: "電業申辦進度",
          color: "#FF6F00",
          icon: "mdi-flash-alert",
          routeName: "File_Progress",
          fileId: 4,
          url: "https://docs.google.com/spreadsheets/d/132bwWWBZmRaIwtzAm8JWkzuAArJaGuN5/edit?usp=sharing%26ouid=100002892372171714788%26rtpof=true%26sd=true",
        },
        "161KV": {
          title: "161KV工程進度",
          color: "#ff7675",
          icon: "mdi-alpha-t-box-outline",
          routeName: "File_Progress",
          fileId: 28,
          url: "https://docs.google.com/spreadsheets/d/1KS9fCHVwyFjl_3QdFgaJzXY_iieYqPFj/edit?usp=sharing&ouid=100002892372171714788&rtpof=true&sd=true",
        },
        升壓站: {
          title: "升壓站工程進度",
          color: "#38ada9",
          icon: "mdi-sprinkler-variant",
          routeName: "File_Progress",
          fileId: 27,
          url: "https://docs.google.com/spreadsheets/d/1OfVYR-cb9JEMb5hq5reNO8PwYIDgwQ5y/edit?usp=sharing&ouid=100002892372171714788&rtpof=true&sd=true",
        },
      };
      return projectInfo[projectName] || {};
    },
  },
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

.note-span {
  color: #6c757d;
  font-size: 11px;
}

.project-cards-row {
  margin: 20px;
}

.project-card {
  height: 180px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.icon-background {
  background-color: white;
  border-radius: 50%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 25px;
  margin-right: 16px;
}

.v-card-actions {
  padding-right: 20px;
}

.v-divider {
  border-width: 1px;
}

.card-title-custom {
  height: 120px;
  display: flex;
  margin-top: 10px;
  font-size: 20px;
}

.btn-custom {
  height: 30px;
  background-color: #ffffff;
  transition: box-shadow 0.3s ease;
  margin-bottom: 10px;
}

.btn-custom:hover {
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
}
</style>
