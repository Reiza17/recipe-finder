<template>
  <div id="app">
    <!-- NOTE Code for if I use a navbar instead -->
    <!-- <header></header> -->
    <!-- <top-header></top-header> -->
    <!-- <div id="nav"> -->
    <!-- <router-link to="/">Home</router-link>| -->
    <!-- <router-link to="/about">About</router-link>| -->
    <!-- <div v-if="!loggedIn">
        <router-link to="/register">Register</router-link>|
        <router-link to="/login">Login</router-link>
      </div>
      <div v-else>
        <button @click="$store.dispatch('auth/logout')">Logout</button>
      </div> -->
    <!-- <router-link to="/secret">Secret</router-link> -->
    <!-- </div> -->
    <VHeader />
    <!-- <router-link to="/home">Go to Foo</router-link>
    <router-link to="/personal">Go to Foo</router-link> -->
    <keep-alive><router-view /></keep-alive>
  </div>
</template>

<script>
import VHeader from '@/components/VHeader.vue';

export default {
  name: 'app',
  components: {
    VHeader,
  },
  // computed: {
  //   loggedIn() {
  //     return this.$store.getters['auth/loggedIn'];
  //   },
  // },
  // async beforeMount() {
  //   await this.$store.dispatch('auth/fetchUser');
  //   await this.$store.dispatch('home/fetchUserRecipes');
  // },
};
</script>

<style lang="scss">
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }

// #nav {
//   padding: 30px;

//   a {
//     font-weight: bold;
//     color: #2c3e50;

//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
</style>
