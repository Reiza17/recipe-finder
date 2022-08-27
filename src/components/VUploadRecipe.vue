<template>
  <div>
    <div @click="toggleUploadRecipeModal" class="overlay"></div>
    <div class="add-recipe-window">
      <button @click="toggleUploadRecipeModal" class="btn--close-modal">
        &times;
      </button>
      <form @submit.prevent="submitForm(formData)" class="upload">
        <div class="upload__column">
          <h3 class="upload__heading">Recipe data</h3>
          <label>Title</label>
          <input v-model="formData.title" name="title" type="text" />
          <label>URL</label>
          <input v-model="formData.source_url" name="source_url" type="text" />
          <label>Image URL</label>
          <input v-model="formData.image_url" name="image" type="text" />
          <label>Publisher</label>
          <input v-model="formData.publisher" name="publisher" type="text" />
          <label>Prep time</label>
          <input
            v-model="formData.cooking_time"
            name="cooking_time"
            type="number"
          />
          <label>Servings</label>
          <input v-model="formData.servings" name="servings" type="number" />
        </div>

        <div class="upload__column">
          <h3 class="upload__heading">Ingredients</h3>
          <div
            v-for="(ingredient, index) of formData.ingredients"
            :key="index + 1"
          >
            <label>Ingredient {{ index + 1 }}</label>
            <input
              v-model="ingredient.quantity"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="quantity"
            />
            <input v-model="ingredient.unit" type="text" placeholder="unit" />
            <input
              v-model="ingredient.description"
              type="text"
              placeholder="description"
            />
          </div>
          <!-- <label>Ingredient 2</label>
          <input
            value="1,,Avocado"
            type="text"
            name="ingredient-2"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 3</label>
          <input
            value=",,salt"
            type="text"
            name="ingredient-3"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 4</label>
          <input
            type="text"
            name="ingredient-4"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 5</label>
          <input
            type="text"
            name="ingredient-5"
            placeholder="Format: 'Quantity,Unit,Description'"
          />
          <label>Ingredient 6</label>
          <input
            type="text"
            name="ingredient-6"
            placeholder="Format: 'Quantity,Unit,Description'"
          /> -->
        </div>

        <button class="btn upload__btn">
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
import { mapMutations } from 'vuex';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import uniqid from 'uniqid';

export default {
  name: 'VUploadRecipe',

  setup() {
    return { v$: useVuelidate() };
  },

  data() {
    return {
      icons: require('@/assets/images/icons.svg'),
      // isSubmitted: false,
      formData: {
        // submittedByUser: true,
        id: uniqid(),
        title: 'TEST17',
        publisher: 'TEST17',
        source_url:
          'https://www.closetcooking.com/chicken-fajita-grilled-cheese/',
        image_url:
          'https://images.unsplash.com/photo-1583224994076-ae951d019af7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        servings: 23,
        cooking_time: 23,
        ingredients: [
          { quantity: 0.5, unit: 'kg', description: 'Rice' },
          { quantity: 0.5, unit: 'kg', description: 'Rice' },
          { quantity: 0.5, unit: 'kg', description: 'Rice' },
          { quantity: 0.5, unit: 'kg', description: 'Rice' },
          { quantity: 0.5, unit: 'kg', description: 'Rice' },
          { quantity: 0.5, unit: 'kg', description: 'Rice' },
        ],
      },
    };
  },
  validations() {
    return {
      formData: {
        title: { required },
        publisher: { required },
        source_url: { required },
        image_url: { required },
        servings: { required },
        cooking_time: { required },
        ingredients: [
          {
            quantity: { required },
            unit: { required },
            description: { required },
          },
          // { quantity: 0.5, unit: 'kg', description: 'Rice' },
          // { quantity: 0.5, unit: 'kg', description: 'Rice' },
          // { quantity: 0.5, unit: 'kg', description: 'Rice' },
          // { quantity: 0.5, unit: 'kg', description: 'Rice' },
          // { quantity: 0.5, unit: 'kg', description: 'Rice' },
        ],
      },
    };
  },

  methods: {
    ...mapMutations({ toggleUploadRecipeModal: 'TOGGLE_UPLOAD_RECIPE_MODAL' }),

    async submitForm(data) {
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return console.log(this.v$.$errors);
      console.log('SUCCESS!');
      console.log(this.formData);
      this.$store.dispatch('addUserRecipe', data);
    },

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
  }
}
</style>
