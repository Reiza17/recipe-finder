<template>
  <header
    class="navbar sticky-top p-3 flex-wrap-reverse justify-content-end gap-4"
  >
    <div class="d-flex flex-row align-items-center flex-grow-1 ms-5">
      <a
        class="navbar-brand d-flex flex-row align-items-center me-4"
        href="/home"
      >
        <img
          src="@/assets/images/logo.svg"
          alt="Logo"
          width="40"
          height="40"
          class="d-inline-block me-3"
        />
        <p class="logo-text me-4">Forklift</p>
      </a>
      <!-- <img src="" alt="Logo" class="logo me-5" /> -->
      <VSearch />
    </div>

    <nav class="nav ms-4">
      <ul class="nav__list">
        <!-- <VUserRecipes v-if="loggedIn" /> -->
        <!-- <li class="nav__item">
          <button @click="toggleUserRecipesView" class="nav__btn">
            <svg class="nav__icon">
              <use :href="`${icons}#icon-upload-cloud`"></use>
            </svg>
            <span class="nav_label">Database</span>
          </button>
        </li> -->
        <li class="nav__item">
          <router-link
            :to="{
              name: 'home',
              // params: {
              //   id: $route.params.id,
              //   userRecipeId: $route.params.userRecipeId,
              // },
            }"
            class="nav__btn"
            :disabled="$route.name === 'home'"
          >
            <svg class="nav__icon">
              <use :href="`${icons}#icon-global`"></use>
            </svg>
            <span class="nav_label">Database</span>
          </router-link>
        </li>

        <li class="nav__item">
          <button
            v-if="!this.loggedIn"
            class="nav__btn"
            @click="toggleRegisterModal"
          >
            <svg class="nav__icon">
              <use :href="`${icons}#icon-user`"></use>
            </svg>
            <span class="nav_label">My Recipes</span>
          </button>
          <router-link
            v-else
            :to="{
              name: 'user-recipes',
              // params: {
              //   id: $route.params.id,
              //   userRecipeId: $route.params.userRecipeId,
              // },
            }"
            class="nav__btn"
            :disabled="$route.name === 'user-recipes'"
          >
            <svg class="nav__icon">
              <use :href="`${icons}#icon-user`"></use>
            </svg>
            <span class="nav_label">My Recipes</span>
          </router-link>
        </li>
        <!-- <li class="nav__item">
          <button
            @click="
              $router.push({
                name: 'recipe',
                params: {
                  id: $route.params.id,
                  userRecipeId: $route.params.userRecipeId,
                },
                query: {
                  query: $route.query.query,
                  userRecipeQuery: $route.query.userRecipeQuery,
                  page: $route.query.page,
                  userRecipeQueryPage: $route.query.userRecipeQueryPage,
                },
              })
            "
            class="nav__btn"
            :disabled="$route.name === 'recipe' || $route.name === 'recipe'"
          >
            <svg class="nav__icon">
              <use :href="`${icons}#icon-upload-cloud`"></use>
            </svg>
            <span class="nav_label">Database</span>
          </button>
        </li>

        <li class="nav__item">
          <button
            @click="
              $router.push({
                name: 'userRecipe',
                params: {
                  id: $route.params.id,
                  userRecipeId: $route.params.userRecipeId,
                },
                query: {
                  query: $route.query.query,
                  userRecipeQuery: $route.query.userRecipeQuery,
                  page: $route.query.page,
                  userRecipeQueryPage: $route.query.userRecipeQueryPage,
                },
              })
            "
            class="nav__btn"
            :disabled="$route.name === 'userRecipe'"
          >
            <svg class="nav__icon">
              <use :href="`${icons}#icon-user`"></use>
            </svg>
            <span class="nav_label">My Recipes</span>
          </button>
        </li> -->

        <VBookmarks />
        <li class="nav__item" v-if="!loggedIn">
          <button @click="toggleLoginModal" class="nav__btn">
            <span>Log In</span>
          </button>
        </li>
        <li class="nav__item" v-if="!loggedIn">
          <!-- <router-link :to="{ name: 'Home' }">
            <v-btn color="primary" large>
              <v-icon left>mdi-home</v-icon>
              <span>Home</span>
            </v-btn>
          </router-link> -->
          <button @click="toggleRegisterModal" class="nav__btn">
            <span>Sign Up</span>
          </button>
        </li>
        <li class="nav__item" v-else>
          <!-- <button class="nav__btn" @click="toggleUploadRecipeView">
            <svg class="nav__icon">
              <use href="@/assets/images/icons.svg#icon-edit"></use>
            </svg>
            <span>Add recipe</span>
          </button> -->
          <button class="nav__btn" @click="$store.dispatch('auth/logout')">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script>
import VSearch from '@/components/VSearch.vue';
import VBookmarks from '@/components/VBookmarks.vue';
// import VUserRecipes from '@/components/VUserRecipes.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapMutations } = createNamespacedHelpers('home');

export default {
  name: 'VHeader',
  components: {
    VSearch,
    VBookmarks,
    // VUserRecipes,
  },
  data() {
    return {
      icons: require('@/assets/images/icons.svg'),
    };
  },
  computed: {
    loggedIn() {
      return this.$store.getters['auth/loggedIn'];
    },
  },
  methods: {
    ...mapMutations({
      // toggleUploadRecipeView: 'TOGGLE_UPLOAD_USER_RECIPE_VIEW',
      toggleUserRecipesView: 'TOGGLE_USER_RECIPES_VIEW',
      toggleLoginModal: 'TOGGLE_LOGIN_MODAL',
      toggleRegisterModal: 'TOGGLE_REGISTER_MODAL',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/style.scss';

@media all and (max-width: 752px) {
  .logo-text {
    display: none;
  }
}
@media all and (max-width: 984px) {
  .nav_label {
    display: none;
  }
}

.navbar {
  background-color: white;
  border-bottom: 1px solid rgb(231, 231, 231);
  margin-bottom: 20px;
  // TODO can remove below once I use bootstrap's modal
  z-index: 10;
}
// .logo {
//   margin-left: 3rem;
//   height: 4.6rem;
//   display: block;
// }
.logo-text {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: large;
  color: #eb1700;
  font-weight: bold;
  letter-spacing: 0.2rem;
  text-transform: uppercase;
}
// .d-flex {
// grid-area: head;
// background-color: $color-grey-light-1;
// display: flex;
// align-items: center;
// justify-content: space-between;

// &__logo {
//   margin-left: 4rem;
//   height: 4.6rem;
//   display: block;
// }
// }

.nav {
  align-self: stretch;
  margin-right: 2.5rem;

  &__list {
    list-style: none;
    display: flex;
    height: 100%;
  }

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
    transition: all 0.25s;
    // transition: border-bottom 0.25s;
    // added below just for non-bootstrap version
    text-decoration: none;
    border-bottom: 2px solid transparent;
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
      background-color: rgb(247, 247, 247);
      // border-bottom: 2px solid rgb(38, 81, 143);
    }
  }
  &__icon {
    margin-top: 0.1rem;
  }
}

.router-link-active {
  // background-color: $color-grey-light-2;
  border-bottom: 2px solid rgb(38, 81, 143);
}
</style>
