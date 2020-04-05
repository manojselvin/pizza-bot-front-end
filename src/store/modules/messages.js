import api from "@/utils/backend-api";
import { Message } from "@/models/Message";

import {
  sendSuccessNotice,
  sendErrorNotice,
  closeNotice
} from "@/utils/store-util.js";

const state = {
  items: [],
  pagination: {},
  loading: false,
  mode: "",
  snackbar: false,
  notice: "",
  item: new Message(),
  endPoint: 'messages'
};

const getters = {};

const actions = {
  getAll({ commit }, { query = "" } = {}) {
    commit("setLoading", { loading: true });
    api.getData(`${state.endPoint}?${query}`).then(res => {
      const items = res.data.data.messages;

      commit("setItems", items);
      commit("setLoading", { loading: false });
    });

    commit("setLoading", { loading: false });
  },

  search({ commit }, { query = "" } = {}) {
    commit("setLoading", { loading: true });

    api.getData(`${state.endPoint}/search?${query}`).then(res => {

      const items = res.data.data.messages;

      commit("setItems", items);
      commit("setLoading", { loading: false });
    });

    commit("setLoading", { loading: false });
  },

  getById({ commit }, id) {
    commit("setLoading", { loading: true });
    if (id) {
      api.getData(`${state.endPoint}/${id}`).then(
        res => {
          console.log(res);
          const item = res.data.data.message;

          commit("setItem", { item });
          commit("setLoading", { loading: false });
        },
        err => {
          console.log(err);
        }
      );
    } else {
      commit("setLoading", { loading: false });
    }
  },

  saveAll({ commit }, items) {
    api
      .postData(`${state.endPoint}/multi`, items)
      .then(res => {
        const items = res.data.data.message;
        console.log("All messages saved!", items);
        sendSuccessNotice(commit, res.data.message);
      })
      .catch(err => {
        console.log(err);
        sendErrorNotice(commit, "Operation failed! Please try again later. ");
        closeNotice(commit, 1500);
      });
  },

  save({ commit }, item) {
    if (!item._id) {
      api
        .postData(`${state.endPoint}`, item)
        .then(res => {

          const item = res.data.data.message;
          commit("setItem", { item });
          sendSuccessNotice(commit, res.data.message);
        })
        .catch(err => {
          console.log(err);
          sendErrorNotice(commit, "Operation failed! Please try again later. ");
          closeNotice(commit, 1500);
        });
    } else {
      api
        .putData(`${state.endPoint}/${item._id.toString()}`, item)
        .then(res => {
          const item = res.data.data.message;
          commit("setItem", { item });
          sendSuccessNotice(commit, "Message has been updated.");
        })
        .catch(err => {
          console.log(err);
          sendErrorNotice(commit, "Operation failed! Please try again later. ");
          closeNotice(commit, 1500);
        });
    }
  },
  closeSnackBar({ commit }, timeout) {
    closeNotice(commit, timeout);
  }
};

const mutations = {
  setItems(state, items) {
    state.items = items;
  },

  setItem(state, { item }) {
    state.item = item;
  },

  setPagination(state, pagination) {
    state.pagination = pagination;
  },
  setLoading(state, { loading }) {
    state.loading = loading;
  },
  setNotice(state, { notice }) {
    console.log(" notice .... ", notice);
    state.notice = notice;
  },
  setSnackbar(state, { snackbar }) {
    state.snackbar = snackbar;
  },
  setMode(state, { mode }) {
    state.mode = mode;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
