<template>
    <div>
        <hjx-header label="BD管理 / 详情">
            <router-link to="index"><el-button size="small">返回BD列表</el-button></router-link>
            <el-button type="primary" size="small" @click="editBD(strUserId)">编辑BD</el-button>
        </hjx-header>
        <div style='width:900px;margin:auto'>
            <el-tabs type="border-card">
                <el-tab-pane label="账号详情">
                    <el-form label-width="150px">
                        <p>1.基本信息</p><br>
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
                        <el-form-item label="邮箱：">
                            <span>{{ruleForm.baseinfo.strEmail}}</span>
                        </el-form-item>
                        <el-form-item label="身份证照片正面：" class='pic'>
                            <img v-if="ruleForm.baseinfo.strCardPicFront" :src=" _Config.API + '/static/upload/' + ruleForm.baseinfo.strCardPicFront">
                            <img v-else src="../../assets/images/no_img.png">
                        </el-form-item>
                        <el-form-item label="身份证照片背面：" class='pic'>
                            <img v-if="ruleForm.baseinfo.strCardPicBack" :src=" _Config.API+'/static/upload/' + ruleForm.baseinfo.strCardPicBack">
                            <img v-else src="../../assets/images/no_img.png">
                        </el-form-item>
                        <el-form-item label="头像照片：" class='pic'>
                            <img v-if="ruleForm.baseinfo.strHeadPic" :src=" _Config.API+ '/static/upload/' + ruleForm.baseinfo.strHeadPic">
                            <img v-else src="../../assets/images/no_img.png">
                        </el-form-item>
                        <p>2.数据范围</p><br>
                        <el-form-item label="">
                            <el-table :data="ruleForm.identityList" style="width: 402px">
                                <el-table-column prop="strMyLevelName" label="组织身份" width="180">
                                </el-table-column>
                                <el-table-column label="对应上级" width="220">
                                    <template slot-scope="scope">
                                        {{scope.row.strLeadUserName + ' / ' + scope.row.strLeadPhoneNum }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-form-item label="销售区域：">
                            <div v-for="item in ruleForm.saleareaList">
                                {{item}}
                            </div>
                        </el-form-item>
                        <p>3.收款信息</p><br>
                        <el-form-item label="微信昵称：">
                            <span v-if="ruleForm.accountInfo.strWechatName">{{ruleForm.accountInfo.strWechatName}}</span>
                            <span v-else>暂无</span>
                        </el-form-item>
                        <el-form-item label="微信openid：">
                            <span v-if="ruleForm.accountInfo.strWechatOpenId">{{ruleForm.accountInfo.strWechatOpenId}}</span>
                            <span v-else>暂无</span>
                        </el-form-item>
                        <el-form-item label="微信头像：" class="pic">
                            <img v-if="ruleForm.accountInfo.strWechatHeadPic" :src="ruleForm.accountInfo.strWechatHeadPic">
                            <img v-else src="../../assets/images/no_img.png">
                        </el-form-item>
                        <p>4.合作状态</p>
                        <el-form-item label="状态：">
                            <span>{{ruleForm.baseinfo.strStatusName}}</span>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="负责门店">
                    <!-- <el-table :data="dataList" border style="width: 100% ; min-height:300px">
                        <el-table-column prop="strStoreId" label="门店ID" ></el-table-column>
                        <el-table-column prop="strStoreName" label="门店名称" ></el-table-column>
                        <el-table-column prop="strProvinceName" label="门店地址">
                            <template slot-scope="scope">
                                {{scope.row.strProvinceName + scope.row.strCityName + scope.row.strAreaName +scope.row.strAddress}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="strChannelName" label="商户" ></el-table-column>
                        <el-table-column prop="strRelationD1List" label="D1" >
                            <template slot-scope="scope">
                                <span v-if="scope.row.strRelationD1List.length == 1">
                                    {{scope.row.strRelationD1List[0].strUserName+' / '+scope.row.strRelationD1List[0].strPhoneNum}}
                                </span>
                                <span v-else-if="scope.row.strRelationD1List.length>1">
                                    {{scope.row.strRelationD1List[0].strUserName+' / '+scope.row.strRelationD1List[0].strPhoneNum}}  ...
                                </span>
                                <span v-else>暂无</span>
                            </template>
                        </el-table-column>
                        <el-table-column  label="合作状态" >
                            <template slot-scope="scope">
                                <span v-for="item in statusList" v-if="scope.row.strStatus == item.id">{{item.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column  label="关联状态" >
                            <template slot-scope="scope">
                                <span v-for = "item in relatedStatusList" v-if="scope.row.strStatus == item.id">{{item.name}}</span>
                            </template>
                        </el-table-column>
                    </el-table> -->
                    <el-table :data="dataList" border style="width: 100% ; min-height:300px">
                        <el-table-column prop="strStoreId" label="门店ID">
                        </el-table-column>
                        <el-table-column prop="strStoreName" label="名称"></el-table-column>
                        <el-table-column prop="strChannelName" label="所属商户"></el-table-column>
                        <el-table-column label="地址">
                            <template slot-scope="scope">
                                {{scope.row.strProvinceName + scope.row.strCityName + scope.row.strAreaName +scope.row.strAddress}}
                            </template>
                        </el-table-column>
                        <el-table-column label="合作状态">
                            <template slot-scope="scope">{{scope.row.strStatus == '1' ?'正常':'停止'}}</template>
                        </el-table-column>
                        <el-table-column prop="strCreateTime" label="生效时间"></el-table-column>
                        <el-table-column prop="strUpdateTime" label="截止时间"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="storeBDetail(scope.row.strStoreId)" size="small">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script type="text/javascript">
import api from '../../api/api'
import { mapGetters , mapActions} from 'vuex'
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
                    strEmail: '',
                    strCardPicBack: '',
                    strCardPicFront: '',
                    strHeadPic: '',
                    strPhoneNum: '',
                    strStatus: '',
                    strUserId: '',
                    strUserName: ''
                },
                identityList: [],
                saleareaList: []
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
        this.getBDStoreList(this.strUserId)
    },
    methods: {
        getId: function() {
            this.strUserId = this.$route.query.id
        },
        addPrefix: function(val) {
            let addLen = 8 - val.length
            let prefix = 'bd'
            if (addLen > 0) {
                for (var i = 0; i < addLen; i++) {
                    prefix += '0'
                }
                return prefix + val
            }
            return val
        },
        //跳至编辑页面
        editBD: function(strUserId) {
            this.$router.push({
                name: 'editBD',
                query: { id: strUserId }
            })
        },
        getDefaultDate: function(strStoreId) {
            api.getBDInfo({ strUserId: this.strUserId }).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                res.baseinfo.strUserId = this.addPrefix(res.baseinfo.strUserId)
                this.ruleForm = res
                this.ruleForm.saleareaList = util.unique(this.ruleForm.saleareaList
                    .map(function(item) {
                        return item.strProvinceName + item.strCityName + item.strAreaName
                    }))
            })
        },
        getBDStoreList: function(strUserId) {
            api.getBDStoreList({ 'strUserId': strUserId }).then(res => {
                if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.dataList = res.list
            })
        },
        storeBDetail: function(strStoreId) {
            this.$router.push({
                name: 'detailStore',
                query: { id: strStoreId }
            })
        }
    }
}

</script>
<style type="text/css" scoped>
.content-container {width: 800px}
.avatar-uploader .el-upload {border: 1px dashed #bfcbd9;border-radius: 6px;cursor: pointer;position: relative;overflow: hidden;}
.avatar-uploader .el-upload:hover {border-color: #20a0ff;}
.avatar-uploader-icon {font-size: 28px;color: #8c939d;width: 128px;height: 128px;line-height: 128px;text-align: center;}
.avatar {width: 128px;height: 128px;display: block;}
</style>