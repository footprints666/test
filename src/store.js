import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    keys:"",
    isLoad:false,
    loadingCount:0,

  },
  mutations: {
    edit(state,payload){
      console.log(payload)
      state.keys=payload;
     

    }

  },
  actions: {

  }
});
