<template>
  <!-- <div id="app"> -->
  <div id="home">
    <html>
      <body class="min-vh-80">
        <div class="container-fluid">
          <div class="row justify-content-sm-center d-flex flex-wrap-reverse">
            <VSearchResults class="col-sm-3 search-results" />
            <VRecipe class="col-sm-9 recipe" />
            <VLogin v-if="loginModal" />
            <VRegister v-if="registerModal" />
            <VToast v-if="toastMessage" />
          </div>
        </div>
      </body>
    </html>
  </div>
</template>

<script>
import VSearchResults from '@/components/VSearchResults.vue';
import VRecipe from '@/components/VRecipe.vue';
import VLogin from '@/components/VLogin.vue';
import VRegister from '@/components/VRegister.vue';
import VToast from '@/components/VToast.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('home');

export default {
  name: 'VHome',
  components: {
    VSearchResults,
    VRecipe,
    VLogin,
    VRegister,
    VToast,
  },

  computed: {
    ...mapGetters(['loginModal', 'registerModal', 'toastMessage']),
    loggedIn() {
      return this.$store.getters['auth/loggedIn'];
    },
  },

  methods: {
    // ...mapMutations({
    //   setStoredBookmarks: 'SET_STORED_BOOKMARKS',
    //   toggleUploadRecipeView: 'TOGGLE_UPLOAD_USER_RECIPE_VIEW',
    // }),

    async init() {
      try {
        this.$store.commit('home/TOGGLE_BOOKMARKS_SPINNER', true);

        // NOTE await is necessary for these, otherwise the user recipes and bookmarks won't display
        await this.$store.dispatch('auth/fetchUser', null, { root: true });
        if (this.loggedIn) {
          this.$store.dispatch('home/fetchBookmarks');
          // NOTE allows persistent selection of user recipe once user tabs over
          if (this.$route.query.userRecipeId)
            this.$store.dispatch('home/fetchUserRecipes');
        }

        if (this.$route.query.query)
          this.$store.dispatch('home/searchRecipes', {
            query: this.$route.query.query,
            page: this.$route.query.page,
            reloadingPage: true,
          });

        if (this.$route.query.id)
          this.$store.dispatch('home/renderRecipe', {
            id: this.$route.query.id,
          });
      } catch (err) {
        console.log(err);
      }
    },
  },

  created() {
    // const storage = localStorage.getItem('bookmarks');
    // if (storage) this.setStoredBookmarks(JSON.parse(storage));
    // console.log('VHome created');
    this.init();
  },
  // destroyed() {
  //   console.log('VHome destroyed');
  // },
};
</script>

<style lang="scss" scoped>
// @import '@/assets/sass/style.scss';
// @import '@/assets/sass/components.scss';
// @import '@/assets/sass/custom.scss';

// .navbar {
//   padding: 1.5rem;
// }

html {
  box-sizing: border-box;
  // font-size: 50.5%;

  // 980px
  // @media only screen and (max-width: 61.25em) {
  //   font-size: 50%;
  // }
}

// .container-fluid {
//   margin: auto;
// }

// TODO add new classes and change names to them here
.search-results {
  min-width: 260px;
  // max-width: 365px;
  min-height: 80vh;
  padding-right: 1.2rem;
  margin-bottom: 2rem;
  margin-right: 0.8rem;
  border-right: 1px solid rgb(231, 231, 231);

  @media only screen and (max-width: 648px) {
    // min-width: 260px;
    width: 100%;
    border-right: none;
  }
}

.recipe {
  flex: 1 1 100px;
  min-width: 372px;
  max-width: 928px;
}

// body {
//   font-family: 'Nunito Sans', sans-serif;
//   font-weight: 400;
//   line-height: 1.6;
//   color: $color-grey-dark-1;
//   // background-image: $gradient;
//   // background-size: cover;
//   background-repeat: no-repeat;
//   // min-height: calc(100vh - 2 * 4vw);
// }

// .container {
//   // max-width: 120rem;
//   min-height: 117rem;
//   // margin: 4vw auto;
//   //   background-color: #fff;
//   //   border-radius: 9px;
//   // overflow: hidden;
//   // box-shadow: 0 2rem 6rem 0.5rem rgba($color-grey-dark-1, 0.2);

//   //   display: grid;
//   //   // grid-template-rows: 10rem minmax(100rem, auto);
//   //   grid-template-columns: 1fr 2fr;
//   //   // grid-template-areas:
//   //   //   'head head'
//   //   //   'list recipe';

//   //   // @media only screen and (max-width: $bp-large) {
//   //   //   max-width: 100%;
//   //   //   margin: 0;
//   //   //   border-radius: 0;
//   //   // }
// }
//
</style>
