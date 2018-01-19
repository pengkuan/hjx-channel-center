import Vue from 'vue'
import Vuex from 'vuex'
import heavyDate from './modules/heavyDate'
import channel from './modules/channel'
import store from './modules/store'
import employee from './modules/employee'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        heavyDate:{
        	namespaced: true,
        	modules:[heavyDate]
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
