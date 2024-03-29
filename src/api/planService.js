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

export {
  fetchPlans,
  fetchProjects,
  fetchCasesByLoop,
  fetchLoopsByProject,
  fetchFile,
  fetchMeeting,
  fetchFilePhase,
};
