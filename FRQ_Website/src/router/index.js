import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/HomeView.vue";
import Login from "@/views/LoginView.vue";
import SignUp from "@/views/SignUpView.vue";

import { dataModel } from "../dataModel.js";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/*
router.beforeEach(async (to) => {
    alert(to.path);
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login'];
    //const authRequired = !publicPages.includes(to.path);

    //console.log(dataModel.currentUser);

    if (to.path != '/login') {
        //auth.returnUrl = to.fullPath;
        next({
            path: '/login',
            replace: true
        });
    } else
        next();
});
*/

export default router;
