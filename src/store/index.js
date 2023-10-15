import { createStore } from "vuex";
import authMod from "./modules/authMod";
import postMod from "./modules/postMod";
import queryMod from "./modules/queryMod";

const store = createStore({
  modules: {
    authMod,
    postMod,
    queryMod
  },
  getters: {
    
  }
});

export default store;
