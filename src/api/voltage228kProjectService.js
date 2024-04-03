import apiClient from "./apiService";

const fetchWeekTableData = (projectId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage228k_progress/${projectId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchQuarterTableData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage228k_all_quarter_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchTableData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage228k_quarter_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchQuarterChartData = (loopId, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage228k_quarter_chart_progress/${loopId}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchCivilWeekTableData = (projectId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_civil_progress/${projectId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

export {
  fetchWeekTableData,
  fetchQuarterTableData,
  fetchTableData,
  fetchQuarterChartData,
  fetchCivilWeekTableData,
};
