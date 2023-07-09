import { createWebHistory, createRouter } from "vue-router";
import studentMainPage from "@/views/studentViews/studentMainView.vue";

import studentLogin from "@/views/studentViews/LoginView.vue";
import studentSignUp from "@/views/studentViews/SignUpView.vue";
import homeView from "@/views/homeView.vue";
import teacherLogin from "@/views/teacherViews/teacherLogin.vue";

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
    name: "Student Login",
    component: studentLogin,
  },
  {
    path: "/studentsignup",
    name: "Signup",
    component: studentSignUp,
  },
  {
    path: "/studenthome",
    name: "Student Home",
    component: studentMainPage,
  },

  {
    path: "/teacherlogin",
    name: "Teacher Login",
    component: teacherLogin,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
