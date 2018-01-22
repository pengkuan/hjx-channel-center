// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import '@/assets/iconfont.css'
import '@/common/index.css'
import router from './router'
import store from './store'
import Config from '@/config/index.js'
import hjxHeader from '@/base/hjx_header'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype._Config = Config
Vue.component('hjxHeader',hjxHeader)

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
})
