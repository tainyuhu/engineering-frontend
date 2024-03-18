import apiClient from "./apiService";

const fetchWeekTableData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_pv_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchQuarterTableData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_pv_all_quarter_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchTableData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_pv_quarter_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

// const fetchPVProjects = () => {
//     return apiClient.get('/api/pv-project/');
// };this.currentPage, this.itemsPerPage

// const fetchPVExpectedProgress = () => {
//     return apiClient.get('/api/pv-expected-progress/');
// };

// const fetchPVExpected = () => {
//     return apiClient.get('/api/pv-expected/');
// };

// const fetchPVProgress = () => {
//     return apiClient.get('/api/pv-progress/');
// };

// const fetchPVBank = () => {
//     return apiClient.get('/api/pv-bank/');
// };

// const fetchPvWeeklyProgressSummary = () => {
//     return apiClient.get('/api/fetchPvWeeklyProgressSummary/');
// };

// const fetchSeasonWeekTableData = (loopId) => {
//     return apiClient.get(`/api/season-week-table-data/${loopId}/`, {
//         headers: {
//             Accept: 'application/json',
//         },
//     });
// };

// const fetchWeekTableData = (loopId) => {
//     return apiClient.get(`/api/week-table-data/${loopId}/`, {
//         headers: {
//             Accept: 'application/json',
//         },
//     });
// };

// const fetchWeekBankTableData = (loopId) => {
//     return apiClient.get(`/api/week-bank-table-data/${loopId}/`, {
//         headers: {
//             Accept: 'application/json',
//         },
//     });
// };

// const fetchSeasonTableData = (loopId) => {
//     return apiClient.get(`/api/season-table-data/${loopId}/`, {
//         headers: {
//             Accept: 'application/json',
//         },
//     });
// };

// const fetchSeasonProjectChartData = (loopId) => {
//     return apiClient.get(`/api/season-project-chart-data/${loopId}/`, {
//         headers: {
//             Accept: 'application/json',
//         },
//     });
// };

// const fetchPVProjectByLoopList = (loopId) => {
//     return apiClient.get(`/api/pvprojects-by-loop/${loopId}/`, {
//         headers: {
//             Accept: 'application/json',
//         },
//     });
// };

export { fetchWeekTableData, fetchQuarterTableData, fetchTableData };
