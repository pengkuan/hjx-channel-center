import axios from 'axios'
import originJsonp from 'jsonp'
// import qs from 'qs'
import router from '../router'
import Config from '../config/index'
import util from '@/common/util'


import { Message } from 'element-ui'

//POST传参序列化
axios.interceptors.request.use((config) => {
    // if(config.method  === 'post'){
    //     config.data = qs.stringify(config.data)
    // }
    return config
}, (error) => {
    return Promise.reject(error)
})

//返回状态判断
axios.interceptors.response.use((res) => {
    let _this = this
    if (res.status != 200) {

        return Promise.reject(res)
    }
    return res.data.body
}, (error) => {
    if (error.response) {

        Message({ message: error.response.data.body.retinfo, type: 'warning' })
        switch (error.response.status) {
            case 403: 
                if (Config.IS_NO_DEV) {
                    let host = encodeURIComponent(Config.RETURN_URL) 
                    window.location.href = Config.POWER_CENTER_LOGIN + '/login?system_id=' + Config.SYSTEM_HOME_ID + '&jump_url=' + host
                }
                break
        }
    }
    return Promise.reject(error)
})

export function fetch(Interface, params) {
    var resParams = {    
        "head": {        
            "version": "0.01",
            "msgtype": "request",
            "interface": Interface,
            "remark": ""    
        },
        "params": {        
            "system": "HJXMBA",
            'strOperatorId' : util.getCookie('userid'), //记录操作流水
            'strOperatorName' : util.getCookie('username') //记录操作流水
        }
    }
    for (var i in params) {
        resParams.params[i] = params[i]
    }
    return new Promise((resolve, reject) => {
        axios.post(Config.API + '/channel_org_interface', resParams)
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

function get_cookie(Name) {
    var search = Name + "=" //查询检索的值
    var returnvalue = ""; //返回值
    if (document.cookie.length > 0) {
        var sd = document.cookie.indexOf(search)
        if (sd != -1) {
            sd += search.length
            let end = document.cookie.indexOf(";", sd)
            if (end == -1)
                end = document.cookie.length
            //unescape() 函数可对通过 escape() 编码的字符串进行解码。
            returnvalue = unescape(document.cookie.substring(sd, end))
        }
    }
    return returnvalue
}
let Fusername, FuserId

export function crossDomain(Interface, params) {
    if (!Fusername) Fusername = get_cookie('username')
    if (!FuserId) FuserId = get_cookie('useruuid')
    var resParams = {    
        "head": {        
            "version": "0.01",
            "msgtype": "request",
            "interface": Interface,
            "remark": ""    
        },
        "params": {        
            "system": "HJXMBA",
            "login_user_id": FuserId,
            "login_token": "12345678911",
            "login_system_id": "1",
            "login_username": Fusername    
        }
    }
    for (var i in params) {
        resParams.params[i] = params[i]
    }
    return new Promise((resolve, reject) => {
        axios.post(Config.API_PHP + '/index/index', resParams)
            .then(response => {
                resolve(response)
            }, err => {
                reject(err)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

/* jsonp接口开始 */ 
export function jsonp(_interface, params) { 
    let url = `${Config.JSONP_URL}?type=jsonp`, 
        token = get_cookie('useruuid'),
        userid = get_cookie('userid') ,
        timestamps = Math.floor(new Date().getTime()/1000) + ''

    let resParams = {     
        "_head": {        
            "_version": "0.01",
            "_msgType": "request",
            "_timestamps": timestamps,
            "_interface": _interface,
            "_remark": "",    
        },
        "_param": { 
            "system":"test",          
            "userid": userid, 
            "token": token
        }
    }
    // 合并参数 
    resParams._param = Object.assign({}, resParams._param, params) 
    // 拼接参数,注意jsonp不能直接字符串化json,后台解析不了
    for (let i in resParams) { 
        for(let j in resParams[i] ) {
            // console.log(j,resParams[i][j]) 
            url += `&${i}[${j}]=${resParams[i][j]}` 
        }
    }  
    // url = `${url}&head[version]=0.01&head[msgtype]=request&head[interface]=newSystem&head[remark]=&params[system]=test&params[number]=12345678`   
    return new Promise((resolve, reject) => {
        originJsonp(url, {param: 'callback'}, (err, data) => {
            if (!err) {
                // 登录超时处理
                if (process.env.NODE_ENV == 'production') {
                    if (data._data._ret == '1' && data._data._errStr == '登录验证不通过') {
                        let host = encodeURIComponent(Config.RETURN_URL)
                        window.location.href = Config.POWER_CENTER_LOGIN + '/login?system_id=' + Config.SYSTEM_HOME_ID + '&jump_url=' + host
                    }
                } 
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}
/* jsonp接口结束 */

export default {
    /* jsonp接口 - 数据导入 */
    searchNewSystem(params) { return jsonp('import_newSystem',params) }, //搜索新系统
    searchOldSystem(params) { return jsonp('import_oldSystem',params) }, //搜索旧系统 
    msgBind(params) { return jsonp('import_bind',params) }, //信息关联

    Login(params) { return fetch('loginLogic', params) }, // 用户登录
    upload(params) { return fetch('upload', params) }, // 
    get_user_authority(params) { return fetch('get_user_authority', params) }, // 获取用户权限列表
    logout(params) { return fetch('logout', params) }, // 退出登录

    getAddress(params) { return fetch('get_addressInfo', params) }, // 获取地址
    getBank(params) { return fetch('get_bank', params) }, // 获取银行
    getPipelineList(params) { return fetch('get_pipeline_list', params) }, // 获取操作流水记录
    setComment(params) { return fetch('set_comment', params) }, // 添加备注
    getAllChannels(params) { return fetch('get_allChannels', params) }, // 获取商户
    getAllChannelsByContion(params) { return fetch('get_allChannelsByContion', params) }, // 获取商户
    getChannelsChild(params) { return fetch('get_Orgs', params) }, // 获取商户下级
    getChannelManager(params) { return fetch('get_channelManager', params) }, // 获取渠道经理

    getChannelTemplate(params) { return fetch('get_channel_template', params) }, // 获取渠道模板
    getPartner(params) { return fetch('get_partner', params) }, // 获取商户
    getDStatus(params) { return fetch('get_channelstatus_list', params) }, // 获取D相关状态

    /*渠道相关*/
    getChannelList(params) { return fetch('get_channel_list', params) }, // 获取渠道列表
    getProvince(params) { return fetch('get_province', params) }, // 获取省份
    addChannelLogic(params) { return fetch('save_ChannelOrg', params) }, // 新增 or 编辑渠道
    /*渠道相关*/
    getChannelInfo(params) { return fetch('channel_detail', params) }, // 获取渠道信息
    getTemplateList(params) { return fetch('get_channelTemplateList', params) }, // 获取模板列表
    addChannelTemplatePageData(params) { return fetch('add_channelTemplatePageData', params) }, // 
    editChannelTemplateJsInfo(params) { return fetch('edit_channelTemplateJsInfo', params) }, // 
    editTemplateLogic(params) { return fetch('edit_channel_template', params) }, // 
    addTemplateLogic(params) { return fetch('add_channelTemplateLogic', params) }, // 添加模板
    delChannelTemplate(params) { return fetch('del_channelTemplate', params) }, // 禁用模板
    upChannelTemplate(params) { return fetch('up_channelTemplate', params) }, // 启用模板
    getDealerIdNamelist(params) { return fetch('get_dealer_id_name_list', params) }, // 获取代理
    getChannelStoreList(params) { return fetch('get_channel_store_list', params) }, // 获取渠道门店

    /*门店相关*/
    getStoreList(params) { return fetch('get_store_list', params) }, // 获取门店列表
    disableStore(params) { return fetch('del_store', params) }, // 禁用门店
    enableStore(params) { return fetch('up_store', params) }, // 启用门店
    addStoreLogic(params) { return fetch('add_storeLogic', params) }, // 新增门店
    addOrgLogic(params) { return fetch('add_orgLogic', params) }, // 新增次级渠道
    bindO1Excel(params) { return fetch('bind_o1_excel', params) }, // 批量关联S1/BD1
    /*编辑门店*/
    getStoreInfo(params) { return fetch('getStoreInfo', params) }, // 获取门店信息

    getStoreS(params) { return fetch('get_store_s', params) }, // 获取该门店关联S
    getAllS4(params) { return fetch('get_can_relate_s4_list', params) }, // 获取S4列表
    getAllS4ByContion(params) { return fetch('get_can_relate_s4_listby_contion', params) }, // 根据姓名或手机号搜索S4

    addStoreS1(params) { return fetch('add_store_s', params) }, // 门店添加S1

    getStoreDS(params) { return fetch('get_related_people_list', params) }, // 获取该门店关联D或S
    getAllDS(params) { return fetch('get_can_relate_people_list', params) }, // 获取D或S列表
    addStoreDS(params) { return fetch('set_relate_people_list', params) }, // 门店添加D或S


    editStoreLogic(params) { return fetch('edit_storeLogic', params) }, // 提交编辑
    /*工号相关*/
    getEmployeeList(params) { return fetch('get_channel_user_list', params) }, // 获取工号列表
    setEmployee(params) { return fetch('set_jobStatus', params) }, // 禁用 启用 工号
    addEmployeeLogic(params) { return fetch('add_jobnumber', params) }, // 新增工号
    cancelAddEmployeeLogic(params) { return fetch('cancelCommit', params) }, // 记录取消工号添加
    /*编辑工号*/
    getEmployeeInfo(params) { return fetch('get_jobnumber_info', params) }, // 获取工号信息
    addEmployeeLogic(params) { return fetch('add_jobnumber', params) }, // 新增工号
    editEmployeeLogic(params) { return fetch('edit_jobnumber', params) }, // 编辑工号
    /*D相关*/
    getDList(params) { return fetch('get_d_list', params) }, // D列表
    addDLogic(params) { return fetch('add_d_user', params) }, // 新增D
    getDInfo(params) { return fetch('get_d_detail', params) }, // D详情
    getDStoreList(params) { return fetch('get_d_store_list', params) }, // D负责门店列表
    editDLogic(params) { return fetch('edit_d_user', params) }, // 编辑D
    /*D tree*/
    getD4List(params) { return fetch('get_dx_list', params) }, //获取D4
    getD4Tree(params) { return fetch('get_d_tree', params) }, //获取D4对应tree
    getReplaceDxList(params) { return fetch('get_replace_dx_list', params) }, //获取可替换D4
    replaceDxNode(params) { return fetch('replace_d_code', params) }, //替换节点
    delLeafNode(params) { return fetch('del_leaf_code', params) }, //删除节点
    getAddNextList(params) { return fetch('get_superior_dx_list', params) }, //获取新增下级list
    setAddNext(params) { return fetch('add_superior_code', params) }, //添加下级

    /*Dealer相关*/
    getDealerList(params) { return fetch('get_dealer_list', params) }, // Dealer列表
    addDealerLogic(params) { return fetch('add_dealer', params) }, // 新增Dealer
    getDealerInfo(params) { return fetch('get_dealer', params) }, // Dealer详情
    editDealerLogic(params) { return fetch('set_dealer', params) }, // Dealer详情
    getWillRelateD4(params) { return fetch('get_will_d4', params) }, // 获取可关联D4
    relateD4(params) { return fetch('set_will_d4', params) }, // 关联D4

    /*BD相关*/
    getBDList(params) { return fetch('get_bd_list', params) }, // BD列表
    addBDLogic(params) { return fetch('add_bd_user', params) }, // 新增BD
    getBDInfo(params) { return fetch('get_bd_detail', params) }, // BD详情
    getBDStoreList(params) { return fetch('get_bd_store_list', params) }, // BD负责门店列表
    editBDLogic(params) { return fetch('edit_bd_user', params) }, // 编辑BD
    checkBdExcel(params) { return fetch('check_bd_excel', params) }, // 批量验证BD
    createBdExcel(params) { return fetch('create_bd_excel', params) }, // 批量创建BD


    /*BD tree*/
    getBD4List(params) { return fetch('get_bdx_list', params) }, //获取BD4
    getBD4Tree(params) { return fetch('get_bd_tree', params) }, //获取BD4对应tree
    getReplaceBDxList(params) { return fetch('get_replace_bdx_list', params) }, //获取可替换BD4
    replaceBDxNode(params) { return fetch('replace_bd_code', params) }, //替换节点
    delBDLeafNode(params) { return fetch('del_leaf_BDcode', params) }, //删除节点
    getAddNextBDList(params) { return fetch('get_junior_bdx_list', params) }, //获取新增下级list
    setAddBDNext(params) { return fetch('add_junior_code', params) }, //添加下级



    /*******   权限中心     *******/
    getSystemList(params) { return crossDomain('getSystemList', params) }, // 系统列表
    addSystem(params) { return crossDomain('addSystem', params) }, // 新增系统
    editSystem(params) { return crossDomain('editSystem', params) }, // 编辑系统
    changeSystemStatus(params) { return crossDomain('changeSystemStatus', params) }, // 禁用启用

    getRoleList(params) { return crossDomain('getRoleList', params) }, // 角色列表
    addRole(params) { return crossDomain('addRole', params) }, // 新增角色
    editRole(params) { return crossDomain('editRole', params) }, // 编辑角色
    getRoleAuth(params) { return crossDomain('setRoleAuth', params) }, // 获取角色权限
    editRoleAuths(params) { return crossDomain('editRoleAuths', params) }, // 设置角色权限
    changeRoleStatus(params) { return crossDomain('changeRoleStatus', params) }, // 禁用启用

    getCateRoleList(params) { return crossDomain('getCateRoleList', params) }, // 角色分类列表
    changeCateRoleStatus(params) { return crossDomain('changeCateRoleStatus', params) }, // 禁用启用
    addCateRole(params) { return crossDomain('addCateRole', params) }, // 新增角色分类
    editCateRole(params) { return crossDomain('editCateRole', params) }, // 编辑角色分类

    getModuleList(params) { return crossDomain('getModuleList', params) }, // 模块列表
    addAuth(params) { return crossDomain('addAuth', params) }, // 新增模块、页面、权限
    editAuth(params) { return crossDomain('editAuth', params) }, // 新增模块、页面、权限
    changeAuthStatus(params) { return crossDomain('changeAuthStatus', params) }, // 新增模块、页面、权限

    getPageList(params) { return crossDomain('getPageList', params) }, // 页面列表

    getActionAuthList(params) { return crossDomain('getActionAuthList', params) }, // 权限列表
    addActionAuths(params) { return crossDomain('addActionAuths', params) }, // 新增权限

    getPowerRecordList(params) { return crossDomain('getRecordList', params) }, // 操作日志


}
