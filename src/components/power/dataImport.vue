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
                                <th width="10%" class="is-leaf">
                                    <div class="cell">系统名称</div>
                                </th>
                                <th width="15%" class="is-leaf">
                                    <div class="cell">老系统信息</div>
                                </th>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">员工姓名</div>
                                </td>
                                <td>
                                    <div class="cell">张三</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">员工角色</div>
                                </td>
                                <td>
                                    <div class="cell">S1</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">所属门店</div>
                                </td>
                                <td>
                                    <div class="cell">A门店</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">所属商户</div>
                                </td>
                                <td>
                                    <div class="cell">B渠道</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">手机号码</div>
                                </td>
                                <td>
                                    <div class="cell">15899996666</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">身份证号</div>
                                </td>
                                <td>
                                    <div class="cell">1111111111111111111</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">门店工号</div>
                                </td>
                                <td>
                                    <div class="cell"></div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">是否与其他账号进行关联</div>
                                </td>
                                <td>
                                    <div class="cell"><span style="color:red;">是</span></div>
                                </td>
                            </tr>
                        </table>
                        <div class="more-info-wrap" v-show="sysItemShow.old">
                            <div class="more-info-item">
                                <div class="more-info-desc">
                                    <p>
                                        <span>姓名：张三</span>
                                        <span class="address">所在城市：北京</span>
                                    </p>
                                    <p>手机号码：15877774444</p>
                                    <p>身份证号：1587777444411111111</p>
                                </div>
                                <div class="more-info-select">
                                    <el-button type="primary">选择</el-button>
                                </div>
                            </div>
                            <div class="more-info-item">
                                <div class="more-info-desc">
                                    <p>
                                        <span>姓名：张三</span>
                                        <span class="address">所在城市：北京</span>
                                    </p>
                                    <p>手机号码：15877774444</p>
                                    <p>身份证号：1587777444411111111</p>
                                </div>
                                <div class="more-info-select">
                                    <el-button type="primary">选择</el-button>
                                </div>
                            </div>
                            <div class="more-info-item">
                                <div class="more-info-desc">
                                    <p>
                                        <span>姓名：张三</span>
                                        <span class="address">所在城市：北京</span>
                                    </p>
                                    <p>手机号码：15877774444</p>
                                    <p>身份证号：1587777444411111111</p>
                                </div>
                                <div class="more-info-select">
                                    <el-button type="primary">选择</el-button>
                                </div>
                            </div>
                            <div class="more-info-item">
                                <div class="more-info-desc">
                                    <p>
                                        <span>姓名：张三</span>
                                        <span class="address">所在城市：北京</span>
                                    </p>
                                    <p>手机号码：15877774444</p>
                                    <p>身份证号：1587777444411111111</p>
                                </div>
                                <div class="more-info-select">
                                    <el-button type="primary">选择</el-button>
                                </div>
                            </div>
                            <div class="more-info-item">
                                <div class="more-info-desc">
                                    <p>
                                        <span>姓名：张三</span>
                                        <span class="address">所在城市：北京</span>
                                    </p>
                                    <p>手机号码：15877774444</p>
                                    <p>身份证号：1587777444411111111</p>
                                </div>
                                <div class="more-info-select">
                                    <el-button type="primary">选择</el-button>
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
                                <th v-show="onlyNewSys" width="10%" class="is-leaf">
                                    <div class="cell">系统名称</div>
                                </th>
                                <th width="15%" class="is-leaf">
                                    <div class="cell">新系统信息</div>
                                </th>
                                <th width="15%" class="is-leaf">
                                    <div class="cell">信息是否一致</div>
                                </th>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">员工姓名</div>
                                </td>
                                <td>
                                    <div class="cell">张三</div>
                                </td>
                                <td>
                                    <div class="cell">-</div>
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">员工角色</div>
                                </td>
                                <td>
                                    <div class="cell">S1</div>
                                </td>
                                <td>
                                    <div class="cell">-</div>
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">所属门店</div>
                                </td>
                                <td>
                                    <div class="cell">A门店</div>
                                </td>
                                <td>
                                    <div class="cell">-</div>
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">所属商户</div>
                                </td>
                                <td>
                                    <div class="cell">B渠道</div>
                                </td>
                                <td>
                                    <div class="cell">-</div>
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">手机号码</div>
                                </td>
                                <td>
                                    <div class="cell">15899996666</div>
                                </td>
                                <td>
                                    <div class="cell">-</div>
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">身份证号</div>
                                </td>
                                <td>
                                    <div class="cell">1111111111111111111</div>
                                </td>
                                <td>
                                    <div class="cell">-</div>
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
                                    <div class="cell">-</div>
                                </td>
                            </tr>
                            <tr>
                                <td v-show="onlyNewSys">
                                    <div class="cell">是否与其他账号进行关联</div>
                                </td>
                                <td>
                                    <div class="cell"><span style="color:red;">是（已与“张三12”进行关联）</span></div>
                                </td>
                                <td>
                                    <div class="cell">-</div>
                                </td>
                            </tr>
                        </table>
                        <div class="more-info-wrap" v-show="sysItemShow.new">
                            <div class="more-info-item">
                                <div class="more-info-desc">
                                    <p>
                                        <span>姓名：张三</span>
                                        <span class="address">所在城市：北京</span>
                                    </p>
                                    <p>手机号码：15877774444</p>
                                    <p>身份证号：1587777444411111111</p>
                                </div>
                                <div class="more-info-select">
                                    <el-button type="primary">选择</el-button>
                                </div>
                            </div>
                            <div class="more-info-item">
                                <div class="more-info-desc">
                                    <p>
                                        <span>姓名：张三</span>
                                        <span class="address">所在城市：北京</span>
                                    </p>
                                    <p>手机号码：15877774444</p>
                                    <p>身份证号：1587777444411111111</p>
                                </div>
                                <div class="more-info-select">
                                    <el-button type="primary">选择</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="msg-relative">
            <el-button type="primary" :disabled="true" @click="msg_Relative()">信息关联</el-button>
            <el-button type="primary" v-show="msgRelative.off">解除关联</el-button>
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
                isAllSelect: false
            },
            // 新旧系统的表格显示数据
            sysTableShow: {
                old: false,
                new: true
            },
            // 新旧系统的多条数据显示
            sysItemShow: {
                old: true,
                new: false
            },
            // 没有搜索时的默认状态
            defaultShow: {
                old: false,
                new: false
            },
            // 搜索无结果时的文案显示
            noResultShow: {
                old: false,
                new: false
            },
            // 关联信息和解除信息
            msgRelative: {
                on: true,
                off: false
            },
            // 只有新系统时的第一列显示数据
            onlyNewSys: true
        }
    },
    methods: {
        newSubmit(form) {
            if (!form.name) { return }
            let rs = this.validate(form)
            let initParams = { id: '', name: '' }
            let dataParams = {}
            if (!rs.isPass) {
                this.$message({
                    message: rs.msg,
                    type: 'warning'
                })
            } else {
                if (this.newForm.isAllSelect) {
                    dataParams = Object.assign(initParams, {
                        [rs.type]: form.name
                    }, { isAll: true })
                } else {
                    dataParams = Object.assign(initParams, {
                        [rs.type]: form.name
                    }, { isAll: false })
                }
                this.newForm.name = ''
                console.log(dataParams, '请求接口开始')
            }
        },
        oldSubmit(form) {
            if (!form.name) { return }
            let rs = this.validate(form)
            // 模拟接口初始数据 
            let initParams = { id: '', name: '' }
            let dataParams = {}
            if (!rs.isPass) {
                this.$message({
                    message: rs.msg,
                    type: 'warning'
                })
            } else {
                // 数据合并
                if (this.newForm.isAllSelect) {
                    dataParams = Object.assign(initParams, {[rs.type]: form.name}, { isAll: true })
                } else {
                    dataParams = Object.assign(initParams, {[rs.type]: form.name}, { isAll: false })
                }
                this.oldForm.name = ''
                console.log(dataParams, '请求接口开始')
                // this.$router.push('/index') 
            }
        },
        // 信息关联
        msg_Relative() {
            let name1 = '张三'
            let name2 = '李四'
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
            }).catch((res) => { console.log(res) })
        },
        validate(opt) {
            let result = { isPass: false, msg: '', type: '' }
            if (opt.region == '员工姓名') {
                let reg = /^[\u4e00-\u9fa5]+$/g.test(opt.name) && (opt.name.length < 11 && opt.name.length > 1)
                if (reg) {
                    result.isPass = true
                    result.type = 'xm'
                } else {
                    result.isPass = false
                    result.msg = '请输入2-10位汉字搜索'
                }
            }
            if (opt.region == '手机号码') {
                let reg = /^1\d{10}$/.test(opt.name)
                if (reg) {
                    result.isPass = true
                    result.type = 'sj'
                } else {
                    result.isPass = false
                    result.msg = '请输入11位手机号码'
                }
            }
            if (opt.region == '员工工号') {
                let reg = /^[A-Za-z0-9]+$/.test(opt.name) && opt.name.length < 20
                if (reg) {
                    result.isPass = true
                    result.type = 'yggh'
                } else {
                    result.isPass = false
                    result.msg = '请输入20位以内的数字和字母字符'
                }
            }
            if (opt.region == '身份证') {
                let reg = /\d{18}/.test(opt.name) && (opt.name.length == 18)
                if (reg) {
                    result.isPass = true
                    result.type = 'sfz'
                } else {
                    result.isPass = false
                    result.msg = '请输入18位身份证号码'
                }
            }
            return result
        }
    },
    mounted() {
        api.getOldImportData({ wd: '你好' }).then((res) => {
            console.log(res)
        })
    }
}

</script>
<style scoped lang="scss">
.data-import {
    .data-import-cont {
        min-width: 1100px;
        // max-width: 1500px; 
        .left-wrap,.right-wrap {
            height: 450px;
            .left,.right {
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
        min-width: 1100px;
        // max-width: 1500px;
        text-align: center;
        height: 60px;
        line-height: 60px;
    }
}

</style>
