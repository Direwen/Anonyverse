import { ref } from "vue";
import {auth} from "../firebase/config"
import { signInWithEmailAndPassword } from "firebase/auth";

let errMsg = ref('');

let loginAccount = async (email, password) => {
    try {
        let response = await signInWithEmailAndPassword(auth, email, password);
        if(!response){
          throw new Error("Couldn't login")
        }
        errMsg.value = '';
        // console.log(response.user.reloadUserInfo.localId);
        // return response.user.reloadUserInfo.localId;
    } catch (error) {
        errMsg.value = error.message;
      }
}

let signin = () => {
    return {errMsg, loginAccount}
}

export default signin;