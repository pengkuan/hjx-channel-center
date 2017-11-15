<template>
    <div>
        <div class="title">
            <el-col :span="12">Dealer管理 > 详情</el-col>
            <el-col :span="12" class="textRight">
                <router-link to="index"><el-button size="small">返回Dealer列表</el-button></router-link>
            </el-col>
        </div>
        <div style='width:900px;margin:auto'>
            <div class="tool">
                <el-button type="primary" size="small" @click="editDealer(dealerid)">编辑Dealer</el-button>
            </div>
            <el-tabs type="border-card">
                <el-tab-pane label="Dealer详情">
                    <el-form :model="ruleForm" ref="ruleForm" label-width="150px">
                        <p>1.基本信息</p>
                        <el-form-item label="公司全称：" prop='dealer.strDealerName'>
                            <span>{{ruleForm.dealer.strDealerName}}</span>
                        </el-form-item>
                        <el-form-item label="公司地址：" prop='dealer.strAddress'>
                            <span>{{ruleForm.dealer.strAddress}}</span>
                        </el-form-item>
                        <el-form-item label="营业执照号码：" prop='dealer.strLicenseNum'>
                            <span>{{ruleForm.dealer.strLicenseNum}}</span>
                        </el-form-item>
                        <el-form-item label="三证照片：" class='pic'>
                            <img :src="apiRoot+ '/static/upload/' + ruleForm.dealer.strLicensePic">
                        </el-form-item>
                        <p>2.收款信息</p>
                        <el-form-item label="银行卡号：" prop='dealer.account_bank.strAccountNum'>
                            <span>{{ruleForm.dealer.account_bank.strAccountNum}}</span>
                        </el-form-item>
                        <el-form-item label="开户名：" prop='dealer.account_bank.strAccountName'>
                            <span>{{ruleForm.dealer.account_bank.strAccountName}}</span>
                        </el-form-item>
                        <el-form-item label="开户地址：">
                            <span>{{ruleForm.dealer.account_bank.strAddress}}</span>
                        </el-form-item>
                        <el-form-item label="开户银行：" prop="dealer.account_bank.strBankName">
                            <span>{{ruleForm.dealer.account_bank.strBankName}}</span>
                        </el-form-item>
                        <el-form-item label="支行名称：" prop='dealer.account_bank.strBranchName'>
                            <span>{{ruleForm.dealer.account_bank.strBranchName}}</span>
                        </el-form-item>
                        <p>3.合作信息</p>
                        <el-form-item label="合同生效时间：" prop='dealer.strContractBeginTime'>
                            <span>{{ruleForm.dealer.strContractBeginTime}}</span>
                        </el-form-item>
                        <el-form-item label="合同结束时间：" prop='dealer.strContractEndTime'>
                            <span>{{ruleForm.dealer.strContractEndTime}}</span>
                        </el-form-item>
                        <el-form-item label="合作协议照片：" class='pic'>
                            <img :src="apiRoot+ '/static/upload/' + ruleForm.dealer.strContractPic">
                        </el-form-item>
                        <p>4.合作状态</p>
                        <el-form-item label="状态：" prop="dealer.account_bank.strBankName">
                            <span>{{ruleForm.dealer.strStatusName}}</span>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="D4">
                    <div v-if='haveD4'>未关联D4</div>
                    <el-form v-else label-width="150px">
                        <p>1.基本信息</p>
                        <el-form-item label="用户ID：">
                            <span>{{DruleForm.baseinfo.strUserId}}</span>
                        </el-form-item>
                        <el-form-item label="用户姓名：">
                            <span>{{DruleForm.baseinfo.strUserName}}</span>
                        </el-form-item>
                        <el-form-item label="手机号：">
                            <span>{{DruleForm.baseinfo.strPhoneNum}}</span>
                        </el-form-item>
                        <el-form-item label="身份证号：">
                            <span>{{DruleForm.baseinfo.strCardNum}}</span>
                        </el-form-item>
                        <el-form-item label="身份证照片正面：" class='pic'>
                            <img :src="apiRoot+ '/static/upload/' + DruleForm.baseinfo.strCardPicFront">
                        </el-form-item>
                        <el-form-item label="身份证照片背面：" class='pic'>
                            <img :src="apiRoot+ '/static/upload/' + DruleForm.baseinfo.strCardPicBack">
                        </el-form-item>
                        <el-form-item label="头像照片：" class='pic'>
                            <img :src="apiRoot+ '/static/upload/' + DruleForm.baseinfo.strHeadPic">
                        </el-form-item>
                        <p>2.数据范围</p>
                        <el-form-item label="">
                            <el-table :data="DruleForm.identityList" style="width: 402px">
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
                            <div v-for="item in DruleForm.saleareaList">
                                {{item.strProvinceName + item.strCityName + item.strAreaName}}
                            </div>
                        </el-form-item>
                        <p>3.收款信息</p>
                        <el-form-item label="微信昵称：">
                            <span>{{DruleForm.accountInfo.strWechatName}}</span>
                        </el-form-item>
                        <el-form-item label="微信openid：">
                            <span>{{DruleForm.accountInfo.strWechatOpenId}}</span>
                        </el-form-item>
                        <el-form-item label="微信头像：">
                            <span>{{DruleForm.accountInfo.strAccountInfoId}}</span>
                        </el-form-item>
                        <p>4.合作状态</p>
                        <el-form-item label="状态：">
                            <span>{{DruleForm.baseinfo.strStatusName}}</span>
                        </el-form-item>
                    </el-form>
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
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            fileName: 'fileName',
            haveD4: false,
            strDUserId: '',
            defaultDate: '',
            number: 'number',
            imageUrl1: '', //三证照片
            imageUrl2: '',
            imageUrl3: '',
            dealer: {
                strStatusName: '',
                provinceChange: false,
                cityChange: false,
                provinces: '',
                citys: '',
                areas: ''
            },
            bankAddr: {
                provinceChange: false,
                cityChange: false,
                provinces: '',
                citys: '',
                areas: '',
            },
            dealerid: '',
            ruleForm: {
                'dealer': {
                    'strStatus': '',
                    'strDealerName': '',
                    'strAddress': '',
                    'strLicenseNum': '',
                    'strLicensePic': '',
                    'account_bank': {
                        'strAccountNum': '',
                        'strAccountName': '',
                        'strAddress': '',
                        'strBankName': '',
                        'strBranchName': ''
                    },
                    'strContractBeginTime': '',
                    'strContractEndTime': '',
                    'strContractPic': ''
                }

            },
            DruleForm: {
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
                    strStatusName: '',
                    strUserId: '',
                    strUserName: ''
                },
                identityList: [],
                saleareaList: []
            }

        }
    },

    mounted() {
        this.getId()
        this.getDefaultDate()
    },
    methods: {
        getId: function() {
            this.dealerid = this.$route.query.id
        },
        changeEndTime: function(val) {
            let endTimeArr = val.split(' ')
            let time = endTimeArr[0] + 'T' + endTimeArr[1] + '.000Z'
            return util.formatDate.format(new Date(time), "yy-MM-dd")
        },
        //跳至编辑页面
        editDealer: function(strUserId) {
            this.$router.push({
                name: 'editDealer',
                query: { id: strUserId }
            })
        },
        loadInfo: function() {
            api.getAddress({}).then(res => {
                this.dealer.provinces = res.data.address
                this.bankAddr.provinces = res.data.address
            }).then(res => {
                this.ruleForm.dealer.strAddrProvinceId = this.defaultDate.strAddrProvinceId
                this.ruleForm.dealer.account_bank.strAddrProvinceId = this.defaultDate.account_bank.strAddrProvinceId
            })

        },
        getDefaultDate: function(strStoreId) {
            api.getDealerInfo({ dealerid: this.dealerid }).then(res => {
                if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return false
                }
                let msg = res.data
                this.defaultDate = res.data
                this.strDUserId = res.data.strDUserId

                this.ruleForm.dealer.strDealerName = msg.strDealerName
                this.ruleForm.dealer.strLicenseNum = msg.strLicenseNum
                this.ruleForm.dealer.strAddress = msg.strProvinceName + msg.strCityName + msg.strAreaName + msg.strAddress
                this.ruleForm.dealer.account_bank.strAddress = msg.account_bank.strProvinceName + msg.account_bank.strCityName + msg.account_bank.strAreaName

                this.ruleForm.dealer.account_bank.strAccountName = msg.account_bank.strAccountName
                this.ruleForm.dealer.account_bank.strBankName = msg.account_bank.strBankName
                this.ruleForm.dealer.account_bank.strBranchName = msg.account_bank.strBranchName

                this.ruleForm.dealer.account_bank.strAccountNum = msg.account_bank.strAccountNum
                this.ruleForm.dealer.strContractBeginTime = this.changeEndTime(msg.strContractBeginTime)
                this.ruleForm.dealer.strContractEndTime = this.changeEndTime(msg.strContractEndTime)
                this.ruleForm.dealer.strStatusName = msg.strStatusName

                this.ruleForm.dealer.strLicensePic = msg.strLicensePic
                this.ruleForm.dealer.strContractPic = msg.strContractPic
                this.imageUrl1 = this.apiRoot + '/static/upload/' + msg.strLicensePic
                this.imageUrl2 = this.apiRoot + '/static/upload/' + msg.strContractPic

                return true
            }).then((res) => {
                if (res) this.loadInfo(), this.getDDefaultDate()
            })
        },
        //D详情
        getDDefaultDate: function() {
            var self = this
            if (this.strDUserId == 0) {
                this.haveD4 = true
                return
            }
            api.getDInfo({ strUserId: this.strDUserId }).then(res => {
                if (res.ret != '0') {
                    self.$message(res.retinfo)
                    return false
                }
                this.DruleForm = res

            })
        },
        //取消
        cancelnow: function() {
            this.$router.push({ path: '/Dealer/index' })
        },

        //确定
        submitnow(formName, GoOn) {
            let self = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    api.addDealerLogic(this.ruleForm).then(res => {
                        if (res.ret != '0') {
                            this.$message('失败！')
                            return
                        }
                        this.$message('成功！')
                        if (!GoOn) self.$router.push({ path: '/Dealer/index' })
                        else self.$refs['ruleForm'].resetFields()

                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })

        }

    }
}

</script>
