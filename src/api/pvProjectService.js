import apiClient from './apiService';

const fetchPVProjects = () => {
    return apiClient.get('/api/pv-project/');
};

const fetchPVExpectedProgress = () => {
    return apiClient.get('/api/pv-expected-progress/');
};

const fetchPVExpected = () => {
    return apiClient.get('/api/pv-expected/');
};

const fetchPVProgress = () => {
    return apiClient.get('/api/pv-progress/');
};

const fetchPVBank = () => {
    return apiClient.get('/api/pv-bank/');
};

const fetchPvWeeklyProgressSummary = () => {
    return apiClient.get('/api/fetchPvWeeklyProgressSummary/');
};

const fetchSeasonWeekTableData = (loopId) => {
    return apiClient.get(`/api/season-week-table-data/${loopId}/`, {
        headers: {
            Accept: 'application/json',
        },
    });
};

const fetchWeekTableData = (loopId) => {
    return apiClient.get(`/api/week-table-data/${loopId}/`, {
        headers: {
            Accept: 'application/json',
        },
    });
};

const fetchWeekBankTableData = (loopId) => {
    return apiClient.get(`/api/week-bank-table-data/${loopId}/`, {
        headers: {
            Accept: 'application/json',
        },
    });
};

const fetchSeasonTableData = (loopId) => {
    return apiClient.get(`/api/season-table-data/${loopId}/`, {
        headers: {
            Accept: 'application/json',
        },
    });
};

const fetchSeasonProjectChartData = (loopId) => {
    return apiClient.get(`/api/season-project-chart-data/${loopId}/`, {
        headers: {
            Accept: 'application/json',
        },
    });
};

const fetchPVProjectByLoopList = (loopId) => {
    return apiClient.get(`/api/pvprojects-by-loop/${loopId}/`, {
        headers: {
            Accept: 'application/json',
        },
    });
};

export { fetchPVProjects, fetchPVExpectedProgress, fetchPVExpected, fetchPVProgress, fetchPVBank, fetchSeasonWeekTableData, fetchWeekTableData, fetchWeekBankTableData, fetchSeasonTableData, fetchPvWeeklyProgressSummary, fetchSeasonProjectChartData, fetchPVProjectByLoopList };
