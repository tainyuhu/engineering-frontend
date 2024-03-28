<template>
  <v-table>
    <thead>
      <tr>
        <th rowspan="2">項目 / 週間</th>
        <th
          v-for="(summary, index) in quarterSummary"
          :key="index"
          :class="{ 'special-bg': index === 0, 'normal-bg': index !== 0 }"
          colspan="2"
        >
          【{{ summary.year }} Q{{ summary.quarter }}】 第{{ summary.week }}周
        </th>
      </tr>
      <tr>
        <th
          v-for="(dateRange, index) in allDateRanges"
          :key="index"
          :class="{ 'special-bg': index === 0, 'normal-bg': index !== 0 }"
          colspan="2"
        >
          {{ dateRange }}
          <v-icon v-if="index === 0" color="yellow">mdi-new-box</v-icon>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in TableData" :key="item.project_name">
        <td class="font-weight-bold">{{ item.project_name }}</td>
        <template v-for="dateRange in item.date_ranges">
          <td
            :style="
              dateRange.records[0].expected > dateRange.records[0].actual
                ? { 'font-weight': 'bold', color: 'red' }
                : {}
            "
          >
            {{ formatPercentage(dateRange.records[0].actual) }}
          </td>
          <td class="expected">{{ formatPercentage(dateRange.records[0].expected) }}</td>
        </template>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  props: {
    allDateRanges: Array,
    quarterSummary: Array,
    TableData: Array,
  },
  methods: {
    formatPercentage(value) {
      return `${(Number(value) * 100).toFixed(2)}%`;
    },
  },
};
</script>

<style scoped>
@import "@/assets/style/browseprogress.css";
</style>
