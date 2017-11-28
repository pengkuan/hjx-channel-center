<template>
    <div>
        <el-row class="container" v-show="showDiv">
            <!--头部-->
            <el-col :span="24" class="topbar-wrap">
                <div class="topbar-logo topbar-btn">
                    <a href="/"><img src="../assets/images/logo.png" style="margin: 10px 0 0 10px;height:30px;border:0"></a>
                </div>
                <div class="topbar-title topbar-btn">
                    <!-- <span>运营管理后台</span> -->
                </div>
                <!-- <div class="topbar-account topbar-btn">
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link userinfo-inner"><i class="iconfont icon-user"></i> {{sysUserName}}  <i class="iconfont icon-down"></i></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>个人信息</el-dropdown-item>
                            <el-dropdown-item>修改密码</el-dropdown-item>
                            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div> -->
            </el-col>
            <!--中间-->
            <el-col :span="24" class="main">
                <!--左侧导航-->
                <aside :class="collapsed?'menu-collapsed':'menu-expanded'">
                    <!--展开折叠开关-->
                    <div class="menu-toggle" @click.prevent="collapse">
                        <i class="iconfont icon-close_menu" v-show="!collapsed"></i>
                        <i class="iconfont icon-open_menu" v-show="collapsed"></i>
                    </div>
                    <!--菜单展开时的显示情况-->
                    <el-menu v-show="!collapsed" default-active="0" @open="handleOpen" @close="handleClose" router>
                        <!-- <template v-for="(item,index) in $router.options.routes" v-if="item.menuShow"> -->
                        <template v-for="(item,index) in menuRutes" v-if="item.menuShow">
                            <el-submenu v-if="!item.leaf" :index="index+''">
                                <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
                                <el-menu-item v-for="term in item.children" :key="term.path" :index="term.path" v-if="term.menuShow" :class="$route.path==term.path?'is-active-add':''">
                                    {{term.name}}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else-if="item.leaf&&item.children&&item.children.length" :index="item.children[0].path" class="el-submenu__title">
                                <i :class="item.iconCls"></i>{{item.children[0].name}}
                            </el-menu-item>
                        </template>
                    </el-menu>
                    <!--菜单折叠后的显示情况-->
                    <ul v-show="collapsed" class="el-menu collapsed" ref="menuCollapsed">
                        <!-- <template v-for="(item,index) in $router.options.routes" v-if="item.menuShow"> -->
                        <template v-for="(item,index) in menuRutes" v-if="item.menuShow">
                            <li v-if="!item.leaf" :index="index+''" style="position: relative;" @click="setCollapsed">
                                <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
                                <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                                    <li v-for="term in item.children" :key="term.path" v-if="term.menuShow" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==term.path?'is-active':''">
                                        {{term.name}}
                                    </li>
                                </ul>
                            </li>
                            <li v-else-if="item.leaf&&item.children&&item.children.length" class="el-menu-item el-submenu__title" @click="setCollapsed">
                                <i :class="item.iconCls"></i>
                            </li>
                        </template>
                    </ul>
                </aside>
                <!--右侧内容区-->
                <section class="content-container right-container">
                    <div class="grid-content bg-purple-light">
                        <el-col :span="24" class="content-wrapper">
                            <transition name="fade">
                                <router-view class="router-class"></router-view>
                            </transition>
                        </el-col>
                    </div>
                </section>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import api from '../api/api'
import util from '../common/util'
export default {
    created() {},
    data() {
        return {
            collapsed: false,
            menuRutes: [],
            menuList: [],
            showDiv: false
        }
    },
    methods: {
        handleOpen() {},
        handleClose() {},
        setCollapsed() {
            this.collapsed = !this.collapsed
        },
        //折叠导航栏
        collapse: function() {
            this.collapsed = !this.collapsed
        },
        showMenu(i, status) {
            this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none'
        },
        // 权限到菜单模块
        getModule(menu) {
            let routes = this.$router.options.routes
            for (let a in routes) {
                if (routes[a].menuShow && routes[a].name != 'home') {
                    this.$router.options.routes[a].menuShow = false
                }
            }
            for (let i in menu) {
                for (let index in routes) {
                    if (menu[i].name == routes[index].name) {
                        this.$router.options.routes[index].menuShow = true
                    }
                }
            }
            this.menuRutes = this.$router.options.routes
        },
        // 权限到菜单页面
        getDeepModule(menu) {
            let routes = this.$router.options.routes
            // 清空导航以及导航下子路由的menuShow，注意排除home以及home没有children的容错
            for (let a in routes) {
                if (routes[a].menuShow && routes[a].name != 'home') {
                    this.$router.options.routes[a].menuShow = false
                }

                let children = this.$router.options.routes[a].children
                // console.log(children)
                if (children) {
                    for (let sub in children) {
                        if (children[sub].menuShow && children[sub].menuShow == true) {
                            this.$router.options.routes[a].children[sub].menuShow = false
                        }
                    }
                }
            }
            // console.log(this.$router.options.routes)
            for (let i in menu) {
                for (let index in routes) {
                    if (menu[i].name == routes[index].name) {
                        this.$router.options.routes[index].menuShow = true
                    }
                    if (routes[index].children && menu[i].sub_menu) {
                        for (let n in menu[i].sub_menu) {
                            for (let m in routes[index].children) {
                                if (menu[i].sub_menu[n].name == routes[index].children[m].name && routes[index].children[m].menuShow == false) {
                                    this.$router.options.routes[index].children[m].menuShow = true
                                }
                            }
                        }
                    }
                }
            }

            this.menuRutes = this.$router.options.routes
        },
        // 获取权限列表数据
        get_user_menu() {
            let host = encodeURIComponent(util.accessHost),
                userid = util.getCookie('userid'),
                token = util.getCookie('useruuid'),
                params = {
                    userid: userid,
                    token: token,
                    systemid: util.systemId
                }
            // this.setTestCookie()  本地时打开一次即可
            if (!userid) {
                window.location.href = util.powerCenterLoginPage + '/login?system_id=' + util.systemId + '&jump_url=' + host
            } else {

                ////////////////////////////////////////////////////////////////////////////////////// 上线时打开,本地服务时关闭 
                // const loading = this.$loading({
                //     lock: true,
                //     text: '玩命加载中......',
                //     spinner: 'el-icon-loading',
                //     background: 'rgba(0, 0, 0, 0.7)'
                // })
                // api.get_user_authority(params).then((res) => {
                //     if (res.ret != '0') {
                //         this.$message({
                //             message: res.retinfo,
                //             type: 'warning'
                //         })
                //         loading.close()
                //         return
                //     }
                //     loading.close()
                //     this.showDiv = true
                //     this.menuList = res.data.menu
                //     this.getModule(this.menuList)
                // })


                ////////////////////////////////////////////////////////////////////////////////////// 本地服务时打开用,上线时关闭 && app.js的403关闭  
                this.setTestCookie()
                this.menuList = [{ name: '渠道关系管理' }, { name: 'D管理' }, { name: 'BD管理' }, {name: '权限中心'}]
                this.showDiv = true
                this.getModule(this.menuList)
            }
        },
        // 测试时，模拟写入cookie,登录信息
        setTestCookie() {
            util.setCookie('userid', '694')
            util.setCookie('username', 'tianyu')
            util.setCookie('useruuid', 'c6ed5c8e9830cf9225d078bdde335de7')
        }
    },
    mounted() {
        this.get_user_menu()
    }
}

</script>
<style>
.el-menu-item,
.el-submenu__title {
    color: #fff;
}

.el-submenu__title:hover {
    background-color: #00C1DE;
}

.el-submenu .el-menu-item {
    background-color: #333744
}

.el-submenu .el-menu-item:hover {
    background-color: #4A5064
}

.el-submenu .el-menu-item.is-active,
.el-menu-item.is-active,
.el-submenu .el-menu-item.is-active:hover,
.el-menu-item.is-active:hover {
    background-color: #00C1DE;
    color: #fff;
}

.el-submenu .el-menu-item.is-active-add,
.el-menu-item.is-active-add,
.el-submenu .el-menu-item.is-active-add:hover,
.el-menu-item.is-active-add:hover {
    background-color: #00C1DE;
    color: #fff;
}

.el-menu .iconfont {
    vertical-align: baseline;
    margin-right: 6px;
}

.warp-breadcrum {
    padding: 10px 0px;
    border-bottom: 1px solid #efefef;
}

.warp-main {
    padding-top: 20px;
}

</style>
<style scoped lang="scss">
.container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;

    .topbar-wrap {
        height: 50px;
        line-height: 50px;
        background: #373d41;
        padding: 0px;

        .topbar-btn {
            color: #fff; 
        }
        .topbar-btn:hover {
            // background-color: #4A5064;
        }
        .topbar-logo {
            float: left;
            text-align: center;
            width: 170px;
            line-height: 26px;
            cursor: pointer;
            a {
                display: block; 
            }
        }
        .topbar-title {
            float: left;
            text-align: center;
            width: 129px; 
        }
        .topbar-account {
            float: right;
            padding-right: 12px;
        }
        .userinfo-inner {
            cursor: pointer;
            color: #fff;
            padding-left: 10px;
        }
    }
    .main {
        display: flex;
        position: absolute;
        top: 50px;
        bottom: 0px;
        overflow: hidden;
    }
    aside {
        overflow-y: auto;
        flex: 0 0 200px;
        background-color: #333744;
        width: 200px;
        .el-menu {
            border-radius: 0px;
            background-color: #333744;
        }
        .collapsed {
            width: 50px;
            .submenu {
                position: absolute;
                top: 0px;
                left: 50px;
                z-index: 9999;
                height: auto;
                display: none;
            }
        }
    }
    .menu-collapsed {
        flex: 0 0 50px;
        width: 50px;
    }
    .menu-expanded {
        flex: 0 0 200px;
        width: 200px;
        .el-menu {
            width: 100%!important
        }
    }
    .menu-toggle {
        background: #4A5064;
        text-align: center;
        color: white;
        height: 26px;
        line-height: 30px;
    }
    .content-container {
        background: #fff;
        flex: 1;
        overflow-y: auto;
        padding: 10px;
        .content-wrapper {
            background-color: #fff;
            box-sizing: border-box;
            position: relative;
            .router-class {
                position: absolute;
                width: 100%;
                left: 0;
                top: 0;
            }
            .fade-enter-active,
            .fade-leave-active {
                transition: all .3s;
            }

            .fade-enter {
                opacity: 0; // transform: translate3d(10%, 0, 0);
            }

            .fade-leave-to {
                opacity: 0; // transform: translate3d(-10%, 0, 0);
            }
        }
    }
}

</style>
