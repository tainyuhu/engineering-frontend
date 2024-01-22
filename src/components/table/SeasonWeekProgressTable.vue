<!--  SeasonWeekProgressTable 综合表格 -->
<template>
   <table class="table">
    <thead>
      <tr>
        <th class="th_title">案場 / 季度-週間 </th>
        <th class="th_title" v-for="header in headers" :key="header" colspan="2">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td>{{ row.project_name }}</td>
        <td v-for="data in row.data" :key="data.key" :colspan="data.type === 'summary' ? 2 : null" :class="{ 'td_expected': data.type === 'expected' }">
          {{ data.value }}
        </td>
      </tr>
    </tbody>
    </table>
</template>

<!-- 另一種寫法 -->
<!-- <script setup>
const props = defineProps({
  headers: Array,
  rows: Array,
})
</script> -->

<script>
export default {
  props:{
    headers: {
      type: Array,
      default: () => []
    },
    rows: {
      type: Array,
      default: () => []
    },
  },

  mounted(){
    console.log(this.headers);
  }
}
</script>


<style scoped>
@import '@/assets/style/progressTable.css';

</style>
