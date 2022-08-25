<template>
  <div class="spinner">
    <svg>
      <use :href="`${icons}#icon-loader`"></use>
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      icons: require('@/assets/images/icons.svg'),
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/style.scss';

.spinner {
  margin: 5rem auto;
  text-align: center;

  svg {
    height: 6rem;
    width: 6rem;
    fill: $color-primary;
    animation: rotate 2s infinite linear;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
