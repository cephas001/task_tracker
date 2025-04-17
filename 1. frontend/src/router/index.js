import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";
import AddToTask from "../views/AddToTask.vue";
import EditTask from "../views/EditTask.vue";
import ErrorPage from "../views/ErrorPage.vue";
import Entry from "../views/Entry.vue";
import Profile from "../views/Profile.vue";
import OTP from "../views/OTP.vue";
import Contact from "../views/Contact.vue";
import NewEmail from "../views/NewEmail";
import ForgotPassword from "../views/ForgotPassword.vue"

import LoggedInLayout from "../layouts/LoggedInLayout.vue";
import EntryLayout from "../layouts/EntryLayout.vue";

import store from "../store";

const routes = [
  {
    path: "/",
    component: LoggedInLayout,
    meta: { requiresLogin: true },
    redirect: "/homepage",
    children: [
      {
        path: "/homepage/:id?",
        name: "Home",
        component: Home,
      },
      {
        path: "/addtask",
        name: "AddToTask",
        component: AddToTask,
      },
      {
        path: "/contact",
        name: "Contact",
        component: Contact,
      },
      {
        path: "/task/:id",
        name: "EditTask",
        component: EditTask,
      },
      {
        path: "/profile",
        name: "Profile",
        component: Profile,
      },
    ],
  },
  {
    path: "/",
    meta: { notRequiresLogin: true },
    component: EntryLayout,
    children: [
      {
        path: "/entry",
        name: "Entry",
        component: Entry,
      },
      {
        path: "/login",
        name: "Login",
        component: Login,
      },
      {
        path: "/signup",
        name: "SignUp",
        component: SignUp,
      },
      {
        path: "/contact_",
        name: "Contact2",
        component: Contact,
      },
      {
        path: "/forgot_password",
        name: "ForgotPassword",
        component: ForgotPassword,
      },
      {
        path: "/enter_otp/:email_change?",
        name: "OTP",
        component: OTP,
        beforeEnter: (to, from, next) => {
          if(localStorage.getItem("hash") == null || localStorage.getItem("email") == null) {
            localStorage.clear()
            next("/signup")
          } else {
            next()
          }
        },
      },
      {
        path: "/new_email",
        name: "NewEmail",
        component: NewEmail,
      },
    ],
  },
  {
    path: "/error",
    name: "ErrorPage",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.requiresLogin) &&
    !localStorage.getItem("token")
  ) {
    next("/login");
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  if (
    to.matched.some((record) => record.meta.notRequiresLogin) &&
    localStorage.getItem("token")
  ) {
    next("/homepage");
  } else {
    next();
  }
});

export default router;
