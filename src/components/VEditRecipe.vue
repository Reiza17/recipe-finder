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
    <div @click="toggleEditRecipeModal" class="overlay"></div>
    <div class="add-recipe-window d-flex">
      <button @click="toggleEditRecipeModal" class="btn--close-modal">
        &times;
      </button>
      <form @submit.prevent="submitForm" class="upload">
        <div
          class="recipe-data border-bottom border-danger"
          style="--bs-border-opacity: 0.5"
        >
          <h3 class="upload__heading">Recipe data</h3>

          <div class="row">
            <div class="col">
              <!-- <div class="upload__field"> -->
              <div class="form-floating recipe-field">
                <input
                  v-model.trim="formData.title"
                  @blur="$v.formData.title.$touch"
                  @input="$v.formData.title.$reset()"
                  name="title"
                  type="text"
                  class="form-control"
                  :class="{
                    'form-group--input-error': $v.formData.title.$error,
                  }"
                  id="floatingTitle"
                  placeholder="Title"
                />
                <!-- NOTE Alternatively, could show  errors only after the form is submitted, rather than right after a field is modified:  -->
                <!-- <p v-if="formErrorsExist" class="upload__error"> -->
                <label for="floatingTitle">Title</label>
                <p v-if="!$v.formData.title.$error" class="form-helper">
                  E.g. Cheddar Bacon Hamburger
                </p>
                <p v-if="$v.formData.title.$error" class="upload__error">
                  <span v-if="!$v.formData.title.required"
                    >This field is required</span
                  >
                </p>
              </div>
            </div>

            <div class="col">
              <div class="form-floating recipe-field">
                <input
                  v-model.trim="formData.source_url"
                  @blur="$v.formData.source_url.$touch"
                  @input="$v.formData.source_url.$reset()"
                  name="source_url"
                  type="text"
                  class="form-control"
                  :class="{
                    'form-group--input-error': $v.formData.source_url.$error,
                  }"
                  id="floatingSource"
                  placeholder="https://www.example.com"
                />
                <label for="floatingSource">URL</label>
                <p v-if="!$v.formData.source_url.$error" class="form-helper">
                  E.g. https://allrecipes.com/recipe/cheddar-bacon-hamburgers/
                </p>
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
            </div>
          </div>

          <div class="row">
            <div class="col">
              <div class="form-floating recipe-field">
                <input
                  v-model.trim="formData.publisher"
                  @blur="$v.formData.publisher.$touch"
                  @input="$v.formData.publisher.$reset()"
                  name="publisher"
                  type="text"
                  class="form-control"
                  :class="{
                    'form-group--input-error': $v.formData.publisher.$error,
                  }"
                  id="floatingPublisher"
                  placeholder="Publisher"
                />
                <label for="floatingPublisher">Publisher</label>
                <p v-if="!$v.formData.publisher.$error" class="form-helper">
                  E.g. All Recipes
                </p>
                <p v-if="$v.formData.publisher.$error" class="upload__error">
                  <span v-if="!$v.formData.publisher.required"
                    >This field is required</span
                  >
                </p>
              </div>
            </div>
            <div class="col">
              <!-- <div class="upload__field"> -->
              <div class="form-floating recipe-field">
                <input
                  v-model.trim="formData.image_url"
                  @blur="$v.formData.image_url.$touch"
                  @input="$v.formData.image_url.$reset()"
                  name="image"
                  type="text"
                  class="form-control"
                  :class="{
                    'form-group--input-error': $v.formData.image_url.$error,
                  }"
                  id="floatingImageURL"
                  placeholder="https://www.example.com"
                />
                <!-- NOTE Alternatively, could show  errors only after the form is submitted, rather than right after a field is modified:  -->
                <!-- <p v-if="formErrorsExist" class="upload__error"> -->
                <label for="floatingImageURL">Image URL</label>
                <p v-if="!$v.formData.image_url.$error" class="form-helper">
                  E.g. https://images.unsplash.com/photo-1553979459-d2229ba7433b
                </p>
                <p v-if="$v.formData.image_url.$error" class="upload__error">
                  <span v-if="!$v.formData.image_url.required"
                    >This field is required</span
                  >
                  <span v-if="!$v.formData.image_url.url"
                    >Please enter a valid URL</span
                  >
                </p>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <!-- <div class="upload__field"> -->
              <div class="form-floating recipe-field">
                <input
                  v-model.trim="formData.cooking_time"
                  min="1"
                  oninput="this.value = Math.abs(this.value) > 0 ? Math.abs(this.value) : null"
                  @blur="$v.formData.cooking_time.$touch"
                  @input="$v.formData.cooking_time.$reset()"
                  name="cooking_time"
                  type="number"
                  class="form-control"
                  :class="{
                    'form-group--input-error': $v.formData.cooking_time.$error,
                  }"
                  id="floatingCookingTime"
                  placeholder="35"
                />
                <!-- NOTE Alternatively, could show  errors only after the form is submitted, rather than right after a field is modified:  -->
                <!-- <p v-if="formErrorsExist" class="upload__error"> -->
                <label for="floatingCookingTime">Prep time</label>
                <p v-if="!$v.formData.cooking_time.$error" class="form-helper">
                  E.g. 25
                </p>
                <p v-if="$v.formData.cooking_time.$error" class="upload__error">
                  <span v-if="!$v.formData.cooking_time.required"
                    >This field is required</span
                  >
                </p>
              </div>
            </div>
            <div class="col">
              <div class="form-floating recipe-field">
                <input
                  v-model.trim="formData.servings"
                  min="1"
                  oninput="this.value = Math.abs(this.value) > 0 ? Math.abs(this.value) : null"
                  @blur="$v.formData.servings.$touch"
                  @input="$v.formData.servings.$reset()"
                  name="servings"
                  type="number"
                  class="form-control"
                  :class="{
                    'form-group--input-error': $v.formData.servings.$error,
                  }"
                  id="floatingServings"
                  placeholder="4"
                />
                <label for="floatingServings">Servings</label>
                <p v-if="!$v.formData.servings.$error" class="form-helper">
                  E.g. 4
                </p>
                <p v-if="$v.formData.servings.$error" class="upload__error">
                  <span v-if="!$v.formData.servings.required"
                    >This field is required</span
                  >
                </p>
              </div>
            </div>
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

        <div class="ingredients">
          <div class="ingredients-heading">
            <h3 class="upload__heading">Ingredients</h3>
            <button
              class="btn btn-success add-ingredient"
              type="button"
              @click.prevent="addIngredient"
            >
              <!-- <span class="me-2" style="font-weight: 800">+</span> -->
              <svg>
                <use :href="`${icons}#icon-add-circle-fill`"></use>
              </svg>
              <span>Add Ingredient</span>
            </button>
          </div>
          <div
            class="d-flex row gap-0"
            v-for="(ingredient, index) of $v.formData.ingredients.$each.$iter"
            :key="ingredient.id"
          >
            <label class="ingredient-label">Ingredient {{ +index + 1 }}</label>

            <div class="col-4">
              <div class="form-floating">
                <input
                  v-model.trim="ingredient.quantity.$model"
                  @blur="ingredient.quantity.$touch"
                  @input="ingredient.quantity.$reset()"
                  name="ingredient_quantity"
                  type="number"
                  class="form-control"
                  :class="{
                    'form-group--input-error': ingredient.quantity.$error,
                  }"
                  id="floatingIngQuantity"
                  placeholder="ingredient"
                />
                <label for="floatingIngQuantity">Quantity</label>
                <p v-if="!ingredient.quantity.$error" class="form-helper">
                  E.g. 2
                </p>
                <p v-if="ingredient.quantity.$error" class="upload__error">
                  <span v-if="!ingredient.quantity.required">Required</span>
                </p>
              </div>
            </div>

            <div class="col-4">
              <div class="form-floating">
                <input
                  v-model.trim="ingredient.unit.$model"
                  @blur="ingredient.unit.$touch"
                  @input="ingredient.unit.$reset()"
                  name="ingredient_unit"
                  type="text"
                  class="form-control"
                  :class="{
                    'form-group--input-error': ingredient.unit.$error,
                  }"
                  id="floatingIngUnit"
                  placeholder="unit"
                />
                <label for="floatingIngUnit">Unit</label>
                <p
                  v-if="!ingredient.unit.$error"
                  class="form-helper text-wrap overflow-visible"
                >
                  E.g. cup/kg/slices
                </p>
                <p v-if="ingredient.unit.$error" class="upload__error">
                  <span v-if="!ingredient.unit.required">Required</span>
                </p>
              </div>
            </div>

            <div class="col-7">
              <div class="form-floating">
                <input
                  v-model.trim="ingredient.description.$model"
                  @blur="ingredient.description.$touch"
                  @input="ingredient.description.$reset()"
                  name="ingredient_description"
                  type="text"
                  class="form-control"
                  :class="{
                    'form-group--input-error': ingredient.description.$error,
                  }"
                  id="floatingIngDescription"
                  placeholder="description"
                />
                <label for="floatingIngDescription">Description</label>
                <p v-if="!ingredient.description.$error" class="form-helper">
                  E.g. sugar/rice/cheese
                </p>
                <p v-if="ingredient.description.$error" class="upload__error">
                  <span v-if="!ingredient.description.required">Required</span>
                </p>
              </div>
            </div>

            <!-- NOTE need prevent default on click events for removing and adding ingredients, as otherwise they would trigger the form submission. Also, need type="button" attribute, or pressing Enter will trigger this method. -->
            <div class="col-1">
              <button
                class="remove-ingredient"
                type="button"
                v-if="formData.ingredients.length > 1"
                @click.prevent="removeIngredient(ingredient.$model)"
              >
                <!-- <span>×</span> -->
                <svg>
                  <use :href="`${icons}#icon-remove-ingredient`"></use>
                </svg>
              </button>
            </div>
          </div>
          <!-- <button
            class="btn btn-success add-ingredient"
            type="button"
            @click.prevent="addIngredient"
          >
            <span>Add ingredient</span>
          </button> -->
        </div>

        <button
          type="submit"
          :disabled="formSubmitted"
          class="btn btn-outline-success upload__btn"
        >
          <span
            class="spinner-border"
            role="status"
            aria-hidden="true"
            v-if="uploadingRecipe"
          ></span>
          <svg v-else-if="successfulUpload" class="icon">
            <use :href="`${icons}#icon-check`"></use>
          </svg>
          <div v-else class="align-items-center d-flex">
            <svg class="icon">
              <use :href="`${icons}#icon-upload-cloud`"></use>
            </svg>
            <span>Submit</span>
          </div>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapMutations, mapGetters } = createNamespacedHelpers('home');
import { required, url, minLength } from 'vuelidate/lib/validators';
import uniqid from 'uniqid';
import { startCase, lowerCase } from 'lodash';
import _ from 'lodash';

export default {
  name: 'VEditRecipe',

  data() {
    return {
      icons: require('@/assets/images/icons.svg'),
      // isSubmitted: false,
      // uiState: 'submit not clicked',
      formSubmitted: false,
      // NOTE For alternative way to display errors
      // formErrorsExist: false,
      // formEmpty: true,
      formData: null,
    };
  },
  // watch: {
  //   recipe: function(recipe) {
  //     this.formData = { ...recipe}
  //   }
  // },
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
  computed: {
    ...mapGetters({
      recipe: 'recipe',
      uploadingRecipe: 'uploadingRecipe',
      successfulUpload: 'toastMessage',
    }),
  },
  methods: {
    ...mapMutations({ toggleEditRecipeModal: 'TOGGLE_EDIT_USER_RECIPE_MODAL' }),

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
        this.formData.date_modified = Date.now();
        this.formData.title = startCase(lowerCase(this.formData.title));

        await this.$store.dispatch('home/editUserRecipe', this.formData);
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
    // NOTE this allows cancelling the edit to restore the original recipe
    this.formData = _.cloneDeep(this.recipe);
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
  // height: 100rem;
  // width: 100rem;
  flex: 1 1 100px;
  min-width: 372px;
  max-width: 928px;
  width: 100%;
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
  // display: grid;
  // grid-template-columns: 1fr 1fr;
  // gap: 4rem 6rem;
  // display: flex;
  // flex-direction: column;
  flex: 1 1 100px;

  .recipe-data {
    padding-bottom: 10px;
    margin-bottom: 25px;
  }

  .ingredients {
    margin-bottom: 60px;
  }

  .row {
    column-gap: 10px;
    row-gap: 30px;
    display: flex;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .form-floating {
    // min-width: 218px;
    color: #78818a;
    font-size: 14px;
    font-weight: 500;

    input {
      font-family: Noto Sans, sans-serif;
    }

    label {
      padding: 1rem 0.75rem;
    }
  }

  .recipe-field {
    min-width: 218px;
  }

  .ingredients-heading {
    display: flex;
    justify-content: space-between;
  }

  .ingredient-label {
    margin-bottom: 3px;
    font-size: 14px;
    font-weight: 500;
  }

  .form-control {
    font-size: 14px;
    font-weight: 500;
    height: 43px;
    width: 100%;
    border-radius: 6px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    background-color: #fcfcfb;
    text-overflow: ellipsis;
  }

  .form-control:focus {
    border-color: rgba(0, 0, 0, 0.2);
    border-width: 0.5px;
    box-shadow: none;
  }
  .form-helper {
    font-weight: 400;
    font-size: 12px;
    margin-left: 1rem;
    position: absolute;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
  }

  .form-group--input-error {
    border-radius: 6px;
    border: 1px solid red;
  }

  label {
    margin-bottom: 0px;
  }

  // .remove-ingredient {
  //   font-size: 22px;
  //   width: 25px;
  //   height: 25px;
  //   border-radius: 0.5rem;
  //   align-items: center;
  //   justify-content: center;
  //   display: flex;

  //   span {
  //     font-weight: 700;
  //     align-self: center;
  //     margin-bottom: 4px;
  //   }
  // }

  .remove-ingredient {
    // background-image: $gradient;
    // background-color: white;
    // background-color: #efeff2;
    border: none;
    background: none;
    // border: 2px solid black;
    cursor: pointer;
    // height: 3.3rem;
    // width: 3.3rem;
    // margin-left: auto;
    // margin-right: 1.75rem;
    transition: all 0.2s;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      // transform: scale(1.07);
      svg {
        fill: rgb(172, 23, 28);
      }
    }

    svg {
      height: 3rem;
      width: 3rem;
      fill: rgba(213, 77, 82, 1);
    }
  }

  .add-ingredient {
    font-size: 14px;
    background-color: rgb(98, 184, 101);
    border: none;
    // width: 25px;
    // height: 25px;
    padding: 5px 15px;
    // margin: auto;
    border-radius: 0.5rem;
    align-items: center;
    justify-content: center;
    display: flex;
    column-gap: 7px;

    svg {
      height: 2.25rem;
      width: 2.25rem;
      fill: currentColor;
      // margin-right: 5px;
      overflow: visible;
      align-self: center;
    }

    span {
      font-weight: 500;
      align-self: center;
    }
  }

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
      justify-self: center;
      margin-top: 1rem;
    }
  }

  &__heading {
    font-size: 2.25rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 1.5rem;
    grid-column: 1/-1;
  }

  &__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem 4rem;
    margin: auto;

    width: 200px;
    min-height: 35px;
    padding: 5px 10px;
    margin-top: 20px;
    // border-radius: 6px;

    .icon {
      margin-right: 5px;
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

  &__error {
    color: red;
    font-size: 12px;
    position: absolute;
    margin-left: 1rem;
    // text-transform: uppercase;
  }

  &__field {
    position: relative;
    // padding-bottom: 30px;
    // display: flex;
  }
}
</style>
