<template>
  <v-container fluid>
    <!-- 標題 -->
    <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center">
      <v-icon color="blue" class="icon">mdi-chevron-down-box</v-icon>
      <span class="font-weight-bold ml-2">瀏覽總體計畫進度：</span>
      <span class="ml-1 note-span">※需要查看統體計畫內容請點選按鈕</span>
      <div class="search-container">
        <v-text-field
          v-model="searchText"
          label="請輸入關鍵字"
          single-line
          hide-details
          dense
          class="search-input"
          variant="solo"
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </div>
    </div>

    <!-- 功能列 -->
    <!-- <div class="select-container">
      <v-select
        v-model="filterStatus"
        :items="['All', 'Active', 'Expired', 'Not Started']"
        label="施工狀態篩選"
        dense
        class="select-input"
        density="compact"
        variant="solo"
      ></v-select>
    </div> -->

    <v-sheet class="mx-auto sheet-card" max-width="99%">
      <v-slide-group>
        <v-slide-item v-for="(planGroup, index) in filteredPlanGroups" :key="index">
          <v-card class="mb-5 card-shadow" :color="getColor(planGroup.status)">
            <v-card-title class="d-flex justify-space-between align-center">
              <span class="plan-title">{{ planGroup.name }}</span>
              <v-chip
                style="margin-left: 5px"
                :color="getMasterProgressColor(planGroup.progress)"
                variant="flat"
              >
                {{ planGroup.progress }}%
              </v-chip>
              <v-btn
                style="margin-left: 5px"
                variant="tonal"
                size="small"
                color="white"
                @click="goToDetails(planGroup)"
              >
                查看
              </v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="white-background">
              <v-carousel height="250" hide-delimiters>
                <template v-slot:prev="{ props }">
                  <v-btn
                    density="compact"
                    :color="getColor(planGroup.status)"
                    variant="text"
                    @click="props.onClick"
                    icon="mdi-chevron-left"
                  ></v-btn>
                </template>
                <template v-slot:next="{ props }">
                  <v-btn
                    density="compact"
                    :color="getColor(planGroup.status)"
                    variant="text"
                    @click="props.onClick"
                    icon="mdi-chevron-right"
                  ></v-btn>
                </template>
                <v-carousel-item v-for="(project, pIndex) in planGroup.projects" :key="pIndex">
                  <div class="project-container d-flex flex-row flex-wrap justify-center">
                    <div class="project-item">
                      <div class="project-title font-weight-bold">
                        <v-icon style="margin-right: 5px" :color="getColor(planGroup.status)">
                          mdi-file-table-box
                        </v-icon>
                        <span>{{ project.name }}</span>
                      </div>
                      <v-progress-circular
                        class="progress-circular"
                        :size="100"
                        :width="12"
                        :model-value="project.progress"
                        :color="getProgressColor(project.progress)"
                      >
                        <span class="progress-text">{{ project.progress }}%</span>
                      </v-progress-circular>
                      <v-btn
                        variant="tonal"
                        block
                        :color="getColor(planGroup.status)"
                        @click="goToDetail(project)"
                        style="margin-top: 10px"
                      >
                        瀏覽
                      </v-btn>
                    </div>
                  </div>
                </v-carousel-item>
              </v-carousel>
            </v-card-text>
          </v-card>
        </v-slide-item>
      </v-slide-group>
    </v-sheet>

    <div class="detail-card" v-if="selectedPlanGroup">
      <masterProgressTable
        :selectedMasterPlanId="selectedPlanGroup.master_id"
      ></masterProgressTable>
    </div>
  </v-container>
</template>

<script>
import masterProgressTable from "@/components/table/masterProgressTable.vue";

export default {
  components: {
    masterProgressTable,
  },
  data() {
    return {
      filterStatus: "All",
      searchText: null,
      selectedPlanGroup: null,
      planGroups: [
        {
          master_id: 1,
          name: "總體計畫",
          status: "Active",
          progress: 51.15,
          projects: [
            { name: "Phase1", progress: 90.04, plan_id: 3 },
            { name: "Phase2", progress: 6, plan_id: 1 },
            { name: "三小案", progress: 97.2, plan_id: 4 },
          ],
        },
      ],
    };
  },
  methods: {
    getProgressColor(progress) {
      if (progress >= 100) return "green";
      if (progress >= 95) return "blue";
      if (progress >= 50) return "orange";
      return "red";
    },
    getMasterProgressColor(progress) {
      if (progress >= 100) return "green lighten-5";
      if (progress >= 95) return "blue lighten-5";
      if (progress >= 50) return "orange-lighten-5";
      return "red lighten-5";
    },
    getColor(status) {
      switch (status) {
        case "Active":
          return "amber-darken-4";
        case "Expired":
          return "green";
        default:
          return "grey darken-3";
      }
    },
    getTextColor(index) {
      return "white";
    },
    goToDetails(planGroup) {
      this.selectedPlanGroup = planGroup;
      this.$nextTick(() => {
        const detailsElement = this.$el.querySelector(".detail-card");
        if (detailsElement) {
          const elementPosition = detailsElement.getBoundingClientRect().top + window.scrollY - 65;
          window.scrollTo({ top: elementPosition, behavior: "smooth" });
        }
      });
    },
    goToDetail(project) {
      this.$router.push({
        name: "Browse_Progress",
        query: { planId: project.plan_id },
      });
    },
  },
  computed: {
    filteredPlanGroups() {
      return this.planGroups.filter((group) => {
        const statusMatch = this.filterStatus === "All" || group.status === this.filterStatus;
        const groupNameMatch = group.name
          .toLowerCase()
          .includes(this.searchText ? this.searchText.toLowerCase() : "");
        const projectMatch = group.projects.some((project) =>
          project.name.toLowerCase().includes(this.searchText ? this.searchText.toLowerCase() : "")
        );

        return statusMatch && (groupNameMatch || projectMatch);
      });
    },
  },
};
</script>

<style scoped>
.v-container {
  padding-left: 0px;
  max-width: 100%;
}

.icon {
  font-size: 35px;
}

.note-span {
  color: #6c757d;
  font-size: 11px;
}

.v-select,
.v-text-field {
  flex: 1;
  min-width: 200px;
}

.card-shadow {
  margin: 10px;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
}

.sheet-card {
  background-color: white;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 10px;
}

.detail-card {
  background-color: white;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  margin: 10px;
  border-radius: 5px;
  padding: 10px;
}

.white-background {
  background-color: white;
}

.plan-title {
  font-weight: bold;
  font-size: 1rem;
}

.project-container {
  display: flex;
  flex-wrap: wrap;
}

.project-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
}

.project-title {
  font-size: 1rem;
  margin-bottom: 10px;
  color: black;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}

.progress-circular {
  margin: 10px 3px;
}

.progress-text {
  font-size: 1rem;
}

.search-input {
  width: 100%;
  background: #ffffff;
}

.search-container {
  margin-left: auto;
  width: 300px;
}

.select-input {
  width: 100%;
}

.select-container {
  margin-left: auto;
  width: 200px;
}
</style>
