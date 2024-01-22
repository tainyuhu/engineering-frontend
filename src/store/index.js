import { createStore } from 'vuex';
import authModule from './authModule';

const store = createStore({
  modules: {
    auth: authModule
  },
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
});

export default store;
