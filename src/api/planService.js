import apiClient from "./apiService";

const fetchMeeting = () => {
  return apiClient.get("/api/v1/meetingrecord/");
};

const fetchFile = () => {
  return apiClient.get("/api/v1/fileprogress/");
};

const fetchFilePhase = () => {
  return apiClient.get("/api/v1/fileprogressphase/");
};

const fetchPlans = () => {
  return apiClient.get("/api/v1/plans/");
};

const fetchProjects = () => {
  return apiClient.get("/api/v1/projects/");
};

const fetchCasesByLoop = (loopid) => {
  return apiClient.get(`/api/v1/project-cases/${loopid}/`);
};

const fetchLoopsByProject = (projectid) => {
  return apiClient.get(`/api/v1/project-loops-by-project/${projectid}/`);
};

const fetchGetLoopPercentageData = (loopid) => {
  return apiClient.get(`/api/v1/get_loop_percentage_data/${loopid}/`);
};

const fetchGetProjectPercentageDataView = (projectid) => {
  return apiClient.get(`/api/v1/get_project_percentage_data/${projectid}/`);
};

const fetchGLoopWeekTableData = (project_id, currentPage, itemsPerPage) => {
  return apiClient.get(`/api/v1/get_gloop_progress/${project_id}/${currentPage}/${itemsPerPage}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchGLoopQuarterTableData = (project_id, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_gloop_all_quarter_progress/${project_id}/${currentPage}/${itemsPerPage}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchGLoopTableData = (project_id, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_gloop_quarter_progress/${project_id}/${currentPage}/${itemsPerPage}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchGLoopQuarterChartData = (projectId) => {
  return apiClient.get(`/api/v1/get_gloop_quarter_chart_progress/${projectId}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchGLoopAllQuarterChartData = (projectId) => {
  return apiClient.get(`/api/v1/get_gloop_all_quarter_chart_progress/${projectId}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchGLoopWeekChartData = (projectId, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_gloop_week_chart_progress/${projectId}/${currentPage}/${itemsPerPage}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

export {
  fetchPlans,
  fetchProjects,
  fetchCasesByLoop,
  fetchLoopsByProject,
  fetchFile,
  fetchMeeting,
  fetchFilePhase,
  fetchGetLoopPercentageData,
  fetchGetProjectPercentageDataView,
  fetchGLoopWeekTableData,
  fetchGLoopQuarterTableData,
  fetchGLoopTableData,
  fetchGLoopQuarterChartData,
  fetchGLoopAllQuarterChartData,
  fetchGLoopWeekChartData,
};
