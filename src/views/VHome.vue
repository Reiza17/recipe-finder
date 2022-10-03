<template>
  <!-- <div id="app"> -->
  <div id="home">
    <html>
      <body>
        <!-- <VHeader /> -->
        <VHeader class="navbar sticky-top p-4"></VHeader>
        <div class="container min-vh-100">
          <div class="row">
            <VSearchResults class="col-sm-3" />
            <VRecipe class="col-sm-9" />
            <VUploadRecipe v-if="uploadRecipeModal" />
            <VEditRecipe v-if="editRecipeModal" />
            <VLogin v-if="loginModal" />
            <VRegister v-if="registerModal" />
          </div>
        </div>
        <router-view />
      </body>
    </html>
  </div>
</template>

<script>
import VHeader from '@/components/VHeader.vue';
import VSearchResults from '@/components/VSearchResults.vue';
import VRecipe from '@/components/VRecipe.vue';
import VUploadRecipe from '@/components/VUploadRecipe.vue';
import VEditRecipe from '@/components/VEditRecipe.vue';
import VLogin from '@/components/VLogin.vue';
import VRegister from '@/components/VRegister.vue';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('home');

export default {
  name: 'VHome',
  components: {
    VHeader,
    VSearchResults,
    VRecipe,
    VUploadRecipe,
    VEditRecipe,
    VLogin,
    VRegister,
  },

  computed: {
    ...mapGetters([
      'uploadRecipeModal',
      'editRecipeModal',
      'loginModal',
      'registerModal',
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

    this.$store.dispatch('home/init');
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
  font-size: 50.5%;

  // 980px
  @media only screen and (max-width: 61.25em) {
    font-size: 50%;
  }
}

.navbar {
  background-color: white;
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

.container-fluid {
  // max-width: 120rem;
  min-height: 117rem;
  // margin: 4vw auto;
  //   background-color: #fff;
  //   border-radius: 9px;
  // overflow: hidden;
  // box-shadow: 0 2rem 6rem 0.5rem rgba($color-grey-dark-1, 0.2);

  //   display: grid;
  //   // grid-template-rows: 10rem minmax(100rem, auto);
  //   grid-template-columns: 1fr 2fr;
  //   // grid-template-areas:
  //   //   'head head'
  //   //   'list recipe';

  //   // @media only screen and (max-width: $bp-large) {
  //   //   max-width: 100%;
  //   //   margin: 0;
  //   //   border-radius: 0;
  //   // }
}
//
</style>
