<template>
  <div>
    <!-- NOTE the router method  -->
    <!-- <div
      @click="
        $router.push({ name: 'recipe', params: { id: $route.params.id } })
      "
      class="overlay"
    ></div> -->
    <div @click="toggleLoginModal" class="overlay"></div>
    <div class="login-modal">
      <button @click="toggleLoginModal" class="btn--close-modal">
        &times;
      </button>
      <div class="modal-content">
        <div class="modal-header">
          <p>Log In</p>
        </div>
        <form @submit.prevent="login">
          <div
            class="form-floating"
            :class="{
              'form-group--input-error': inputError($v.email.$error),
            }"
          >
            <input
              type="email"
              class="form-control"
              id="floatingEmail"
              placeholder="name@example.com"
              v-model.trim="email"
              @input="delayTouch($v.email)"
              @blur="$store.commit('auth/CLEAR_AUTH_MESSAGE')"
            />
            <label for="floatingEmail">Email</label>
          </div>
          <div v-if="$v.email.$error" class="error">
            <div v-if="!$v.email.required">
              Please enter an email address to continue.
            </div>
            <div v-if="!$v.email.email">Not a valid email address</div>
          </div>
          <!-- TODO refactor below using a less hacky method -->
          <div
            v-if="authMessage.includes('Incorrect') && !successfulAuth"
            class="error mb-4"
          >
            {{ authMessage }}
          </div>
          <div
            class="form-floating mt-4"
            :class="{
              'form-group--input-error': inputError($v.password.$error),
            }"
          >
            <input
              type="password"
              class="form-control"
              id="floatingPassword"
              placeholder="password"
              v-model="password"
              @input="delayTouch($v.password)"
            />
            <label for="floatingPassword">Password</label>
          </div>
          <div v-if="$v.password.$error" class="error">
            <div v-if="!$v.password.required">
              Please enter a password to continue
            </div>
          </div>
          <button class="btn btn-primary btn--submit" type="submit">
            <span
              class="spinner-border"
              role="status"
              aria-hidden="true"
              v-if="isAuthenticating"
            ></span>
            <svg v-else-if="successfulAuth" class="icon">
              <use :href="`${icons}#icon-check`"></use>
            </svg>
            <span v-else>Continue</span>
          </button>
        </form>
        <!-- TODO refactor below using a less hacky method -->
        <div
          v-if="successfulAuth || authMessage.includes('attempts')"
          :class="{
            'auth-message': successfulAuth,
            'auth-error-message': !successfulAuth,
          }"
        >
          <p>{{ authMessage }}</p>
        </div>
        <p class="bottom-text">
          New to Recipe Finder?
          <a href="" @click.prevent="switchToRegisterModal" class="bottom-link">
            SIGN UP
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapMutations } = createNamespacedHelpers('home');
import { required, email } from 'vuelidate/lib/validators';
const touchMap = new WeakMap();

export default {
  data() {
    return {
      icons: require('@/assets/images/icons.svg'),
      email: '',
      password: '',
      isLoading: null,
    };
  },
  validations: {
    email: { required, email },
    password: { required },
  },
  computed: {
    authMessage() {
      return this.$store.getters['auth/authMessage'];
    },
    successfulAuth() {
      return this.$store.getters['auth/successfulAuth'];
    },
    isAuthenticating() {
      return this.$store.getters['auth/isAuthenticating'];
    },
  },
  methods: {
    ...mapMutations({
      toggleLoginModal: 'TOGGLE_LOGIN_MODAL',
      toggleRegisterModal: 'TOGGLE_REGISTER_MODAL',
    }),

    delayTouch($v) {
      $v.$reset();
      if (touchMap.has($v)) {
        clearTimeout(touchMap.get($v));
      }
      touchMap.set($v, setTimeout($v.$touch, 1000));
    },

    inputError(error) {
      return error || (this.authMessage && !this.successfulAuth);
    },

    switchToRegisterModal() {
      this.toggleLoginModal();
      this.toggleRegisterModal();
    },

    login() {
      this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password,
      });
      // this.$v.$reset();
    },
    // NOTE does the same as below
    // exit() {
    //   this.$router.push({ name: 'home' });
    //   this.$store.commit('auth/CLEAR_REGISTRATION_ERROR');
    // },
  },
  // REVIEW is this a good way to reset the authentication error message?
  beforeDestroy() {
    this.$store.commit('auth/CLEAR_AUTH_MESSAGE');
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

.login-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75rem;
  background-color: white;
  border-radius: 12px;

  padding: 5rem 6rem;
  box-shadow: 0 2rem 3rem rgba(0, 0, 0, 0.411);
  z-index: 1000;
  transition: all 0.5s;

  .btn--close-modal {
    font-family: inherit;
    color: #6c757d;
    position: absolute;
    top: 0.5rem;
    right: 1.6rem;
    font-size: 3.5rem;
    cursor: pointer;
    border: none;
    background: none;
  }

  .form-floating {
    color: #78818a;
    font-size: 14px;
    font-weight: 500;

    input {
      font-family: Noto Sans, sans-serif;
    }
  }

  .form-control {
    font-size: 14px;
    font-weight: 500;
    height: 43px;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background-color: #fcfcfb;
  }

  .form-control:focus {
    border-color: rgba(0, 0, 0, 0.2);
    border-width: 0.5px;
    box-shadow: none;
  }

  .form-group--input-error {
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid red;
  }

  .btn--submit {
    width: 100%;
    min-height: 35px;
    padding: 5px 10px;
    margin-top: 20px;
    border-radius: 6px;

    .icon {
      height: 2.5rem;
      width: 2.5rem;
      fill: white;
      outline: white;
      stroke: white;
      stroke-width: 1px;
    }

    span {
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }

  .modal-content {
    max-width: 280px;
    margin-left: 40px;
  }

  .modal-header {
    // max-width: 40rem;
    // display: flex;
    margin-bottom: 30px;
    p {
      font-size: 2.2rem;
      line-height: 1.5;
      font-weight: 600;
    }
  }

  .error {
    margin: 2px 0 0 8px;
    font-size: 1.5rem;
    color: #d30000;
  }

  .auth-message {
    margin: 5px 0;
    font-size: 1.5rem;
    color: #287eff;
  }

  .auth-error-message {
    margin: 5px 0;
    font-size: 1.5rem;
    color: #d30000;
  }

  .bottom-text {
    margin-top: 12px;
    font-family: Noto Sans, sans-serif;
    font-size: 13px;

    .bottom-link {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      line-height: 24px;
      text-transform: uppercase;
      color: #0079d3;
      text-decoration: none;
    }
  }
}
</style>
