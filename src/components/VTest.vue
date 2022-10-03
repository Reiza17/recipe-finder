<template>
  <div class="row height d-flex justify-content-center align-items-center">
    <div class="col-md-8">
      <div class="search">
        <i class="fa fa-search"></i>
        <input
          type="text"
          class="form-control"
          placeholder="Have a question? Ask Now"
        />
        <button class="btn btn-primary">Search</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VSearch',

  data() {
    return {
      icons: require('@/assets/images/icons.svg'),
      query: '',
    };
  },
  methods: {
    submitSearch() {
      this.$store.dispatch('home/searchRecipes', { query: this.query });
      this.query = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  position: relative;
  box-shadow: 0 0 40px rgba(51, 51, 51, 0.1);
}

.search input {
  height: 60px;
  text-indent: 25px;
  border: 2px solid #d6d4d4;
}

.search input:focus {
  box-shadow: none;
  border: 2px solid blue;
}

.search .fa-search {
  position: absolute;
  top: 20px;
  left: 16px;
}

.search button {
  position: absolute;
  top: 5px;
  right: 5px;
  height: 50px;
  width: 110px;
  background: blue;
}
</style>
