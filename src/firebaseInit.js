import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// import { collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDUQ4ZRGiNm7PaiGAG__d341CK81xst_2s',
  authDomain: 'recipe-finder-f184b.firebaseapp.com',
  projectId: 'recipe-finder-f184b',
  storageBucket: 'recipe-finder-f184b.appspot.com',
  messagingSenderId: '227314776149',
  appId: '1:227314776149:web:5869b7b3477ece9c60bcdc',
  measurementId: 'G-E8SP7QN7BV',
};

// Initialize Firebase
export const fireStoreApp = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(fireStoreApp);

const auth = getAuth(fireStoreApp);

export { auth };

// export default {
//   data() {
//     return {
//       recipe: { test1: 2, test2: 3 },
//     };
//   },

//   methods: {
//     initializeFirebase() {
//       const firebaseConfig = {
//         apiKey: 'AIzaSyDUQ4ZRGiNm7PaiGAG__d341CK81xst_2s',
//         authDomain: 'recipe-finder-f184b.firebaseapp.com',
//         projectId: 'recipe-finder-f184b',
//         storageBucket: 'recipe-finder-f184b.appspot.com',
//         messagingSenderId: '227314776149',
//         appId: '1:227314776149:web:5869b7b3477ece9c60bcdc',
//         measurementId: 'G-E8SP7QN7BV',
//       };

//       // Initialize Firebase
//       this.app = initializeApp(firebaseConfig);

//       // Initialize Cloud Firestore and get a reference to the service
//       this.db = getFirestore(app);
//     },

//     async createRecipe(recipe) {
//       // return new Promise( (resolve, reject) => {
//       try {
//         const docRef = await addDoc(collection(db, 'recipes'), recipe);
//         console.log('Document written with ID: ', docRef.id);
//         // resolve(docRef)
//       } catch (e) {
//         console.error('Error adding document: ', e);
//         // reject(e)
//       }
//       // })
//     },

//     async renderRecipes() {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'recipes'));
//         querySnapshot.forEach(doc => {
//           console.log(`${doc.id} => ${doc.data()}`);
//         });
//       } catch (err) {
//         console.log(err);
//       }
//     },
//   },

//   created() {
//     this.createRecipe({ test1: 3, test2: 4 });
//     console.log('test');
//   },
// };

// // import firebaseService from 'where you put the file above`

// // renderRecipes({commit}) {
// //   const recipes = firebaseService.renderRecipes()
// //   //commit here to save recipes
// // }
