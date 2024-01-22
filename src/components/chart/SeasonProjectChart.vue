<template>
  <div class="line-chart-container" style="min-width: 600px; min-height: 450px;">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: 'SeasonProjectChart',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      required: true
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(newData) {
        this.updateChart(newData);
      }
    }
  },
  mounted() {
    this.createChart();
  },
  methods: {
    createChart() {
      const ctx = this.$refs.chartCanvas;
      if (!Chart.getChart(ctx)) { // 沒有圖表Instance再新增
        this.chart = new Chart(ctx, {
          type: 'line',
          data: this.chartData,
          options: this.chartOptions
        });
      }
    },
    updateChart(newData) {
      if (this.chart) {
        this.chart.data = newData;
        this.chart.update();
      }
    }
  }
};
</script>

<style scoped>
.line-chart-container {
  position: relative;
  max-width: 100vw;
  max-height: 70vh;
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

