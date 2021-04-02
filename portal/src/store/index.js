import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    token: localStorage.getItem('user-token') || '',
    status: ''
  },
  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status
  },
  mutations: {
    AUTH_REQUEST (state) {
      state.status = 'loading';
    },
    AUTH_SUCCESS (state, token) {
      state.status = 'success';
      state.token = token;
    },
    AUTH_ERROR (state) {
      state.status = 'error'
    },
    AUTH_LOGOUT (state) {
      state.status = '';
      state.token = '';
    }
  },
  actions: {
    AUTH_REQUEST ({commit}, user) {
      return new Promise((resolve, reject) => { // The Promise used for router redirect in login
        commit('AUTH_REQUEST')
        axios({url: '/api/login', data: user, method: 'POST' })
          .then(resp => {
            const token = resp.data.token;
            localStorage.setItem('user-token', token); // store the token in localstorage
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            commit('AUTH_SUCCESS', token);
            resolve(resp);
          })
        .catch(err => {
          commit('AUTH_ERROR', err);
          localStorage.removeItem('user-token'); // if the request fails, remove any possible user token if possible
          reject(err);
        });
      });
    },
    AUTH_LOGOUT ({commit}) {
      return new Promise((resolve) => {
        commit('AUTH_LOGOUT');
        localStorage.removeItem('user-token'); // if the request fails, remove any possible user token if possible
        delete axios.defaults.headers.common['Authorization'];
        resolve()
      });
    }
  },
  modules: {
  }
});
