import Vue from 'vue'
import Vuex from 'vuex'
import commonData from './modules/commonData'
import channel from './modules/channel'
import store from './modules/store'
import employee from './modules/employee'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        commonData:{
        	namespaced: true,
        	modules:[commonData]
        },
        channel:{
        	namespaced: true,
        	modules:[channel]
        },
        store:{
            namespaced: true,
            modules:[store]
        },
        employee:{
            namespaced: true,
            modules:[employee]
        },
    }
})
