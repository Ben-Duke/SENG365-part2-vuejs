import Vue from 'vue';
import App from './App.vue';
import Home from './Home/Home.vue';
import Register from './Register/Register.vue';
import Dashboard from './Dashboard/DashBoard.vue';
import Venues from './Venues/Venues.vue';
import Venue from './Venues/Venue.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.use(BootstrapVue)
Vue.use(VueRouter);
Vue.use(VueResource);

Vue.http.options.emulateJSON = true

const routes = [{
        path:"/",
        component: Home
      },
      {
        path:"/register",
        component: Register
      },
      {
        path:"/dashboard",
        component: Dashboard
      },
      {
        path:"/venues",
        component: Venues
      },
      {
        path:"/venues/:id",
        component: Venue
      }
];

const router = new VueRouter ({
  routes : routes,
  mode : 'history'
});

new Vue({
  el: '#app',
  router : router,
  render: h => h(App)
})
