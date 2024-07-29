import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HomeView from "../views/HomeView.vue";
import AddCampaignView from "../views/AddCampaignView.vue";

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: HomeView,
  },
  {
    path: "/login",
    name: "LoginView",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/LoginView.vue"),
  },
  {
    path: "/signup",
    name: "SignUpView",
    component: () =>
      import(/* webpackChunkName: "signup" */ "../views/SignUpView.vue"),
  },
  {
    path: "/campaigns",
    name: "MainView",
    component: () =>
      import(/* webpackChunkName: "main" */ "../views/MainView.vue"),
    meta: {
      requiresAuth: true, // Change to true when needed
    },
  },
  {
    path: "/add-campaign",
    name: "AddCampaign",
    component: AddCampaignView,
    meta: {
      requiresAuth: true, // Change to true when needed
    },
  },
  {
    path: "/campaigns/:id",
    name: "CampaignView",
    component: () =>
      import(/* webpackChunkName: "campaign" */ "../views/CampaignView.vue"),
    props: true,
    meta: {
      requiresAuth: true, // Change to true when needed
    },
  },
  {
    path: "/profile/:userId",
    name: "ProfileView",
    component: () =>
      import(/* webpackChunkName: "profile" */ "../views/ProfileView.vue"),
    props: true,
    meta: {
      requiresAuth: true, // Change to true when needed
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (!requiresAuth) {
    next();
    return;
  }

  const auth = getAuth();
  onAuthStateChanged(
    auth,
    (user) => {
      if (user) {
        next();
      } else {
        next("/login");
      }
    },
    () => {
      next("/login");
    }
  );
});

export default router;
