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
  },

  getters: {
    user: state => state.user,
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },

    CLEAR_USER(state) {
      state.user = null;
    },
  },

  actions: {
    async register({ commit }, details) {
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
        switch (error.code) {
          case 'auth/email-already-in-use':
            alert('Email already in use');
            break;
          case 'auth/invalid-email':
            alert('Invalid email');
            break;
          case 'auth/operation-not-allowed':
            alert('Operation not allowed');
            break;
          case 'auth/weak-password':
            alert('Weak password');
            break;
          default:
            alert('Something went wrong');
        }
        console.log(error);
        return;
      }

      commit('SET_USER', auth.currentUser);

      router.push('/');
      // NOTE Alternative syntax below. Would have to also add "dispatch" as a parameter (refer to official docs)
      // router.replace({ name: 'home' });
    },

    async login({ commit }, details) {
      const { email, password } = details;

      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        switch (error.code) {
          case 'auth/user-not-found':
            alert('User not found');
            break;
          case 'auth/wrong-password':
            alert('Wrong password');
            break;
          default:
            alert('Something went wrong');
        }
        console.log(error);
        return;
      }

      // commit('home/TOGGLE_RECIPE_SPINNER', null, { root: true });

      commit('SET_USER', auth.currentUser);
      // NOTE Need to either refresh the page or call fetchUserRecipes from home.js.
      // router.replace({ name: 'home' });
      router.push('/');
      location.reload();

      // NOTE Alternatively, without reloading I would have to manually refetch the user's data:
      // dispatch('home/fetchUserRecipes', null, { root: true });
    },

    // signOut() {
    //   auth.signOut().then(() => {
    //     this.$router.replace({ name: 'login' });
    //   });
    // },
    async logout({ commit }) {
      await signOut(auth);

      commit('CLEAR_USER');

      // NOTE Include below only if we want user redirected to login
      // router.push('login');
      router.push('/');
      location.reload();
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
