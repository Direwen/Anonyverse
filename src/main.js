import { createApp } from 'vue'
import router from './router'
import store from './store'
import './firebase/config'
import './style.css'
import App from './App.vue'
import {auth} from './firebase/config'
import { browserSessionPersistence } from 'firebase/auth'


//Setting session persistence which prevents users from logging out after refreshing
//browserSessionPersistence meaning => persist in the current session or tab, and will be cleared when the tab or window in which the user authenticated is closed
auth.setPersistence(browserSessionPersistence)
.then(() => {
    createApp(App)
    .use(router)
    .use(store)
    .mount('#app')
})
.catch((error) => {
    console.log("Session persistence Error => ", error.message);
})


