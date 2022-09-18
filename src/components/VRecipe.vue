<template>
  <div class="recipe">
    <VLoadingSpinner v-if="loadingRecipe" />

    <div
      class="message"
      v-else-if="!this.$route.params.id && !Object.keys(this.recipe).length"
    >
      <div>
        <svg>
          <use :href="`${icons}#icon-smile`"></use>
        </svg>
      </div>
      <p>Start by searching for a recipe or an ingredient. Have fun!</p>
    </div>

    <div v-else>
      <figure class="recipe__fig">
        <img :src="recipe.image_url" :alt="recipe.title" class="recipe__img" />
        <h1 class="recipe__title">
          <span>{{ recipe.title }}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use :href="`${icons}#icon-clock`"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">{{
            recipe.cooking_time
          }}</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use :href="`${icons}#icon-users`"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">{{
            recipe.servings
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

        <button
          v-if="recipe.user_generated"
          @click="deleteUserRecipe"
          class="btn--round"
        >
          <svg class="">
            <use :href="`${icons}#icon-delete`"></use>
          </svg>
        </button>
        <button
          v-if="recipe.user_generated"
          @click="editUserRecipe"
          class="btn--round"
        >
          <svg class="">
            <use :href="`${icons}#icon-edit`"></use>
          </svg>
        </button>
        <div v-if="recipe.user_generated" class="recipe__user-generated">
          <svg>
            <use :href="`${icons}#icon-user`"></use>
          </svg>
        </div>
        <button
          v-if="!recipe.user_generated"
          @click="bookmarkRecipe"
          class="btn--round btn--bookmark"
        >
          <svg class="">
            <use
              :href="`${icons}#icon-bookmark${recipeBookmarked ? '-fill' : ''}`"
            ></use>
          </svg>
        </button>
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
            <div class="recipe__quantity">
              {{ ingQuantity(ing) }}
            </div>
            <div class="recipe__description">
              <span class="recipe__unit">{{ ing.unit }}</span>
              {{ ing.description }}
            </div>
          </li>
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">{{ recipe.publisher }}</span
          >. Please check out directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          :href="recipe.source_url"
          target="_blank"
        >
          <span>Directions</span>
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
      fracty,
      // REVIEW Instead of below, could get the value from init. Or, I could also use something like v-if="this.$router.currentRoute.value.path === '/login'". However, this would require that my url changes when I do a search (currently it doesn't).
      // existingRecipe: this.$route.params.id,
    };
  },
  watch: {
    '$route.params'(newValue) {
      console.log(newValue);
      console.log(this.$route);

      if (newValue.id)
        this.$store.dispatch('home/renderRecipe', {
          id: newValue.id,
        });
    },
  },
  computed: {
    ...mapGetters([
      'recipe',
      'recipeBookmarked',
      'loadingRecipe',
      // 'searchQuery',
    ]),
    loggedIn() {
      return this.$store.getters['auth/user'];
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
    }),
    ingQuantity(ingredient) {
      return ingredient.quantity ? fracty(ingredient.quantity).toString() : '';
    },
    bookmarkRecipe() {
      if (!this.loggedIn) this.$router.push({ name: 'register' });
      else this.$store.dispatch('home/toggleBookmark', this.recipe);
    },
    deleteUserRecipe() {
      this.$store.dispatch('home/deleteUserRecipe', this.recipe);
    },
    editUserRecipe() {
      this.$store.dispatch('home/editUserRecipe', this.recipe);
    },

    // TODO move this to either App.vue, VHome.vue, upon login, or upon user state change.
    // Concerns: if I put this in App, it would render the recipe even if I begin in another tab, thereby using resources and slowing things down. Or maybe that doesn't matter?
    // I could try to avoid the above issue by putting the function in Home, but I would also need to fetch user and fetch user recipes if I begin in another tab. So perhaps App is where I fetchUser and fetchUserRecipes. Home is where I render the recipe, user recipes tab is where I do something else. This separation makes sense, but how do I ensure that renderRecipe is only dispatched after fetchUser and fetchUserRecipes? Does it go by order automatically, since App is the base level? Could try to experiment.

    // TODO probably put this in RecipePreview and make it execute upon clicking a preview. Though perhaps also leave it in mounted() below in case of reloading or pasting in a recipe URL.
    // async renderNewRecipe() {
    //   try {
    //     window.addEventListener('hashchange', async () => {
    //       await this.$store.dispatch('home/renderRecipe', {
    //         id: this.$route.hash.slice(1),
    //       });
    //     });
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },
  },
  mounted() {
    // this.init();
    // this.renderNewRecipe();
    // this.$store.dispatch('home/reloadSearchResults');
    // console.log(this.searchQuery);
    // document.addEventListener('visibilitychange', () => {
    //   if (document.visibilityState === 'hidden') {
    //     this.$store.dispatch('home/uploadBookmarks');
    //   }
    // });
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/style.scss';

%btn {
  background-image: $gradient;
  border-radius: 10rem;
  border: none;
  text-transform: uppercase;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }

  & > *:first-child {
    margin-right: 1rem;
  }
}

.btn {
  @extend %btn;

  padding: 1.5rem 4rem;
  font-size: 1.5rem;
  font-weight: 600;

  svg {
    height: 2.25rem;
    width: 2.25rem;
    fill: currentColor;
  }
}

.btn--small {
  &,
  &:link,
  &:visited {
    @extend %btn;

    font-size: 1.4rem;
    font-weight: 600;
    padding: 1.25rem 2.25rem;
    text-decoration: none;

    svg {
      height: 1.75rem;
      width: 1.75rem;
      fill: currentColor;
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

.btn--round {
  background-image: $gradient;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  height: 4.5rem;
  width: 4.5rem;
  margin-left: auto;
  margin-right: 1.75rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.07);
  }

  &:focus {
    outline: none;
  }

  svg {
    height: 2.5rem;
    width: 2.5rem;
    fill: #fff;
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
    fill: $color-grad-2;
    transform: translateY(-1px);
  }

  &:active svg {
    fill: $color-grad-2;
    transform: translateY(0);
  }

  &:not(:last-child) {
    margin-right: 0.3rem;
  }
}

.heading--2 {
  font-size: 2rem;
  font-weight: 700;
  color: $color-primary;
  text-transform: uppercase;
  margin-bottom: 2.5rem;
  text-align: center;
  // transform: skewY(-3deg);
}

.link:link,
.link:visited {
  color: $color-grey-dark-2;
}

.spinner {
  margin: 5rem auto;
  text-align: center;

  svg {
    height: 6rem;
    width: 6rem;
    fill: $color-primary;
    animation: rotate 2s infinite linear;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

// NOTE no need because of v-if
// .hidden {
//   visibility: hidden;
//   opacity: 0;
// }

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

//////////////////
/// From _recipe.scss

.recipe {
  background-color: $color-grey-light-1;

  ///////////
  // FIGURE
  &__fig {
    height: 32rem;
    position: relative;
    // transform: scale(1.04) translateY(-1px);
    transform-origin: top;

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
      opacity: 0.6;
    }
  }

  &__img {
    width: 100%;
    display: block;
    height: 100%;
    object-fit: cover;
  }

  &__title {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 20%) skewY(-6deg);
    color: #fff;
    font-weight: 700;
    font-size: 3.25rem;
    text-transform: uppercase;
    width: 50%;
    line-height: 1.95;
    text-align: center;

    span {
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
      padding: 1.3rem 2rem;
      background-image: linear-gradient(
        to right bottom,
        $color-grad-1,
        $color-grad-2
      );
    }

    @media only screen and (max-width: $bp-medium) {
      width: 70%;
    }
  }

  ///////////
  // DETAILS
  &__details {
    display: flex;
    align-items: center;
    padding: 7.5rem 8rem 3.5rem 8rem;
  }

  &__info {
    font-size: 1.65rem;
    text-transform: uppercase;
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-right: 4.5rem;
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
    margin-left: 1.6rem;
    transform: translateY(-1px);
  }

  &__user-generated {
    background-color: darken($color-grey-light-2, 2%);

    display: flex;
    align-items: center;
    justify-content: center;
    height: 4rem;
    width: 4rem;
    border-radius: 10rem;

    margin-left: auto;
    margin-right: 1.75rem;

    svg {
      height: 2.25rem;
      width: 2.25rem;
      fill: $color-primary;
    }
  }

  ///////////
  // INGREDIENTS
  &__ingredients {
    padding: 5rem 8rem;
    font-size: 1.6rem;
    line-height: 1.4;
    background-color: $color-grey-light-2;
    display: flex;
    flex-direction: column;
    align-items: center;
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

  &__quantity {
    margin-right: 0.5rem;
    flex: 0 0 auto;
  }

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
