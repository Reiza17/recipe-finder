<template>
  <div>
    <div
      @click="
        $router.push({ name: 'recipe', params: { id: $route.params.id } })
      "
      class="overlay"
    ></div>
    <div class="register-window">
      <button
        @click="
          $router.push({ name: 'recipe', params: { id: $route.params.id } })
        "
        class="btn--close-modal"
      >
        &times;
      </button>
      <div class="message">
        <p>Sign up to upload or bookmark recipes!</p>
      </div>
      <form @submit.prevent="register">
        <div class="email">
          <input type="email" v-model="email" placeholder="email" />
        </div>
        <div class="password">
          <input type="password" v-model="password" placeholder="password" />
        </div>
        <button class="btn submit__btn" type="submit">
          <span>Sign Up</span>
        </button>
      </form>
      <div class="error" v-if="error">
        <p>{{ error }}</p>
      </div>
      <p>
        Already have an account?
        <router-link to="/login" class="bottom-link"> LOG IN </router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    error() {
      return this.$store.getters['auth/registerErrorMessage'];
    },
  },
  methods: {
    register() {
      this.$store.dispatch('auth/register', {
        email: this.email,
        password: this.password,
      });
    },
    // NOTE does the same as below
    // exit() {
    //   this.$router.push({ name: 'home' });
    //   this.$store.commit('auth/CLEAR_REGISTRATION_ERROR');
    // },
  },
  // REVIEW is this a good way to reset the authentication error message?
  beforeDestroy() {
    this.$store.commit('auth/CLEAR_REGISTRATION_ERROR');
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/sass/style.scss';

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  // backdrop-filter: blur(4px);
  z-index: 100;
  transition: all 0.5s;
}

.register-window {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100rem;
  background-color: white;
  border-radius: 5px;

  padding: 5rem 6rem;
  box-shadow: 0 2rem 3rem rgba(0, 0, 0, 0.411);
  z-index: 1000;
  transition: all 0.5s;

  .btn--close-modal {
    font-family: inherit;
    color: inherit;
    position: absolute;
    top: 0.5rem;
    right: 1.6rem;
    font-size: 3.5rem;
    cursor: pointer;
    border: none;
    background: none;
  }

  input {
    width: 300px;
    padding: 10px;
    margin: 10px;
    margin-left: 40px;
    font-size: 15px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  .submit__btn {
    width: 300px;
    padding: 10px;
    margin: 10px;
    margin-left: 40px;
    border-radius: 16px;
    text-align: center;

    span {
      margin: auto;
      letter-spacing: 0.5px;
    }
  }

  .message {
    max-width: 40rem;
    display: flex;

    p {
      margin: 0px 0px 20px 40px;
      font-size: 2.2rem;
      line-height: 1.5;
      font-weight: 600;
    }
  }

  .error {
    width: 300px;
    margin-left: 40px;
    margin-top: 20px;
    font-size: 1.5rem;
    color: #d30000;

    p {
      margin: auto;
    }
  }

  p {
    margin-top: 20px;
    margin-left: 40px;
    font-size: 1.5rem;
  }

  .bottom-link {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.5px;
    line-height: 24px;
    text-transform: uppercase;
    color: #0079d3;
    text-decoration: none;
  }
}
</style>
