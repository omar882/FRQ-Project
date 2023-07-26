import { createWebHistory, createRouter } from "vue-router";
import studentMainView from "@/views/studentViews/studentMainView.vue";
import teacherMainView from "@/views/teacherViews/teacherMainView.vue";
import homeView from "@/views/homeView.vue";
import studentLoginView from "@/views/studentViews/LoginView.vue";
import studentSignUpView from "@/views/studentViews/SignUpView.vue";
import teacherLoginView from "@/views/teacherViews/TeacherLoginView.vue";
import teacherSignUpView from "@/views/teacherViews/TeacherSignUpView.vue";

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
    component: studentLoginView,
  },
  {
    path: "/studentsignup",
    name: "Signup",
    component: studentSignUpView,
  },
  {
    path: "/studenthome",
    name: "Student Home",
    component: studentMainView,
  },

  {
    path: "/teacherlogin",
    name: "Teacher Login",
    component: teacherLoginView,
  },
  {
    path: "/teachersignup",
    name: "Teacher Signup",
    component: teacherSignUpView,
  },
  {
    path: "/teacherhome",
    name: "Teacher Main View",
    component: teacherMainView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
