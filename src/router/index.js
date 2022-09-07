// import { createRouter, createWebHistory } from 'vue-router';
import Vue from 'vue';
import VHome from '@/views/VHome.vue';
import VueRouter from 'vue-router';
import VRegister from '@/views/VRegister.vue';
import VLogin from '@/views/VLogin.vue';
import VUploadRecipe from '@/components/VUploadRecipe.vue';
import { auth } from '@/firebaseInit';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: VHome,
    children: [
      {
        path: '/upload',
        name: 'upload',
        component: VUploadRecipe,
        meta: { requiresAuth: true },
      },
      {
        path: '/login',
        name: 'login',
        component: VLogin,
      },
      {
        path: '/register',
        name: 'register',
        component: VRegister,
      },
    ],
  },

  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // console.log(from);

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = auth.currentUser;
  if (requiresAuth && !isAuthenticated) {
    next('/register');
  } else {
    next();
  }
});

export default router;

// import { createRouter, createWebHistory } from 'vue-router';
// import VHome from '@/views/VHome.vue';
// // import VRegister from '@/views/VRegister.vue';
// import VLogin from '@/views/VLogin.vue';
// // import Secret from "@/views/Secret.vue";

// import { auth } from '@/firebaseInit';
// const routes = [
//   {
//     path: '/',
//     name: 'Home',
//     component: VHome,
//     meta: {
//       requiresAuth: true,
//     },
//   },
//   // {
//   //   path: '/about',
//   //   name: 'About',
//   //   component: () => import('../views/About.vue'),
//   //   meta: {
//   //     requiresAuth: true,
//   //   },
//   // },
//   {
//     path: '/login',
//     name: 'Login',
//     component: VLogin,
//   },
// ];

// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes,
// });

// router.beforeEach((to, from, next) => {
//   if (to.path === '/login' && auth.currentUser) {
//     next('/');
//     return;
//   }

//   if (
//     to.matched.some(record => record.meta.requiresAuth) &&
//     !auth.currentUser
//   ) {
//     next('/login');
//     return;
//   }

//   next();
// });

// export default router;
