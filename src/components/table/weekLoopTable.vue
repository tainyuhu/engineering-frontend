<template>
  <v-table height="400px" fixed-header>
    <thead>
      <tr>
        <th>項目 / 週間</th>
        <th>比例</th>
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
      <tr v-for="item in weekTableData" :key="item.loop_name">
        <td class="font-weight-bold">{{ item.loop_name }}</td>
        <td>{{ formatPercentage(getPercentage(item.loop_name)) }}</td>
        <td
          v-if="shouldDisplayNotStarted(item)"
          :colspan="allDateRanges.length * 2"
          class="text-center"
        >
          未開工
        </td>
        <td
          v-else-if="shouldDisplayCompleted(item)"
          :colspan="allDateRanges.length * 2"
          class="text-center"
        >
          已完工
        </td>
        <template v-else>
          <template v-for="dateRange in allDateRanges">
            <td
              v-if="
                getActualData(item.date_ranges, dateRange) > 0 ||
                getExpectedData(item.date_ranges, dateRange) > 0
              "
              :style="dataStyle(item.date_ranges, dateRange)"
            >
              {{ formatPercentage(getActualData(item.date_ranges, dateRange)) }}
            </td>
            <td
              v-if="
                getActualData(item.date_ranges, dateRange) > 0 ||
                getExpectedData(item.date_ranges, dateRange) > 0
              "
              class="expected"
            >
              {{ formatPercentage(getExpectedData(item.date_ranges, dateRange)) }}
            </td>
            <td v-else colspan="2" class="text-center">未開工</td>
          </template>
        </template>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  props: {
    allDateRanges: Array,
    weekTableData: Array,
    percentagedata: Array,
  },
  methods: {
    formatPercentage(value) {
      return `${(Number(value) * 100).toFixed(2)}%`;
    },
    getPercentage(loop_name) {
      const item = this.percentagedata.find((p) => p.loop_name === loop_name);
      return item ? item.percentage : 0;
    },
    getActualData(date_ranges, dateRange) {
      const range = date_ranges.find((dr) => dr.date_range === dateRange);
      return range && range.records.length > 0 ? range.records[0].actual : 0;
    },
    getExpectedData(date_ranges, dateRange) {
      const range = date_ranges.find((dr) => dr.date_range === dateRange);
      return range && range.records.length > 0 ? range.records[0].expected : 0;
    },
    dataStyle(date_ranges, dateRange) {
      const range = date_ranges.find((dr) => dr.date_range === dateRange);
      if (range && range.records[0].expected > range.records[0].actual) {
        return { "font-weight": "bold", color: "red" };
      }
      return {};
    },
    shouldDisplayNotStarted(item) {
      return (
        item.construction_status === 0 &&
        item.date_ranges.every((dr) => dr.records.every((r) => r.actual === 0 && r.expected === 0))
      );
    },
    shouldDisplayCompleted(item) {
      return item.construction_status === 1;
    },
  },
};
</script>

<style scoped>
@import "@/assets/style/browseprogress.css";
</style>
