<template>
  <li class="nav__item">
    <!-- FIXME change the class from 'bookmarks' to something else -->
    <button class="nav__btn nav__btn--bookmarks">
      <svg class="nav__icon">
        <use :href="`${icons}#icon-user`"></use>
      </svg>
      <span class="nav__label">My recipes</span>
    </button>
    <div class="bookmarks">
      <ul class="bookmarks__list">
        <VLoadingSpinner v-if="loadingBookmarks" />
        <!-- REVIEW Change condition to if fetch results in nothing? -->
        <div class="message" v-else-if="userRecipes.length === 0">
          <div>
            <svg>
              <use :href="`${icons}#icon-smile`"></use>
            </svg>
          </div>
          <p>You haven't uploaded any recipes yet!</p>
        </div>

        <VRecipePreview v-else :recipes="userRecipes" />
      </ul>
    </div>
  </li>
</template>

<script>
import VLoadingSpinner from './VLoadingSpinner.vue';
import VRecipePreview from '@/components/VRecipePreview.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('home');

export default {
  name: 'VBookmarks',
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
    ...mapGetters(['userRecipes', 'loadingBookmarks']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/style.scss';

.nav {
  &__item {
    position: relative;
  }

  &__btn {
    height: 100%;
    font-family: inherit;
    color: inherit;
    font-size: 15px;
    font-weight: 700;
    // text-transform: uppercase;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 1.5rem;
    transition: all 0.3s;

    display: flex;
    align-items: center;

    svg {
      height: 2.4rem;
      width: 2.4rem;
      // fill: $color-primary;
      fill: black;
      margin-right: 0.7rem;
      transform: translateY(-1px);
    }

    &:focus {
      outline: none;
    }

    &:hover {
      background-color: $color-grey-light-2;
    }
  }

  &__label {
    @media all and (max-width: 984px) {
      display: none;
    }
  }
}

.bookmarks {
  padding: 1rem 0;
  position: absolute;
  // right: 0;
  right: -2.5rem;
  z-index: 10;
  width: 40rem;
  background-color: #fff;
  // box-shadow: 0 0.8rem 5rem 2rem rgba($color-grey-dark-1, 0.1);

  visibility: hidden;
  opacity: 0;
  transition: all 0.01s 0.01s;

  &__list {
    list-style: none;
  }

  &__field {
    cursor: pointer;
    padding: 0 4rem;

    display: flex;
    align-items: center;
    height: 100%;
    transition: all 0.01s;

    &:hover {
      background-color: $color-grey-light-2;
    }
  }

  &:hover,
  .nav__btn--bookmarks:hover + & {
    visibility: visible;
    opacity: 1;
  }
}

.message,
.error {
  max-width: 40rem;
  margin: 0 auto;
  padding: 5rem 4rem;

  display: flex;

  svg {
    height: 3rem;
    width: 3rem;
    fill: $color-primary;
    transform: translateY(-0.3rem);
  }

  p {
    margin-left: 1.5rem;
    font-size: 1.8rem;
    line-height: 1.5;
    font-weight: 600;
  }
}
</style>
