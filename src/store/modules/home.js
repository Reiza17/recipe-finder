import axios from 'axios';
import router from '@/router';
import { API_URL, RES_PER_PAGE, KEY } from '@/common/config.js';
import {
  // collection,
  // getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/firebaseInit';
// import { TIMEOUT_SEC } from '@/common/config.js';
// import { timeout } from '@/common/helpers.js';

export default {
  namespaced: true,

  state: {
    recipe: {},
    userRecipe: {},
    userRecipes: [],
    bookmarks: [],
    previousURL: '',
    search: {
      results: [],
      page: 1,
      resultsPerPage: RES_PER_PAGE,
    },
    userRecipeSearch: {
      results: [],
      page: 1,
      resultsPerPage: RES_PER_PAGE,
    },
    loadingSearchResults: false,
    loadingRecipe: false,
    loadingBookmarks: false,
    loadingUserRecipes: false,
    loginModal: false,
    registerModal: false,
    editRecipeModal: false,
    renderRecipeError: null,
    uploadRecipeModal: false,
    uploadingRecipe: false,
    toastMessage: '',
    toastTimeout: null,
    // User recipes view variables
    userRecipesView: false,
  },

  getters: {
    recipe: state => state.recipe,
    recipeBookmarks: state => state.bookmarks,
    recipeBookmarked: state => state.recipe.bookmarked,
    userRecipe: state => state.userRecipe,
    userRecipes: state => state.userRecipes,
    userRecipeSearchResults: state => state.userRecipeSearch.results,
    userRecipeSearchResultsCurrentPage: state => state.userRecipeSearch.page,
    userRecipeSearchResultsDisplay: state => {
      const start =
        (state.userRecipeSearch.page - 1) *
        state.userRecipeSearch.resultsPerPage; // 0
      const end =
        state.userRecipeSearch.page * state.userRecipeSearch.resultsPerPage; // 10

      return state.userRecipeSearch.results.slice(start, end);
    },
    searchResults: state => state.search.results,
    searchResultsCurrentPage: state => state.search.page,
    searchResultsPerPage: state => state.search.resultsPerPage,
    searchResultsDisplay: state => {
      const start = (state.search.page - 1) * state.search.resultsPerPage; // 0
      const end = state.search.page * state.search.resultsPerPage; // 10

      return state.search.results.slice(start, end);
    },
    loadingSearchResults: state => state.loadingSearchResults,
    loadingRecipe: state => state.loadingRecipe,
    loadingBookmarks: state => state.loadingBookmarks,
    loadingUserRecipes: state => state.loadingUserRecipes,
    loginModal: state => state.loginModal,
    registerModal: state => state.registerModal,
    editRecipeModal: state => state.editRecipeModal,
    renderRecipeError: state => state.renderRecipeError,
    uploadRecipeModal: state => state.uploadRecipeModal,
    uploadingRecipe: state => state.uploadingRecipe,
    toastMessage: state => state.toastMessage,
    // User recipes view variables
    userRecipesView: state => state.userRecipesView,
  },

  mutations: {
    SET_PREVIOUS_URL(state, pageName) {
      state.previousURL = pageName;
    },

    // REVIEW should I combine these into one action instead?
    CREATE_SEARCH_RESULTS(state, { results, page = 1 }) {
      state.search.results = results;
      state.search.page = page;
    },

    CREATE_USER_RECIPE_SEARCH_RESULTS(state, { results, page = 1 }) {
      state.userRecipeSearch.results = results;
      state.userRecipeSearch.page = page;
    },

    TOGGLE_SEARCH_SPINNER(state, boolean) {
      state.loadingSearchResults = boolean;
    },

    UPDATE_PAGINATION(state, amount) {
      state.search.page += amount;
      router.push({
        query: {
          page: state.search.page,
        },
      });
    },

    // REVIEW should I split this into two actions instead?
    CREATE_RECIPE_OBJECT(state, { data, userGenerated = false }) {
      if (!userGenerated) {
        state.recipe = { ...data, bookmarked: false };
        if (state.bookmarks.some(bookmark => bookmark.id === state.recipe.id))
          state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;
      } else {
        state.userRecipe = { ...data, bookmarked: false };
        if (
          state.bookmarks.some(bookmark => bookmark.id === state.userRecipe.id)
        )
          state.userRecipe.bookmarked = true;
        else state.userRecipe.bookmarked = false;
      }
    },

    SHOW_RENDER_RECIPE_ERROR_MESSAGE(state, message) {
      state.renderRecipeError = message;
    },

    TOGGLE_RECIPE_SPINNER(state, boolean) {
      state.loadingRecipe = boolean;
    },

    UPDATE_SERVINGS(state, amount) {
      if (state.recipe.servings + amount <= 0) return;

      const oldServings = state.recipe.servings;
      state.recipe.servings += amount;
      state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * state.recipe.servings) / oldServings;
      });
    },

    TOGGLE_BOOKMARKS_SPINNER(state, boolean) {
      state.loadingBookmarks = boolean;
    },

    SET_STORED_BOOKMARKS(state, bookmarks) {
      // NOTE uses reverse() so that newly bookmarked/uploaded recipes are at the top, similar to newly "Liked" videos on Youtube. In reality, it's probably better to use a timestamp and sort().
      state.bookmarks = bookmarks.reverse();
    },

    ADD_BOOKMARK(state, recipe) {
      state.recipe.bookmarked = true;
      state.bookmarks.unshift(recipe);
    },

    DELETE_BOOKMARK(state, recipe) {
      const recipeIndex = state.bookmarks.findIndex(
        bookmark => bookmark.id === recipe.id
      );
      state.bookmarks.splice(recipeIndex, 1);
      state.recipe.bookmarked = false;
    },

    TOGGLE_LOGIN_MODAL(state) {
      state.loginModal = !state.loginModal;
    },

    TOGGLE_REGISTER_MODAL(state) {
      state.registerModal = !state.registerModal;
    },

    TOGGLE_USER_RECIPES_VIEW(state) {
      state.userRecipesView = !state.userRecipesView;
    },

    TOGGLE_UPLOAD_RECIPE_MODAL(state) {
      state.uploadRecipeModal = !state.uploadRecipeModal;
    },

    TOGGLE_UPLOAD_SPINNER(state, boolean) {
      state.uploadingRecipe = boolean;
    },

    SET_TOAST_MESSAGE(state, msg) {
      state.toastMessage = '';
      setTimeout(() => {
        state.toastMessage = msg;
      }, 1);

      clearTimeout(state.toastTimeout);
      state.toastTimeout = setTimeout(() => {
        state.toastMessage = '';
      }, 3500);
    },

    TOGGLE_USER_RECIPES_SPINNER(state, boolean) {
      state.loadingUserRecipes = boolean;
    },

    ADD_USER_RECIPE(state, recipe) {
      // console.log(recipe.id);
      state.userRecipes.unshift(recipe);
      console.log(state.userRecipes);
    },

    EDIT_USER_RECIPE(state, recipe) {
      // REVIEW test out below option. Supposedly might fail to update Vue reactively
      // state.userRecipes.map(userRecipe => {
      //   if (userRecipe.id === recipe.id) {
      //     userRecipe = recipe;
      //   }
      // });
      const recipeIndex = state.userRecipes.findIndex(
        userRecipe => userRecipe.id === recipe.id
      );
      state.userRecipes.splice(recipeIndex, 1, recipe);
    },

    DELETE_USER_RECIPE(state, recipe) {
      const recipeIndex = state.userRecipes.findIndex(
        userRecipe => userRecipe.id === recipe.id
      );
      state.userRecipes.splice(recipeIndex, 1);

      // NOTE delete the recipe object so that Recipe view changes (there's a v-if that's based on object length)
      Object.keys(recipe).forEach(key => delete recipe[key]);
    },

    TOGGLE_EDIT_USER_RECIPE_MODAL(state) {
      // console.log(recipe.id);
      state.editRecipeModal = !state.editRecipeModal;
    },

    SET_USER_RECIPES(state, recipes) {
      state.userRecipes = recipes;
      // console.log(state.userRecipes);
    },
  },

  actions: {
    async init({ commit, dispatch, rootState }) {
      try {
        commit('TOGGLE_RECIPE_SPINNER', true);
        commit('TOGGLE_BOOKMARKS_SPINNER', true);
        commit('TOGGLE_USER_RECIPES_SPINNER', true);

        // NOTE no need to toggle above spinners to false, as that's done at the end of the actions themselves

        // NOTE await is necessary for these, otherwise the user recipes and bookmarks won't display
        await dispatch('auth/fetchUser', null, { root: true });
        if (rootState.auth.user) {
          dispatch('fetchBookmarks');
          await dispatch('fetchUserRecipes');
        }
        commit('TOGGLE_BOOKMARKS_SPINNER', false);
        commit('TOGGLE_USER_RECIPES_SPINNER', false);

        console.log(router);
        if (router.app._route.query.query)
          dispatch('searchRecipes', {
            query: router.app._route.query.query,
            page: router.app._route.query.page,
            reloadingPage: true,
          });

        if (router.app._route.query.userRecipeQuery)
          dispatch('searchUserRecipes', {
            query: router.app._route.query.userRecipeQuery,
            page: router.app._route.query.userRecipeQueryPage,
            reloadingPage: true,
          });

        // NOTE Prevents a second reload from triggering while logging in. The login action in auth.js does a router.push to send the params (thereby reloading the recipe b/c the url will change), then dispatches this init action. Once I remove the router-links from the login/register/upload recipe modules, I probably won't need this guard anymore (as well as the loggingIn parameter above, and a slew of other related things in this and other components.
        // if (loggingIn) return;

        // TODO test to see if the actions for one tab are executed when the other tab inits upon reload. If so, then split the actions or use a guard clause
        if (router.app._route.query.id)
          dispatch('renderRecipe', {
            id: router.app._route.query.id,
          });

        if (router.app._route.query.userRecipeId)
          dispatch('renderRecipe', {
            id: router.app._route.query.userRecipeId,
          });
      } catch (err) {
        console.log(err);
      }
    },

    async searchRecipes(
      { commit, state },
      { query, page = 1, reloadingPage = false }
    ) {
      try {
        commit('TOGGLE_SEARCH_SPINNER', true);

        // NOTE The guard clause prevents the router from replacing an existing query with the same query during page reloads, something which results in a redundancy error.
        // TODO used to not have "name: 'home'"
        if (!reloadingPage)
          router
            .push({
              name: 'home',
              query: {
                query: query,
                page: page,
              },
            })
            .catch(() => {});

        // console.log(state.userRecipes);
        // NOTE Remove 'split' below if I want to include partial-word results
        // const matchingUserRecipes = state.userRecipes.filter(recipe =>
        //   recipe.title.toLowerCase().split(' ').includes(query.toLowerCase())
        // );

        const res = await axios.get(`${API_URL}?search=${query}&key=${KEY}`);
        const allSearchResults = res.data.data.recipes;

        // TODO Rename variable to something better?
        const bookmarkedSearchResults = allSearchResults.filter(apiRecipe =>
          state.bookmarks.some(
            bookmarkedRecipe => bookmarkedRecipe.id === apiRecipe.id
          )
        );

        // TODO Rename variable to something better?
        const nonBookmarkedSearchResults = allSearchResults.filter(
          apiRecipe =>
            !state.bookmarks.some(
              bookmarkedRecipe => bookmarkedRecipe.id === apiRecipe.id
            )
        );

        const filteredResults = [
          // ...matchingUserRecipes,
          ...bookmarkedSearchResults,
          ...nonBookmarkedSearchResults,
        ];
        commit('CREATE_SEARCH_RESULTS', {
          results: filteredResults,
          page: +page,
        });
        commit('TOGGLE_SEARCH_SPINNER', false);
      } catch (err) {
        console.error(`Error searching for recipes: ${err}`);
        commit('TOGGLE_SEARCH_SPINNER', false);
      }
    },

    async searchUserRecipes(
      { commit, state },
      { query, page = 1, reloadingPage = false }
    ) {
      try {
        commit('TOGGLE_SEARCH_SPINNER', true);

        // NOTE The guard clause prevents the router from replacing an existing query with the same query during page reloads, something which results in a redundancy error.
        // TODO used to not have "name: 'home'"
        if (!reloadingPage)
          router
            .push({
              name: 'personal',
              query: {
                userRecipeQuery: query,
                userRecipeQueryPage: page,
              },
            })
            .catch(() => {});

        // console.log(state.userRecipes);
        // NOTE Remove 'split' below if I want to include partial-word results
        const allSearchResults = state.userRecipes.filter(recipe =>
          recipe.title.toLowerCase().split(' ').includes(query.toLowerCase())
        );

        // TODO Rename variable to something better?
        const bookmarkedSearchResults = allSearchResults.filter(recipe =>
          state.bookmarks.some(
            bookmarkedRecipe => bookmarkedRecipe.id === recipe.id
          )
        );

        // TODO Rename variable to something better?
        const nonBookmarkedSearchResults = allSearchResults.filter(
          recipe =>
            !state.bookmarks.some(
              bookmarkedRecipe => bookmarkedRecipe.id === recipe.id
            )
        );

        const filteredResults = [
          ...bookmarkedSearchResults,
          ...nonBookmarkedSearchResults,
        ];
        commit('CREATE_USER_RECIPE_SEARCH_RESULTS', {
          results: filteredResults,
          page: +page,
        });
        commit('TOGGLE_SEARCH_SPINNER', false);
      } catch (err) {
        console.error(`Error searching for recipes: ${err}`);
        commit('TOGGLE_SEARCH_SPINNER', false);
      }
    },

    async renderRecipe({ commit, state }, { id }) {
      try {
        // console.log(id);
        commit('SHOW_RENDER_RECIPE_ERROR_MESSAGE', null);
        commit('TOGGLE_RECIPE_SPINNER', true);

        const [userRecipe] = state.userRecipes.filter(
          recipe => recipe.id === id
        );
        if (userRecipe)
          commit('CREATE_RECIPE_OBJECT', {
            data: userRecipe,
            userGenerated: true,
          });
        // REVIEW can I load faster? as in, if it's already been loaded before, I just render it quickly. One suggested way is to store already loaded recipes into an array. And if the id of it matches any in that array, skip the API call. That's a somewhat hacky method, but others do it and it works.
        // BUG if I click between two recipes too fast, then it will render the wrong one
        else {
          const res = await axios.get(`${API_URL}${id}`);
          console.log(res);
          commit('CREATE_RECIPE_OBJECT', {
            data: res.data.data.recipe,
            userGenerated: false,
          });
        }
        commit('TOGGLE_RECIPE_SPINNER', false);
      } catch (err) {
        console.log(err);
        console.error(`Error loading recipe: ${err}`);
        // TODO improve and streamline the error handling process
        if (err.response.status === 400)
          commit(
            'SHOW_RENDER_RECIPE_ERROR_MESSAGE',
            "This recipe isn't available"
          );
        else if (err.response.status === 429)
          commit(
            'SHOW_RENDER_RECIPE_ERROR_MESSAGE',
            'You have sent too many requests for recipes. Please try again in an hour.'
          );
        // REVIEW can add more messages for other types of errors
        else if (!err.status) {
          commit(
            'SHOW_RENDER_RECIPE_ERROR_MESSAGE',
            'There was a network connection problem. Please reload the page or check your connection.'
          );
        } else {
          commit(
            'SHOW_RENDER_RECIPE_ERROR_MESSAGE',
            'Oops! Something went wrong. Please try reloading the page.'
          );
        }
        commit('TOGGLE_RECIPE_SPINNER', false);
      }
    },

    async fetchUserRecipes({ commit, rootState }) {
      try {
        // console.log(rootState);

        commit('TOGGLE_RECIPE_SPINNER', true);
        const docRef = doc(db, 'users', rootState.auth.user.uid);
        const docSnap = await getDoc(docRef);

        // NOTE async test timer
        // const setTimeoutPromise = timeout => {
        //   return new Promise(resolve => setTimeout(resolve, timeout));
        // };
        // await setTimeoutPromise(2000);
        // console.log('done');

        commit('SET_USER_RECIPES', docSnap.data().uploadedRecipes);
        commit('TOGGLE_RECIPE_SPINNER', false);

        // NOTE Fetching an entire collection (e.g. all users, instead of a single user)
        // const querySnapshot = await getDocs(collection(db, 'users'));
        // const userRecipes = querySnapshot.docs.map(doc => doc.data());
      } catch (err) {
        console.error(`Failed to get user recipes from server: ${err}`);
        commit('TOGGLE_RECIPE_SPINNER', false);
      }
    },

    async uploadUserRecipe({ commit, rootState, dispatch }, { recipe, id }) {
      commit('TOGGLE_UPLOAD_SPINNER', true);

      try {
        const userRecipe = { ...recipe, bookmarked: false };
        const docRef = doc(db, 'users', rootState.auth.user.uid);

        await updateDoc(docRef, {
          uploadedRecipes: arrayUnion(userRecipe),
        });

        // REVIEW this timeout is not useful, because there's no way to cancel pending writes to firestore, meaning even after timeout throws an error, the user's network will keep trying to upload the data to firestore (and if successful, the user recipes will not be updated on the client-side). Stack overflow solution: Use (firestore) security rules to ensure that only valid transitions are allowed. A typical approach here could be to add a (client-side) timestamp to each write operation, and reject (firestore) writes where the timestamp is too old.
        // const uploadRec = async function () {
        //   await updateDoc(docRef, {
        //     uploadedRecipes: arrayUnion(userRecipe),
        //   });
        //   return true;
        // };

        // const res = await Promise.race([uploadRec(), timeout(TIMEOUT_SEC)]);
        // console.log(res);
        // if (!res) throw new Error('10 seconds have passed...');

        commit('TOGGLE_UPLOAD_SPINNER', false);

        commit('ADD_USER_RECIPE', userRecipe);

        router
          .push({
            name: 'recipe',
            query: { id: id },
          })
          .catch(() => {});

        if (router.app._route.query.query)
          dispatch('searchRecipes', {
            query: router.app._route.query.query,
            page: router.app._route.query.page,
            reloadingPage: true,
          });
        commit('TOGGLE_UPLOAD_RECIPE_MODAL');
        commit('SET_TOAST_MESSAGE', 'The recipe has been uploaded');
      } catch (err) {
        console.log(err);
        commit('TOGGLE_UPLOAD_SPINNER', false);
        return commit(
          'SET_UPLOAD_MESSAGE',
          'There was a problem uploading the recipe. Please try again'
        );

        // TODO prob need to add something that saves the draft (client-side, maybe as a cookie?), so that they don't lose everything, which would suck
        // throw err;
      }
    },

    async editUserRecipe({ commit, state, rootState, dispatch }, recipe) {
      commit('TOGGLE_UPLOAD_SPINNER', true);

      try {
        const userRecipes = [...state.userRecipes];

        const recipeIndex = userRecipes.findIndex(
          userRecipe => userRecipe.id === recipe.id
        );
        userRecipes.splice(recipeIndex, 1, recipe);

        const docRef = doc(db, 'users', rootState.auth.user.uid);
        await updateDoc(docRef, {
          uploadedRecipes: userRecipes,
        });

        commit('TOGGLE_UPLOAD_SPINNER', false);

        commit('EDIT_USER_RECIPE', recipe);

        dispatch('renderRecipe', {
          id: router.app._route.query.id,
        });
        commit('TOGGLE_EDIT_USER_RECIPE_MODAL');
        commit('SET_TOAST_MESSAGE', 'The recipe has been edited');
      } catch (err) {
        console.log(err);
        commit('TOGGLE_UPLOAD_SPINNER', false);
        return commit(
          'SET_UPLOAD_MESSAGE',
          'There was a problem submitting the edited recipe. Please try again'
        );
      }
    },

    async deleteUserRecipe({ commit, rootState, dispatch }, recipe) {
      try {
        const docRef = doc(db, 'users', rootState.auth.user.uid);
        await updateDoc(docRef, {
          uploadedRecipes: arrayRemove(recipe),
        });
        commit('DELETE_USER_RECIPE', recipe);

        // NOTE push to 'home' instead of 'recipe', as the latter expects a defined param
        router
          .push({
            name: 'home',
            query: { id: null },
          })
          .catch(() => {});

        dispatch('searchRecipes', { query: router.app._route.query.query });
        commit('SET_TOAST_MESSAGE', 'The recipe has been deleted');
      } catch (err) {
        console.error(`Failed to remove user recipe from server: ${err}`);
      }
    },

    async fetchBookmarks({ commit, rootState }) {
      try {
        // REVIEW probably unnecessary to have below
        commit('TOGGLE_BOOKMARKS_SPINNER', true);
        const docRef = doc(db, 'users', rootState.auth.user.uid);
        const docSnap = await getDoc(docRef);
        commit('SET_STORED_BOOKMARKS', docSnap.data().bookmarks);
        commit('TOGGLE_BOOKMARKS_SPINNER', false);
      } catch (err) {
        console.error(`Failed to get user recipes from server: ${err}`);
        commit('TOGGLE_BOOKMARKS_SPINNER', false);
      }
    },

    // REVIEW Instead of pushing an entire recipe object, it might be better to push just its id.
    async toggleBookmark({ state, commit, rootState }, recipe) {
      try {
        const docRef = doc(db, 'users', rootState.auth.user.uid);

        if (!state.bookmarks.some(bookmark => bookmark.id === recipe.id)) {
          commit('ADD_BOOKMARK', recipe);
          // NOTE no need to await this, since no further thing depends on it here. Not awaiting allows the toggling of bookmarks to be much faster
          updateDoc(docRef, {
            bookmarks: arrayUnion(recipe),
          });
          commit('SET_TOAST_MESSAGE', "You've saved this recipe");
        } else {
          // NOTE the mutation below actually changes the recipe (setting its 'bookmarked' property to 'false'), meaning it becomes different from the object in the backend. Having this discrepancy means the backend cannot remove the object, as they need to exactly match. Therefore, need to dispatch action to backend FIRST before committing the mutation.
          updateDoc(docRef, {
            bookmarks: arrayRemove(recipe),
          });
          commit('DELETE_BOOKMARK', recipe);
          commit('SET_TOAST_MESSAGE', "You've unsaved this recipe");
        }
      } catch (err) {
        console.error(`Failed to add/delete bookmark: ${err}`);
      }
    },
  },
};
