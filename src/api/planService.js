import apiClient from './apiService';

const fetchFile = () => {
    return apiClient.get('/api/v1/fileprogress/');
};

const fetchPlans = () => {
    return apiClient.get('/api/v1/plans/');
};

const fetchProjects = () => {
    return apiClient.get('/api/v1/projects/');
};

const fetchCasesByLoop = (loopid) => {
    return apiClient.get(`/api/v1/project-cases/${loopid}/`);
};

const fetchLoopsByProject = (projectid) => {
    return apiClient.get(`/api/v1/project-loops-by-project/${projectid}/`);
};


export { fetchPlans, fetchProjects, fetchCasesByLoop, fetchLoopsByProject, fetchFile };
