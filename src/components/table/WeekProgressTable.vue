<!-- WeekProgressTable 週間表格 -->
<template>
  <table class="table">
    <thead>
      <tr>
        <th class="th_title">案場 / 週間</th>
        <th class="th_title" v-for="header in tableData.headers" :key="header" colspan="2">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody v-if="!isBankMode">
      <tr v-for="row in tableData.rows" :key="row.project_name">
        <td>{{ row.project_name }}</td>
        <td v-for="item in row.data" :key="item.key" :colspan="item.type === 'summary' ? 2 : null" :class="{ 'td_expected': item.type === 'expected'}">
          {{ item.value }}
        </td>
      </tr>
    </tbody>
    <tbody v-if="isBankMode">
      <tr v-for="row in tableBankData.rows" :key="row.project_name">
        <td>{{ row.project_name }}</td>
        <td v-for="item in row.data" :key="item.key" :colspan="item.type === 'summary' ? 2 : null" :class="{ 'td_expected': item.type === 'expected' }">
          {{ item.value }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Object,
      required: true
    },
    tableBankData: {
      type: Object,
      required: true
    },
    isBankMode: {
      type: Boolean,
      default: false
    }
  }
}
</script>


<style scoped>
@import '@/assets/style/progressTable.css';

</style>