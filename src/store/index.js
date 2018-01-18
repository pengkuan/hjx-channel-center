import Vue from 'vue'
import Vuex from 'vuex'
import heavyDate from './modules/heavyDate'
import channel from './modules/channel'

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
        }
    }
})
