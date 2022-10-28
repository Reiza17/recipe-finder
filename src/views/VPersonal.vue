<template>
  <!-- <div id="app"> -->
  <div id="personal">
    <html>
      <body class="min-vh-100">
        <!-- <VHeader /> -->
        <div class="container-fluid">
          <div class="row justify-content-sm-center d-flex flex-wrap-reverse">
            <VUserSearchResults class="col-sm-3 search-results" />
            <VUserRecipe class="col-sm-9 recipe" />
            <VUploadRecipe v-if="uploadRecipeModal" />
            <VEditRecipe v-if="editRecipeModal" />
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
// import VHeader from '@/components/VHeader.vue';
import VUserSearchResults from '@/components/VUserSearchResults.vue';
import VUserRecipe from '@/components/VUserRecipe.vue';
import VUploadRecipe from '@/components/VUploadRecipe.vue';
import VEditRecipe from '@/components/VEditRecipe.vue';
import VLogin from '@/components/VLogin.vue';
import VRegister from '@/components/VRegister.vue';
import VToast from '@/components/VToast.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('home');

export default {
  name: 'VPersonal',
  components: {
    // VHeader,
    VUserSearchResults,
    VUserRecipe,
    VUploadRecipe,
    VEditRecipe,
    VLogin,
    VRegister,
    VToast,
  },

  computed: {
    ...mapGetters([
      'userRecipesView',
      'uploadRecipeModal',
      'editRecipeModal',
      'loginModal',
      'registerModal',
      'toastMessage',
    ]),
  },
  // methods: {
  //   ...mapMutations({
  //     setStoredBookmarks: 'SET_STORED_BOOKMARKS',
  //     toggleUploadRecipeModal: 'TOGGLE_UPLOAD_RECIPE_MODAL',
  //   }),
  // },

  created() {
    // const storage = localStorage.getItem('bookmarks');
    // if (storage) this.setStoredBookmarks(JSON.parse(storage));
    console.log('VPersonal created');
    this.$store.dispatch('home/init');
  },
  destroyed() {
    console.log('VPersonal destroyed');
  },
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
  margin-bottom: 2rem;

  @media only screen and (max-width: 648px) {
    // min-width: 260px;
    width: 100%;
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
