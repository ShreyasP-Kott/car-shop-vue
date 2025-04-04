// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Landing from "../components/Landing.vue";
import Dashboard from "../components/Dashboard.vue";
const routes = [
  {
    path: "/",
    name: "Home",
    component: Landing,
  },
  {
    path: "/list",
    name: "List",
    component: Dashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
