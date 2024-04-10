import apiClient from "./apiService";

const fetchWeekTableData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_breeding_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchQuarterTableData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_breeding_all_quarter_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchTableData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_breeding_quarter_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchQuarterChartData = (loopId, project_type) => {
  return apiClient.get(`/api/v1/get_breeding_quarter_chart_progress/${loopId}/${project_type}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchAllQuarterChartData = (loopId, project_type) => {
  return apiClient.get(
    `/api/v1/get_breeding_all_quarter_chart_progress/${loopId}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchWeekChartData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_breeding_week_chart_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
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
  fetchWeekChartData,
  fetchAllQuarterChartData,
};
