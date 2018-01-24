import api from '@/api/index'
import * as types from '../mutation-types.js'

 
// initial state
const state = {
    status:[//合作状态
        {id:'1',name:'合作中'},
        {id:'0',name:'停止合作'},
        // {id:'2',name:'待审批'},
        // {id:'3',name:'资料不全'}
    ],
    relatedStatus:[//门店关联状态
        {id:'1',name:'正常'},
        {id:'0',name:'异常'}
    ]

}

// getters
const getters = {
    status: state => state.status,
    relatedStatus: state => state.relatedStatus
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
