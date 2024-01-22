import axios from 'axios';

export default {
    checkPermission(user, resource, action) {
        return axios.get('/api/check_permission/', {
            params: {
                auth: user,
                resource: resource,
                action: action
            }
        }).then(response => response.data.permission)
            .catch(error => {
                console.error("权限检查失败:", error);
                return false;
            });
    }
};
