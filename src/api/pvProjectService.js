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

const fetchLoopWeekTableData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_loop_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchLoopQuarterTableData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_loop_all_quarter_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchLoopTableData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_loop_quarter_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchQuarterChartData = (loopId, project_type) => {
  return apiClient.get(`/api/v1/get_pv_quarter_chart_progress/${loopId}/${project_type}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchAllQuarterChartData = (loopId, project_type) => {
  return apiClient.get(`/api/v1/get_pv_all_quarter_chart_progress/${loopId}/${project_type}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchWeekChartData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_pv_week_chart_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchWeekLoopChartData = (loopId, currentPage, itemsPerPage, project_type) => {
  return apiClient.get(
    `/api/v1/get_loop_chart_progress/${loopId}/${currentPage}/${itemsPerPage}/${project_type}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchLoopAllQuarterChartData = (loopId, project_type) => {
  return apiClient.get(`/api/v1/get_loop_all_quarter_chart_progress/${loopId}/${project_type}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchLoopQuarterChartData = (loopId, project_type) => {
  return apiClient.get(`/api/v1/get_loop_quarter_chart_progress/${loopId}/${project_type}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchLoopPVWeekTableData = (project_id, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_only_pv_loop_progress/${project_id}/${currentPage}/${itemsPerPage}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchLoopPVQuarterTableData = (project_id, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_only_pv_loop_all_quarter_progress/${project_id}/${currentPage}/${itemsPerPage}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchLoopPVTableData = (project_id, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_only_pv_loop_all_quarter_progress/${project_id}/${currentPage}/${itemsPerPage}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchLoopPVQuarterChartData = (projectId) => {
  return apiClient.get(`/api/v1/get_loop_pv_quarter_chart_progress/${projectId}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchLoopPVAllQuarterChartData = (projectId) => {
  return apiClient.get(`/api/v1/get_loop_pv_all_quarter_chart_progress/${projectId}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchLoopPVWeekChartData = (projectId, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_loop_pv_week_chart_progress/${projectId}/${currentPage}/${itemsPerPage}/`,
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
  fetchLoopWeekTableData,
  fetchLoopQuarterTableData,
  fetchLoopTableData,
  fetchAllQuarterChartData,
  fetchWeekLoopChartData,
  fetchLoopAllQuarterChartData,
  fetchLoopQuarterChartData,
  fetchLoopPVWeekTableData,
  fetchLoopPVQuarterTableData,
  fetchLoopPVTableData,
  fetchLoopPVQuarterChartData,
  fetchLoopPVAllQuarterChartData,
  fetchLoopPVWeekChartData,
};
