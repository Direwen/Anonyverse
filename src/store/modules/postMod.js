export default {
  namespaced: true,
  state: {
    notiState: null,
    notiStatus: false,
    show: false,
    popupMode: false,
    editMode: false,
    fullPostMode: false,
    tempPost: null,
    confirmMode: false,
    posts: [],
    loadingState: false,
    tags: [],
  },

  getters: {
    getNotiStatus(state) {
      return state.notiStatus;
    },
    getNotiState(state) {
      return state.notiState;
    },
    getNotiShow(state) {
      return state.show;
    },
    getPopupMode(state) {
      return state.popupMode;
    },
    getConfirmMode(state) {
      return state.confirmMode;
    },
    getEditMode(state) {
      return state.editMode;
    },
    getFullPostMode(state) {
      return state.fullPostMode;
    },
    getTempPost(state) {
      return state.tempPost;
    },
    getTempPostId(state) {
      return state.tempPost.id;
    },
    getTempPostContent(state) {
      return state.tempPost ? state.tempPost.content : "";
    },
    getTempPostTag(state) {
      return state.tempPost ? state.tempPost.tags : "";
    },
    getTempPostComment(state) {
      return state.tempPost ? state.tempPost.comments : "";
    },
    getPosts(state) {
      return state.posts ? state.posts : [];
    },
    getLoadingState(state) {
      return state.loadingState;
    },
    getTags(state){
      return state.tags;
    }
  },

  mutations: {
    setNoti(state, status) {
      state.notiStatus = status;
      state.notiState = state.notiStatus ? "Completed" : "Failed";
      state.show = true;
    },
    defaultNoti(state) {
      state.show = false;
      state.notiState = null;
      state.notiStatus = false;
    },
    openPopup(state, data) {
      state.popupMode = !state.popupMode;
      state.tempPost = data.post;
      if (data.mode === "FullPost") {
        state.fullPostMode = true;
      } else if (data.mode === "EditPost") {
        state.editMode = true;
      } else if (data.mode === "Comment") {
        state.commentMode = true;
      } else if (data.mode === "confirmDelete") {
        state.confirmMode = true;
      }
    },
    closePopup(state) {
      state.popupMode = false;
      state.editMode = false;
      state.fullPostMode = false;
      state.commentMode = false;
      state.confirmMode = false;
    },
    setValueToTempPost(state, post) {
      state.tempPost = post;
    },
    assignPosts(state, dataArr) {
      state.posts = dataArr;
    },
    setLoadingState(state, loading) {
      state.loadingState = loading;
    },
    setTags(state, data){
      state.tags = data;
    }
  },

  actions: {
    showNoti({ commit }, status) {
      commit("setNoti", status);

      setTimeout(() => {
        commit("defaultNoti");
      }, 3000);
    },
    openPopup({ commit }, data) {
      commit("openPopup", data);
    },
    closePopup({ commit }) {
      commit("closePopup");
    },
    setValueToTempPost({ commit }, data) {
      commit("setValueToTempPost", data);
    },
    setLoadingState({ commit }, loadingState) {
      commit("setLoadingState", loadingState);
    },
    setPosts({commit}, tempArr){
      commit("assignPosts", tempArr);
      //Step 1 >>> extract arrays of tags of each post
      let tempPosts = [];
      let tempTags = [];
      tempArr.forEach(post => {
        tempPosts.push({tags: new Set(post.tags), id: post.id});
      })
      //Step 2 >>> extract each tag from the array of tags and format it with post id
      tempPosts.forEach(post => {
        post.tags.forEach(tag => {
          let foundItem = tempTags.find(item => item.tag == tag.toLowerCase());
          if(foundItem){
            foundItem.postId.push(post.id);
          }else{
            tempTags.push({tag: tag.toLowerCase(), postId: [post.id]});
          }
        })
      })
      //Step 3 >>> Sort the array by the tag and Bubble sort Algorithm
      let tempVar, swappedFlag;
      for(let outerIndex = 0; outerIndex < tempTags.length - 2; outerIndex++){
        swappedFlag = false;
        for(let innerIndex = 0; innerIndex < tempTags.length - outerIndex - 1; innerIndex++){
          if(tempTags[innerIndex].tag > tempTags[innerIndex + 1].tag){
            tempVar = tempTags[innerIndex];
            tempTags[innerIndex] = tempTags[innerIndex + 1];
            tempTags[innerIndex + 1] = tempVar;
            swappedFlag = true;
          }
        }
        if(!swappedFlag) {
          break;
        }
      }
      //Step 4 >>> Set the data via commits
      commit("setTags", tempTags);
      
    },
  },
};
