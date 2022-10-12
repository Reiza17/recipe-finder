<template>
  <!-- <div class="toast-container top-0 start-50 translate-middle-x"> -->
  <div
    ref="el"
    class="toast align-items-center text-bg-success border-0 bottom-0 start-50 translate-middle-x"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">Your recipe has been uploaded!</div>
      <button
        type="button"
        class="btn-close btn-close-white m-auto"
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
  mounted() {
    this.toast = new Toast(this.$refs.el);
    this.toast.show();
  },
};
</script>

<style lang="scss" scoped>
.toast {
  max-width: 250px;
  position: absolute;
}
.toast-body {
  font-size: 14px;
  padding-left: 15px;
}
</style>
