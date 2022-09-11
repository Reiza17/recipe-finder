<template>
  <!-- <div id="app"> -->
  <div id="home">
    <html>
      <body>
        <div class="container">
          <VHeader />
          <VSearchResults />
          <VRecipe />
        </div>
        <!-- <VUploadRecipe v-if="uploadRecipeModal" /> -->
        <router-view />
      </body>
    </html>
  </div>
</template>

<script>
import VHeader from '@/components/VHeader.vue';
import VSearchResults from '@/components/VSearchResults.vue';
import VRecipe from '@/components/VRecipe.vue';
// import VUploadRecipe from '@/components/VUploadRecipe.vue';
// import { createNamespacedHelpers } from 'vuex';
// const { mapGetters, mapMutations } = createNamespacedHelpers('home');

export default {
  name: 'VHome',
  components: {
    VHeader,
    VSearchResults,
    VRecipe,
    // VUploadRecipe,
  },

  // computed: {
  //   ...mapGetters(['uploadRecipeModal']),
  // },
  // methods: {
  //   ...mapMutations({
  //     setStoredBookmarks: 'SET_STORED_BOOKMARKS',
  //     toggleUploadRecipeModal: 'TOGGLE_UPLOAD_RECIPE_MODAL',
  //   }),
  // },

  // created() {
  // const storage = localStorage.getItem('bookmarks');
  // if (storage) this.setStoredBookmarks(JSON.parse(storage));

  // this.$store.dispatch('fetchUserRecipes');
  // },
};
</script>

<style lang="scss">
@import '@/assets/sass/style.scss';
@import '@/assets/sass/components.scss';

html {
  box-sizing: border-box;
  font-size: 50.5%;

  @media only screen and (max-width: $bp-medium) {
    font-size: 50%;
  }
}

body {
  font-family: 'Nunito Sans', sans-serif;
  font-weight: 400;
  line-height: 1.6;
  color: $color-grey-dark-1;
  background-image: $gradient;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: calc(100vh - 2 * 4vw);
}

.container {
  max-width: 120rem;
  min-height: 117rem;
  margin: 4vw auto;
  background-color: #fff;
  border-radius: 9px;
  overflow: hidden;
  box-shadow: 0 2rem 6rem 0.5rem rgba($color-grey-dark-1, 0.2);

  display: grid;
  grid-template-rows: 10rem minmax(100rem, auto);
  grid-template-columns: 1fr 2fr;
  grid-template-areas:
    'head head'
    'list recipe';

  @media only screen and (max-width: $bp-large) {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }
}
</style>
