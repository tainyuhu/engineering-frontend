<template>
  <v-container>
    <!-- 標題 -->
    <div class="mb-5" style="padding-left: 20px; display: flex; align-items: center;">
      <v-icon class="title-icon" color="blue">mdi-chevron-right-box</v-icon>
      <span class="font-weight-bold ml-2">會議記錄列表：</span>
      <!-- 搜索框 -->
      <div class="search-container">
        <v-text-field
          v-model="searchQuery"
          variant="solo"
          prepend-inner-icon="mdi-magnify"
          label="請輸入關鍵字搜尋"
          single-line
          hide-details
          class="search-input"
          @keyup.enter="fetchData"
        ></v-text-field>
      </div>
    </div>

    <!-- 卡片 -->
    <v-card class="elevated-card" outlined>
      <!-- 表格 -->
      <v-table class="elevated-table" width="100%">
          <thead>
              <tr class="table-header">
                <th @click="sortBy = 'file_name'; sortDesc = !sortDesc" class="font-weight-bold sortable">
                  會議紀錄名稱
                  <v-icon small v-if="sortBy === 'file_name'">
                    {{ sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}
                  </v-icon>
                </th>
                <th class="font-weight-bold">更新描述</th>
                <th @click="sortBy = 'create_at'; sortDesc = !sortDesc" class="font-weight-bold sortable">
                  上傳時間
                  <v-icon small v-if="sortBy === 'create_at'">
                    {{ sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}
                  </v-icon>
                </th>
                <th @click="sortBy = 'last_update'; sortDesc = !sortDesc" class="font-weight-bold sortable">
                  更新時間
                  <v-icon small v-if="sortBy === 'last_update'">
                    {{ sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}
                  </v-icon>
                </th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="(file, index) in paginatedFiles" :key="index" @click="viewFile(file)" class="table-row">
              <td>{{ file.file_name }}</td>
              <td>{{ file.update_description }}</td>
              <td>{{ file.create_at }}</td>
              <td>{{ file.last_update }}</td>
              </tr>
          </tbody>
      </v-table>
      
      <!-- 分頁功能 -->
      <div class="pagination-container">
        <div class="select-actions d-none d-md-flex">
          <span class="font-weight-bold ml-2">每頁顯示：</span>
          <v-select
            density="compact"
            variant="outlined"
            v-model="itemsPerPage"
            :items="itemsPerPageOptions"
            class="items-per-page-select"
            @change="page = 1"
          ></v-select>
        </div>
        <div class="pagination-actions">
          <v-btn icon small variant="text" @click="page = 1">
            <v-icon>mdi-page-first</v-icon>
          </v-btn>
          <v-pagination
            v-model="page"
            :length="pages"
            :total-visible="1"
            class="pagination"
            active-color="#00b894"
            @input="page = $event"
          ></v-pagination>
          <v-btn icon small variant="text" @click="page = pages">
            <v-icon>mdi-page-last</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { fetchMeeting } from '@/api/planService';
export default {
  data() {
    return {
      files: [],
      //搜索框
      searchQuery: '',
      // 表格 
      page: 1,
      itemsPerPage: 5,
      sortBy: null, 
      sortDesc: false, 
      itemsPerPageOptions: [5, 10, 15, 20], 
    };
  },
  computed: {
    pages() {
      return Math.ceil(this.filteredFiles.length / this.itemsPerPage);
    },
    filteredFiles() {
      this.page = 1;
      let files = this.files.filter(file =>
        file.file_name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      // 項目排序邏輯
      if (this.sortBy) {
        files.sort((a, b) => {
          if (this.sortDesc) {
            return a[this.sortBy] < b[this.sortBy] ? 1 : -1;
          } else {
            return a[this.sortBy] > b[this.sortBy] ? 1 : -1;
          }
        });
      }
      return files;
    },
    paginatedFiles() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredFiles.slice(start, end);
    },
  },
  async created() {
    if (this.$route.query.page) {
      this.page = Number(this.$route.query.page);
    }
    if (this.$route.query.itemsPerPage) {
      this.itemsPerPage = Number(this.$route.query.itemsPerPage);
    }
    await this.fetchData();
  },
  methods: {
    viewFile(file) {
      window.open(file.file_link, '_blank');
    },
    async fetchData() {
      try {
        const filesResponse = await fetchMeeting();
        this.files = filesResponse.data.map(file => ({
          ...file,
          create_at: this.formatDate(file.create_at),
          last_update: this.formatDate(file.last_update),
          last_update_raw: file.last_update
        }))
        .sort((a, b) => new Date(b.last_update_raw) - new Date(a.last_update_raw));
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
  },
};
</script>

<style scoped>
.v-container {
max-width: 100%;
}

.title-icon {
font-size: 35px; 
}

.search-container {
margin-left: auto;
width: 300px;
}

.search-input {
width: 100%;
background: #FFFFFF;
}

.v-card {
overflow-y: hidden; 
overflow-x: auto; 
display: flex;
flex-direction: column;
padding: 20px;
width: 100%;
}

.table-header {
background-color: #00b894; 
}

.table-row:hover {
background-color: #E3F2FD; 
}

.elevated-table th,
.elevated-table td {
border: 1px solid #CCCCCC;
padding: 10px;
}

.v-card .table-header th {
text-align: left;
color: white;
}

.pagination-container {
display: flex;
align-items: center;
justify-content: space-between;
margin-top: 20px;
}

.select-actions {
display: flex;
align-items: center;
}

.items-per-page-select {
width: auto;
}

.pagination-actions {
display: flex;
align-items: center;
justify-content: center;
}

.pagination {
margin-left: 20px; 
margin-right: 20px;
}

.sortable-icon {
margin-left: 5px;
}

.sortable {
cursor: pointer;
justify-content: space-between;
align-items: center;
}

.elevated-card::-webkit-scrollbar {
height: 4px;
}

.elevated-card::-webkit-scrollbar-thumb {
border-radius: 2px;
background-color: #bdc3c7;
color: #bdc3c7;
-webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}
</style>