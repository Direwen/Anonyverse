import { ref } from "vue";

export default {
    namespaced: true,
    state:{
        isLogin: true,
        userInfo: null,
    },
    getters:{
        getLoginState(state){
            return state.isLogin;
        },
        getUID(state){
            return state.userInfo ? state.userInfo.uid : "No_UID";
        },
        getUserInfo(state){
            return state.userInfo ? state.userInfo : "No_User_Info";
        }
    },
    mutations:{
        changeSide(state){
            state.isLogin = !state.isLogin;
            console.log(state.isLogin);
        },
        setUserInfo(state, data){
            state.userInfo = data;
        }
    },
    actions:{
        changeSide({commit}){
            console.log("toggled state");
            commit("changeSide");
        },
        getUserInfo({commit}, data){
            commit('setUserInfo', data);
        },
        
    }
}