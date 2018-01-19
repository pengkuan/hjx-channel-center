import api from '@/api/index'
import * as types from '../mutation-types.js'

 
// initial state
const state = {
    status:[//合作状态
        {id:'1',name:'合作中'},
        {id:'0',name:'停止合作'}
    ]
}

// getters
const getters = {
    status: state => state.status
}

// actions
const actions = {

}

// mutations 
const mutations = {
    
}

export default {
    state,
    getters,
    actions,
    mutations
}
