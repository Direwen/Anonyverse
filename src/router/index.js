import { createMemoryHistory, createRouter, createWebHistory } from "vue-router"
import Authentication from "../views/Authentication.vue"
import Home from "../views/Home.vue"
import Newsfeed from "../views/Newsfeed.vue"
import UserProfile from "../views/UserProfile.vue"
import {auth} from "../firebase/config"


const routes = [
  {
    path: "/",
    name: "auth",
    component: Authentication,
    beforeEnter: (to, from, next) => {
      //check if the user is authenticated
      if(!auth.currentUser){
        //allow the user to access the authentication page
        next();
      }else{
        next({name: 'home'});
      }
      
    }
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    redirect: {name: 'newsfeed'},//to direct user to newsfeed even if he goes backwards from the home default page
    children: [
      // remove "/" from path will show base path name like "/home/profile/:uid"
      {
        path: 'newsfeed',//default child path 
        name: 'newsfeed',
        component: Newsfeed,
      },
      {
        path: 'profile/:uid',
        name: 'profile',
        component: UserProfile
      },
      
    ],
    beforeEnter: (to, from, next) => {
      //check if the user is authenticated
      if(auth.currentUser){
        //allow the user to access the full website
        next();
      }else{
        next({name: 'auth'});
      }
    },
  }
];

const router = createRouter({

  history: createWebHistory(),
  routes,
});

export default router;
