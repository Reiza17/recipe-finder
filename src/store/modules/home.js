import axios from 'axios';
import { API_URL, RES_PER_PAGE, KEY } from '@/common/config.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';
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
    loadingSearchResults: false,
    loadingRecipe: false,
    uploadRecipeModal: false,
  },

  getters: {
    recipe: state => state.recipe,
    recipeBookmarks: state => state.bookmarks,
    recipeBookmarked: state => state.recipe.bookmarked,
    hashUrl: state => state.hashUrl,
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
    uploadRecipeModal: state => state.uploadRecipeModal,
  },

  mutations: {
    SET_PREVIOUS_URL(state, pageName) {
      state.previousURL = pageName;
    },

    GET_HASH_URL(state, id) {
      state.hashUrl = id;
    },

    CREATE_SEARCH_RESULTS(state, data) {
      state.search.results = [...state.userRecipes, ...data.data.recipes];
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

    TOGGLE_BOOKMARK(state, recipe) {
      if (!state.bookmarks.some(bookmark => bookmark.id === recipe.id)) {
        state.bookmarks.unshift(recipe);
        state.recipe.bookmarked = true;
      } else {
        const recipeIndex = state.bookmarks.findIndex(
          bookmark => bookmark.id === recipe.id
        );
        state.bookmarks.splice(recipeIndex, 1);
        state.recipe.bookmarked = false;
      }
      localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    },

    SET_STORED_BOOKMARKS(state, bookmarks) {
      state.bookmarks = bookmarks;
    },

    TOGGLE_UPLOAD_RECIPE_MODAL(state) {
      state.uploadRecipeModal = !state.uploadRecipeModal;
    },

    ADD_USER_RECIPE(state, recipe) {
      // console.log(recipe.id);
      state.userRecipes.unshift(recipe);
      state.bookmarks.unshift(recipe);
      console.log(state.userRecipes);
    },

    SET_USER_RECIPES(state, recipes) {
      state.userRecipes = recipes;
      console.log(state.userRecipes);
    },
  },

  actions: {
    async searchRecipes({ commit }, query) {
      try {
        const res = await axios.get(`${API_URL}?search=${query}&key=${KEY}`);
        commit('CREATE_SEARCH_RESULTS', res.data);
      } catch (err) {
        console.error('Error searching for recipes: ', err);
      }
    },

    async loadRecipe({ commit, state }, { id }) {
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
        console.error('Error loading recipe: ', err);
      }
    },

    async addUserRecipe({ commit }, recipe) {
      try {
        // console.log(recipe.id);
        const docRef = await addDoc(collection(db, 'recipes'), recipe);
        console.log(docRef);
        // add successful upload condition, such as: if (docRef.id).. else throw error. But perhaps this is unnecessary because maybe an unsuccessful upload would automatically trigger an error, thereby jumping straight to catch.
        console.log('Passed server-side validation!');
        commit('ADD_USER_RECIPE', recipe);
      } catch (err) {
        console.error('Error adding document: ', err);
      }
    },

    async fetchUserRecipes({ commit }) {
      try {
        const querySnapshot = await getDocs(collection(db, 'recipes'));
        const userRecipes = querySnapshot.docs.map(doc => doc.data());
        commit('SET_USER_RECIPES', userRecipes);
      } catch (err) {
        console.log('Error loading user recipes: ', err);
      }
    },
  },
};
