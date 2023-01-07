<template>
  <header class="navbar sticky-top p-3 d-flex gap-4">
    <nav class="nav ms-3 narrowscreen-navbar">
      <ul class="nav__list justify-content-between">
        <a class="navbar-brand d-flex align-items-center me-4" href="/home">
          <img
            src="@/assets/images/logo.svg"
            alt="Logo"
            width="40"
            height="40"
            class="d-inline-block me-2"
          />
          <p class="logo-text-narrow me-3">Forklift</p>
        </a>

        <div class="d-flex">
          <li class="nav__item">
            <router-link
              :to="{
                name: 'home',
              }"
              class="nav__btn"
              :disabled="$route.name === 'home'"
            >
              <!-- <svg class="nav__icon">
              <use :href="`${icons}#icon-global`"></use>
            </svg> -->
              <span>Database</span>
            </router-link>
          </li>

          <li class="nav__item text-nowrap me-3">
            <button
              v-if="!this.loggedIn"
              class="nav__btn"
              @click="toggleRegisterModal"
            >
              <!-- <svg class="nav__icon">
              <use :href="`${icons}#icon-user`"></use>
            </svg> -->
              <span>My Recipes</span>
            </button>
            <router-link
              v-else
              :to="{
                name: 'user-recipes',
              }"
              class="nav__btn"
              :disabled="$route.name === 'user-recipes'"
            >
              <!-- <svg class="nav__icon">
              <use :href="`${icons}#icon-user`"></use>
            </svg> -->
              <span>My Recipes</span>
            </router-link>
          </li>

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <!-- <li class="nav__item">
          </li> -->
          <!-- <VBookmarks /> -->

          <!-- <li class="nav__item" v-if="!loggedIn">
            <button @click="toggleLoginModal" class="nav__btn">
              <span>Log In</span>
            </button>
          </li>
          <li class="nav__item" v-if="!loggedIn">
            <button @click="toggleRegisterModal" class="nav__btn">
              <span>Sign Up</span>
            </button>
          </li>
          <li class="nav__item" v-else>
            <button class="nav__btn" @click="$store.dispatch('auth/logout')">
              Logout
            </button>
          </li> -->
        </div>
      </ul>
    </nav>

    <div
      class="collapse navbar-collapse narrowscreen-navbar"
      id="navbarNavDropdown"
    >
      <ul class="navbar-nav">
        <!-- <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li> -->
        <!-- <li class="nav-item">
          <a class="nav-link" href="#">Features</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Pricing</a>
        </li> -->
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Saved Recipes
          </a>
          <ul class="dropdown-menu">
            <VBookmarksMobile />
          </ul>
        </li>
        <li class="nav-item" v-if="!loggedIn">
          <a class="nav-link" @click="toggleLoginModal">Log In</a>
        </li>
        <li class="nav-item" v-if="!loggedIn">
          <!-- <router-link :to="{ name: 'Home' }">
            <v-btn color="primary" large>
              <v-icon left>mdi-home</v-icon>
              <span>Home</span>
            </v-btn>
          </router-link> -->
          <a class="nav-link" @click="toggleRegisterModal">Sign Up</a>
        </li>
        <li class="nav-item" v-else>
          <!-- <button class="nav__btn" @click="toggleUploadRecipeView">
            <svg class="nav__icon">
              <use href="@/assets/images/icons.svg#icon-edit"></use>
            </svg>
            <span>Add recipe</span>
          </button> -->
          <a class="nav-link" @click="$store.dispatch('auth/logout')">
            Logout
          </a>
        </li>
      </ul>
    </div>

    <div
      class="d-flex flex-row align-items-center flex-grow-1 ms-5 widescreen-search"
    >
      <a
        class="navbar-brand d-flex flex-row align-items-center me-4 widescreen-icons"
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

    <button
      v-if="!loadingSearchResults && $route.query.query"
      class="navbar-toggler dropdown-toggle narrowscreen-navbar p-2"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#searchResultsDropdown"
      aria-controls="searchResultsDropdown"
      aria-expanded="false"
      aria-label="Toggle search results"
    >
      <span class="fs-2 fw-normal p-2">Search results</span>
    </button>

    <VSearchResults
      class="collapse narrowscreen-navbar"
      id="searchResultsDropdown"
    />

    <nav class="nav ms-4 widescreen-icons">
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
import VBookmarksMobile from '@/components/VBookmarksMobile.vue';
import VSearchResults from '@/components/VSearchResults.vue';
// import VUserRecipes from '@/components/VUserRecipes.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapMutations } = createNamespacedHelpers('home');

export default {
  name: 'VHeader',
  components: {
    VSearch,
    VBookmarks,
    VBookmarksMobile,
    VSearchResults,
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
    loadingSearchResults() {
      return this.$store.getters['home/loadingSearchResults'];
    },
  },
  methods: {
    ...mapMutations({
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

.narrowscreen-navbar {
  display: none;
}

.nav-link {
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
}

.dropdown-item {
  font-size: 15px;
}

@media all and (max-width: 644px) {
  .widescreen-icons {
    display: none !important;
  }
  .widescreen-search {
    margin-left: 0 !important;
  }

  .narrowscreen-navbar {
    display: block;
    width: 100%;
    margin-right: 0 !important;
    margin-left: 0.5rem !important;
  }

  .d-inline-block {
    width: 28px;
    height: 28px;
  }

  .logo-text-narrow {
    font-size: 16px !important;
    letter-spacing: 0 !important;
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
.logo-text,
.logo-text-narrow {
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
    font-weight: 600;
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

    @media all and (max-width: 644px) {
      padding: 0 0.8rem;
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
