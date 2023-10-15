import { ref } from "vue";
import { auth } from "../firebase/config"
import { createUserWithEmailAndPassword } from "firebase/auth";

let errorMsg = ref(null);
let createAccount = async (email, password) => {
    try {
        let response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (!response) {
          throw new Error("Couldn't create a new user account");
        }
        console.log(response);
        errorMsg.value = '';
        return response.user.reloadUserInfo.localId;
      } catch (error) {
        console.log(error.message);
        errorMsg.value = error.message;
      }
}
let signup = () => {
    return {errorMsg, createAccount}
}

export default signup;