<template>
  <div
    class="sidebar"
    style="flex: 2; margin: 20px; display: flex; flex-direction: column; height: 500px"
  >
    <div class="mb-3" style="padding-left: 20px; align-items: center">
      <v-icon color="green">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">選擇案場：</span>
      <div>
        <span class="ml-1 note-span">※可以透過點選取消與選擇案場</span>
      </div>
      <div>
        <v-btn small color="primary" @click="selectAllPvs">全選</v-btn>
        <v-btn small color="error" style="margin-left: 5px" @click="deselectAllPvs">全部取消</v-btn>
      </div>
    </div>
    <div style="overflow-y: auto">
      <div v-for="item in uniquePvNames" :key="item.name" style="flex-grow: 1; margin: 5px">
        <v-btn
          block
          rounded="0"
          :class="{ selected: isPvSelected(item.name), deselected: !isPvSelected(item.name) }"
          :style="
            isPvSelected(item.name)
              ? { background: item.color, color: 'white' }
              : { background: 'white', color: item.color, border: `1px solid ${item.color}` }
          "
          @click="selectPv(item.name)"
        >
          {{ item.name }}
        </v-btn>
      </div>
    </div>
  </div>
  <Chart
    v-if="Object.keys(chartData).length > 0"
    :chartData="chartData"
    :chartOptions="chartOptions"
    style="flex: 8; margin-top: 25px"
  />
</template>

<script>
import Chart from "@/components/chart/Chart.vue";

export default {
  components: {
    Chart,
  },
  props: {
    chartData: Object,
  },
  computed: {
    uniquePvNames() {
      const uniqueNames = new Map();
      if (this.chartData.datasets) {
        this.chartData.datasets.forEach((dataset) => {
          const name = dataset.label.split(" ")[0];
          const color = dataset.borderColor;
          if (!uniqueNames.has(name)) {
            uniqueNames.set(name, color);
          }
        });
      }
      return Array.from(uniqueNames).map(([name, color]) => ({ name, color }));
    },
  },
  methods: {
    selectPv(pvName) {
      this.chartData.datasets.forEach((dataset) => {
        if (dataset.label.startsWith(pvName)) {
          dataset.hidden = !dataset.hidden;
        }
      });
    },
    isPvSelected(pvName) {
      const dataset = this.chartData.datasets.find((dataset) => dataset.label.startsWith(pvName));
      return !dataset.hidden;
    },
    selectAllPvs() {
      this.chartData.datasets.forEach((dataset) => {
        dataset.hidden = false;
      });
    },
    deselectAllPvs() {
      this.chartData.datasets.forEach((dataset) => {
        dataset.hidden = true;
      });
    },
  },
  data() {
    return {
      chartOptions: {
        bezierCurve: false,
        responsive: true,
        maintainAspectRatio: false,
        // interaction: {
        //   // Group Tooltip
        // //   mode: "nearest",
        //   axis: "x",
        //   intersect: false,
        // },
        plugins: {
          // Plugins
          title: {
            // 主標題
            display: true,
            text: "",
            font: {
              weight: "bolder",
              size: 18,
            },
          },
          subtitle: {
            // 副標題
            display: true,
            text: "",
            color: "#ED4C67",
            font: {
              weight: "bolder",
              size: 16,
            },
          },
          // Change options for ALL labels of THIS CHART(需要安裝 chartjs-plugin-datalabels)
          datalabels: {
            // 資料標籤
            display: true,
            color: "#000",
            align: "end",
            anchor: "end",
            font: {
              weight: "bolder",
            },
          },
          tooltip: {
            // // 提示框
            // padding: 10,
            // titleFont: {
            //   size: 16,
            //   weight: "bolder",
            // },
            // titleMarginBottom: 10, // title margin-bottom
            // bodyFont: {
            //   size: 14,
            // },
            // bodySpacing: 10, // body間距
            // backgroundColor: "rgba(247, 245, 248, 1)",
            // titleColor: "black",
            // bodyColor: "black",
            // borderColor: "blue",
            // borderWidth: "1",
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(2) + "%";
                }
                return label;
              },
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            ticks: {
              callback: function (value) {
                return value + "%";
              },
            },
          },
        },
      },
    };
  },
};
</script>

<style scoped>
@import "@/assets/style/browseprogress.css";
</style>
