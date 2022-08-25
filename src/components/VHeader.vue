<template>
  <header class="header">
    <img src="@/assets/images/logo.png" alt="Logo" class="header__logo" />

    <VSearch />

    <nav class="nav">
      <ul class="nav__list">
        <li class="nav__item">
          <button class="nav__btn" @click="toggleUploadRecipeModal">
            <svg class="nav__icon">
              <use href="@/assets/images/icons.svg#icon-edit"></use>
            </svg>
            <span>Add recipe</span>
          </button>
        </li>
        <VBookmarks />
      </ul>
    </nav>
  </header>
</template>

<script>
import VSearch from '@/components/VSearch.vue';
import VBookmarks from '@/components/VBookmarks.vue';
import { mapMutations } from 'vuex';

export default {
  name: 'VHeader',
  components: {
    VSearch,
    VBookmarks,
  },
  methods: {
    ...mapMutations({ toggleUploadRecipeModal: 'TOGGLE_UPLOAD_RECIPE_MODAL' }),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/style.scss';

.header {
  grid-area: head;
  background-color: $color-grey-light-1;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__logo {
    margin-left: 4rem;
    height: 4.6rem;
    display: block;
  }
}

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
    font-size: 1.4rem;
    font-weight: 700;
    text-transform: uppercase;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 1.5rem;
    transition: all 0.3s;

    display: flex;
    align-items: center;

    svg {
      height: 2.4rem;
      width: 2.4rem;
      fill: $color-primary;
      margin-right: 0.7rem;
      transform: translateY(-1px);
    }

    &:focus {
      outline: none;
    }

    &:hover {
      background-color: $color-grey-light-2;
    }
  }
}
</style>
