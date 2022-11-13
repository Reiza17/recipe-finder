<template>
  <div class="search-container">
    <button @click="uploadUserRecipe" class="btn btn-success btn-lg">
      <svg>
        <use :href="`${icons}#icon-add-circle-fill`"></use>
      </svg>
      <span>Add a recipe</span>
    </button>

    <VLoadingSpinner v-if="loadingUserRecipes || loadingSearchResults" />

    <VUserRecipePreview
      v-else-if="!$route.query.userRecipeQuery"
      :recipes="userRecipes"
      :resultsActive="true"
    />

    <div v-else-if="!Object.keys(searchResultsDisplay).length">
      <div class="error">
        <div>
          <svg>
            <use :href="`${icons}#icon-alert-triangle`"></use>
          </svg>
        </div>
        <div>
          <p>No recipes for your search terms were found.</p>
        </div>
      </div>

      <VUserRecipePreview :recipes="userRecipes" :resultsActive="true" />
    </div>

    <div
      v-else-if="
        searchResultsDisplay.length > 0 &&
        searchResultsDisplay.length < userRecipes.length
      "
    >
      <button @click="resetSearchResults" class="btn btn-primary btn-lg">
        <svg>
          <use :href="`${icons}#icon-go-back`"></use>
        </svg>
        <span>Back to all recipes</span>
      </button>
      <VUserRecipePreview
        :recipes="searchResultsDisplay"
        :resultsActive="true"
      />
    </div>

    <VUserRecipePreview
      v-else
      :recipes="searchResultsDisplay"
      :resultsActive="true"
    />

    <div
      v-if="!loadingSearchResults && $route.query.userRecipeQuery"
      class="page-nav"
    >
      <!-- If 1st page and there are multiple pages -->
      <button
        v-if="searchResultsCurrentPage === 1 && numPages > 1"
        @click="updatePagination(1)"
        class="btn--inline float-end"
      >
        <span>Page {{ searchResultsCurrentPage + 1 }}</span>
        <svg class="search__icon">
          <use :href="`${icons}#icon-arrow-right`"></use>
        </svg>
      </button>

      <!-- If last page and there are multiple pages-->
      <button
        v-else-if="searchResultsCurrentPage === numPages && numPages > 1"
        @click="updatePagination(-1)"
        class="btn--inline"
      >
        <svg class="search__icon">
          <use :href="`${icons}#icon-arrow-left`"></use>
        </svg>
        <span>Page {{ searchResultsCurrentPage - 1 }}</span>
      </button>

      <!-- If between 1st & last page of multiple pages -->
      <div
        class="d-flex flex-row justify-content-between"
        v-else-if="searchResultsCurrentPage < numPages"
      >
        <button @click="updatePagination(-1)" class="btn--inline">
          <svg class="search__icon">
            <use :href="`${icons}#icon-arrow-left`"></use>
          </svg>
          <span>Page {{ searchResultsCurrentPage - 1 }}</span>
        </button>

        <button @click="updatePagination(1)" class="btn--inline">
          <span>Page {{ searchResultsCurrentPage + 1 }}</span>
          <svg class="search__icon">
            <use :href="`${icons}#icon-arrow-right`"></use>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VUserRecipePreview from '@/components/VUserRecipePreview.vue';
import VLoadingSpinner from '@/components/VLoadingSpinner.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters, mapMutations } = createNamespacedHelpers('home');

export default {
  name: 'VUserSearchResults',
  components: {
    VUserRecipePreview,
    VLoadingSpinner,
  },

  data() {
    return {
      icons: require('@/assets/images/icons.svg'),
    };
  },
  computed: {
    ...mapGetters({
      userRecipes: 'userRecipes',
      searchResults: 'userRecipeSearchResults',
      searchResultsDisplay: 'userRecipeSearchResultsDisplay',
      searchResultsCurrentPage: 'userRecipeSearchResultsCurrentPage',
      searchResultsPerPage: 'searchResultsPerPage',
      loadingSearchResults: 'loadingSearchResults',
      loadingUserRecipes: 'loadingUserRecipes',
    }),
    numPages() {
      return Math.ceil(
        this.searchResultsDisplay.length / this.searchResultsPerPage
      );
    },
    // isActive(resultId) {
    //   const id = window.location.hash.slice(1);
    //   if (resultId === id) return true;
    //   else return false;
    // },
  },

  methods: {
    ...mapMutations({
      updatePagination: 'UPDATE_PAGINATION',
      createSearchResults: 'CREATE_USER_RECIPE_SEARCH_RESULTS',
    }),

    resetSearchResults() {
      this.createSearchResults({ results: this.userRecipes, page: 1 });
      this.$router
        .replace({
          query: {
            userRecipeQuery: '',
          },
        })
        .catch(() => {});
    },

    uploadUserRecipe() {
      this.$router
        .replace({ name: 'upload', query: { userRecipeId: 'draft' } })
        .catch(() => {});
    },
  },

  // methods: {
  //   renderRecipe() {
  //     this.$store.dispatch('renderRecipe');
  //   },
  // },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/style.scss';

.search-container {
  // padding: 3rem 0;
  // display: flex;
  flex-direction: column;
  // min-width: 140px;

  @media only screen and (max-width: 648px) {
    border-top: 1px solid rgb(231, 231, 231);
    padding-top: 5px;
  }

  // .header {
  //   display: flex;
  //   margin-bottom: 2rem;
  //   justify-content: space-between;
  // }

  .btn {
    display: flex;
    width: 98%;
    margin: 2rem auto;
    align-items: center;
    justify-content: center;
    column-gap: 7px;

    svg {
      height: 2.25rem;
      width: 2.25rem;
      fill: currentColor;
      // margin-right: 5px;
      overflow: visible;
      align-self: center;
    }

    span {
      font-weight: 500;
      align-self: center;
      font-size: 14px;
    }
  }

  .error {
    max-width: 40rem;
    margin: 0 auto;
    margin-bottom: 1rem;
    padding: 3rem 2rem 1rem 2rem;
    display: flex;
    border-bottom: 1px solid grey;

    svg {
      height: 3rem;
      width: 3rem;
      fill: rgb(230, 71, 32);
    }
    p {
      margin-left: 1.5rem;
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
      font-weight: 600;
      line-height: 1.5;
    }
  }
}

.page-nav {
  margin-top: auto;
  padding: 0 3.2rem;

  &::after {
    content: '';
    display: table;
    clear: both;
  }
}

.btn--inline {
  color: black;
  font-size: 1.3rem;
  font-weight: 600;
  border: none;
  background-color: $color-grey-light-2;
  padding: 0.8rem 1.2rem;
  border-radius: 10rem;
  cursor: pointer;

  display: flex;
  align-items: center;
  transition: all 0.2s;

  svg {
    height: 1.6rem;
    width: 1.6rem;
    fill: currentColor;
    margin: 0 0.2rem;
  }

  span {
    margin: 0 0.4rem;
  }

  &:hover {
    background-color: $color-grey-light-3;
  }

  &:focus {
    outline: none;
  }
}
</style>
