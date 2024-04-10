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

const fetchCableAllQuarterTableData = (projectId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_cable_all_quarter_progress/${projectId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchCableQuarterTableData = (projectId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_cable_quarter_progress/${projectId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchCableWeekTableData = (projectId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_cable_progress/${projectId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchCableQuarterChartData = (projectId, project_type) => {
  return apiClient.get(`/api/v1/get_cable_quarter_chart_progress/${projectId}/${project_type}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchCableAllQuarterChartData = (projectId, project_type) => {
  return apiClient.get(
    `/api/v1/get_cable_all_quarter_chart_progress/${projectId}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchCableWeekChartData = (projectId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_cable_week_chart_progress/${projectId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchCivilAllQuarterTableData = (projectId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_civil_all_quarter_progress/${projectId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchCivilQuarterTableData = (projectId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_civil_quarter_progress/${projectId}/${currentPage}/${itemsPerPage}/${project_type}/`,
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

const fetchCivilQuarterChartData = (projectId, project_type) => {
  return apiClient.get(`/api/v1/get_civil_quarter_chart_progress/${projectId}/${project_type}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchCivilAllQuarterChartData = (projectId, project_type) => {
  return apiClient.get(
    `/api/v1/get_civil_all_quarter_chart_progress/${projectId}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchCivilWeekChartData = (projectId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_civil_week_chart_progress/${projectId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchQuarterChartData = (projectId, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage228k_quarter_chart_progress/${projectId}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchAllQuarterChartData = (projectId, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage228k_all_quarter_chart_progress/${projectId}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchWeekChartData = (projectId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_voltage228k_week_chart_progress/${projectId}/${currentPage}/${itemsPerPage}/${project_type}/`,
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
  fetchCableWeekTableData,
  fetchCableAllQuarterTableData,
  fetchCableQuarterTableData,
  fetchCableQuarterChartData,
  fetchCableAllQuarterChartData,
  fetchCableWeekChartData,
  fetchCivilWeekTableData,
  fetchCivilAllQuarterTableData,
  fetchCivilQuarterTableData,
  fetchCivilQuarterChartData,
  fetchCivilAllQuarterChartData,
  fetchCivilWeekChartData,
};
