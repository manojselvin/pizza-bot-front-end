import api from "@/utils/backend-api";
import { Order } from "@/models/Order";

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
  item: new Order(),
  endPoint: 'orders'
};

const getters = {};

const actions = {
  getAll({ commit }, { query = "" } = {}) {
    commit("setLoading", { loading: true });
    api.getData(`${state.endPoint}?${query}`).then(res => {
      const items = res.data.data.orders;

      commit("setItems", items);
      commit("setLoading", { loading: false });
    });

    commit("setLoading", { loading: false });
  },

  search({ commit }, { query = "" } = {}) {
    commit("setLoading", { loading: true });

    api.getData(`${state.endPoint}/search?${query}`).then(res => {

      const items = res.data.data.orders;

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
          const item = res.data.data.order;

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

  save({ commit }, item) {
    if (!item._id) {
      api
        .postData(`${state.endPoint}`, item)
        .then(res => {

          const item = res.data.data.order;
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
          const item = res.data.data.order;
          commit("setItem", { item });
          sendSuccessNotice(commit, "Order has been updated.");
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
    console.log("orders items", items);
    state.items = items;
  },

  setItem(state, { item }) {
    console.log("called set state for order", item, state.item);
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
