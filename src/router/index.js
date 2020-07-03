import Vue from "vue";
import VueRouter from "vue-router";
// import Home from '../views/Home.vue'
import SignPad from "../views/SignPad.vue";
import OTList from "../views/OTList.vue";
import OTDetail from "../views/OTDetail.vue";

// OT

// OT Verify Detail Show user in list

// Approve

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "OTList",
    component: OTList,
  },
  {
    path: "/signpad/:action/:id",
    name: "SignPad",
    component: SignPad,
  },
  {
    path: "/list",
    name: "OTList",
    component: OTList,
  },
  {
    path: "/ot-detail/:id",
    name: "OTDetail",
    component: OTDetail,
  },
];

const router = new VueRouter({
  // mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
