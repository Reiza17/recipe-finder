import Vue from 'vue';
import Vuex from 'vuex';

import home from '@/store/modules/home';
import auth from '@/store/modules/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    home,
    auth,
  },
});
