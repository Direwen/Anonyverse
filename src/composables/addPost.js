import { ref } from "vue";
import {db} from "../firebase/config"
import { addDoc, collection } from "firebase/firestore";
import store from "../store";

let addPost = () => {
  let error = ref(null);
  let addDocument = async (dataToAdd) => {
    try {
      // Step 1 >>> Create the post document
      let firebaseCollection = collection(db, "anonyEntries");
      await addDoc(firebaseCollection, dataToAdd);
      console.log(">>>>>>> Post Added <<<<<<<<");
    } catch (err) {
      console.log("Error occured => ", err.message);
      error.value = err.message;
    }
  };
  
  return { error, addDocument };
};

export default addPost;
