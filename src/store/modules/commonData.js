import api from '@/api/api'
import * as types from '../mutation-types'

// initial state
const state = {
    adds: [],
    selectAddrSetting:{ //级联选择地址时的配置
        label:'strAreaName',
        value:'strAreaId',
        children:'areas'
    },
    pipeType: { //操作流水及备注对应各线ID
        s:'1',
        bd:'2',
        o:'3'
    },
    channel:[]
}

// getters
const getters = {
    adds: state => state.adds,
    selectAddrSetting: state => state.selectAddrSetting,
    pipeType: state => state.pipeType,
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
        list.forEach(item=>{ //级联选择地址时的配置（使数据字段整齐）
            item.strAreaName = item.strProvinceName
            item.strAreaId = item.strProvinceId
            item.areas = item.citys
            item.areas.forEach(option=>{
                option.strAreaName = option.strCityName
                option.strAreaId = option.strCityId
            })
        })
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
