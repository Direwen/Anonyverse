import { collection, orderBy, query, where } from "firebase/firestore";
import {db} from "../../firebase/config";

export default {
    namespaced: true,
    state: {
        collectionRef: collection(db, "anonyEntries"),
        searchMode: false,
        targetToSearch: null,
    },
    getters: {
        getQuery(state){
            let queryForSearchMode = query(state.collectionRef, where("tags", "array-contains", state.targetToSearch), orderBy("timestamp", "desc"));
            let queryForNormalMode = query(state.collectionRef, orderBy("timestamp", "desc"));
            return state.searchMode ? queryForSearchMode : queryForNormalMode;
        },
        getQueryForOwner(state, getters, rootState, rootGetters){
            return query(state.collectionRef, where("uid", "==", rootGetters["authMod/getUID"]), orderBy("timestamp", "desc"));
        },
        getSearchMode(state){
            return state.searchMode;
        },
        getCollectionRef(state){
            return state.collectionRef;
        }
        
    },
    mutations: {
        setQuery(state, target){
            state.targetToSearch = target;
            state.searchMode = true;
        },
        resetQuery(state){
            state.searchMode = false;
            state.targetToSearch = null;
        }
    },
    actions: {
        setQuery({commit}, target){
            commit("setQuery", target);
        },
        resetQuery({commit}){
            commit("resetQuery");
        },
    }
}