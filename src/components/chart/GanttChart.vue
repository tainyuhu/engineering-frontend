<template>
  <div class="line-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import "chartjs-adapter-moment";

export default {
  name: "GanttChart",
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  watch: {
    chartData: {
      deep: true,
      handler(newData) {
        this.updateChart(newData);
      },
    },
  },
  mounted() {
    this.createChart();
  },
  beforeDestroy() {
    this.destroyChart();
  },
  methods: {
    createChart() {
      const ctx = this.$refs.chartCanvas;
      if (!Chart.getChart(ctx)) {
        // 沒有圖表Instance再新增
        this.chart = new Chart(ctx, {
          type: "bar",
          data: this.chartData,
          options: {
            bezierCurve: false,
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
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
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    const startDate = new Date(context.raw[0]);
                    const endDate = new Date(context.raw[1]);
                    const duration = (endDate - startDate) / (1000 * 60 * 60 * 24);
                    label += `${duration.toFixed(0)} 天`;

                    return label;
                  },
                },
              },
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
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                min: "2024-01-01",
                type: "time",
                time: {
                  unit: "month",
                  displayFormats: {
                    month: "YYYY MM",
                  },
                },
              },
              y: {
                ticks: {
                  autoSkip: false,
                },
              },
            },
          },
        });
      }
    },
    updateChart(newData) {
      if (this.chart) {
        this.chart.data = newData;
        this.chart.update();
      }
    },
    destroyChart() {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }
    },
  },
};
</script>

<style scoped>
@import "@/assets/style/browseprogress.css";

canvas {
  width: 100% !important;
  height: 100% !important;
}

.line-chart-container {
  position: relative;
  max-width: 100vw;
  max-height: 100vh;
  height: 100vh;
  overflow-x: auto;
  overflow-y: auto;
  margin-right: 25px;
  padding: 5px;
  background-color: #fff;
}
</style>
