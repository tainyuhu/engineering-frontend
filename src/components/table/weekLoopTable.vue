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
          v-if="shouldDisplayCompleted(item)"
          :colspan="allDateRanges.length * 2"
          class="text-center"
        >
          已完工
        </td>
        <td
          v-else-if="shouldDisplayNotStarted(item)"
          :colspan="allDateRanges.length * 2"
          class="text-center"
        >
          未開工
        </td>
        <template v-else>
          <template v-for="dateRange in allDateRanges" :key="dateRange">
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
              :style="expectedStyle(item.date_ranges, dateRange)"
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
      const actual_lag_status = range ? range.actual_lag_status : 0;
      if (actual_lag_status == 1 && range && range.records[0].expected > range.records[0].actual) {
        return { "font-weight": "bold", color: "red", "background-color": "pink" };
      } else if (range && range.records[0].expected > range.records[0].actual) {
        return { "font-weight": "bold", color: "red" };
      }
      return {};
    },
    expectedStyle(date_ranges, dateRange) {
      const range = date_ranges.find((dr) => dr.date_range === dateRange);
      const expected_lag_status = range ? range.expected_lag_status : 0;
      if (expected_lag_status == 1) {
        return { "background-color": "pink" };
      }
      return { "background-color": "#fafaea" };
    },
    shouldDisplayNotStarted(item) {
      return (
        item.construction_status === 0 ||
        (item.date_ranges.every((dr) =>
          dr.records.every((r) => r.actual === 0 && r.expected === 0)
        ) &&
          item.construction_status != 1)
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
