// import { createRouter, createWebHistory } from 'vue-router';
import Vue from 'vue';
import VHome from '@/views/VHome.vue';
import VPersonal from '@/views/VPersonal.vue';
import VUploadRecipe from '@/components/VUploadRecipe.vue';
import VEditRecipe from '@/components/VEditRecipe.vue';
import VueRouter from 'vue-router';
import store from '@/store';

// import VRegister from '@/views/VRegister.vue';
// import VLogin from '@/views/VLogin.vue';
// import VUploadRecipe from '@/components/VUploadRecipe.vue';
// import { auth } from '@/firebaseInit';

Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    name: 'home',
    component: VHome,
    // children: [
    //   // {
    //   //   path: '/upload',
    //   //   name: 'upload',
    //   //   component: VUploadRecipe,
    //   //   meta: { requiresAuth: true },
    //   // },
    //   // {
    //   //   path: '/login',
    //   //   name: 'login',
    //   //   component: VLogin,
    //   // },
    //   // {
    //   //   path: '/register',
    //   //   name: 'register',
    //   //   component: VRegister,
    //   // },
    //   {
    //     path: ':id?/:userRecipeId?',
    //     name: 'recipe',
    //     // REVIEW What exactly should I put here?
    //     // component:
    //   },
    // ],
  },
  {
    path: '/personal',
    name: 'personal',
    component: VPersonal,
    children: [
      {
        path: '/personal/upload',
        name: 'upload',
        component: VUploadRecipe,
        // path: ':userRecipeId?/:id?',
        // name: 'userRecipe',
        // REVIEW What exactly should I put here?
        // component:
      },
      {
        path: '/personal/edit',
        name: 'edit',
        component: VEditRecipe,
        // path: ':userRecipeId?/:id?',
        // name: 'userRecipe',
        // REVIEW What exactly should I put here?
        // component:
      },
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
//   if (!hasQuery(to) && hasQuery(from)) {
//     next({ ...to, query: { query: from.query.query } });
//   } else {
//     next();
//   }
// });

// function hasQueryParams(route) {
//   return !!Object.keys(route.query).length;
// }

// function hasRecipeParams(route) {
//   return !!Object.keys(route.params).length;
// }

// router.beforeEach((to, from, next) => {
//   // console.log(from.params.id);
//   // console.log(hasRecipeParams(to));
//   // console.log(hasRecipeParams(from));
//   if (hasRecipeParams(from) && !hasRecipeParams(to)) {
//     next({
//       ...to,
//       params: {
//         id: from.params.id,
//         userRecipeId: from.params.userRecipeId,
//       },
//     });
//   } else {
//     next();
//   }
// });

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

  if (from.path === to.path) {
    next(false);
  }

  if (from.query.id && !to.query.id) {
    next({
      path: to.path,
      query: { ...to.query, id: from.query.id },
    });
  } else {
    next();
  }

  if (from.query.userRecipeId && !to.query.userRecipeId) {
    const userRecipes = store.getters['home/userRecipes'];

    const existingUserRecipe = userRecipes.filter(
      recipe => recipe.id === from.query.userRecipeId
    );

    // NOTE this allows deleting a recipe to also remove the recipe's id from the query params
    if (Object.keys(existingUserRecipe).length) {
      next({
        path: to.path,
        query: { ...to.query, userRecipeId: from.query.userRecipeId },
      });
    } else {
      next();
    }
  } else {
    next();
  }

  if (from.query.query && !to.query.query) {
    next({
      path: to.path,
      query: { ...to.query, query: from.query.query },
    });
  } else {
    next();
  }

  if (from.query.page && !to.query.page) {
    next({
      path: to.path,
      query: { ...to.query, page: from.query.page },
    });
  } else {
    next();
  }

  if (from.query.userRecipeQuery && !to.query.userRecipeQuery) {
    next({
      path: to.path,
      query: { ...to.query, userRecipeQuery: from.query.userRecipeQuery },
    });
  } else {
    next();
  }

  if (from.query.userRecipeQueryPage && !to.query.userRecipeQueryPage) {
    next({
      path: to.path,
      query: {
        ...to.query,
        userRecipeQueryPage: from.query.userRecipeQueryPage,
      },
    });
  } else {
    next();
  }

  // if (hasQueryParams(from) && !hasQueryParams(to)) {
  //   next({
  //     ...to,
  //     // params: { id: from.params.id },
  //     query: {
  //       id: from.query.id,
  //       userRecipeId: from.query.userRecipeId,
  //       query: from.query.query,
  //       page: from.query.page,
  //       userRecipeQuery: from.query.userRecipeQuery,
  //       userRecipeQueryPage: from.query.userRecipeQueryPage,
  //     },
  //   });
  // } else {
  //   next();
  // }
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
