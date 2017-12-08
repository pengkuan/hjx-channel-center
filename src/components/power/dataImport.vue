<template>
    <div class="data-import">
        <div class="title">数据导入</div>
        <div class="data-import-cont">
            <div class="search-box">
                <el-form ref="form" :model="oldForm" label-width="60px" inline style="display:inline-block">
                    <el-form-item label="旧系统">
                        <el-select v-model="oldForm.region" class="my-region">
                            <el-option label="员工姓名" value="员工姓名"></el-option>
                            <el-option label="员工工号" value="员工工号"></el-option>
                            <el-option label="手机号码" value="手机号码"></el-option>
                            <el-option label="身份证" value="身份证"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="my-text-input">
                        <el-input v-model="oldForm.name" :placeholder="'请输入'+oldForm.region"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="oldSubmit(oldForm)">搜索</el-button>
                    </el-form-item>
                </el-form>
                <el-form ref="form" :model="newForm" label-width="60px" inline style="display:inline-block;margin-left:20px;">
                    <el-form-item label="新系统">
                        <el-select v-model="newForm.region" placeholder="" class="my-region">
                            <el-option label="员工姓名" value="员工姓名"></el-option>
                            <el-option label="手机号码" value="手机号码"></el-option>
                            <el-option label="身份证" value="身份证"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="my-text-input">
                        <el-input v-model="newForm.name" :placeholder="'请输入'+newForm.region"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="newSubmit(newForm)">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="newForm.isAllSelect">新旧同时查询</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
            <el-row :gutter="10">
                <el-col :span="11" class="left-wrap">
                    <div class="left">
                        <div class="default-show-text result" v-show="defaultShow.old">请输入搜索条件</div>
                        <div class="no-result-text result" v-show="noResultShow.old">没有符合条件的结果</div>
                        <table class="el-table el-table--border border-RB-none" cellspacing="0" cellpadding="0" border="0" v-show="sysTableShow.old">
                            <tr>
                                <th width="50%" class="is-leaf">
                                    <div class="cell">系统名称</div>
                                </th>
                                <th width="50%" class="is-leaf">
                                    <div class="cell">老系统信息</div>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">员工姓名</div>
                                </td>
                                <td>
                                    <div class="cell">{{oldSysData.username}}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">员工角色</div>
                                </td>
                                <td>
                                    <div class="cell">{{oldSysData.level}}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">所属门店</div>
                                </td>
                                <td>
                                    <div class="cell">{{oldSysData.store}}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">所属商户</div>
                                </td>
                                <td>
                                    <div class="cell">{{oldSysData.channelName}}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">手机号码</div>
                                </td>
                                <td>
                                    <div class="cell">{{oldSysData.phone}}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">身份证号</div>
                                </td>
                                <td>
                                    <div class="cell">{{oldSysData.idCard}}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">门店工号</div>
                                </td>
                                <td>
                                    <div class="cell">{{oldSysData.number}}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">是否与其他账号进行关联</div>
                                </td>
                                <td>
                                    <div class="cell"><span style="color:red;" v-show="oldSysData.associated=='是'">是（已与“{{oldSysData.assocUser}}”进行关联）</span></div>
                                    <div class="cell"><span v-show="oldSysData.associated=='否'">否</span></div>
                                </td>
                            </tr>
                        </table>
                        <div class="more-info-wrap" v-show="sysItemShow.old">
                            <div class="more-info-item" v-for="(item,index) in oldSysItemData" :key="index">
                                <div class="more-info-desc">
                                    <p>
                                        <span>姓名：{{item.username}}</span>
                                        <span class="address">所在城市：{{item.city}}</span>
                                    </p>
                                    <p>手机号码：{{item.phone}}</p>
                                    <p>身份证号：{{item.idCard}}</p>
                                </div>
                                <div class="more-info-select">
                                    <el-button type="primary" @click="showDetail('old',item)">选择</el-button>
                                </div>
                            </div> 
                        </div>
                    </div>
                </el-col>
                <el-col :span="2" class="mid-wrap">
                    <div class="line"></div>
                </el-col>
                <el-col :span="11" class="right-wrap">
                    <div class="right">
                        <div class="default-show-text result" v-show="defaultShow.new">请输入搜索条件</div>
                        <div class="no-result-text result" v-show="noResultShow.new">没有符合条件的结果</div>
                        <table class="el-table el-table--border border-RB-none" cellspacing="0" cellpadding="0" border="0" v-show="sysTableShow.new">
                            <tr>
                                <th v-show="onlyNewSys" width="33%" class="is-leaf">
                                    <div class="cell">系统名称</div>
                                </th>
                                <th width="33%" class="is-leaf">
                                    <div class="cell">新系统信息</div>
                                </th>
                                <th width="33%" class="is-leaf">
                                    <div class="cell">信息是否一致</div>
                                </th>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">员工姓名</div>
                                </td>
                                <td>
                                    <div class="cell">{{newSysData.username}}</div>
                                </td>
                                <td>
                                    <div class="cell" style="color:red" v-show="sysTableShow.old == true && (oldSysData.username != newSysData.username)">否</div>
                                    <div class="cell" v-show="sysTableShow.old == true && (oldSysData.username == newSysData.username)">是</div>
                                    <div class="cell" v-show="sysTableShow.old == false">-</div> 
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">员工角色</div>
                                </td>
                                <td>
                                    <div class="cell">{{newSysData.level}}</div>
                                </td>
                                <td>
                                    <div class="cell" style="color:red" v-show="sysTableShow.old == true && (oldSysData.level != newSysData.level)">否</div>
                                    <div class="cell" v-show="sysTableShow.old == true && (oldSysData.level == newSysData.level)">是</div>
                                    <div class="cell" v-show="sysTableShow.old == false">-</div> 
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">所属门店</div>
                                </td>
                                <td>
                                    <div class="cell">{{newSysData.store}}</div>
                                </td>
                                <td>
                                    <div class="cell" style="color:red" v-show="sysTableShow.old == true && (oldSysData.store != newSysData.store)">否</div>
                                    <div class="cell" v-show="sysTableShow.old == true && (oldSysData.store == newSysData.store)">是</div>
                                    <div class="cell" v-show="sysTableShow.old == false">-</div> 
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">所属商户</div>
                                </td>
                                <td>
                                    <div class="cell">{{newSysData.channelName}}</div>
                                </td>
                                <td>
                                    <div class="cell" style="color:red" v-show="sysTableShow.old == true && (oldSysData.channelName != newSysData.channelName)">否</div>
                                    <div class="cell" v-show="sysTableShow.old == true && (oldSysData.channelName == newSysData.channelName)">是</div>
                                    <div class="cell" v-show="sysTableShow.old == false">-</div> 
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">手机号码</div>
                                </td>
                                <td>
                                    <div class="cell">{{newSysData.phone}}</div>
                                </td>
                                <td>
                                    <div class="cell" style="color:red" v-show="sysTableShow.old == true && (oldSysData.phone != newSysData.phone)">否</div>
                                    <div class="cell" v-show="sysTableShow.old == true && (oldSysData.phone == newSysData.phone)">是</div>
                                    <div class="cell" v-show="sysTableShow.old == false">-</div>
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">身份证号</div>
                                </td>
                                <td>
                                    <div class="cell">{{newSysData.idCard}}</div>
                                </td>
                                <td>
                                    <div class="cell" style="color:red" v-show="sysTableShow.old == true && (oldSysData.idCard != newSysData.idCard)">否</div>
                                    <div class="cell" v-show="sysTableShow.old == true && (oldSysData.idCard == newSysData.idCard)">是</div>
                                    <div class="cell" v-show="sysTableShow.old == false">-</div> 
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">门店工号</div>
                                </td>
                                <td>
                                    <div class="cell"></div>
                                </td>
                                <td>
                                    <div class="cell"></div>
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">是否与其他账号进行关联</div>
                                </td>
                                <td> 
                                    <div class="cell"><span style="color:red;" v-show="newSysData.associated=='是'">是（已与“{{newSysData.assocUser}}”进行关联）</span></div>
                                    <div class="cell"><span v-show="newSysData.associated=='否'">否</span></div>
                                </td>
                                <td>
                                    <div class="cell"></div>
                                </td>
                            </tr>
                        </table>
                        <div class="more-info-wrap" v-show="sysItemShow.new"> 
                            <div class="more-info-item" v-for="(item,index) in oldSysItemData" :key="index">
                                <div class="more-info-desc">
                                    <p>
                                        <span>姓名：{{item.username}}</span>
                                        <span class="address">所在城市：{{item.city}}</span>
                                    </p>
                                    <p>手机号码：{{item.phone}}</p>
                                    <p>身份证号：{{item.idCard}}</p>
                                </div>
                                <div class="more-info-select">
                                    <el-button type="primary" @click="showDetail('new',item)">选择</el-button>
                                </div>
                            </div> 
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="msg-relative">
            <el-button type="primary" :disabled="!canBind" @click="msg_Relative()">信息关联</el-button>
        </div>
    </div>
</template>
<script>
import api from '../../api/api'
export default {
    data() {
        return {
            //旧新系统的搜索框数据
            oldForm: {
                region: '员工姓名',
                name: ''
            },
            newForm: {
                region: '员工姓名',
                name: '',
                isAllSelect: true
            },
            // 新旧系统的表格显示数据
            sysTableShow: {
                old: false,
                new: false
            },
            // 新旧系统的多条数据显示
            sysItemShow: {
                old: false,
                new: false
            },
            // 没有搜索时的默认状态
            defaultShow: {
                old: true,
                new: true
            },
            // 搜索无结果时的文案显示
            noResultShow: {
                old: false,
                new: false
            },   
            // 旧新系统的具体数据
            oldSysData: {
                username: '1212',
                user_id: '568',
                level: 's1',
                store: 'A',
                channelName: 'B渠道',
                phone: '158787878',
                idCard: '432525',
                number: '45458',
                associated: '否',
                assocUser: '李橙',
                city:'北京'
            },
            newSysData: {
                username: '老1田',
                user_id: '5681',
                level: 's11',
                store: 'A1',
                channelName: 'B渠道1',
                phone: '1587878781',
                idCard: '432525',
                number: '45458',
                associated: '否',
                assocUser: '李橙',
                city:'北京'
            },
            // 旧新系统的列表数据
            oldSysItemData: [],
            newSysItemData: []
        }
    },
    methods: {
        newSubmit(form) {
            if (!form.name) { return }
            let rs = this.validate(form) 
            let dataParams = {}
            // 验证不通过
            if (!rs.isPass) {
                this.$message({
                    message: rs.msg,
                    type: 'warning'
                })
                return
            } else {
                // 验证通过并判断是否为全选
                if (this.newForm.isAllSelect) {
                    dataParams = {[rs.type]: form.name }
                    this.fetchDate('new', 'all', dataParams)
                } else {
                    dataParams = {[rs.type]: form.name }
                    this.fetchDate('new', 'one', dataParams)
                }
                this.newForm.name = ''
                console.log(dataParams, '请求接口开始')
            }
        },
        oldSubmit(form) {
            if (!form.name) { return }
            let rs = this.validate(form)
            // 模拟接口初始数据  
            let dataParams = {}
            // 验证不通过
            if (!rs.isPass) {
                this.$message({
                    message: rs.msg,
                    type: 'warning'
                })
                return
            } else {
                // 验证通过并判断是否为全选
                if (this.newForm.isAllSelect) { 
                    dataParams = {[rs.type]: form.name } 
                    this.fetchDate('old', 'all', dataParams)
                } else {
                    dataParams = {[rs.type]: form.name }
                    this.fetchDate('old', 'one', dataParams)
                }
                this.oldForm.name = ''
                console.log(dataParams, '请求接口开始')
            }
        },
        // 请求接口
        fetchDate(isNew, isAll, data) {
            if (isNew == 'new' && isAll == 'one') {
                console.log('新系统，单独搜索') 
                this.handlerNewSys(data)
            }
            if (isNew == 'old' && isAll == 'one') {
                console.log('老系统，单独搜索')   
                this.handlerOldSys(data)
            }
            if (isAll == "all") {
                console.log('新旧同时搜索') 
                this.handlerOldSys(data)
                this.handlerNewSys(data)
            } 
        },
        handlerOldSys(data) { 
            api.searchOldSystem(data).then((res) => {  
                if (res._data._ret != '0') {
                    this.$message({
                        message: res._data._errStr,
                        type: 'warning'
                    })
                    return
                } 
                if (res._data.data.length == 1) { 
                    this.oldSysData = Object.assign(this.oldSysData, res._data.data[0])
                    this.defaultShow.old = false
                    this.sysItemShow.old = false 
                    this.noResultShow.old = false
                    this.sysTableShow.old = true

                    // 模拟多个数据的情况
                    // this.defaultShow.old = false
                    // this.sysItemShow.old = true
                    // this.sysTableShow.old = false
                    // this.oldSysItemData = this.oldSysItemData
                } else if (res._data.data.length > 1) {
                    this.oldSysItemData = res._data.data
                    this.defaultShow.old = false 
                    this.sysTableShow.old = false
                    this.noResultShow.old = false
                    this.sysItemShow.old = true
                    //搜索无结果
                } else {
                    this.defaultShow.old = false
                    this.sysItemShow.old = false
                    this.sysTableShow.old = false
                    this.noResultShow.old = true
                } 
            }) 
        },
        handlerNewSys(data) {
            api.searchNewSystem(data).then((res) => {
                if (res._data._ret != '0') {
                    this.$message({
                        message: res._data._errStr,
                        type: 'warning'
                    })
                    return
                } 


                if (res._data.data.length == 1) {
                    this.newSysData = Object.assign(this.newSysData, res._data.data[0])
                    this.defaultShow.new = false 
                    this.sysItemShow.new = false
                    this.noResultShow.new = false
                    this.sysTableShow.new = true

                    // 模拟多个数据的情况
                    // this.defaultShow.new = false
                    // this.sysItemShow.new = true
                    // this.sysTableShow.new = false
                    // this.newSysItemData = this.newSysItemData
                } else if (res._data.data.length > 1) {
                    this.newSysItemData = res._data.data
                    this.defaultShow.new = false
                    this.noResultShow.new = false
                    this.sysTableShow.new = false
                    this.sysItemShow.new = true
                    //搜索无结果
                } else { 
                    this.defaultShow.new = false
                    this.sysItemShow.new = false
                    this.sysTableShow.new = false
                    this.noResultShow.new = true
                }

            })
        },
        // 显示详细信息
        showDetail(flag, item) {
            // console.log(item)
            if (flag == 'old') {
                this.sysItemShow.old = false
                this.oldSysData = item
                this.sysTableShow.old = true
            } 
            if (flag == 'new') {
                this.sysItemShow.new = false
                this.newSysData = item
                this.sysTableShow.new = true
            }
        },
        // 信息关联
        msg_Relative() {
            let name1 = this.oldSysData.username,
                name2 = this.newSysData.username
            const h = this.$createElement
            this.$msgbox({
                title: '确认信息关联',
                message: h('p', null, [
                    h('span', null, '是否确认将旧系统账号:'),
                    h('span', { style: 'color: blue' }, name1),
                    h('span', null, '和新系统账号:'),
                    h('span', { style: 'color: blue' }, name2),
                    h('span', null, '进行信息关联？')
                ]),
                showCancelButton: true,
                cancelButtonText: '取消',
                confirmButtonText: '确认'
            }).then((action) => {
                console.log('确定，开始接口操作') 
                let data = {
                    old_user_id: this.oldSysData.user_id,
                    new_user_id: this.newSysData.user_id
                }
                api.msgBind(data).then((res)=>{
                    // console.log(res)
                    if (res._data._ret != '0') {
                        this.$message({
                            message: res._data._errStr,
                            type: 'warning'
                        })
                        return
                    } else if(res._data._ret == '0') {
                        this.$message({
                            message: res._data._errStr,
                            type: 'warning'
                        })
                        //数据关联成功后，若后台无刷新的数据，那么就需要手动修改
                        this.oldSysData.associated = '是'
                        this.oldSysData.assocUser = this.newSysData.username
                        this.newSysData.associated = '是'
                        this.newSysData.assocUser = this.oldSysData.username 
                    }
                    
                }) 
            }).catch((res) => { console.log(res) })
        },
        // 字段验证
        validate(opt) {
            let result = { isPass: false, msg: '', type: '' }
            if (opt.region == '员工姓名') {
                let reg = /^[\u4e00-\u9fa5]{2,10}$/g.test(opt.name)
                if (reg) {
                    result.isPass = true
                    result.type = 'username'
                } else {
                    result.isPass = false
                    result.msg = '请输入2-10位汉字搜索'
                }
            }
            if (opt.region == '手机号码') {
                let reg = /^1\d{10}$/.test(opt.name)
                if (reg) {
                    result.isPass = true
                    result.type = 'phone'
                } else {
                    result.isPass = false
                    result.msg = '请输入11位手机号码'
                }
            }
            if (opt.region == '员工工号') {
                let reg = /^[A-Za-z0-9]{1,19}$/.test(opt.name)
                if (reg) {
                    result.isPass = true
                    result.type = 'number'
                } else {
                    result.isPass = false
                    result.msg = '请输入20位以内的数字和字母字符'
                }
            }
            if (opt.region == '身份证') {
                let reg = /^\d{18}$/.test(opt.name)
                if (reg) {
                    result.isPass = true
                    result.type = 'idCard'
                } else {
                    result.isPass = false
                    result.msg = '请输入18位身份证号码'
                }
            }
            return result
        }
    },
    computed: {
        // 是否可以关联
        canBind() {
            return this.sysTableShow.old && this.sysTableShow.new && this.oldSysData.associated == '否' && this.newSysData.associated == '否'
        },
        //只有新系统时，显示三列，否则显示两列
        onlyNewSys() {
            return this.sysTableShow.old == false ? true : false 
        }
    },
    mounted() {
        // api.searchNewSystem({ number: 'XHJX45885474' }).then((res) => {
        //     console.log(res)
        // })
        // api.searchOldSystem({ number: 'DX00201039' }).then((res) => {
        //     console.log(res)
        // })
    }
}

</script>
<style scoped lang="scss">
.data-import {
    .data-import-cont {
        min-width: 1100px; // max-width: 1500px; 
        .left-wrap,
        .right-wrap {
            height: 450px;
            .left,
            .right {
                height: 435px;
                overflow-y: auto;
            }
        }
        .line {
            height: 435px;
            width: 1px;
            background: #DFE6EC;
            position: relative;
            top: 0;
            left: 50%;
        }
        tr,
        th {
            height: 48px;
            min-height: 48px;
            text-align: center;
        }
        .result {
            height: 430px;
            border: 1px solid #DFE6EC;
        }
        .my-region {
            width: 130px;
        }
        .my-text-input {
            width: 180px;
        }
        .more-info-wrap {
            min-height: 130px;
            .more-info-item {
                min-height: 130px;
                display: flex;
                margin-bottom: 12px;
                font-size: 14px;
                color: #1f2d3d;
                .more-info-desc {
                    border: 1px solid #DFE6EC;
                    flex: 1;
                    p {
                        line-height: 43px;
                        padding: 0 10px;
                        box-sizing: border-box;
                        position: relative;
                        .address {
                            position: absolute;
                            top: 0;
                            right: 10px;
                        }
                    }
                }
                .more-info-select {
                    flex: 0 0 100px;
                    text-align: center;
                    line-height: 130px;
                }
            }
        }
        .default-show-text,
        .no-result-text {
            line-height: 48px;
            padding-left: 6px;
        }
    }
    .msg-relative {
        min-width: 1100px; // max-width: 1500px;
        text-align: center;
        height: 60px;
        line-height: 60px;
    }
}

</style>
