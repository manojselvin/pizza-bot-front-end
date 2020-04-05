import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import users from './modules/users';
import products from './modules/products';
import orders from './modules/orders';
import messages from './modules/messages';

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })], // !debug ? [createPersistedState({ storage: window.sessionStorage })] : [],
  modules: {
    users, 
    products,
    orders,
    messages
  }
});
