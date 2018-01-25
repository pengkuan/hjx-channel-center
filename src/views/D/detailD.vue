<template>
    <div id="d-detailD">
        <hjx-header label="D管理 / 详情">
            <router-link to="index"><el-button size="small">返回D列表</el-button></router-link>
            <el-button type="primary" size="small" @click="editD(strUserId)">编辑D</el-button>
        </hjx-header>
        <el-tabs type="border-card">
            <el-tab-pane label="账号详情">
                <el-form label-width="150px">
                    <el-alert title="基本信息" type="info" :closable="false"></el-alert><br>
                    <el-form-item label="用户ID：">
                        <span>{{ruleForm.baseinfo.strUserId}}</span>
                    </el-form-item>
                    <el-form-item label="用户姓名：">
                        <span>{{ruleForm.baseinfo.strUserName}}</span>
                    </el-form-item>
                    <el-form-item label="手机号：">
                        <span>{{ruleForm.baseinfo.strPhoneNum}}</span>
                    </el-form-item>
                    <el-form-item label="身份证号：">
                        <span>{{ruleForm.baseinfo.strCardNum}}</span>
                    </el-form-item>
                    <el-form-item label="身份证照片正面：" class='pic'>
                        <img v-if="ruleForm.baseinfo.strCardPicFront" :src=" _Config.API + '/static/upload/' + ruleForm.baseinfo.strCardPicFront">
                        <img v-else src="../../assets/images/no_img.png">
                    </el-form-item>
                    <el-form-item label="身份证照片背面：" class='pic'>
                        <img v-if="ruleForm.baseinfo.strCardPicBack"  :src=" _Config.API+'/static/upload/' + ruleForm.baseinfo.strCardPicBack">
                        <img v-else src="../../assets/images/no_img.png">
                    </el-form-item>
                    <el-form-item label="头像照片：" class='pic'>
                        <img v-if="ruleForm.baseinfo.strHeadPic"  :src=" _Config.API+ '/static/upload/' + ruleForm.baseinfo.strHeadPic">
                        <img v-else src="../../assets/images/no_img.png">
                    </el-form-item>
                    <el-alert title="数据范围" type="info" :closable="false"></el-alert><br>
                    <el-form-item >
                        <el-table :data="ruleForm.identityList" border style="width: 800px">
                            <el-table-column prop="strLevelName" label="组织身份"></el-table-column>
                            <el-table-column prop="strLevelName" label="对应上级">
                                <template slot-scope="scope">
                                    {{scope.row.strUserName + ' / ' + scope.row.strPhoneNum }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="strAreaList" label="销售区域"></el-table-column>
                        </el-table>
                    </el-form-item>
                    <el-alert title="收款信息" type="info" :closable="false"></el-alert><br>
                    <el-form-item label="微信昵称：">
                        <span v-if="ruleForm.accountInfo.strWechatName">{{ruleForm.accountInfo.strWechatName}}</span>
                        <span v-else>暂无</span>
                    </el-form-item>
                    <el-form-item label="微信openid：">
                        <span v-if="ruleForm.accountInfo.strWechatOpenId">{{ruleForm.accountInfo.strWechatOpenId}}</span>
                        <span v-else>暂无</span>
                    </el-form-item>
                    <el-form-item label="微信头像：" class="pic">
                        <img v-if="ruleForm.accountInfo.strWechatHeadPic"  :src="ruleForm.accountInfo.strWechatHeadPic">
                        <img v-else src="../../assets/images/no_img.png">
                    </el-form-item>
                    <el-alert title="合作状态" type="info" :closable="false"></el-alert><br>
                    <el-form-item label="状态：">
                        <span>{{ruleForm.baseinfo.strStatusName}}</span>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="负责门店">
                <el-table :data="dataList" border style="width: 100% ; min-height:300px">
                    <el-table-column prop="strStoreId" label="门店ID" ></el-table-column>
                    <el-table-column prop="strStoreName" label="门店名称" ></el-table-column>
                    <el-table-column prop="strChannelName" label="商户" ></el-table-column>
                    <el-table-column  label="合作状态" >
                        <template slot-scope="scope">
                            <span v-for="item in statusList" v-if="scope.row.strStatus == item.id">{{item.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="关联状态" >
                        <template slot-scope="scope">
                            <span v-for = "item in relatedStatusList" v-if="scope.row.strRelatedStatus == item.id">{{item.name}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script type="text/javascript">
import api from '../../api/api'
import { mapGetters } from 'vuex'
import util from '../../common/util'
export default {
    data() {
        return {
            strUserId: '',
            dataList: [],
            ruleForm: {
                accountInfo: {
                    strAccountInfoId: '',
                    strWechatName: '',
                    strWechatOpenId: ''
                },
                baseinfo: {
                    strAccountId: '',
                    strCardNum: '',
                    strCardPicBack: '',
                    strCardPicFront: '',
                    strHeadPic: '',
                    strPhoneNum: '',
                    strStatus: '',
                    strUserId: '',
                    strUserName: ''
                },
                identityList: []
            },
        }
    },
    computed:{
        ...mapGetters({
            statusList : 'store/status',
            relatedStatusList : 'store/relatedStatus',
        })
    },
    mounted() {
        this.getId()
        this.getDefaultDate()
        this.getDStoreList(this.strUserId)
    },
    methods: {
        getId: function() {
            this.strUserId = this.$route.query.id
        },
        addPrefix: function(val) {
            let addLen = 8 - val.length
            let prefix = 'd'
            if (addLen > 0) {
                for (var i = 0; i < addLen; i++) {
                    prefix += '0'
                }
                return prefix + val
            }
            return val
        },
        //跳至编辑页面
        editD: function(strUserId) {
            this.$router.push({
                name: 'editD',
                query: { id: strUserId }
            })
        },
        getDefaultDate: function(strStoreId) {
            api.getDInfo({ strUserId: this.strUserId }).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                res.baseinfo.strUserId = this.addPrefix(res.baseinfo.strUserId)
                this.ruleForm = res
            })
        },
        getDStoreList: function(strUserId) {
            api.getDStoreList({ 'strUserId': strUserId }).then(res => {
                if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.dataList = res.list
            })
        },
        storeDetail: function(strStoreId) {
            this.$router.push({
                name: 'detailStore',
                query: { id: strStoreId }
            })
        }
    }
}
</script>
<style type="text/css" scoped>
    #d-detailD .pic{margin-bottom: 12px}
</style>
