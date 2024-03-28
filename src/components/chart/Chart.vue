<template>
  <div class="line-chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "Chart",
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
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
          type: "line",
          data: this.chartData,
          options: this.chartOptions,
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
canvas {
  width: 100% !important;
  height: 100% !important;
}

.line-chart-container {
  position: relative;
  max-width: 100vw;
  max-height: 80vh;
  overflow-x: auto;
  overflow-y: auto;
  margin-right: 25px;
  padding: 5px;
  background-color: #fff;
  border: 1px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
</style>
