import api from '@/api/api'
import * as types from '../mutation-types'

// initial state
const state = {
    adds: [],
    channel:[]
}

// getters
const getters = {
    adds: state => state.adds,
    channel: state => state.channel
}

// actions
const actions = {
    async getAdds({ commit }) {
        if(state.adds.length == 0){
            let res = await api.getAddress({})
            commit(types.ADDRS_LIST,  res.data.address )
        }
    },
    async getChannel({ commit }) {
        if(state.channel.length == 0){
            let res = await api.getAllChannels({})
            commit(types.CHANNEL_LIST,  res.data.Relations )
        }
    },
}
// mutations
const mutations = {
    [types.ADDRS_LIST](state,  list ) {
        state.adds = list
    },
    [types.CHANNEL_LIST](state,  list ) {
        state.channel = list
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}
