<template>
  <div>
    <!-- Original version: -->
    <!-- <div
      @click="
        $router.push({ name: 'home'})
      "
      class="overlay"
    ></div> -->
    <!-- <div
      @click="
        $router.push({ name: 'recipe', params: { id: $route.params.id } })
      "
      class="overlay"
    ></div> -->
    <div @click="toggleUploadRecipeModal" class="overlay"></div>
    <div class="add-recipe-window">
      <button @click="toggleUploadRecipeModal" class="btn--close-modal">
        &times;
      </button>
      <form @submit.prevent="submitForm" class="upload">
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>

          <label>Title</label>
          <div class="upload__field">
            <input
              v-model.trim="formData.title"
              name="title"
              type="text"
              @blur="$v.formData.title.$touch"
            />
            <!-- NOTE Alternatively, could show  errors only after the form is submitted, rather than right after a field is modified:  -->
            <!-- <p v-if="formErrorsExist" class="upload__error"> -->
            <p v-if="$v.formData.title.$error" class="upload__error">
              <span v-if="!$v.formData.title.required"
                >This field is required</span
              >
            </p>
          </div>

          <label>URL</label>
          <div class="upload__field">
            <input
              v-model.trim="formData.source_url"
              name="source_url"
              type="text"
              @blur="$v.formData.source_url.$touch"
            />
            <p v-if="$v.formData.source_url.$error" class="upload__error">
              <span v-if="!$v.formData.source_url.required"
                >This field is required</span
              >
              <span v-if="!$v.formData.source_url.url"
                >Please enter a valid URL</span
              >
              <!-- TODO implement duplicate validation -->
              <!-- <span v-if="....backend source_url duplicate found"
              >This url is already being used for an existing recipe: (link to it)</span
            > -->
            </p>
          </div>

          <label>Image URL</label>
          <div class="upload__field">
            <input
              v-model.trim="formData.image_url"
              name="image"
              type="text"
              @blur="$v.formData.image_url.$touch"
            />
            <p v-if="$v.formData.image_url.$error" class="upload__error">
              <span v-if="!$v.formData.image_url.required"
                >This field is required</span
              >
              <span v-if="!$v.formData.image_url.url"
                >Please enter a valid URL</span
              >
            </p>
          </div>

          <label>Publisher</label>
          <div class="upload__field">
            <input
              v-model.trim="formData.publisher"
              name="publisher"
              type="text"
              @blur="$v.formData.publisher.$touch"
            />
            <p v-if="$v.formData.publisher.$error" class="upload__error">
              <span v-if="!$v.formData.publisher.required"
                >This field is required</span
              >
            </p>
          </div>

          <label>Prep time</label>
          <div class="upload__field">
            <input
              v-model.trim="formData.cooking_time"
              name="cooking_time"
              type="number"
              min="1"
              oninput="this.value = Math.abs(this.value) > 0 ? Math.abs(this.value) : null"
              @blur="$v.formData.cooking_time.$touch"
            />
            <p v-if="$v.formData.cooking_time.$error" class="upload__error">
              <span v-if="!$v.formData.cooking_time.required"
                >This field is required</span
              >
            </p>
          </div>

          <label>Servings</label>
          <div class="upload__field">
            <input
              v-model.trim="formData.servings"
              name="servings"
              type="number"
              min="1"
              oninput="this.value = Math.abs(this.value) > 0 ? Math.abs(this.value) : null"
              @blur="$v.formData.servings.$touch"
            />
            <p v-if="$v.formData.servings.$error" class="upload__error">
              <span v-if="!$v.formData.servings.required"
                >This field is required</span
              >
            </p>
          </div>
        </div>

        <!-- NOTE Component method for validating nested collection -->
        <!-- <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <VUploadRecipeIngredients
            v-for="(ingredient, index) of formData.ingredients"
            :ingredient="ingredient"
            :index="index"
            :key="ingredient.id"
            :formData="formData"
            @updateQuantity="ingredient.quantity = $event"
          />
          <button @click.prevent="addIngredient">Add ingredient</button>
        </div> -->

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <div
            v-for="(ingredient, index) of $v.formData.ingredients.$each.$iter"
            :key="ingredient.id"
          >
            <label>Ingredient {{ +index + 1 }}</label>
            <input
              v-model.trim="ingredient.quantity.$model"
              @blur="ingredient.quantity.$touch"
              type="number"
              step="any"
              min="0.01"
              placeholder="quantity"
              name="ingredient_quantity"
            />
            <!-- NOTE the $error condition is necessary because it only triggers if there's an error AND the field has been touched. Without it, errors will be shown under each field of a newly added ingredient, as they're empty by default. -->
            <p v-if="ingredient.quantity.$error" class="upload__error">
              <span v-if="!ingredient.quantity.required">
                Enter a quantity (e.g. 3).</span
              >
            </p>

            <input
              v-model.trim="ingredient.unit.$model"
              @blur="ingredient.unit.$touch"
              type="text"
              placeholder="unit"
              name="ingredient_unit"
            />
            <p v-if="ingredient.unit.$error" class="upload__error">
              <span v-if="!ingredient.unit.required">
                Enter a unit (e.g. cup/kg/slices).</span
              >
            </p>

            <input
              v-model.trim="ingredient.description.$model"
              @blur="ingredient.description.$touch"
              type="text"
              placeholder="description"
              name="ingredient_description"
            />
            <p v-if="ingredient.description.$error" class="upload__error">
              <span v-if="!ingredient.description.required">
                Enter a description (e.g. sugar/rice/cheese).</span
              >
            </p>

            <!-- NOTE need prevent default on click events for removing and adding ingredients, as otherwise they would trigger the form submission. Also, need type="button" attribute, or pressing Enter will trigger this method. -->
            <button
              type="button"
              v-if="formData.ingredients.length > 1"
              @click.prevent="removeIngredient(ingredient.$model)"
            >
              Remove ingredient
            </button>
          </div>
          <button type="button" @click.prevent="addIngredient">
            Add ingredient
          </button>
        </div>

        <button type="submit" :disabled="formSubmitted" class="btn upload__btn">
          <svg>
            <use :href="`${icons}#icon-upload-cloud`"></use>
          </svg>
          <span>Upload</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapMutations } = createNamespacedHelpers('home');
import { required, url, minLength } from 'vuelidate/lib/validators';
import uniqid from 'uniqid';

export default {
  name: 'VUploadRecipe',

  data() {
    return {
      icons: require('@/assets/images/icons.svg'),
      // isSubmitted: false,
      // uiState: 'submit not clicked',
      formSubmitted: false,
      // NOTE For alternative way to display errors
      // formErrorsExist: false,
      // formEmpty: true,
      formData: {
        id: uniqid(),
        user_generated: true,
        title: 'TEST RECIPE',
        publisher: 'TEST17',
        source_url:
          'https://www.closetcooking.com/chicken-fajita-grilled-cheese/',
        image_url:
          'https://images.unsplash.com/photo-1583224994076-ae951d019af7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        servings: 2,
        cooking_time: 25,
        ingredients: [
          // { quantity: null, unit: null, description: null, id: uniqid() },
          { quantity: 1, unit: 'cup', description: 'sugar', id: uniqid() },
          { quantity: 0.5, unit: 'kg', description: 'rice', id: uniqid() },
          {
            quantity: 1,
            unit: 'tsp',
            description: 'coriander seeds',
            id: uniqid(),
          },
          { quantity: 50, unit: 'oz', description: 'butter', id: uniqid() },
          // { quantity: 2, unit: 'free-range', description: 'eggs', id: uniqid() },
          // { quantity: 2, unit: 'pieces', description: 'bread', id: uniqid() },
          // { quantity: 1, unit: 'cup', description: 'grated romano cheese', id: uniqid() },
        ],
      },
    };
  },
  validations: {
    formData: {
      title: { required },
      publisher: { required },
      source_url: { required, url },
      image_url: { required, url },
      servings: { required }, // minValue
      cooking_time: { required }, // minValue
      ingredients: {
        required,
        minLength: minLength(1),
        $each: {
          quantity: { required }, // minValue
          unit: { required },
          description: { required },
        },
      },
      date_created: '',
    },
  },

  methods: {
    ...mapMutations({ toggleUploadRecipeModal: 'TOGGLE_UPLOAD_RECIPE_MODAL' }),

    addIngredient() {
      this.formData.ingredients.push({
        quantity: '',
        unit: '',
        description: '',
        id: uniqid(),
      });
    },

    removeIngredient(ing) {
      const ingredientIndex = this.formData.ingredients.findIndex(
        ele => ele.id === ing.id
      );
      this.formData.ingredients.splice(ingredientIndex, 1);
    },

    async submitForm() {
      // is loading
      try {
        // const isFormCorrect = await this.$v.$validate();
        // is not loading
        this.formSubmitted = true;
        this.$v.$touch();
        if (this.$v.$invalid) {
          // NOTE For alternative way to display errors
          // this.formErrorsExist = true;
          throw Error('Failed client-side validation');
        }
        console.log('Passed client-side validation!');
        // TODO start loading bar or spinner
        this.formData.date_created = Date.now();

        await this.$store.dispatch('home/uploadUserRecipe', {
          recipe: this.formData,
          id: this.formData.id,
        });
        // TODO end loading bar or spinner
        // TODO successful upload toast
      } catch (err) {
        this.formSubmitted = false;
        console.log(err);
      }
    },

    confirmStayInDirtyForm() {
      return this.$v.formData.$anyDirty && !this.confirmLeaveDirtyForm();
    },

    confirmLeaveDirtyForm() {
      return window.confirm(
        '⚠ You have unsaved changes. Do you really want to leave?'
      );
    },

    checkIfStayInDirtyForm(e) {
      if (this.confirmStayInDirtyForm()) {
        // NOTE default message is 'Changes you made may not be saved', and is unchangeable
        e.returnValue = '';
      }
    },
  },

  beforeRouteLeave(to, from, next) {
    if (!this.formSubmitted && this.confirmStayInDirtyForm()) {
      next(false);
    } else {
      next();
    }
  },

  created() {
    window.addEventListener('beforeunload', this.checkIfStayInDirtyForm);
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.checkIfStayInDirtyForm);
  },

  // NOTE below watcher could be useful if I want to alter a variable's value depending on changes in anyDirty
  // watch: {
  //   '$v.formData.$anyDirty': {
  //     handler() {
  //       console.log('change detected! ');
  //     },
  //   },
  // },

  // beforeRouteLeave(to, from, next) {
  //   if (!this.formSubmitted && this.$v.formData.$anyDirty) {
  //     let confirmLeaveDirtyForm = window.confirm('Close page without saving data?');
  //     if (confirmLeaveDirtyForm) {
  //       this.canceledFormSubmit = true;
  //       next();
  //     } else {
  //       next(from);
  //     }
  //   }
  //   next();
  // },

  // submitForm() {
  //   db.collection('data')
  //     .add(JSON.stringify(this.formData))
  //     .then(() => {
  //       alert('Recipe successfully created!');
  //       // this.user.name = '';
  //       // this.user.email = '';
  //       // this.user.phone = '';
  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // },
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
  backdrop-filter: blur(4px);
  z-index: 100;
  transition: all 0.5s;
}

.add-recipe-window {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100rem;
  background-color: white;
  border-radius: 9px;

  padding: 5rem 6rem;
  box-shadow: 0 4rem 6rem rgba(0, 0, 0, 0.25);
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
}

.upload {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem 6rem;

  &__column {
    display: grid;
    grid-template-columns: 1fr 2.8fr;
    align-items: center;
    gap: 1.5rem;

    & label {
      font-size: 1.5rem;
      font-weight: 600;
      color: inherit;
    }

    & input {
      font-size: 1.5rem;
      padding: 0.8rem 1rem;
      border: 1px solid #ddd;
      border-radius: 0.5rem;
      transition: all 0.2s;

      &::placeholder {
        color: $color-grey-light-3;
      }

      &:focus {
        outline: none;
        border: 1px solid $color-primary;
        background-color: $color-grey-light-1;
      }
    }

    & button {
      grid-column: 1 / span 2;
      justify-self: center;
      margin-top: 1rem;
    }
  }

  &__heading {
    font-size: 2.25rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 1rem;
    grid-column: 1/-1;
  }

  &__btn {
    grid-column: 1 / -1;
    justify-self: center;
    padding: 1.5rem 4rem;
  }

  &__error {
    color: red;
    font-size: 12px;
    position: absolute;
    // text-transform: uppercase;
  }

  &__field {
    position: relative;
    // padding-bottom: 30px;
    // display: flex;
  }
}
</style>
