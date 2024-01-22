<template>
  <div>
    <v-card class="mx-auto">
      <v-container>
        <v-row>
          <v-col cols="12"  md="4" v-for="item in progress_filling_items" :key="item['title']">
            <v-card  :color="item['color']" max-width="400" max-height="300" style="border-radius: 16px;">
              <v-card-title class="text-h5">
                <v-row>
                  <v-col cols="12">
                    <v-btn class="rounded-btn" variant="outlined" rounded="circle">
                      <svg-icon type="mdi" :path="item['icon']" :color="item['color']" size="50"></svg-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12">
                    <span style="font-size: 20pt; font-weight: bold; margin:10px;">{{ item['title'] }}</span>
                  </v-col>
                </v-row>
              </v-card-title>
              <div class="spacer"></div>
              <v-card-actions class="d-flex justify-end">
                <v-btn @click="toggleDialog(item.Dialog)" rounded="lg" size="x-large" :color="item['color']"
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
      </v-container>
    </v-card>
    <v-dialog v-model="showDialog" style="max-width: 800px;" scrollable>
      <v-card>
        <v-card-title style="background-color: #0D47A1;">
          <v-row style="max-height: 70px;">
            <v-col cols="11" class="d-flex align-center">
              <span style="color: #FFFFFF;font-weight: bold; font-size: 20pt;">填寫工程進度</span>
            </v-col>
            <v-col cols="1">
              <v-btn variant="plain" style="background-color: #0D47A1;" icon @click="showDialog = false">
                <v-icon style="background-color: #0D47A1;color: #FFFFFF;">mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        
        <v-card-text style="overflow-y: hidden;">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field label="工程名稱" variant="underlined"></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select :items="['王大明', '王小明', '王阿明']" label="現場監工" variant="underlined"></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-select :items="['施工中', '停工', '未開工']" label="工程狀態" variant="underlined"></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-menu v-model="menu" :close-on-content-click="false">
                <template v-slot:activator="{ props }">
                  <v-text-field v-model="formattedDateRange" label="週間" variant="underlined" v-bind="props"
                    v-on="on"></v-text-field>
                </template>
                <v-date-picker show-adjacent-months color="primary" v-model="selectedDate"
                  @click:save="menu = false"></v-date-picker>
              </v-menu>
            </v-col>

            <div style="overflow-y: auto; max-height: 500px;">
              <v-col cols="12" v-for="item in items" :key="item['title']">
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
                              <v-col cols="12" md="3" class="d-flex align-center justify-center">
                                <v-text-field hint="僅供參考" suffix="%" :model-value="panel['progress']" label="前次進度"
                                  variant="outlined" readonly style="margin: 10px;"></v-text-field>
                              </v-col>
                              <v-col cols="12" md="5">
                                <v-text-field :model-value="0" label="本周進度" variant="outlined" suffix="%"
                                  style="margin: 10px;"></v-text-field>
                              </v-col>
                              <v-col cols="12" md="4">
                                <v-text-field :model-value="0" label="施工人數" variant="outlined" suffix="人"
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
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiPier,mdiPool,mdiFlashAlert,mdiSprinklerVariant,mdiAxisArrow,mdiAlphaT } from '@mdi/js';
export default {
  name: "my-component",
  components: {
    SvgIcon
  },
  data() {
    return {
      mdiPier,
      mdiPool,
      mdiFlashAlert,
      mdiSprinklerVariant,
      mdiAxisArrow,
      showDialog: false,
      showDialog1: false,
      menu: false,
      selectedDate: new Date().toISOString().substr(0, 10),
      show: false,
      weekDays: [],
      progress_filling_items: [
        { title: 'PV工程進度',color: '#00b894' ,icon:mdiPier,Dialog:"showDialog"},
        { title: '養殖工程進度',color: '#0984e3' ,icon:mdiPool,Dialog:"showDialog1"},
        { title: '電能申辦進度',color: '#FF6F00' ,icon:mdiFlashAlert,Dialog:"showDialog1"},
        { title: '22.8KV工程進度',color: '#a29bfe' ,icon:mdiAxisArrow,Dialog:"showDialog1"},
        { title: '161KV工程進度',color: '#ff7675' ,icon:mdiAlphaT,Dialog:"showDialog1"},
        { title: '升壓站工程進度',color: '#38ada9' ,icon:mdiSprinklerVariant,Dialog:"showDialog1"},
      ],
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
  },
  mounted() {
    // console.log(this.$vuetify.display.mobile)
    console.log(this.is_mobile)

  },
  methods: {
    toggleDialog(dialogName) {
      this[dialogName] = !this[dialogName];
    },
    clearForm() {

    },
    submitForm() {
      this.showDialog = false;
      this.showDialog = false;

    },

  },
};
</script>

<style scoped>
.rounded-btn {
  width: 80px; /* Ensure this is equal to the height */
  height: 85px; /* Ensure this is equal to the width */
  border-radius: 50%; /* This will make it a circle */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF; /* Background color */
  box-shadow: inset 0 3px 5px rgba(0,0,0,0.25); /* Inner shadow */
}
.spacer {
  height: 60px; /* Adjust the height as needed */
}
:deep(.v-btn),
:deep(.v-col) {
  font-size: 14pt;
}

:deep(.v-expansion-panel-text) {
  font-size: 14pt;

}

:deep(.v-label.v-field-label) {
  font-size: 14pt;
}

:deep(.model-value) {
  background-color: gray;
}
</style>