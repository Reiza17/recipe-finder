<template>
  <!-- <div class="toast-container top-0 start-50 translate-middle-x"> -->
  <div
    ref="el"
    class="toast justify-content-center text-bg-success border-0 bottom-0 start-50 translate-middle-x"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    data-bs-autohide="false"
  >
    <div class="d-flex align-items-center gap-4">
      <div class="toast-body">{{ toastMessage }}</div>
      <button
        type="button"
        class="btn-close btn-close-white"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { Toast } from 'bootstrap';

export default {
  name: 'VToast',

  // props: {
  //   toastMessage: {
  //     type: String,
  //     required: true,
  //   },
  // },

  data() {
    return {
      toast: null,
    };
  },
  computed: {
    toastMessage() {
      return this.$store.getters['home/toastMessage'];
    },
  },
  mounted() {
    this.toast = new Toast(this.$refs.el);
    this.toast.show();
  },
};
</script>

<style lang="scss" scoped>
.toast {
  display: flex;
  max-width: 250px;
  position: absolute;
}
.toast-body {
  font-size: 14px;
}
</style>
