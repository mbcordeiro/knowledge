import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import './config/msg'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

require('axios').defaults.heders.common['Authorization'] = 'bearer gdhjgfgrgfsdujkflhKJSVFDHAFSJDGFUSDGFJHSDGFJHFDGHFHGH'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')