import { createStore } from "vuex";
import authModule from "./authModule";

function getSavedUser() {
  const userData = localStorage.getItem("user");
  try {
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
}

const store = createStore({
  modules: {
    auth: authModule,
  },
  state: {
    user: getSavedUser() || {
      username: null,
      firstName: null,
      lastName: null,
      email: null,
      isStaff: null,
      title: null,
      department: null,
      isActive: null,
      groups: [],
    },
  },
  getters: {
    getUser(state) {
      return state.user;
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = {
        username: user.username || null,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        email: user.email || null,
        isStaff: user.isStaff || null,
        isActive: user.isActive || null,
        groups: user.groups || [],
      };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
  actions: {
    setUser({ commit }, user) {
      commit("setUser", user);
    },
  },
});

export default store;
