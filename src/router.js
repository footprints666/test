import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import MusicDetail from "./views/MusicDetail.vue";
import MusicPlay from "./views/MusicPlay.vue";



Vue.use(Router);

export default new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/music",
      name: "MusicDetail",
      component: MusicDetail,
    },
    {
      path: "/play",
      name: "MusicPlay",
      component: MusicPlay,
    }
    
   
  ]
});
