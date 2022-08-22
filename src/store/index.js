import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import { API_URL, RES_PER_PAGE, KEY } from '@/common/config.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    recipe: {},
    search: {
      query: '',
      results: [],
      page: 1,
      resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
    hashUrl: '',
    uploadRecipeModal: false,
    loadingSearchResults: false,
    loadingRecipe: false,
  },
  getters: {
    hashUrl: state => state.hashUrl,
    uploadRecipeModal: state => state.uploadRecipeModal,
    recipe: state => state.recipe,
    recipeBookmarked: state => state.recipe.bookmarked,
    recipeBookmarks: state => state.bookmarks,
    searchResults: state => state.search.results,
    searchResultsCurrentPage: state => state.search.page,
    searchResultsPerPage: state => state.search.resultsPerPage,
    searchResultsDisplay: state => {
      const start = (state.search.page - 1) * state.search.resultsPerPage; // 0
      const end = state.search.page * state.search.resultsPerPage; // 9

      return state.search.results.slice(start, end);
    },
    loadingSearchResults: state => state.loadingSearchResults,
    loadingRecipe: state => state.loadingRecipe,
  },
  mutations: {
    TOGGLE_SEARCH_SPINNER(state, boolean) {
      state.loadingSearchResults = boolean;
    },

    TOGGLE_RECIPE_SPINNER(state, boolean) {
      state.loadingRecipe = boolean;
    },

    SET_STORED_BOOKMARKS(state, bookmarks) {
      state.bookmarks = bookmarks;
    },

    GET_HASH_URL(state, id) {
      state.hashUrl = id;
    },

    CREATE_RECIPE_OBJECT(state, data) {
      state.recipe = { ...data.data.recipe, bookmarked: false };

      if (state.bookmarks.some(bookmark => bookmark.id === state.recipe.id))
        state.recipe.bookmarked = true;
      else state.recipe.bookmarked = false;
      // console.log(state);
    },

    CREATE_SEARCH_RESULTS(state, data) {
      state.search.results = data.data.recipes;
      console.log(state);
      console.log(state.search.results);
    },

    UPDATE_SERVINGS(state, amount) {
      if (state.recipe.servings + amount <= 0) return;

      const oldServings = state.recipe.servings;
      state.recipe.servings += amount;
      state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * state.recipe.servings) / oldServings;
      });
    },

    UPDATE_PAGINATION(state, amount) {
      state.search.page += amount;
    },

    TOGGLE_BOOKMARK(state, recipe) {
      if (!state.bookmarks.some(bookmark => bookmark.id === recipe.id)) {
        state.bookmarks.push(recipe);
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

    TOGGLE_UPLOAD_RECIPE_MODAL(state) {
      state.uploadRecipeModal = !state.uploadRecipeModal;
    },
  },
  actions: {
    async loadRecipe({ commit }, { id }) {
      // try {
      // console.log(id);
      const res = await axios.get(`${API_URL}${id}`);
      // this.recipe = res.data.recipe;

      commit('CREATE_RECIPE_OBJECT', res.data);
      // } catch (error) {
      // console.error(`${error} 💥💥💥💥`);
      // throw error;
      // }
    },
    async searchRecipes({ commit }, query) {
      const res = await axios.get(`${API_URL}?search=${query}&key=${KEY}`);
      commit('CREATE_SEARCH_RESULTS', res.data);
    },
  },
});
