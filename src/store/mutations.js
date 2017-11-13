import * as types from './mutation-types'
import util from '../common/util'

const mutations = {
  [types.SET_MENU_LIST](state, data) { 
    state.menu = data 
  }
}

export default mutations