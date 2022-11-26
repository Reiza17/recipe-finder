<template>
  <div class="recipe">
    <VLoadingSpinner v-if="loadingRecipe" />
    <div v-else-if="!$route.query.id && $route.query.query" class="message">
      <div>
        <svg>
          <use :href="`${icons}#icon-smile`"></use>
        </svg>
      </div>
      <p>Click on a recipe!</p>
    </div>

    <div
      v-else-if="
        (!$route.query.id && !$route.query.query) ||
        (!$route.query.id &&
          $route.query.query &&
          !Object.keys(searchResultsDisplay).length)
      "
      class="message"
    >
      <div>
        <svg>
          <use :href="`${icons}#icon-smile`"></use>
        </svg>
      </div>
      <p>Start by searching for a recipe or an ingredient.</p>
    </div>

    <div v-else-if="renderRecipeError" class="message">
      <p>{{ renderRecipeError }}</p>
    </div>

    <div v-else>
      <img
        :src="imageLoading ? placeholder : recipe.image"
        @load="imageLoading = false"
        @error="recipe.image_url = image_error"
        :alt="recipe.label"
        class="recipe__img"
      />

      <div class="recipe__title d-flex flex-row justify-content-between mb-2">
        <span>{{ recipe.label }}</span>
        <!-- NOTE uncomment to enable personal recipe tag -->
        <!-- <div
            v-if="recipe.user_generated"
            title="This recipe was created by you"
          >
            <h4>
              <span class="badge bg-primary text-uppercase">Personal</span>
            </h4>
          </div> -->
      </div>

      <div
        class="recipe__details justify-content-between flex-wrap-reverse gap-4"
      >
        <div class="d-flex flex-row align-items-center">
          <div v-if="recipe.totalTime" class="recipe__info">
            <svg class="recipe__info-icon">
              <use :href="`${icons}#icon-clock`"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">{{
              recipe.totalTime
            }}</span>
            <span class="recipe__info-text">minutes</span>
          </div>

          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use :href="`${icons}#icon-users`"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">{{
              recipe.yield
            }}</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button
                class="btn--tiny btn--update-servings"
                @click="updateServings(-1)"
              >
                <svg>
                  <use :href="`${icons}#icon-minus-circle`"></use>
                </svg>
              </button>
              <button
                class="btn--tiny btn--update-servings"
                @click="updateServings(1)"
              >
                <svg>
                  <use :href="`${icons}#icon-plus-circle`"></use>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="d-flex flex-row align-items-end">
          <!-- NOTE uncomment to enable personal recipe buttons -->
          <!-- <button
          v-if="recipe.user_generated"
          @click="deleteUserRecipe"
          class="btn--round"
          title="Delete this recipe"
        >
          <svg>
            <use :href="`${icons}#icon-delete`"></use>
          </svg>
        </button> -->
          <button
            @click="copyRecipeLink"
            class="btn--round me-3"
            title="Copy link to this recipe"
          >
            <svg>
              <use :href="`${icons}#icon-link`"></use>
            </svg>
            <span>Share</span>
          </button>
          <button
            @click="bookmarkRecipe"
            class="btn--round"
            :title="`${
              recipeBookmarked ? 'Unsave this recipe' : 'Save this recipe'
            }`"
          >
            <svg class="btn--bookmark">
              <use
                :href="`${icons}#icon-favorite${
                  recipeBookmarked ? '-fill' : ''
                }`"
              ></use>
            </svg>
            <span>Save</span>
          </button>
        </div>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          <li
            class="recipe__ingredient"
            v-for="(ing, index) in recipe.ingredients"
            :key="index"
          >
            <svg class="recipe__icon">
              <use :href="`${icons}#icon-check`"></use>
            </svg>
            <!-- <div class="recipe__quantity">
              {{ ingQuantity(ing) }}
            </div>
            <div class="recipe__description">
              <span v-if="ing.measure !== '<unit>'" class="recipe__unit">{{
                ing.measure
              }}</span>
              {{ ing.food }}
            </div> -->
            <!-- !isNaN(ing.text.split(' ')[0]) -->
            <div class="recipe__description">
              {{ ingDescription(ing) }}
            </div>
          </li>
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">{{ recipe.source }}</span
          >. Please check out directions at their website.
        </p>
        <a class="btn btn-outline-success" :href="recipe.url" target="_blank">
          <span>Directions </span>
          <svg class="search__icon">
            <use :href="`${icons}#icon-arrow-right`"></use>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import VLoadingSpinner from './VLoadingSpinner.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters, mapMutations } = createNamespacedHelpers('home');
import fracty from 'fracty';

export default {
  name: 'VRecipe',
  components: { VLoadingSpinner },
  data() {
    return {
      // icons: '@/assets/images/icons.svg',
      icons: require('@/assets/images/icons.svg'),
      placeholder: require('@/assets/images/placeholder.jpg'),
      image_error: require('@/assets/images/image_error.jpg'),
      imageLoading: true,
      fracty,
      // REVIEW Instead of below, could get the value from init. Or, I could also use something like v-if="this.$router.currentRoute.value.path === '/login'". However, this would require that my url changes when I do a search (currently it doesn't).
      // existingRecipe: this.$route.params.id,
    };
  },
  watch: {
    '$route.query.id'(newValue) {
      if (newValue)
        this.$store.dispatch('home/renderRecipe', {
          id: newValue,
        });
    },
    'recipe.image_url': function () {
      this.imageLoading = true;
    },
  },
  computed: {
    ...mapGetters([
      'recipe',
      'recipeBookmarked',
      'loadingRecipe',
      'renderRecipeError',
      'searchResultsDisplay',
    ]),
    loggedIn() {
      return this.$store.getters['auth/loggedIn'];
    },
    // validRecipe() {
    //   if (Object.keys(this.recipe).length) return true;
    //   return false;
    // },
  },
  methods: {
    // TODO delete the unused
    ...mapMutations({
      updateServings: 'UPDATE_SERVINGS',
      toggleRecipeSpinner: 'TOGGLE_RECIPE_SPINNER',
      toggleBookmarksSpinner: 'TOGGLE_BOOKMARKS_SPINNER',
      toggleUserRecipesSpinner: 'TOGGLE_USER_RECIPES_SPINNER',
      toggleRegisterModal: 'TOGGLE_REGISTER_MODAL',
    }),
    parseFraction(fraction) {
      if (fraction.includes('/')) {
        const [numerator, denominator] = fraction.split('/').map(Number);
        return numerator / denominator;
      } else {
        const [numerator, denominator] = fraction.split('⁄').map(Number);
        return numerator / denominator;
      }
    },
    ingQuantity(ingredient) {
      return ingredient.quantity ? fracty(ingredient.quantity).toString() : '';
    },
    ingDescription(ingredient) {
      const parenthesesDeleted = ingredient.text.replace(/(\(.*?\))/, '');

      const splitWords = parenthesesDeleted.split(' ');

      for (const word of splitWords) {
        const normalizedWord = word.normalize('NFKD');
        if (normalizedWord.includes('⁄')) {
          splitWords.splice(
            splitWords.indexOf(word),
            1,
            this.parseFraction(normalizedWord)
          );
        }

        if (normalizedWord.includes('/')) {
          if (isNaN(word.split('/')[0]) || isNaN(word.split('/')[1])) {
            splitWords.splice(splitWords[1], 1, ingredient.measure);
            return `${this.ingQuantity(ingredient)} ${splitWords.join(' ')}`;
          } else {
            splitWords.splice(splitWords[0], 1, this.parseFraction(word));
          }
        }
      }

      if (!isNaN(splitWords[0]) && !isNaN(splitWords[1])) {
        splitWords[0] = +splitWords[0] + +splitWords[1];
        splitWords.splice(splitWords.indexOf(splitWords[1]), 1);
      }

      if (ingredient.quantity === 0 && isNaN(splitWords[0])) {
        console.log('pure text');
        return ingredient.text;
      } else if (ingredient.quantity && isNaN(splitWords[0])) {
        if (!isNaN(splitWords[0].split('')[0]))
          return `${this.ingQuantity(ingredient)} ${
            ingredient.measure
          } ${splitWords.slice(1).join(' ')}`;

        return `${this.ingQuantity(ingredient)} ${
          splitWords.join(' ').charAt(0).toLowerCase() +
          splitWords.join(' ').slice(1)
        }`;
      } else {
        return `${this.ingQuantity(ingredient)} ${splitWords
          .slice(1)
          .join(' ')}`;
      }
    },

    bookmarkRecipe() {
      // if (!this.loggedIn) this.$router.push({ name: 'register' });
      if (!this.loggedIn) this.toggleRegisterModal();
      else this.$store.dispatch('home/toggleBookmark', this.recipe);
    },
    // deleteUserRecipe() {
    //   this.$store.dispatch('home/deleteUserRecipe', this.recipe);
    // },
    copyRecipeLink() {
      // FIXME change the base URL below after deploying this app
      navigator.clipboard.writeText(
        `http://localhost:8080/home?id=${this.recipe.id}`
      );
      this.$store.commit(
        'home/SET_TOAST_MESSAGE',
        'Recipe link copied to clipboard!'
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/style.scss';

.btn {
  padding: 1.5rem 4rem;
  font-size: 1.5rem;
  font-weight: 600;

  svg {
    height: 2.25rem;
    width: 2.25rem;
    fill: currentColor;
  }
}

.btn--round {
  height: 3.8rem;
  border-radius: 18px;
  font-family: inherit;
  color: inherit;
  font-size: 15px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  padding: 0 1.3rem;
  transition: all 0.25s;
  // transition: border-bottom 0.25s;
  // added below just for non-bootstrap version
  // text-decoration: none;
  // border-bottom: 2px solid transparent;
  display: flex;
  align-items: center;

  svg {
    height: 2.4rem;
    width: 2.4rem;
    fill: black;
    margin-right: 0.7rem;
    @media only screen and (max-width: 767px) {
      height: 2rem;
      width: 2rem;
    }
  }

  &:hover {
    background-color: rgb(230, 230, 230);
  }

  @media only screen and (max-width: 767px) {
    height: 3.15rem;
    font-size: 13px;
  }

  .btn--bookmark {
    fill: white;
    stroke: red;
    stroke-width: 2.5px;
  }
}

.btn--tiny {
  height: 2rem;
  width: 2rem;
  border: none;
  background: none;
  cursor: pointer;

  svg {
    height: 100%;
    width: 100%;
    fill: $color-primary;
    transition: all 0.3s;
  }

  &:focus {
    outline: none;
  }

  &:hover svg {
    // fill: $color-grad-2;
    transform: translateY(-1px);
  }

  &:active svg {
    // fill: $color-grad-2;
    transform: translateY(0);
  }

  &:not(:last-child) {
    margin-right: 0.3rem;
  }
}

.heading--2 {
  font-size: 2rem;
  font-weight: 700;
  color: black;
  text-transform: uppercase;
  margin-bottom: 2.5rem;
  text-align: center;
  // transform: skewY(-3deg);
}

// NOTE no need because of v-if
// .hidden {
//   visibility: hidden;
//   opacity: 0;
// }

.message {
  max-width: 40rem;
  margin: 0 auto;
  padding: 5rem 4rem;

  display: flex;

  svg {
    height: 3rem;
    width: 3rem;
    // fill: $color-primary;
    transform: translateY(-0.3rem);
  }

  p {
    margin-left: 1.5rem;
    font-size: 1.8rem;
    line-height: 1.5;
    font-weight: 600;
  }
}

//////////////////
/// From _recipe.scss

.recipe {
  background-color: white;

  &__img {
    width: 100%;
    display: block;
    height: 240px;
    object-fit: cover;
    border-radius: 16px;

    @media only screen and (max-width: 767px) {
      // height: 60%;
      height: 200px;
    }
  }

  &__title {
    font-size: 36px;
    font-family: DD-TTNorms, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol';
    font-weight: 700;
    // line-height: 48px;
    letter-spacing: -0.04ch;
    text-transform: capitalize;
    color: rgb(25, 25, 25);
    margin: 25px 0 0 0;
    // text-align: center;
    padding: 0px;
    display: block;
    font-variant-ligatures: no-common-ligatures;

    @media only screen and (max-width: 767px) {
      font-size: 22px;
    }
  }

  ///////////
  // DETAILS
  &__details {
    display: flex;
    // align-items: center;
    padding: 1rem 0 3.5rem 0;
  }

  &__info {
    font-size: 1.65rem;
    text-transform: uppercase;
    display: flex;

    &:not(:last-child) {
      margin-right: 3rem;
    }
  }

  &__info-icon {
    height: 2.35rem;
    width: 2.35rem;
    fill: $color-primary;
    margin-right: 1.15rem;
  }

  &__info-data {
    margin-right: 0.5rem;
    font-weight: 700;
  }

  &__info-buttons {
    display: flex;
    margin-left: 1rem;
    transform: translateY(-1px);
  }

  &__user-generated {
    background-color: darken($color-grey-light-2, 2%);

    display: flex;
    align-items: center;
    justify-content: center;
    height: 4.5rem;
    width: 4.5rem;
    border-radius: 8rem;

    margin-left: auto;
    margin-right: 1.75rem;

    @media only screen and (max-width: 767px) {
      height: 3.15rem;
      width: 3.15rem;
    }

    svg {
      height: 2.5rem;
      width: 2.5rem;
      // fill: $color-grad-2;
      fill: black;

      @media only screen and (max-width: 767px) {
        height: 1.75rem;
        width: 1.75rem;
      }
    }
  }

  ///////////
  // INGREDIENTS
  &__ingredients {
    padding: 5rem 8rem;
    font-size: 1.6rem;
    line-height: 1.4;
    background-color: #efeff2;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 12px;
  }

  &__ingredient-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem 3rem;
    list-style: none;
  }

  &__ingredient {
    display: flex;
  }

  &__icon {
    height: 2rem;
    width: 2rem;
    fill: $color-primary;
    margin-right: 1.1rem;
    flex: 0 0 auto;
    margin-top: 0.1rem;
  }

  // &__quantity {
  //   margin-right: 0.5rem;
  //   flex: 0 0 auto;
  // }

  ///////////
  // DIRECTIONS
  &__directions {
    padding: 5rem 10rem;
    padding-bottom: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__directions-text {
    font-size: 1.7rem;
    text-align: center;
    margin-bottom: 3.5rem;
    color: $color-grey-dark-2;
  }

  &__publisher {
    font-weight: 700;
  }
}
</style>
