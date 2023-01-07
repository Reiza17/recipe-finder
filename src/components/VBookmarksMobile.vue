<template>
  <ul class="bookmarks__list">
    <VLoadingSpinner v-if="loadingBookmarks" />
    <!-- Change condition to if fetch results in nothing -->
    <div class="message" v-else-if="recipeBookmarks.length === 0">
      <div>
        <svg>
          <use :href="`${icons}#icon-smile`"></use>
        </svg>
      </div>
      <p>Bookmark a recipe you like!</p>
    </div>

    <VRecipePreview v-else :recipes="recipeBookmarks" />
  </ul>
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
    ...mapGetters(['recipeBookmarks', 'loadingBookmarks', 'bookmarkImages']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/style.scss';

@media all and (max-width: 984px) {
  .nav_label {
    display: none;
  }
}

.nav {
  &__item {
    position: relative;
  }

  &__btn {
    height: 100%;
    font-family: inherit;
    color: inherit;
    font-size: 15px;
    font-weight: 600;
    // text-transform: uppercase;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 1.5rem;
    // transition: all 0.3s;
    border-bottom: 2px solid transparent;

    display: flex;
    align-items: center;

    svg {
      height: 2.4rem;
      width: 2.4rem;
      fill: black;
      margin-right: 0.7rem;
      transform: translateY(-1px);
    }

    &:focus {
      outline: none;
    }

    &:hover {
      background-color: rgb(247, 247, 247);
      // border-bottom: 2px solid rgb(38, 81, 143);
    }
  }

  &__icon {
    margin-top: 0.1rem;
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
