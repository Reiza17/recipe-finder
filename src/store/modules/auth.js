import { auth, db } from '@/firebaseInit';
import router from '@/router';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
// import { collection, setDoc } from 'firebase/firestore';

export default {
  namespaced: true,

  state: {
    user: null,
    registerErrorMessage: '',
    loginErrorMessage: '',
  },

  getters: {
    user: state => state.user,
    registerErrorMessage: state => state.registerErrorMessage,
    loginErrorMessage: state => state.loginErrorMessage,
  },

  mutations: {
    CLEAR_LOGIN_ERROR(state) {
      state.loginErrorMessage = '';
    },

    CLEAR_REGISTRATION_ERROR(state) {
      state.registerErrorMessage = '';
    },

    SET_USER(state, user) {
      state.user = user;
    },

    CLEAR_USER(state) {
      state.user = null;
    },
  },

  actions: {
    async register({ commit, state }, details) {
      const { email, password } = details;

      try {
        const cred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await setDoc(doc(db, 'users', cred.user.uid), {
          email: email,
          uploadedRecipes: [],
          bookmarks: [],
        });
      } catch (error) {
        if (error.code === 'auth/email-already-in-use')
          state.registerErrorMessage = 'Email already in use';
        if (error.code === 'auth/weak-password')
          state.registerErrorMessage = 'Password too weak';
        else state.registerErrorMessage = 'Something went wrong';

        return;
      }
      commit('SET_USER', auth.currentUser);

      router.push('/');
      // NOTE Alternative syntax below. Would have to also add "dispatch" as a parameter (refer to official docs)
      // router.replace({ name: 'home' });
    },

    async login({ commit, state, dispatch }, details) {
      const { email, password } = details;

      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password'
        )
          state.loginErrorMessage = 'Incorrect username or password';
        else state.loginErrorMessage = 'Something went wrong';
        return;
      }

      // commit('home/TOGGLE_RECIPE_SPINNER', null, { root: true });

      commit('SET_USER', auth.currentUser);
      // NOTE including the params means it will redirect back to the same recipe

      router.push({
        name: 'recipe',
        params: { id: router.app._route.params.id },
      });
      // router.push('/');

      location.reload();
      dispatch('home/init', true, null, { root: true });
    },

    // signOut() {
    //   auth.signOut().then(() => {
    //     this.$router.replace({ name: 'login' });
    //   });
    // },
    async logout({ commit, dispatch }) {
      await signOut(auth);

      commit('CLEAR_USER');

      // NOTE Include below only if we want user redirected to login or home
      // router.push('login');
      // router.push('/');

      // NOTE dispatching the init here allows the state to remain
      location.reload();
      dispatch('home/init', null, { root: true });
    },

    // setupFirebase() {
    //   auth.onAuthStateChanged(user => {
    //     if (user) {
    //       // User is signed in.
    //       console.log('signed in');
    //       this.loggedIn = true;
    //     } else {
    //       // No user is signed in.
    //       this.loggedIn = false;
    //       console.log('signed out', this.loggedIn);
    //     }
    //   });
    // },

    // REVIEW The 'async' next to user below might not actually be necessary. Test this.
    fetchUser({ commit }) {
      auth.onAuthStateChanged(async user => {
        console.log(user);
        if (!user) {
          commit('CLEAR_USER');
        } else {
          commit('SET_USER', user);

          // // NOTE: isReady() is Vue 3 version of Vue 2's onReady
          // if (
          //   this.$router.isReady() &&
          //   this.$router.currentRoute.value.path === '/login'
          // ) {
          //   this.$router.push('/');
          // }
        }
      });
    },
  },
};
