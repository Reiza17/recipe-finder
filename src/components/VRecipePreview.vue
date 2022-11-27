<template>
  <ul :class="{ results: resultsActive }">
    <li
      class="preview"
      :class="{ 'preview__link--active': getId(result) === $route.query.id }"
      v-for="result in recipes"
      :key="getId(result)"
    >
      <!-- v-if in router-link is needed to prevent TypeError: undefined -->
      <router-link
        :to="{
          name: 'home',
          query: {
            id: getId(result),
          },
        }"
        class="preview__link"
        v-if="result.recipe"
      >
        <figure class="preview__fig">
          <img :src="result.recipe.image" :alt="result.recipe.label" />
        </figure>
        <div class="preview__data">
          <h4
            class="preview__title"
            :class="{
              'preview__title--active': getId(result) === $route.query.id,
            }"
          >
            {{ result.recipe.label }}
          </h4>
          <p class="preview__publisher">{{ result.recipe.source }}</p>
          <!-- NOTE uncomment to enable personal recipe tag -->
          <!-- <div v-if="result.user_generated">
            <div v-if="resultsActive" class="preview__user-generated">
              <h4>
                <span class="badge bg-primary text-uppercase">Personal</span>
              </h4>
            </div>
          </div> -->
          <div v-if="isBookmarked(result.recipe.uri)">
            <div
              v-if="resultsActive"
              class="preview__bookmarked btn--round"
              :class="{
                'preview__bookmarked--active':
                  getId(result) === $route.query.id,
              }"
            >
              <svg>
                <use :href="`${icons}#icon-favorite-fill`"></use>
              </svg>
            </div>
          </div>
        </div>
      </router-link>

      <!-- <a class="preview__link" :href="`#${result.id}`">
        <figure class="preview__fig">
          <img :src="result.image_url" :alt="result.title" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">{{ result.title }}</h4>
          <p class="preview__publisher">{{ result.publisher }}</p>
          <div v-if="result.user_generated">
            <div v-if="resultsActive" class="preview__user-generated">
              <svg>
                <use :href="`${icons}#icon-user`"></use>
              </svg>
            </div>
          </div>
          <div v-if="isBookmarked(result.id)">
            <div v-if="resultsActive" class="preview__bookmarked btn--round">
              <svg>
                <use :href="`${icons}#icon-favorite-fill`"></use>
              </svg>
            </div>
          </div>
        </div>
      </a> -->
    </li>
  </ul>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('home');

export default {
  name: 'VRecipePreview',

  props: {
    recipes: {
      type: Array,
      required: true,
    },
    resultsActive: {
      type: Boolean,
      default: false,
    },
    headerActive: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      icons: require('@/assets/images/icons.svg'),
    };
  },

  computed: {
    ...mapGetters(['searchResultsDisplay', 'recipeBookmarks']),
  },
  methods: {
    isBookmarked(id) {
      // console.log(id);
      // console.log(this.recipeBookmarks);
      // console.log(this.recipeBookmarks[0].uri);
      // return this.recipeBookmarks.some(recipe => recipe.id === id);
      return this.recipeBookmarks.some(recipe => recipe.uri === id);
    },
    getId(result) {
      // NOTE optional chaining needed to prevent TypeError: undefined. Note also that Vue 2 doesn't support optional chaining in html template (only Vue 3 does). Hence I need to use a method, like here.
      return result.recipe?.uri.split('#recipe_')[1];
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/style.scss';

.results {
  list-style: none;
  margin-bottom: 2rem;
}

// NOTE unnecessary because of v-if
// .hidden {
//   visibility: hidden;
//   opacity: 0;
// }

.preview {
  list-style: none;
  &__link {
    &:link,
    &:visited {
      display: flex;
      align-items: center;
      padding: 1.5rem 3.25rem;
      transition: all 0.3s;
      border-right: 1px solid #fff;
      text-decoration: none;
    }

    &:hover {
      background-color: #efeff2;
      transform: translateY(-2px);
      border-radius: 8px;
    }

    &--active {
      background-color: #efeff2;
      border-radius: 8px;
    }
  }

  &__fig {
    flex: 0 0 5.8rem;
    border-radius: 50%;
    overflow: hidden;
    height: 5.8rem;
    margin-right: 2rem;
    position: relative;
    backface-visibility: hidden;

    &::before {
      content: '';
      display: block;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-image: linear-gradient(
        to right bottom,
        $color-grad-1,
        $color-grad-2
      );
      opacity: 0.4;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.3s;
    }
  }

  &__data {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 2.7rem;
    row-gap: 0.1rem;
    align-items: center;
  }

  &__title {
    grid-column: 1/-1;
    font-size: 1.45rem;
    color: black;
    text-transform: uppercase;
    font-weight: 600;

    // NOTE This is how text is truncated!
    text-overflow: ellipsis;
    max-width: 40rem;
    white-space: nowrap;
    overflow: hidden;

    &--active {
      font-weight: 800;
    }
  }

  &__publisher {
    font-size: 1.15rem;
    color: $color-grey-dark-2;
    text-transform: uppercase;
    font-weight: 600;
  }

  &__user-generated {
    // background-color: darken($color-grey-light-2, 2%);

    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    width: 2rem;
    border-radius: 10rem;

    .badge {
      letter-spacing: 0.5px;
    }
    // margin-left: auto;
    // margin-right: 1.75rem;

    // &--active {
    //   background-color: white;
    // }

    // svg {
    //   height: 1.2rem;
    //   width: 1.2rem;
    //   fill: $color-primary;
    // }
  }

  &__bookmarked {
    // background-color: darken($color-grey-light-2, 2%);

    display: flex;
    align-items: center;
    justify-content: center;
    height: 2rem;
    width: 2rem;
    border-radius: 10rem;

    &--active {
      background-color: white;
    }

    svg {
      height: 1.5rem;
      width: 1.5rem;
    }
  }

  // .btn--round {
  //   background-image: $gradient;
  //   border-radius: 50%;
  //   border: none;
  //   cursor: pointer;
  //   height: 4.5rem;
  //   width: 4.5rem;
  //   // margin-left: auto;
  //   transition: all 0.2s;

  //   display: flex;
  //   align-items: center;
  //   justify-content: center;

  //   &:hover {
  //     transform: scale(1.07);
  //   }

  //   &:focus {
  //     outline: none;
  //   }

  //   svg {
  //     height: 2.5rem;
  //     width: 2.5rem;
  //     fill: #fff;
  //   }
  // }
}
</style>
