/* eslint-disable */
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

const state = {
  ot: [],
  ot_detail: [],
  profile: [],
  line: [],
};

const mutations = {
  SET_OT(state, ot) {
    state.ot = ot;
  },
  SET_PROFILE(state, profile) {
    state.profile = profile;
  },
};

const actions = {
  // getProfile({ commit, state }) {},
  getOt({ commit, state }) {
    axios
      .post("/api/line/ot")
      .then((res) => {
        // console.log(res);
        // state.ot = res.data.ot;
        // state.profile = res.data.employee;
        commit("SET_OT", res.data.ot);
        commit("SET_PROFILE", res.data.employee);

        // this.ot_employee = res.data.employee;
        // this.ot_data = res.data.ot;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getOtDetail() {},
};

const getters = {
  Ot(state) {
    return state.ot;
  },
  Profile() {
    return state.profile;
  },
  OtDetail() {
    return state.ot_detail;
  },
};

export default new Vuex.Store({ state, mutations, actions, getters });
