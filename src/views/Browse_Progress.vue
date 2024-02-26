<template>
    <v-container>
      <!-- 瀏覽計畫進度标题和图标 -->
      <div class="mb-3" style="padding-left: 20px; display: flex; align-items: center;">
        <v-icon color="blue">mdi-chevron-right-box</v-icon>
        <span class="font-weight-bold ml-2">瀏覽計畫進度：</span>
        <span class="ml-1 note-span">※在下方選擇一項計畫後，才會顯示計畫內容</span>
      </div>
  
      <!-- 选择计划部分 -->
      <div class="mb-3" style="padding-left: 40px; display: flex; align-items: center;">
        <v-icon color="orange">mdi-chevron-right-box</v-icon>
        <span class="font-weight-bold ml-2">選擇計畫：</span>
        <v-select
          label="選擇欲瀏覽的計畫"
          variant="underlined"
          class="ml-3"
          :items="plan" 
          item-title="plan_name" 
          item-value="id" 
          v-model="selectedPlan"
          style="flex-grow: 1;"
        ></v-select>
      </div>
    </v-container>
  </template>
  
  <script>
  import { fetchPlans, fetchLoopByPlan, fetchLoops } from '@/api/planService';
  export default {
    data() {
      return {
        planNames: [],// 所有計畫名稱
        plan: [],//所有計畫
        selectedPlan: null,//所選中的計畫
      };
    },
    methods: {
        async fetchData() {
            try {
                const plansResponse = await fetchPlans();
                this.plans = plansResponse.data;
                this.planNames = plansResponse.data.map(plan => plan.plan_name);
            } catch (error) {
                
            }
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
  </style>
  