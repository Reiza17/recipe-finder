<template>
  <form class="search" @submit.prevent="submitSearch(query)">
    <input
      type="text"
      class="search__field"
      placeholder="Search over 1,000,000 recipes..."
      v-model="query"
    />
    <button class="btn search__btn">
      <svg class="search__icon">
        <use :href="`${icons}#icon-search`"></use>
      </svg>
      <span>Search</span>
    </button>
  </form>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapGetters, mapMutations } =
  createNamespacedHelpers('home');

export default {
  name: 'VSearch',

  data() {
    return {
      icons: require('@/assets/images/icons.svg'),
      query: '',
    };
  },

  methods: {
    ...mapGetters(['loadingSearchResults']),
    ...mapActions(['searchRecipes']),
    ...mapMutations({ toggleSearchSpinner: 'TOGGLE_SEARCH_SPINNER' }),

    async submitSearch(searchQuery) {
      try {
        this.toggleSearchSpinner(true);
        await this.$store.dispatch('home/searchRecipes', searchQuery);
        this.toggleSearchSpinner(false);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/style.scss';

.search {
  background-color: #fff;
  border-radius: 10rem;
  display: flex;
  align-items: center;
  padding-left: 3rem;
  transition: all 0.3s;

  &:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 0.7rem 3rem rgba($color-grey-dark-1, 0.08);
  }

  &__field {
    border: none;
    background: none;
    font-family: inherit;
    color: inherit;
    font-size: 1.7rem;
    width: 30rem;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: $color-grey-light-3;
    }

    @media only screen and (max-width: $bp-medium) {
      width: auto;

      &::placeholder {
        color: white;
      }
    }
  }

  &__btn {
    font-weight: 600;
    font-family: inherit;
  }
}
</style>
