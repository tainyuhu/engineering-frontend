<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <v-row>
          <v-col cols="12" md="4" v-for="(planGroup, index) in planGroups" :key="index">
            <v-card class="mb-5 card-shadow" :color="getColor(index)" elevation="2">
              <v-card-title class="d-flex justify-space-between align-center">
                <span class="plan-title">{{ planGroup.name }}</span>
                <v-btn text :color="getTextColor(index)" @click="goToDetails(planGroup)"
                  >查看詳情</v-btn
                >
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="white-background">
                <div class="project-container d-flex flex-row flex-wrap justify-center">
                  <div
                    v-for="(project, pIndex) in planGroup.projects"
                    :key="pIndex"
                    class="project-item"
                  >
                    <div class="project-title">{{ project.name }}</div>
                    <v-progress-circular
                      class="progress-circular"
                      rotate="-90"
                      :size="80"
                      :width="10"
                      :model-value="project.progress"
                      :color="getProgressColor(project.progress)"
                    >
                      {{ project.progress }}%
                    </v-progress-circular>
                    <v-btn text :color="getTextColor(index)" @click="goToDetails(project)"
                      >瀏覽</v-btn
                    >
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      planGroups: [
        {
          name: "總體計畫",
          projects: [
            { name: "Phase1", progress: 50 },
            { name: "Phase2", progress: 70 },
            { name: "三小案", progress: 70 },
          ],
        },
        {
          name: "B",
          projects: [
            { name: "B1", progress: 20 },
            { name: "B2", progress: 95 },
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
    getColor(index) {
      const colors = ["blue-grey darken-3", "brown darken-3"];
      return colors[index % colors.length];
    },
    getTextColor(index) {
      return "white";
    },
    getStatusColor(status) {
      return status === "Active" ? "blue" : "green";
    },
    goToDetails(planGroup) {
      console.log("Navigating to details of ", planGroup.name);
      // navigate to details
    },
  },
};
</script>

<style scoped>
.card-shadow {
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
}

.white-background {
  background-color: white;
}

.plan-title {
  font-weight: bold;
  font-size: 1.2rem;
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
}

.progress-circular {
  margin: 5px;
}
</style>
