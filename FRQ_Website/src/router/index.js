import { createWebHistory, createRouter } from "vue-router";
import CompletedReviews from "@/views/CompletedReviews.vue";
import OpenReviews from "@/views/OpenReviews.vue";

import Login from "@/views/LoginView.vue";
import SignUp from "@/views/SignUpView.vue";

import { dataModel } from "../dataModel.js";

const routes = [
  {
    path: "/",
    name: "default",
    component: CompletedReviews,
  },
  {
    path: "/home",
    name: "Home",
    component: CompletedReviews,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/signup",
    name: "Signup",
    component: SignUp,
  },
  {
    path: "/completedreviews",
    name: "Completed Reviews",
    component: CompletedReviews,
  },
  {
    path: "/openreviews",
    name: "Open Reviews",
    component: OpenReviews,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
