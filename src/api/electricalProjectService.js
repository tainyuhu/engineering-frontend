import apiClient from "./apiService";

const fetchStageData = (project_id) => {
  return apiClient.get(`/api/v1/stages/series/${project_id}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

const fetchElectricalProgressData = (project_id) => {
  return apiClient.get(`/api/v1/electrical-progress/${project_id}/`, {
    headers: {
      Accept: "application/json",
    },
  });
};

export { fetchStageData, fetchElectricalProgressData };
