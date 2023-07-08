import { createWebHistory, createRouter } from "vue-router";
import studentCompletedReviews from "@/views/studentViews/CompletedReviews.vue";
import studentOpenReviews from "@/views/studentViews/OpenReviews.vue";

import studentLogin from "@/views/studentViews/LoginView.vue";
import studentSignUp from "@/views/studentViews/SignUpView.vue";
import homeView from "@/views/homeView.vue";

const routes = [
  {
    path: "/",
    name: "default",
    component: homeView,
  },
  {
    path: "/home",
    name: "Home",
    component: homeView,
  },
  {
    path: "/studentlogin",
    name: "Login",
    component: studentLogin,
  },
  {
    path: "/studentsignup",
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
