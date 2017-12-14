import Vue from 'vue'
import iView from 'iview'
import { router } from './router/index'
import store from './store'
import App from './app.vue'
import 'iview/dist/styles/iview.css'
import apis from './api/index'
import * as filters from './libs/filter'

// debugger
Vue.use(iView)
Vue.prototype.apis = apis

//载入Filter
Object.keys(filters.default).forEach(key => {
  Vue.filter(key, filters.default[key])
})

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
  mounted() {
    this.$store.commit('updateMenulist')
  }
})
