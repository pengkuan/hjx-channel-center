<template>
    <div>
        <div class="title">
		    <el-col :span="12">D管理 > 详情</el-col>
		    <el-col :span="12" class="textRight">
		        <router-link to="index"><el-button size="small">返回D列表</el-button></router-link>
		    </el-col>
		</div>
        <div style='width:900px;margin:auto'>
            <div class="tool">
                <el-button type="primary" size="small" @click="editD(strUserId)">编辑D</el-button>
            </div>
            <el-tabs type="border-card">
                <el-tab-pane label="账号详情">
                    <el-form label-width="150px">
                        <p>1.基本信息</p>
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
                            <img :src=" apiRoot + '/static/upload/' + ruleForm.baseinfo.strCardPicFront">
                        </el-form-item>
                        <el-form-item label="身份证照片背面：" class='pic'>
                            <img :src=" apiRoot+'/static/upload/' + ruleForm.baseinfo.strCardPicBack">
                        </el-form-item>
                        <el-form-item label="头像照片：" class='pic'>
                            <img :src=" apiRoot+ '/static/upload/' + ruleForm.baseinfo.strHeadPic">
                        </el-form-item>
                        <p>2.数据范围</p>
                        <el-form-item label="">
                            <el-table :data="ruleForm.identityList" style="width: 402px">
                                <el-table-column prop="strLevelName" label="组织身份" width="180">
                                </el-table-column>
                                <el-table-column prop="strLevelName" label="对应上级" width="220">
                                    <template slot-scope="scope">
                                        {{scope.row.strUserName + ' / ' + scope.row.strPhoneNum }}
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-form-item label="销售区域：">
                            <div v-for="item in ruleForm.saleareaList">
                                {{item}}
                            </div>
                        </el-form-item>
                        <p>3.收款信息</p>
                        <el-form-item label="微信昵称：">
                            <span>{{ruleForm.accountInfo.strWechatName}}</span>
                        </el-form-item>
                        <el-form-item label="微信openid：">
                            <span>{{ruleForm.accountInfo.strWechatOpenId}}</span>
                        </el-form-item>
                        <el-form-item label="微信头像：">
                            <span>{{ruleForm.accountInfo.strAccountInfoId}}</span>
                        </el-form-item>
                        <p>4.合作状态</p>
                        <el-form-item label="状态：">
                            <span>{{ruleForm.baseinfo.strStatusName}}</span>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="负责门店">
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
                            <template slot-scope="scope">
                                <span v-if="scope.row.strStatus == '1' ">待审核</span>
                                <span v-else-if="scope.row.strStatus == '2' ">资料不全</span>
                                <span v-else-if="scope.row.strStatus == '3' ">合作中</span>
                                <span v-else-if="scope.row.strStatus == '4' ">暂停合作</span>
                                <span v-else-if="scope.row.strStatus == '5' ">黑名单</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="strCreateTime" label="生效时间"></el-table-column>
                        <el-table-column prop="strUpdateTime" label="截止时间"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="storeDetail(scope.row.strStoreId)" size="small">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <div class="tool">
                <router-link to="index">
                    <el-button size="small">关闭</el-button>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script type="text/javascript">
import api from '../../api/api';
import util from '../../common/util';
export default {
    data() {

        return {
            apiRoot: util.api,
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
                identityList: [],
                saleareaList: []
            },

        }
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
                    this.$layer.alert(res.retinfo)
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
        //销售区域去重
        delReSaleAdds: function(list) {

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
                name: 'editStore',
                query: { id: strStoreId }
            })
        }


    }
}

</script>
