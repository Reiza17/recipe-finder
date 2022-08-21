<template>
  <div class="search-results">
    <!-- <div class="spinner">
        <svg>
          <use :href="`${icons}#icon-loader`"></use>
        </svg>
      </div> -->

    <!-- <div class="error">
        <div>
          <svg>
            <use :href="`${icons}#icon-alert-triangle`"></use>
          </svg>
        </div>
        <p>No recipes found for your query. Please try again!</p>
      </div> -->

    <AppRecipePreview :recipes="searchResultsDisplay" :resultsActive="true" />

    <div class="pagination">
      <!-- Page 1, and there are other pages -->
      <button
        v-if="searchResultsCurrentPage === 1 && numPages > 1"
        @click="updatePagination(1)"
        class="btn--inline pagination__btn--next"
      >
        <span>Page {{ searchResultsCurrentPage + 1 }}</span>
        <svg class="search__icon">
          <use :href="`${icons}#icon-arrow-right`"></use>
        </svg>
      </button>

      <!-- // Last page -->
      <button
        v-else-if="searchResultsCurrentPage === numPages && numPages > 1"
        @click="updatePagination(-1)"
        class="btn--inline pagination__btn--prev"
      >
        <svg class="search__icon">
          <use :href="`${icons}#icon-arrow-left`"></use>
        </svg>
        <span>Page {{ searchResultsCurrentPage - 1 }}</span>
      </button>

      <!-- // Other pages -->
      <div v-else-if="searchResultsCurrentPage < numPages">
        <button
          @click="updatePagination(-1)"
          class="btn--inline pagination__btn--prev"
        >
          <svg class="search__icon">
            <use :href="`${icons}#icon-arrow-left`"></use>
          </svg>
          <span>Page {{ searchResultsCurrentPage - 1 }}</span>
        </button>

        <button
          @click="updatePagination(1)"
          class="btn--inline pagination__btn--next"
        >
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
import { mapGetters, mapMutations } from 'vuex';
import AppRecipePreview from '@/components/AppRecipePreview.vue';

export default {
  name: 'AppSearchResults',
  components: {
    AppRecipePreview,
  },

  data() {
    return {
      icons: require('@/assets/images/icons.svg'),
    };
  },
  computed: {
    ...mapGetters([
      'searchResults',
      'searchResultsCurrentPage',
      'searchResultsPerPage',
      'searchResultsDisplay',
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
  //   loadRecipe() {
  //     this.$store.dispatch('loadRecipe');
  //   },
  // },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/style.scss';

.search-results-container {
  padding: 3rem 0;
  display: flex;
  flex-direction: column;
}

.pagination {
  margin-top: auto;
  padding: 0 3.5rem;

  &::after {
    content: '';
    display: table;
    clear: both;
  }

  &__btn {
    &--prev {
      float: left;
    }
    &--next {
      float: right;
    }
  }
}

.btn--inline {
  color: $color-primary;
  font-size: 1.3rem;
  font-weight: 600;
  border: none;
  background-color: $color-grey-light-1;
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
    color: $color-grad-2;
    background-color: $color-grey-light-2;
  }

  &:focus {
    outline: none;
  }
}
</style>
