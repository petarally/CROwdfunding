import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "LoginView",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LoginView.vue"),
  },
  {
    path: "/signup",
    name: "SignUpView",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SignUpView.vue"),
  },
  {
    path: "/main",
    name: "MainView",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/MainView.vue"),
    meta: {
      requiresAuth: false /* Tu treba promijeniti u true kasnije */,
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
  new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  })
    .then((user) => {
      if (user) {
        next();
      } else {
        next("/login");
      }
    })
    .catch(() => {
      next("/login");
    });
});

export default router;
