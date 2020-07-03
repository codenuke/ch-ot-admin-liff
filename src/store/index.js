/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import VuexPersistence from "vuex-persist";

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

Vue.use(Vuex);

const state = {
  ot: [],
  employee: {},
  line: "",
};

const mutations = {
  setOt(state, payload) {
    state.ot = payload;
  },
  setEmployee(state, payload) {
    state.employee = payload;
  },
  setLine(state, payload) {
    state.line = payload;
  },
  setStateClear(state) {
    state.ot = [];
    state.employee = {};
    state.line = "";
  },
};

const actions = {
  getOt({ commit, state }) {
    axios
      .post("/api/line/ot")
      .then((res) => {
        commit("setOt", res.data.ot);
        commit("setEmployee", res.data.employee);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  setLineToken({ commit, state }, token) {
    commit("setLine", token);
  },
  clearState({ commit, state }) {
    commit("setStateClear");
  },
};

const getters = {
  Ot(state) {
    return state.ot;
  },
  Employee() {
    return state.employee;
  },
  Line() {
    return state.line;
  },
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [vuexLocal.plugin],
});
