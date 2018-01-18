import api from '@/api/index'
import * as types from '../mutation-types.js'

 
// initial state
const state = {
    score:[ //商户评分
        {id:'0',name:'S'},
        {id:'1',name:'A'},
        {id:'2',name:'B'},
        {id:'3',name:'C'},
        {id:'4',name:'D'}
    ],
    valuation:[//估价模型
        {id:'2',name:'2B估价模型'}
    ],
    payMethod:[//付款模式
        {id:'0',name:'垫付'},
        {id:'1',name:'预付'}
    ],
    status:[//合作状态
        {id:'1',name:'合作中'},
        {id:'2',name:'停止合作'}
    ]
}

// getters
const getters = {
    score: state => state.score,
    valuation: state => state.valuation,
    payMethod: state => state.payMethod,
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
