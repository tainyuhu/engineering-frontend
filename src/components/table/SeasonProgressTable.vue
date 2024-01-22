<!--  SeasonWeekProgressTable 综合表格 -->
<template>
    <table class="table" >
        <thead>
            <tr>
            <th class="th_title">案場 / 季度</th>
            <th class="th_title" v-for="header in seasonTableData.headers" :key="header" colspan="2">
                {{ header }}
            </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, index) in seasonTableData.rows" :key="index">
            <td>{{ row.project_name }}</td>
            <td v-for="data in row.data" :key="data.key" :colspan="data.type === 'summary' ? 2 : null" :class="{ 'td_expected': data.type === 'expected' }">
                {{ data.value }}
            </td>
            </tr>
        </tbody>
    </table>
</template>
 
 <script>
 export default {
    props: {
    seasonTableData: {
      type: Object,
      required: true
    },
   }
 }
 </script>
 
 
 <style scoped>
 @import '@/assets/style/progressTable.css';
 
 </style>