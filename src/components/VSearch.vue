<template>
  <form class="search" @submit.prevent="submitSearch">
    <i class="fa-solid fa-magnifying-glass fa-2xl"></i>
    <input
      type="search"
      class="form-control"
      placeholder="Search over 1,000,000 recipes"
      v-model="query"
    />
    <!-- <button class="btn btn-primary">Search</button> -->

    <!-- <div class="row mt-5">
      <div class="col-md-5 mx-auto">
        <div class="small fw-light">rounded search input with icon</div>
        <div class="input-group">
          <input
            class="form-control border-end-0 border"
            type="search"
            value="search"
            id="example-search-input"
          />
          <span class="input-group-append">
            <button
              class="btn btn-outline-secondary bg-white border-start-0 border-bottom-0 border ms-n5"
              type="button"
            >
              <i class="fa fa-search"></i>
            </button>
          </span>
        </div>
      </div>
    </div> -->
  </form>
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
@import '@/assets/sass/style.scss';

.form-control {
  text-overflow: ellipsis;
  font-weight: 500;
}

.search {
  // display: flex;
  max-width: 40rem;
  width: 100%;
  position: relative;
  border-radius: 10rem;
  box-shadow: 0 1px 8px rgb(67 41 163 / 10%);
  // box-sizing: border-box;
  // max-width: 450px;
}

.search .fa-magnifying-glass {
  position: absolute;
  top: 22px;
  left: 16px;
}

.search input {
  height: 42px;
  border: 1px solid #8f8fa1;
  border-radius: 10rem;
  font-size: 1.8rem;
  padding: 1.3rem 1.3rem 1.3rem 3em;
}

.search input:focus {
  box-shadow: none;
  border: 2px solid black;
}

// .search button {
//   position: absolute;
//   top: 5px;
//   right: 5px;
//   height: 38px;
//   width: 110px;
// }

// .btn-primary {
//   font-size: 1.7rem;
// }

// .form-control {
//   border-radius: 10rem;
//   font-size: 1.7rem;
//   width: 45rem;
//   padding: 1.3rem 1.3rem 1.3rem 2.6rem;
// }

// .d-flex {
//   padding: 1.7rem;
// }

// .search {
//   background-color: #fff;
//   border-radius: 10rem;
//   display: flex;
//   align-items: center;
//   padding-left: 3rem;
//   transition: all 0.3s;

//   &:focus-within {
//     transform: translateY(-2px);
//     box-shadow: 0 0.7rem 3rem rgba($color-grey-dark-1, 0.08);
//   }

//   &__field {
//     border: none;
//     background: none;
//     font-family: inherit;
//     color: inherit;
//     font-size: 1.7rem;
//     width: 30rem;

//     &:focus {
//       outline: none;
//     }

//     &::placeholder {
//       color: $color-grey-light-3;
//     }

//     @media only screen and (max-width: $bp-medium) {
//       width: auto;

//       &::placeholder {
//         color: $color-grey-light-3;
//       }
//     }
//   }

// &__btn {
//   font-weight: 600;
//   font-family: inherit;
// }
// }
</style>
