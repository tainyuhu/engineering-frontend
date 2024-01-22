export default {
    namespaced: true,
    state: {
        accessToken: null,
    },
    getters: {
        isAuthenticated(state) {
            return !!state.accessToken;
        }
    },
    mutations: {
        setToken(state, token) {
            console.log("Setting token:", token);
            state.accessToken = token;
        },
        clearToken(state) {
            state.accessToken = null;
            localStorage.removeItem('access_token');
        },
    },
    actions: {
        // login({ commit }, token) {
        //     commit('setToken', token);
        //     localStorage.setItem('access_token', token);
        // },
        logout({ commit }) {
            commit('clearToken');
        }
    }
};
