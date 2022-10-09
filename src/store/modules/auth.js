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
    authMessage: '',
    successfulAuth: null,
    loginErrorMessage: '',
    isAuthenticating: null,
  },

  getters: {
    loggedIn: state => state.user,
    loginErrorMessage: state => state.loginErrorMessage,
    authMessage: state => state.authMessage,
    successfulAuth: state => state.successfulAuth,
    isAuthenticating: state => state.isAuthenticating,
  },

  mutations: {
    SET_AUTH_MESSAGE(state, message) {
      state.authMessage = message;
    },
    CLEAR_AUTH_MESSAGE(state) {
      state.authMessage = '';
    },

    SET_LOGIN_ERROR(state, message) {
      state.loginErrorMessage = message;
    },
    CLEAR_LOGIN_ERROR(state) {
      state.loginErrorMessage = '';
    },

    SET_SUCCESSFUL_AUTH(state, message) {
      state.successfulAuth = true;
      state.authMessage = message;
    },

    SET_USER(state, user) {
      state.user = user;
    },
    CLEAR_USER(state) {
      state.user = null;
    },

    TOGGLE_AUTH_SPINNER(state, boolean) {
      state.isAuthenticating = boolean;
    },
  },

  actions: {
    async register({ commit }, details) {
      commit('TOGGLE_AUTH_SPINNER', true);
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

        commit('TOGGLE_AUTH_SPINNER', false);
        commit(
          'SET_SUCCESSFUL_AUTH',
          'You have successfully signed up. You will soon be redirected.'
        );
        setTimeout(() => {
          location.reload();
        }, 1000);
      } catch (error) {
        commit('TOGGLE_AUTH_SPINNER', false);
        if (error.code === 'auth/email-already-in-use')
          return commit('SET_AUTH_MESSAGE', 'Email already in use');
        if (error.code === 'auth/weak-password')
          return commit('SET_AUTH_MESSAGE', 'Password too weak');
        else return commit('SET_AUTH_MESSAGE', 'Something went wrong');
      }

      commit('SET_USER', auth.currentUser);
    },

    async login({ commit }, details) {
      commit('TOGGLE_AUTH_SPINNER', true);
      const { email, password } = details;

      try {
        await signInWithEmailAndPassword(auth, email, password);

        commit('TOGGLE_AUTH_SPINNER', false);
        commit(
          'SET_SUCCESSFUL_AUTH',
          'You are now logged in. You will soon be redirected.'
        );
        setTimeout(() => {
          location.reload();
        }, 1000);
      } catch (error) {
        console.log(error.code);
        commit('TOGGLE_AUTH_SPINNER', false);
        if (
          error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password'
        )
          return commit('SET_AUTH_MESSAGE', 'Incorrect username or password');
        else if (error.code === 'auth/too-many-requests')
          return commit(
            'SET_AUTH_MESSAGE',
            'There have been too many login attempts. Please try again later.'
          );
        else return commit('SET_AUTH_MESSAGE', 'Something went wrong');
      }

      commit('SET_USER', auth.currentUser);
    },

    // signOut() {
    //   auth.signOut().then(() => {
    //     this.$router.replace({ name: 'login' });
    //   });
    // },
    async logout({ commit }) {
      await signOut(auth);

      commit('CLEAR_USER');

      console.log(router);
      // NOTE Include below only if we want user redirected to login or home
      // router.push('login');

      // router.push({
      //   name: 'home',
      // });

      // Clears the URL
      router.replace({
        name: 'home',
        params: { id: null },
        query: { query: undefined },
      });

      location.reload();

      // NOTE This line and location.reload() will keep the same search results and recipe view
      // dispatch('home/init', null, { root: true });
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
