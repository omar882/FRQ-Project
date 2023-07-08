import { createWebHistory, createRouter } from "vue-router";
import studentCompletedReviews from "@/views/studentViews/CompletedReviews.vue";
import studentOpenReviews from "@/views/studentViews/OpenReviews.vue";

import studentLogin from "@/views/studentViews/LoginView.vue";
import studentSignUp from "@/views/studentViews/SignUpView.vue";

const routes = [
  {
    path: "/",
    name: "default",
    component: studentCompletedReviews,
  },
  {
    path: "/home",
    name: "Home",
    component: studentCompletedReviews,
  },
  {
    path: "/login",
    name: "Login",
    component: studentLogin,
  },
  {
    path: "/signup",
    name: "Signup",
    component: studentSignUp,
  },
  {
    path: "/completedreviews",
    name: "Completed Reviews",
    component: studentCompletedReviews,
  },
  {
    path: "/openreviews",
    name: "Open Reviews",
    component: studentOpenReviews,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
