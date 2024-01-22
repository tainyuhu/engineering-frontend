<template>
    <div class="background-card">
        <!-- 標題 -->
        <div class="title">  
            <div class="blue-rectangle"></div>
            <span class="span_title">工程進度填寫</span>
        </div>
        <!-- 內容 -->
        <div  class="flex-container">
            <div class="orange-rectangle"></div>
            <span class="span_label">計畫名稱：</span>
            <v-select :items="plan" item-title="plan_name" item-value="id" v-model="selectedPlan" variant="underlined"></v-select>
        </div>
        <div class="content">
            <v-row>
                <v-col v-for="item in progress_filling_items_Processed" :key="item['title']">
                    <v-card v-if="item.item.name === '案場'" class="card-radius"  :color="item['color']">
                        <v-card-title class="text-h5">
                            <v-row>
                            <v-col cols="12" >
                                <v-btn class="rounded-btn" variant="outlined" rounded="circle">
                                <svg-icon type="mdi" :path="item['icon']" :color="item['color']" size="35"></svg-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12">
                                <span class="span_title">{{ item['title'] }}</span>
                            </v-col>
                            </v-row>
                        </v-card-title>
                        <div class="spacer1"></div>
                        <v-card-actions class="d-flex justify-center">
                          <V-row>
                            <!-- 迴路下拉選單 -->
                            <v-col cols="12" md="6">
                              <v-select :items="loopOptions" item-title="loop_name" item-value="id" label="迴路" variant="underlined" v-model="selectedLoop"></v-select>
                            </v-col>

                            <!-- 案場下拉選單 -->
                            <v-col cols="12" md="6" >
                              <v-select :items="filteredSiteOptions" item-value="id" item-title="case_name" label="案場" variant="underlined"  v-model="selectedSite"></v-select>
                            </v-col>
                          </V-row>
                        </v-card-actions>
                        <v-card style="background-color: #FFFFFF;">
                            <!-- 當兩個選單都有值 -->
                          <div v-if="selectedLoop && selectedSite">
                            <v-row>
                              <v-col cols="12" md="6" class="d-flex justify-center align-center">
                                <v-btn block variant="text" size="x-large" @click="toggleDialog(item.Dialog1, item)"
                                 style="background-color: #FFFFFF;  padding: 5px 10px;" class="d-flex justify-center align-center">
                                  <span class="span_btn" style="color: #00b894;" >PV進度填寫</span>
                                </v-btn>
                              </v-col>
                              <v-divider v-if="!is_mobile" vertical></v-divider>
                              <v-divider v-else></v-divider>
                              <v-col cols="12" md="6" class="d-flex justify-center align-center">
                                <v-btn block variant="text" size="x-large" @click="toggleDialog(item.Dialog2, item)"
                                 style="background-color: #FFFFFF;  padding: 5px 10px;"  class="d-flex justify-center align-center">
                                  <span class="span_btn" style="color: #00b894;" >養殖進度填寫</span>
                                </v-btn>
                              </v-col>
                            </v-row>
                          </div>
                        </v-card>
                    </v-card>
                    <v-card v-else class="card-radius" :color="item['color']">
                        <v-card-title class="text-h5">
                            <v-row>
                            <v-col cols="12" >
                                <v-btn class="rounded-btn" variant="outlined" rounded="circle">
                                <svg-icon type="mdi" :path="item['icon']" :color="item['color']" size="35"></svg-icon>
                                </v-btn>
                            </v-col>
                            <v-col cols="12">
                                <span class="span_title">{{ item['title'] }}</span>
                            </v-col>
                            </v-row>
                        </v-card-title>
                        <div class="spacer"></div>
                        <v-card-actions class="d-flex justify-end">
                            <v-btn @click="toggleDialog(item.Dialog, item)" rounded="lg" size="x-large" :color="item['color']"
                        prepend-icon="mdi-pencil" style="background-color: #FFFFFF;  padding: 10px 20px; margin: 10px 10px;" >
                            <template v-slot:prepend>
                                <v-icon :color="item['color']"></v-icon>
                            </template>
                            開始記錄
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </div>




        <!-- PV 表單 -->
        <v-dialog v-model="showPVDialog" style="max-width: 800px;" scrollable>
            <v-card>
                <v-card-title style="background-color: #0D47A1;">
                <v-row style="max-height: 70px;">
                    <v-col cols="11" class="d-flex align-center">
                    <span style="color: #FFFFFF;font-weight: bold; font-size: 20pt;">填寫工程進度</span>
                    </v-col>
                    <v-col cols="1">
                    <v-btn variant="plain" style="background-color: #0D47A1;" icon @click="showPVDialog = false">
                        <v-icon style="background-color: #0D47A1;color: #FFFFFF;">mdi-close</v-icon>
                    </v-btn>
                    </v-col>
                </v-row>
                </v-card-title>
                
                <v-card-text :style="{ 'overflow-y': is_mobile ? 'auto' : 'hidden' }">
                <v-row>
                    <v-col cols="12" md="6">
                    <v-select :items="['王大明', '王小明', '王阿明']" label="工程名稱" variant="underlined"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                    <v-select :items="['王大明', '王小明', '王阿明']" label="現場監工" variant="underlined"></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                    <v-select :items="['施工中', '停工', '未開工']" label="工程狀態" variant="underlined"></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                    <v-menu v-model="menu" :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                        <v-text-field v-model="formattedDateRange" label="週間" variant="underlined" v-bind="props"
                            v-on="on"></v-text-field>
                        </template>
                        <v-date-picker show-adjacent-months color="primary" v-model="selectedDate"
                        @click:save="menu = false"></v-date-picker>
                    </v-menu>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field :model-value="0" label="施工人數" variant="underlined" suffix="人"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <div style="overflow-y: auto; max-height: 250px; overflow-x: hidden;">
                            <v-col v-for="item in items" :key="item['title']" style="width: 100%;" >
                                <v-expansion-panels>
                                    <v-expansion-panel>
                                        <v-expansion-panel-title color="primary" style="font-weight: bold;">
                                            <v-row no-gutters>
                                            <v-col class="d-flex justify-start">
                                                {{ item['title'] }}
                                            </v-col>
                                            </v-row>
                                        </v-expansion-panel-title>
                                        <v-expansion-panel-text style="background-color: #E3F2FD;">
                                        <v-expansion-panels>
                                            <v-expansion-panel v-for="panel in item['panels']" :key="panel['title']">
                                            <v-expansion-panel-title style="border: 3px solid #E3F2FD;color: #0D47A1;font-weight: bold;">
                                            
                                                <v-row no-gutters>
                                                    <v-col class="d-flex justify-start">
                                                    {{ panel['title'] }}
                                                    </v-col>
                                                </v-row>
                                            
                                            </v-expansion-panel-title>
                                            <v-expansion-panel-text>
                                                <v-row justify="space-around" no-gutters>
                                                <v-col cols="12" md="6" class="d-flex align-center justify-center">
                                                    <v-text-field hint="僅供參考" suffix="%" :model-value="panel['progress']" label="前次進度"
                                                    variant="outlined" readonly style="margin: 10px;"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field :model-value="0" label="本周進度" variant="outlined" suffix="%"
                                                    style="margin: 10px;"></v-text-field>
                                                </v-col>
                                                </v-row>
                                            </v-expansion-panel-text>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </div>
                    </v-col>
                    
                    <v-col cols="12" class="d-flex justify-end">
                    <v-btn color="primary" @click="clearForm" style="margin: 5px;">清空</v-btn>
                    <v-btn color="secondary" @click="submitForm" style="margin: 5px;">送出</v-btn>
                    </v-col>
                </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- 養殖表單 -->
        <v-dialog v-model="showBreedingDialog" style="max-width: 800px;" scrollable>
            <v-card>
                <v-card-title style="background-color: #0D47A1;">
                <v-row style="max-height: 70px;">
                    <v-col cols="11" class="d-flex align-center">
                    <span style="color: #FFFFFF;font-weight: bold; font-size: 20pt;">填寫工程進度</span>
                    </v-col>
                    <v-col cols="1">
                    <v-btn variant="plain" style="background-color: #0D47A1;" icon @click="showBreedingDialog = false">
                        <v-icon style="background-color: #0D47A1;color: #FFFFFF;">mdi-close</v-icon>
                    </v-btn>
                    </v-col>
                </v-row>
                </v-card-title>
                
                <v-card-text :style="{ 'overflow-y': is_mobile ? 'auto' : 'hidden' }">
                <v-row>
                    <v-col cols="12" md="6">
                    <v-select :items="['王大明', '王小明', '王阿明']" label="工程名稱" variant="underlined"></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                    <v-select :items="['王大明', '王小明', '王阿明']" label="現場監工" variant="underlined"></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                    <v-select :items="['施工中', '停工', '未開工']" label="工程狀態" variant="underlined"></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                    <v-menu v-model="menu" :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                        <v-text-field v-model="formattedDateRange" label="週間" variant="underlined" v-bind="props"
                            v-on="on"></v-text-field>
                        </template>
                        <v-date-picker show-adjacent-months color="primary" v-model="selectedDate"
                        @click:save="menu = false"></v-date-picker>
                    </v-menu>
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field :model-value="0" label="施工人數" variant="underlined" suffix="人"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <div style="overflow-y: auto; max-height: 250px; overflow-x: hidden;">
                            <v-col v-for="item in items" :key="item['title']" style="width: 100%;" >
                                <v-expansion-panels>
                                    <v-expansion-panel>
                                        <v-expansion-panel-title color="primary" style="font-weight: bold;">
                                            <v-row no-gutters>
                                            <v-col class="d-flex justify-start">
                                                {{ item['title'] }}
                                            </v-col>
                                            </v-row>
                                        </v-expansion-panel-title>
                                        <v-expansion-panel-text style="background-color: #E3F2FD;">
                                        <v-expansion-panels>
                                            <v-expansion-panel v-for="panel in item['panels']" :key="panel['title']">
                                            <v-expansion-panel-title style="border: 3px solid #E3F2FD;color: #0D47A1;font-weight: bold;">
                                            
                                                <v-row no-gutters>
                                                    <v-col class="d-flex justify-start">
                                                    {{ panel['title'] }}
                                                    </v-col>
                                                </v-row>
                                            
                                            </v-expansion-panel-title>
                                            <v-expansion-panel-text>
                                                <v-row justify="space-around" no-gutters>
                                                <v-col cols="12" md="6" class="d-flex align-center justify-center">
                                                    <v-text-field hint="僅供參考" suffix="個" :model-value="panel['progress']" label="前次總量"
                                                    variant="outlined" readonly style="margin: 10px;"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" md="6">
                                                    <v-text-field :model-value="0" label="本周總量" variant="outlined" suffix="個"
                                                    style="margin: 10px;"></v-text-field>
                                                </v-col>
                                                </v-row>
                                            </v-expansion-panel-text>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </v-col>
                        </div>
                    </v-col>
                    
                    <v-col cols="12" class="d-flex justify-end">
                    <v-btn color="primary" @click="clearForm" style="margin: 5px;">清空</v-btn>
                    <v-btn color="secondary" @click="submitForm" style="margin: 5px;">送出</v-btn>
                    </v-col>
                </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- 電業申辦表單 -->
        <v-dialog v-model="showelectricityDialog" style="max-width: 800px;" scrollable>
            <v-card>
                <v-card-title style="background-color: #0D47A1;">
                <v-row style="max-height: 70px;">
                    <v-col cols="11" class="d-flex align-center">
                    <span style="color: #FFFFFF;font-weight: bold; font-size: 20pt;">填寫申辦進度</span>
                    </v-col>
                    <v-col cols="1">
                    <v-btn variant="plain" style="background-color: #0D47A1;" icon @click="showelectricityDialog = false">
                        <v-icon style="background-color: #0D47A1;color: #FFFFFF;">mdi-close</v-icon>
                    </v-btn>
                    </v-col>
                </v-row>
                </v-card-title>
                
                <v-card-text :style="{ 'overflow-y': is_mobile ? 'auto' : 'hidden' }">
                <v-row>
                    <v-col cols="12" md="4">
                    <v-select :items="['王大明', '王小明', '王阿明']" label="迴路名稱" variant="underlined"></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                    <v-select :items="['王大明', '王小明', '王阿明']" label="填表人員" variant="underlined"></v-select>
                    </v-col>
                    <v-col cols="12" md="4">
                    <v-menu v-model="menu" :close-on-content-click="false">
                        <template v-slot:activator="{ props }">
                        <v-text-field v-model="formattedDateRange" label="週間" variant="underlined" v-bind="props"
                            v-on="on"></v-text-field>
                        </template>
                        <v-date-picker show-adjacent-months color="primary" v-model="selectedDate"
                        @click:save="menu = false"></v-date-picker>
                    </v-menu>
                    </v-col>
                    <v-col cols="12" class="d-flex align-center justify-center">
                      <v-expansion-panels>
                          <v-expansion-panel>
                            <v-expansion-panel-title color="primary">
                                <v-row no-gutters>
                                    <v-col class="d-flex justify-start">
                                    電業申辦進度更新
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                                <v-row justify="space-around" no-gutters>
                                <v-col cols="12" md="6" class="d-flex align-center justify-center">
                                    <v-text-field hint="僅供參考" model-value="初步協商 - 50%" label="前次進度"
                                    variant="outlined" readonly style="margin: 10px;"></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                  <v-select :items="['細部協商 - 55%', '出流管制 - 65%', '施工許可 - 75%']" label="本次進度" variant="underlined"></v-select>
                                </v-col>
                                </v-row>
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                      </v-expansion-panels>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-end">
                    <v-btn color="primary" @click="clearForm" style="margin: 5px;">清空</v-btn>
                    <v-btn color="secondary" @click="submitForm" style="margin: 5px;">送出</v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>



    </div>
</template>
<script>
import axios from 'axios';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPier,mdiPool,mdiFlashAlert,mdiSprinklerVariant,mdiAxisArrow,mdiAlphaT, mdiBlackMesa,mdiPencil } from '@mdi/js';
export default {
  name: "my-component",
  components: {
    SvgIcon
  },
  data() {
    return {
      mdiPencil,
      mdiPier,
      mdiPool,
      mdiFlashAlert,
      mdiSprinklerVariant,
      mdiAxisArrow,
      // 從資料庫讀取數據
      planNames: [],// 所有計畫名稱
      plan: [],
      project: [],
      showPVDialog: false, //PV填寫表單
      showBreedingDialog: false, //養殖填寫表單
      showelectricityDialog: false, //電業申辦填寫表單
      showDialog1: false,
      menu: false,
      currentProjectitem: null,
      selectedDate: new Date().toISOString().substr(0, 10),
      show: false,
      weekDays: [],
      selectedPlan: null,
      progress_filling_items: [],
      progress_filling_items_Processed: [],
      record_planid:null,
      loopOptions: [], 
      siteOptions: [], 
      selectedSite: null, 
      filteredSiteOptions: [],
      selectedLoop: null, 
      subitem: [],
      items: [
        { // A
          title: 'A.土建工程', panels: [
            { progress: 12, title: '測量放樣+基樁加工' },
            { progress: 12, title: '植樁工程' },
            { progress: 12, title: '路口監視設備安裝' },
          ]
        },
        { // B
          title: 'B.結構工程', panels: [
            { progress: 12, title: '結構部件組裝架設工程', },
            { progress: 12, title: '水槽安裝', },
            { progress: 12, title: '立柱水泥灌漿作業', },
          ]
        },
      ]
    };
  },
  computed: {
    formattedDateRange() {
      const formatDate = (date) => {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        const dayOfWeek = days[date.getDay()];
        return `${year}/${month}/${day}`;
      };

      if (this.selectedDate) {
        const date = new Date(this.selectedDate);
        const dayOfWeekIndex = date.getDay();

        const startDate = new Date(date);
        startDate.setDate(date.getDate() - dayOfWeekIndex + (dayOfWeekIndex === 0 ? -1 : 0));

        const endDate = new Date(date);
        endDate.setDate(date.getDate() + (6 - dayOfWeekIndex) + (dayOfWeekIndex === 0 ? 1 : 0));

        return `${formatDate(startDate)} - ${formatDate(endDate)}`;
      }
      return null;
    },
    is_mobile() {
      return this.$vuetify.display.xs
    },
    filteredLoopOptions() {
      const projectsForSelectedPlan = this.projects.filter(project => project.plan_id === this.selectedPlan);
      const projectIdsForSelectedPlan = projectsForSelectedPlan.map(project => project.id);

      return this.loopOptions.filter(loopOption => projectIdsForSelectedPlan.includes(loopOption.project_id));
    }
    
  },
  methods: {
    async toggleDialog(dialogName, item) {
    const hasPermission = await this.checkPermission(item);
    if (hasPermission) {
      this.currentProjectitem = item;
      this[dialogName] = !this[dialogName];
    } else {
      alert('您沒有權限執行該操作');
    }
  },
    clearForm() {

    },
    submitForm() {

    },
    getPlanIdFromName(newVal) {
      const selectedPlans = this.plan.find(plan => plan.name === newVal);
      return selectedPlans ? selectedPlans.id : null;
    },
    fetchProjectsForPlan(planId) {
      axios.get(`/api/projects-by-plan/?plan_id=${planId}`)
      
        .then(response => {
          console.log('api response:', response.data);
          this.progress_filling_items = response.data.map(project => ({ id: project.id, name: project.projcet_name }));
          this.processProgressFillingItems(this.progress_filling_items)
          console.log(this.progress_filling_items_Processed);
        })
        .catch(error => {
          console.error('Error fetching projects:', error);
          this.progress_filling_items = [];
        });
        
    },
    processProgressFillingItems(progress_filling_items) {
      console.log(progress_filling_items);
      this.progress_filling_items.forEach(item => {
        if (item.name === '案場') {
          this.progress_filling_items_Processed.push({
            item:item,
            title: '案場工程進度',
            color: '#00b894',
            icon: mdiPier,
            Dialog1: 'showPVDialog',
            Dialog2: 'showBreedingDialog'
          });
        } else if (item.name === '22.8KV') {
          this.progress_filling_items_Processed.push({
            item:item,
            title: '22.8KV工程進度',
            color: '#a29bfe',
            icon: mdiAxisArrow,
            Dialog: 'showPVDialog'
          });
        } else if (item.name === '電業申辦') {
          this.progress_filling_items_Processed.push({
            item:item,
            title: '電業申辦進度',
            color: '#FF6F00',
            icon: mdiFlashAlert,
            Dialog: 'showelectricityDialog'
          });
        }else if (item.name === '161KV') {
          this.progress_filling_items_Processed.push({
            item:item,
            title: '161KV工程進度',
            color: '#ff7675' ,
            icon:mdiAlphaT,
            Dialog:"showDialog1"
          });
        }else if (item.name === '升壓站') {
          this.progress_filling_items_Processed.push({
            item:item,
            title: '升壓站工程進度',
            color: '#38ada9' ,
            icon:mdiSprinklerVariant,
            Dialog:"showDialog1"
          });
        }
      });
      console.log(this.progress_filling_items_Processed)
    },
    async checkPermission(item) {
      const user = localStorage.getItem('user');
      const resource = item.title;
      const action = "write";
      console.log({user},{resource},{action})
      const hasPermission = await this.$permissionCheck.checkPermission(user, resource, action);
      console.log("hasPermission",hasPermission)
      return hasPermission
    }
  },
  mounted() {
    // console.log(this.$vuetify.display.mobile)
    console.log(this.is_mobile)
    // 請求所有計畫的API
    axios.get('/api/plans/')
      .then((response) => {
        // 記錄回應以查看實際得到的內容
        console.log('api response:', response.data);

        if (Array.isArray(response.data)) {
          this.plan = response.data;
          this.planNames = response.data.map(plan => plan.plan_name);
        } 
        else {
          console.error('Unexpected response format:', response.data);
          throw new Error('Unexpected response format');
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the plans:', error);
      });
      // 請求所有專案的API
      axios.get('/api/projects/')
        .then((response) => {
          // 記錄回應以查看實際得到的內容
          console.log('api response:', response.data);

          if (Array.isArray(response.data)) {
            this.project = response.data;
          } 
          else {
            console.error('Unexpected response format:', response.data);
            throw new Error('Unexpected response format');
          }
        })
      .catch((error) => {
        console.error('There was an error fetching the plans:', error);
      });
      // 請求所有迴路的API
    axios.get('/api/project-loop/')
      .then((response) => {
        // 記錄回應以查看實際得到的內容
        console.log('loop api response:', response.data);

        if (Array.isArray(response.data)) {
          this.loopOptions = response.data;
        }
        else {
          console.error('Unexpected response format:', response.data);
          throw new Error('Unexpected response format');
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the plans:', error);
      });
    axios.get('/api/project-cases/')
      .then((response) => {
        // 記錄回應以查看實際得到的內容
        console.log('api response:', response.data);

        if (Array.isArray(response.data)) {
          this.siteOptions = response.data;
        }
        else {
          console.error('Unexpected response format:', response.data);
          throw new Error('Unexpected response format');
        }
      })
      .catch((error) => {
        console.error('There was an error fetching the plans:', error);
      });
  },
  watch: {
    selectedPlan(newVal) {
      if (newVal) {
        this.fetchProjectsForPlan(newVal);
        this.progress_filling_items_Processed= [];  
      } else {
        this.progress_filling_items = [];
      }
    },
    selectedLoop(newVal) {
      if (newVal) {
        this.filteredSiteOptions = this.siteOptions.filter(site => site.loop_id === newVal);
      } else {
        this.filteredSiteOptions = [];
      }
      this.selectedSite = null;
    }
  },
};

</script>

<style scoped>

.background-card {
    background-color: #fcfcfc;
    height: 100vh;
    width: 100%;
}
.title{
    margin: 15px;
}
.flex-container {
    margin: 25px;
    display: flex;
    align-items: center;
}
.content {
    justify-content: center;
    align-items: center;
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

.orange-rectangle {
  background-color: #FF6F00;
  width: 10px;            
  height: 20px;           
  display: inline-block;  
  vertical-align: middle; 
  margin-right: 10px;
}
.span_title{
    display: inline-block; 
    vertical-align: middle;
    margin: 0;
    font-size: 16pt; 
    font-weight: bold; 
    margin-left:10px;
    margin-bottom:10px;
}
.span_label{
    display: inline-block; 
    vertical-align: middle;
    font-size: 16pt; 
    font-weight: bold; 
    margin:10px;
}

.span_btn{
    display: inline-block; 
    vertical-align: middle;
    font-size: 12pt; 
    font-weight: bold; 
    justify-content: center;
    align-items: center;
}

.rounded-btn {
  width: 60px; 
  height: 65px; 
  border-radius: 50%; 
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top:10px;
  margin-left:10px;
  background-color: #FFFFFF; 
  box-shadow: inset 0 3px 5px rgba(0,0,0,0.25); 
}
.card-radius{
    border-radius: 16px;
}
.spacer {
  height: 50px; 
  width: 250px
}
.spacer1 { 
  width: 250px
}
.spacer_case {
  height: 15px; 
  width: 250px
}
:deep(.v-btn),
:deep(.v-col),
:deep(.v-select) {
  font-size: 12pt;
}

:deep(.v-expansion-panel-text) {
  font-size: 12pt;
}

:deep(.v-label.v-field-label) {
  font-size: 12pt;
}

:deep(.model-value) {
  background-color: gray;
}
</style>
