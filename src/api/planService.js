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

const fetchFileMonth = () => {
  return apiClient.get("/api/v1/fileprogressmonth/");
};

const fetchPlans = () => {
  return apiClient.get("/api/v1/plans/");
};

const fetchProjects = () => {
  return apiClient.get("/api/v1/projects/");
};

const fetchIndexweek = () => {
  return apiClient.get("/api/v1/get-index-week/");
};

const fetchBillboardList = () => {
  return apiClient.get("/api/v1/billboard/");
};

const fetchGetOnePlanProgressData = (master_plan_id) => {
  return apiClient.get(`/api/v1/get_plan_progress/${master_plan_id}/`);
};

const fetchCasesByLoop = (loopid) => {
  return apiClient.get(`/api/v1/project-cases/${loopid}/`);
};

const fetchLoopsByProject = (projectid) => {
  return apiClient.get(`/api/v1/project-loops-by-project/${projectid}/`);
};

// 比例
const fetchGetLoopPercentageData = (loopid) => {
  return apiClient.get(`/api/v1/get_loop_percentage_data/${loopid}/`);
};

const fetchGetProjectPercentageDataView = (projectid) => {
  return apiClient.get(`/api/v1/get_project_percentage_data/${projectid}/`);
};

const fetchGetPlanPercentageDataView = (planid) => {
  return apiClient.get(`/api/v1/get_plan_percentage_data/${planid}/`);
};

const fetchGetMasterPlanPercentageDataView = (masterplanid) => {
  return apiClient.get(`/api/v1/get_master_plan_percentage_data/${masterplanid}/`);
};

// 總迴路進度
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

// 管理總表進度
const fetchProjectWeekTableData = (plan_id, currentPage, itemsPerPage) => {
  return apiClient.get(`/api/v1/get_project_progress/${plan_id}/${currentPage}/${itemsPerPage}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchProjectQuarterTableData = (plan_id, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_project_all_quarter_progress/${plan_id}/${currentPage}/${itemsPerPage}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchProjectTableData = (plan_id, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_project_quarter_progress/${plan_id}/${currentPage}/${itemsPerPage}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchProjectQuarterChartData = (plan_id) => {
  return apiClient.get(`/api/v1/get_project_quarter_chart_progress/${plan_id}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchProjectAllQuarterChartData = (plan_id) => {
  return apiClient.get(`/api/v1/get_project_all_quarter_chart_progress/${plan_id}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchProjectWeekChartData = (plan_id, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_project_week_chart_progress/${plan_id}/${currentPage}/${itemsPerPage}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

// 總體計畫
const fetchPlanWeekTableData = (master_plan_id, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_plan_progress/${master_plan_id}/${currentPage}/${itemsPerPage}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchPlanQuarterTableData = (master_plan_id, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_plan_all_quarter_progress/${master_plan_id}/${currentPage}/${itemsPerPage}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchPlanTableData = (master_plan_id, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_plan_quarter_progress/${master_plan_id}/${currentPage}/${itemsPerPage}/`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
};

const fetchPlanQuarterChartData = (master_plan_id) => {
  return apiClient.get(`/api/v1/get_plan_quarter_chart_progress/${master_plan_id}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchPlanAllQuarterChartData = (master_plan_id) => {
  return apiClient.get(`/api/v1/get_plan_all_quarter_chart_progress/${master_plan_id}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchPlanWeekChartData = (master_plan_id, currentPage, itemsPerPage) => {
  return apiClient.get(
    `/api/v1/get_plan_week_chart_progress/${master_plan_id}/${currentPage}/${itemsPerPage}/`,
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
  fetchFileMonth,
  fetchIndexweek,
  fetchGetLoopPercentageData,
  fetchGetProjectPercentageDataView,
  fetchGetPlanPercentageDataView,
  fetchGetMasterPlanPercentageDataView,
  fetchGLoopWeekTableData,
  fetchGLoopQuarterTableData,
  fetchGLoopTableData,
  fetchGLoopQuarterChartData,
  fetchGLoopAllQuarterChartData,
  fetchGLoopWeekChartData,
  fetchProjectWeekTableData,
  fetchProjectQuarterTableData,
  fetchProjectTableData,
  fetchProjectQuarterChartData,
  fetchProjectAllQuarterChartData,
  fetchProjectWeekChartData,
  fetchPlanWeekTableData,
  fetchPlanQuarterTableData,
  fetchPlanTableData,
  fetchPlanQuarterChartData,
  fetchPlanAllQuarterChartData,
  fetchPlanWeekChartData,
  fetchBillboardList,
  fetchGetOnePlanProgressData,
};
