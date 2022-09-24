// import { createRouter, createWebHistory } from 'vue-router';
import Vue from 'vue';
import VHome from '@/views/VHome.vue';
import VueRouter from 'vue-router';
// import VRegister from '@/views/VRegister.vue';
// import VLogin from '@/views/VLogin.vue';
// import VUploadRecipe from '@/components/VUploadRecipe.vue';
// import { auth } from '@/firebaseInit';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: VHome,
    children: [
      // {
      //   path: '/upload',
      //   name: 'upload',
      //   component: VUploadRecipe,
      //   meta: { requiresAuth: true },
      // },
      // {
      //   path: '/login',
      //   name: 'login',
      //   component: VLogin,
      // },
      // {
      //   path: '/register',
      //   name: 'register',
      //   component: VRegister,
      // },
      {
        path: ':id',
        name: 'recipe',
        // REVIEW What exactly should I put here?
        // component:
      },
      // {
      //   path: '/search',
      //   name: 'search',
      //   // REVIEW What exactly should I put here?
      //   // component:
      // },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   // console.log(from);
//   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
//   const isAuthenticated = auth.currentUser;
//   if (requiresAuth && !isAuthenticated) {
//     next('/register');
//   } else if (
//     isAuthenticated &&
//     (to.name === 'register' || to.name === 'login')
//   ) {
//     next('/');
//   } else {
//     next();
//   }
// });

// router.beforeEach((to, from, next) => {
//   if (!hasQueryParams(to) && hasQueryParams(from)) {
//     next({ ...to, query: { query: from.query.query } });
//   } else {
//     next();
//   }
// });

function hasQueryParams(route) {
  return !!Object.keys(route.query).length;
}

function hasRecipeParams(route) {
  return !!Object.keys(route.params).length;
}

router.beforeEach((to, from, next) => {
  // console.log(from.params.id);
  // console.log(hasRecipeParams(to));
  // console.log(hasRecipeParams(from));
  if (hasRecipeParams(from) && !hasRecipeParams(to)) {
    next({ ...to, params: { id: from.params.id } });
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  // const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // const isAuthenticated = auth.currentUser;
  // if (requiresAuth && !isAuthenticated) {
  //   next('/register');
  // } else if (
  //   isAuthenticated &&
  //   (to.name === 'register' || to.name === 'login')
  // ) {
  //   next('/');
  // } else {
  // NOTE If user reloads the page, it will retain the previous search results in the search panel. To remove this functionality, simply replace the code block below with the params codeblock above;
  if (hasQueryParams(from) && !hasQueryParams(to)) {
    next({
      ...to,
      // params: { id: from.params.id },
      query: { query: from.query.query, page: from.query.page },
    });
  } else {
    next();
  }
  // }
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
