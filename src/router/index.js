import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import index from '@/views/index' 
// 渠道
import channelIndex from '@/views/channel/index'
import addChannel from '@/views/channel/add_channel'
import editChannel from '@/views/channel/edit_channel'
import detailChannel from '@/views/channel/detail_channel'
import channelStore from '@/views/channel/store'
import channelAddStore from '@/views/channel/add_store'
import channelEditStore from '@/views/channel/edit_store'
import channelDetailStore from '@/views/channel/detail_store'
import channelEmployee from '@/views/channel/employee'
import channelAddEmployee from '@/views/channel/add_employee'
import channelEditEmployee from '@/views/channel/edit_employee'
import channelTemplate from '@/views/channel/template'
import channelAddTemplate from '@/views/channel/add_template'
import channelEditTemplate from '@/views/channel/edit_template'
/**  权限中心  **/
  //系统管理
import system from '@/views/power/system'

import powerPage from '@/views/power/page'
import powerModule from '@/views/power/module'
import powerIndex from '@/views/power/index'
import powerAdd from '@/views/power/add'
import dataImport from '@/views/power/dataImport'
  //角色管理
import userList from '@/views/power/user'
import userCategory from '@/views/power/category'
import setPower from '@/views/power/setPower'

import RecordPower from '@/views/power/record'


//D
import DList from '@/views/D/index'
import DAdd from '@/views/D/add'
import EditD from '@/views/D/editD'
import DAddNext from '@/views/D/d_addNext'
import DDetail from '@/views/D/detailD'
import DTree from '@/views/D/tree'
//Dealer
import DealerList from '@/views/Dealer/index'
import DealerAdd from '@/views/Dealer/add'
import EditDealer from '@/views/Dealer/editDealer'
import RelateD4 from '@/views/Dealer/relateD4'
import DealerDetail from '@/views/Dealer/detailDealer'
//BD
import BDList from '@/views/BD/index'
import BDAdd from '@/views/BD/add'
import BDAdds from '@/views/BD/adds'
import EditBD from '@/views/BD/edit'
import BDAddNext from '@/views/BD/addNext'
import BDDetail from '@/views/BD/detail'
import BDTree from '@/views/BD/tree'


// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/views/Login'], resolve)

Vue.use(Router)

let router = new Router({ 
    routes: [
        {
            path: '/login',
            name: '登录',
            component: Login
        },  
        {
            path: '/',
            name: 'home', 
            component: Home,
            redirect: '/index',
            leaf: true, // 只有一个节点
            menuShow: false,
            iconCls: 'iconfont icon-home_fill_light', // 图标样式class
            children: [
                {path: '/index', component: index, name: '首页', menuShow: true}
            ]
        },
        {
            path: '/',
            component: Home,
            name: 'O/S管理',
            menuShow: true,
            //leaf: true, // 只有一个节点
            iconCls: 'iconfont icon-friend_light', // 图标样式class
            children: [
                {path: '/channel/index', component: channelIndex, name: '商户管理', menuShow: true},
                {path: '/channel/add_channel', component: addChannel},
                {path: '/channel/edit_channel', component: editChannel , name:'editChannel'},
                {path: '/channel/detail_channel', component: detailChannel , name:'detailChannel'},

                {path: '/channel/store', component: channelStore, name: '门店管理', menuShow: true},
                {path: '/channel/add_store', component: channelAddStore},
                {path: '/channel/edit_store', component: channelEditStore , name:'editStore'},
                {path: '/channel/detail_store', component: channelDetailStore , name:'detailStore'},
                
                {path: '/channel/employee', component: channelEmployee, name: '工号管理', menuShow: true},
                {path: '/channel/add_employee', component: channelAddEmployee},
                {path: '/channel/edit_employee', component: channelEditEmployee , name:'editEmployee'},

                {path: '/channel/template', component: channelTemplate, name: 'O模板管理', menuShow: true} ,  
                {path: '/channel/add_template', component: channelAddTemplate, name: '新增渠道模板'}   ,
                {path: '/channel/edit_template', component: channelEditTemplate, name: 'editTemplate'}   
            ]
        },
        {
            path: '/',
            component: Home,
            name: 'D管理',
            menuShow: true,
            iconCls: 'iconfont icon-people',
            children: [
                {path: '/Dealer/index', component: DealerList, name: 'Dealer列表', menuShow: true},
                {path: '/Dealer/add', component: DealerAdd, name: '新增Dealer'},
                {path: '/Dealer/DealerDetail', component: DealerDetail, name: 'detailDealer'},
                {path: '/Dealer/editDealer', component: EditDealer, name: 'editDealer'},
                {path: '/Dealer/relateD4', component: RelateD4, name: 'relateD4'},

                {path: '/D/index', component: DList, name: 'D列表', menuShow: true},
                {path: '/D/tree', component: DTree, name: 'D tree管理', menuShow: true},
                {path: '/D/add', component: DAdd, name: '新增D'},
                {path: '/D/d_addNext', component: DAddNext, name: 'DAddNext'},
                {path: '/D/detailD', component: DDetail, name: 'detailD'},
                {path: '/D/editD', component: EditD, name: 'editD'}
            ]
        },
        {
            path: '/',
            component: Home,
            name: 'BD管理',
            menuShow: true,
            iconCls: 'iconfont icon-peoplefill',
            children: [
                {path: '/BD/index', component: BDList, name: 'BD列表', menuShow: true},
                {path: '/BD/tree', component: BDTree, name: 'BD tree管理', menuShow: true},
                {path: '/BD/add', component: BDAdd, name: '新增BD'},
                {path: '/BD/adds', component: BDAdds, name: '批量新增BD'},
                {path: '/BD/addNext', component: BDAddNext, name: 'BDAddNext'},
                {path: '/BD/detail', component: BDDetail, name: 'detailBD'},
                {path: '/BD/edit', component: EditBD, name: 'editBD'},
            ]
        },
        {
            path: '/',
            component: Home,
            name: '权限中心',
            menuShow: true,
            iconCls: 'iconfont icon-unlock',
            children: [
                {path: '/power/system', component: system, name: '系统管理', menuShow: true},
                {path: '/power/index', component: powerIndex, name: '权限管理', menuShow: true},
                {path: '/power/module', component: powerModule, name: '模块管理'},
                {path: '/power/page', component: powerPage, name: '页面管理'},
                {path: '/power/add', component: powerAdd, name: '新增权限'},
                {path: '/power/user', component: userList, name: '角色管理', menuShow: true},
                {path: '/power/category', component: userCategory, name: '分类管理'},
                {path: '/power/setPower', component: setPower, name: 'setPower'},
                {path: '/power/record', component: RecordPower, name: '操作日志', menuShow: true},
                {path: '/power/dataImport', component: dataImport, name: '数据导入', menuShow: true}
            ]
        }
    ]
})

// router.beforeEach((to, from, next) => {
//     if (typeof String.prototype.startsWith != 'function') { 
//         String.prototype.startsWith = function (prefix){ 
//           return this.slice(0, prefix.length) === prefix
//         }
//     }  
//     if (to.path.startsWith('/login')) {
//         window.sessionStorage.removeItem('access-user')
//         next()
//     } else {
//         let user = window.document.cookie.match('(^|;) ?' + 'username' + '=([^;]*)(;|$)')
//         let session = window.sessionStorage.getItem('access-user')
//         if (!user || !session) {
//           // next({path: '/login'})
//           next()
//         } else {
//           next()
//         }
//     }
// })

export default router
