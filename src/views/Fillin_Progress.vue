<template>
  <v-container>
      <!-- 瀏覽計畫進度標題 -->
      <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center;">
          <v-icon color="blue">mdi-chevron-right-box</v-icon>
          <span class="font-weight-bold ml-2">填寫計畫進度：</span>
          <span class="ml-1 note-span">※在下方選擇一項計畫後，才會顯示計畫內容</span>
      </div>

      <!-- 選擇計畫 -->
      <div class="mb-3" style="padding-left: 40px; display: flex; align-items: center;">
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
          style="flex-grow: 1;"
          ></v-select>
      </div>

      <div>
          <v-row v-if="selectedPlan && filteredProjects.length > 0" class="project-cards-row">
              <v-col v-for="project in filteredProjects" :key="project.project_id" cols="12" sm="6" md="4">
                  <v-card :color="getProjectCardInfo(project.project_name).color" class="project-card" dark >
                      <v-card-title class="d-flex font-weight-bold flex-column align-items-center justify-content-center card-title-custom">
                          <v-icon :icon="getProjectCardInfo(project.project_name).icon" class="icon-background mb-2" :color="getProjectCardInfo(project.project_name).color"></v-icon>
                          {{ getProjectCardInfo(project.project_name).title }}
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-actions class="justify-end">
                          <template v-if="project.project_name === '案場'">
                              <v-btn :color="getProjectCardInfo(project.project_name).color" class="mt-auto font-weight-bold btn-custom" @click="navigateToProject(getProjectCardInfo(project.project_name).routeName, project.project_id)">紀錄PV進度</v-btn>
                              <v-btn :color="getProjectCardInfo(project.project_name).color" class="mt-auto font-weight-bold btn-custom" @click="navigateToProject(getProjectCardInfo(project.project_name).routeName1, project.project_id)">紀錄養殖進度</v-btn>
                          </template>
                          <template v-else>
                              <v-btn :color="getProjectCardInfo(project.project_name).color" class="mt-auto font-weight-bold btn-custom" @click="navigateToProject(getProjectCardInfo(project.project_name).routeName, project.project_id)">紀錄進度</v-btn>
                          </template>
                      </v-card-actions>
                  </v-card>
              </v-col>
          </v-row>

          <v-row v-else-if="selectedPlan">
              <p>此計畫沒有其他專案項目。</p>
          </v-row>

      </div>
  </v-container>
</template>

<script>
import { fetchPlans, fetchProjects } from '@/api/planService';
export default {
  data() {
    return {
      plan: [],//所有計畫
      project: [],//所有專案
      selectedPlan: null,//所選中計畫
      currentDialog: null, //顯示當前對話框
    };
  },
  computed: {
      // 根據所選項目過濾專案
      filteredProjects() {
      // 如果沒有選中則回覆空數列
      if (!this.selectedPlan) return [];
      // 返回有相同plan_id的專案項目
      return this.project.filter(projects => projects.plan_id === this.selectedPlan);
      }
  },
  async created() {
      await this.fetchData();
  },
  methods: {
      navigateToProject(projectRouteName, project) {
        console.log('api response:', this.selectedPlan);
          this.$router.push({ name: projectRouteName, query: { Plan: this.selectedPlan, Project: project } });
      },
      async fetchData() {
          try {
              const plansResponse = await fetchPlans();
              const projectsResponse = await fetchProjects();
              console.log('api response:', plansResponse.data);
              console.log('api response:', projectsResponse.data);
              this.plan = plansResponse.data;
              this.project = projectsResponse.data;
          } catch (error) {
              
          }
      },
      getProjectCardInfo(projectName) {
      // 根據項目名稱反應對應的名稱
      const projectInfo = {
          '案場': { title: '案場工程進度', color: '#00b894', icon: 'mdi-pier', routeName: 'PV_Progress', routeName1: 'Project_Breeding' },
          '22.8KV': { title: '22.8KV工程進度', color: '#a29bfe', icon: 'mdi-axis-arrow', routeName: 'Powerline_228KV_Details' },
          '電業申辦': { title: '電業申辦進度', color: '#FF6F00', icon: 'mdi-flash-alert', routeName: 'Electricity_Application_Process' },
          '161KV': { title: '161KV工程進度', color: '#ff7675', icon: 'mdi-alpha-t-box-outline', routeName: 'High-Voltage-161KV-Info' },
          '升壓站': { title: '升壓站工程進度', color: '#38ada9', icon: 'mdi-sprinkler-variant', routeName: 'Booster_Station_Progress' },
      };
      return projectInfo[projectName] || {};
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
background-color: #FFFFFF; 
transition: box-shadow 0.3s ease;
margin-bottom: 10px;
}

.btn-custom:hover {
  box-shadow: 0px 5px 15px rgba(0,0,0,0.3);
}
</style>
