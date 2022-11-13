<template>
  <div class="search-container">
    <div v-if="!$route.query.query"></div>
    <VLoadingSpinner v-else-if="loadingSearchResults" />
    <div v-else-if="!Object.keys(searchResultsDisplay).length" class="error">
      <div>
        <svg>
          <use :href="`${icons}#icon-alert-triangle`"></use>
        </svg>
      </div>
      <div>
        <p>No recipes for your search terms were found.</p>
        <p>Try different keywords or more general keywords.</p>
      </div>
    </div>

    <VRecipePreview
      v-else
      :recipes="searchResultsDisplay"
      :resultsActive="true"
    />

    <div v-if="!loadingSearchResults && $route.query.query" class="page-nav">
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
        class="d-flex justify-content-between"
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
import VRecipePreview from '@/components/VRecipePreview.vue';
import VLoadingSpinner from '@/components/VLoadingSpinner.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters, mapMutations } = createNamespacedHelpers('home');

export default {
  name: 'VSearchResults',
  components: {
    VRecipePreview,
    VLoadingSpinner,
  },

  data() {
    return {
      icons: require('@/assets/images/icons.svg'),
    };
  },
  computed: {
    ...mapGetters([
      'searchResults',
      'searchResultsDisplay',
      'searchResultsCurrentPage',
      'searchResultsPerPage',
      'loadingSearchResults',
    ]),
    numPages() {
      return Math.ceil(this.searchResults.length / this.searchResultsPerPage);
    },
    // isActive(resultId) {
    //   const id = window.location.hash.slice(1);
    //   if (resultId === id) return true;
    //   else return false;
    // },
  },

  methods: {
    ...mapMutations({ updatePagination: 'UPDATE_PAGINATION' }),
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

  .error {
    max-width: 40rem;
    margin: 0 auto;
    padding: 4rem 3rem;
    display: flex;

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
