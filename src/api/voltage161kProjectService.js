import apiClient from "./apiService";

const fetchWeekTableData = (project_id, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage161k_progress/${project_id}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchQuarterTableData = (project_id, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage161k_all_quarter_progress/${project_id}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchTableData = (project_id, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage161k_quarter_progress/${project_id}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchQuarterChartData = (projectId, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage161k_quarter_chart_progress/${projectId}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchAllQuarterChartData = (projectId, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage161k_all_quarter_chart_progress/${projectId}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchWeekChartData = (projectId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage161k_week_chart_progress/${projectId}/${currentPage}/${itemsPerPage}/${project_type}/`,
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
  fetchAllQuarterChartData,
  fetchWeekChartData,
};
