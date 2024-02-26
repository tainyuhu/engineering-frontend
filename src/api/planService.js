import apiClient from './apiService';

const fetchPlans = () => {
    return apiClient.get('/api/v1/plans/');
};

const fetchProjects = () => {
    return apiClient.get('/api/projects/');
};

const fetchCases = () => {
    return apiClient.get('/api/project-cases/');
};

const fetchLoops = () => {
    return apiClient.get('/api/project-loop/');
};

const fetchLoopByPlan = (planid) => {
    return apiClient.get(`/api/project-loop-by-plan/${planid}/`, {
        headers: {
            Accept: 'application/json',
        },
    });
};

export { fetchPlans, fetchProjects, fetchCases, fetchLoopByPlan, fetchLoops };
