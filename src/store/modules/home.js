import axios from 'axios';
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

export default {
  namespaced: true,

  state: {
    recipe: {},
    userRecipes: [],
    bookmarks: [],
    hashUrl: '',
    previousURL: '',
    search: {
      query: '',
      results: [],
      page: 1,
      resultsPerPage: RES_PER_PAGE,
    },
    initialSearchSubmitted: false,
    loadingSearchResults: false,
    loadingRecipe: false,
    loadingBookmarks: false,
    loadingUserRecipes: false,
    uploadRecipeModal: false,
  },

  getters: {
    recipe: state => state.recipe,
    recipeBookmarks: state => state.bookmarks,
    recipeBookmarked: state => state.recipe.bookmarked,
    userRecipes: state => state.userRecipes,
    hashUrl: state => state.hashUrl,
    initialSearchSubmitted: state => state.initialSearchSubmitted,
    // searchQuery: state => state.search.query,
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
    uploadRecipeModal: state => state.uploadRecipeModal,
  },

  mutations: {
    SET_PREVIOUS_URL(state, pageName) {
      state.previousURL = pageName;
    },

    GET_HASH_URL(state, id) {
      state.hashUrl = id;
    },

    INITIAL_SEARCH_SUBMITTED(state, boolean) {
      state.initialSearchSubmitted = boolean;
    },

    STORE_SEARCH_QUERY(state, query) {
      state.search.query = query;
    },

    CREATE_SEARCH_RESULTS(state, results) {
      state.search.results = results;
      state.search.page = 1;
      console.log(state);
      console.log(state.search.results);
    },

    TOGGLE_SEARCH_SPINNER(state, boolean) {
      state.loadingSearchResults = boolean;
    },

    UPDATE_PAGINATION(state, amount) {
      state.search.page += amount;
    },

    CREATE_RECIPE_OBJECT(state, data) {
      state.recipe = { ...data, bookmarked: false };
      console.log(state.recipe);
      if (state.bookmarks.some(bookmark => bookmark.id === state.recipe.id))
        state.recipe.bookmarked = true;
      else state.recipe.bookmarked = false;
      console.log(state.recipe);
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

    TOGGLE_USER_RECIPES_SPINNER(state, boolean) {
      state.loadingUserRecipes = boolean;
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

    TOGGLE_UPLOAD_RECIPE_MODAL(state) {
      state.uploadRecipeModal = !state.uploadRecipeModal;
    },

    ADD_USER_RECIPE(state, recipe) {
      // console.log(recipe.id);
      state.userRecipes.unshift(recipe);
      console.log(state.userRecipes);
    },

    DELETE_USER_RECIPE(state, recipe) {
      const recipeIndex = state.userRecipes.findIndex(
        userRecipes => userRecipes.id === recipe.id
      );
      state.userRecipes.splice(recipeIndex, 1);
    },

    EDIT_USER_RECIPE(state, recipe) {
      // console.log(recipe.id);
      state.userRecipes.unshift(recipe);
      console.log(state.userRecipes);
    },

    SET_USER_RECIPES(state, recipes) {
      state.userRecipes = recipes;
      console.log(state.userRecipes);
    },
  },

  actions: {
    async reloadSearchResults({ dispatch, state }) {
      console.log(state.search.query);
      dispatch('searchRecipes', state.search.query);
    },

    async searchRecipes({ commit, state }, query) {
      try {
        commit('TOGGLE_SEARCH_SPINNER', true);
        commit('INITIAL_SEARCH_SUBMITTED', true);
        commit('STORE_SEARCH_QUERY', query);

        // NOTE Remove 'split' below if I want to include partial-word results
        const matchingUserRecipes = state.userRecipes.filter(recipe =>
          recipe.title.toLowerCase().split(' ').includes(query.toLowerCase())
        );

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
          ...matchingUserRecipes,
          ...bookmarkedSearchResults,
          ...nonBookmarkedSearchResults,
        ];
        commit('CREATE_SEARCH_RESULTS', filteredResults);
        commit('TOGGLE_SEARCH_SPINNER', false);
      } catch (err) {
        console.error(`Error searching for recipes: ${err}`);
      }
    },

    async renderRecipe({ commit, state }, { id }) {
      try {
        // console.log(id);
        const [userRecipe] = state.userRecipes.filter(
          recipe => recipe.id === id
        );

        if (userRecipe) commit('CREATE_RECIPE_OBJECT', userRecipe);
        else {
          const res = await axios.get(`${API_URL}${id}`);
          commit('CREATE_RECIPE_OBJECT', res.data.data.recipe);
        }
      } catch (err) {
        console.error(`Error loading recipe: ${err}`);
      }
    },

    async fetchUserRecipes({ commit, rootState }) {
      try {
        console.log(rootState);

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
      }
    },

    async uploadUserRecipe({ commit, rootState }, recipe) {
      try {
        const userRecipe = { ...recipe, bookmarked: false };
        const docRef = doc(db, 'users', rootState.auth.user.uid);
        await updateDoc(docRef, {
          uploadedRecipes: arrayUnion(userRecipe),
        });
        // const docRef = await addDoc(collection(db, 'recipes'), recipe);
        // REVIEW add successful upload condition, such as: if (docRef.id).. else throw error. But perhaps this is unnecessary because maybe an unsuccessful upload would automatically trigger an error, thereby jumping straight to catch.
        console.log('Successfully uploaded user recipe to server!');
        commit('ADD_USER_RECIPE', userRecipe);
      } catch (err) {
        console.error(`Failed to upload user recipe to server: ${err}`);
      }
    },

    async deleteUserRecipe({ commit, rootState }, recipe) {
      try {
        const docRef = doc(db, 'users', rootState.auth.user.uid);
        await updateDoc(docRef, {
          uploadedRecipes: arrayRemove(recipe),
        });
        commit('DELETE_USER_RECIPE', recipe);
      } catch (err) {
        console.error(`Failed to remove user recipe from server: ${err}`);
      }
    },

    // FIXME placeholder
    async editUserRecipe({ commit, rootState }, recipe) {
      try {
        const docRef = doc(db, 'users', rootState.auth.user.uid);
        await updateDoc(docRef, {
          recipes: arrayRemove(recipe),
        });
        commit('DELETE_USER_RECIPE', recipe);
      } catch (err) {
        console.error(`Failed to begin edit for user recipe: ${err}`);
      }
    },

    async fetchBookmarks({ commit, rootState }) {
      try {
        // REVIEW Test effectiveness of below spinners if init executes upon login, user state change, or in App
        // commit('TOGGLE_BOOKMARKS_SPINNER', true);
        const docRef = doc(db, 'users', rootState.auth.user.uid);
        const docSnap = await getDoc(docRef);
        commit('SET_STORED_BOOKMARKS', docSnap.data().bookmarks);
        // commit('TOGGLE_BOOKMARKS_SPINNER', false);
      } catch (err) {
        console.error(`Failed to get user recipes from server: ${err}`);
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
        } else {
          // NOTE the mutation below actually changes the recipe (setting its 'bookmarked' property to 'false'), meaning it becomes different from the object in the backend. Having this discrepancy means the backend cannot remove the object, as they need to exactly match. Therefore, need to dispatch action to backend FIRST before committing the mutation.
          updateDoc(docRef, {
            bookmarks: arrayRemove(recipe),
          });
          commit('DELETE_BOOKMARK', recipe);
          console.log('deleted bookmark');
        }
      } catch (err) {
        console.error(`Failed to add/delete bookmark: ${err}`);
      }
    },
  },
};
