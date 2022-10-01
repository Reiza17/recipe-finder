// import Vue from 'vue';
// import App from './App.vue';
// import store from './store';
// import '@/assets/sass/style.scss';

// Vue.config.productionTip = false;

// new Vue({
//   store,
//   render: h => h(App),
// }).$mount('#app');

import Vue from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
// import firebase from 'firebase/compat/app';
import { auth } from './firebaseInit';
import '@/assets/sass/style.scss';
import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

Vue.config.productionTip = false;

let app;

// NOTE necessary for clearing the state after user logs out
auth.onAuthStateChanged(user => {
  console.log('User', user);
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app');
  }
});
