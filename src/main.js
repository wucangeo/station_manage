import Vue from 'vue'
import iView from 'iview'
import { router } from './router/index'
import store from './store'
import App from './app.vue'
import 'iview/dist/styles/iview.css'
import apis from './api/index'

// debugger
Vue.use(iView)
// let apis = {}
// Object.keys(api.default).forEach(key => {
//   apis[key] = api.default[key]
// })
Vue.prototype.apis = apis

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
  mounted() {
    this.$store.commit('updateMenulist')
  }
})
