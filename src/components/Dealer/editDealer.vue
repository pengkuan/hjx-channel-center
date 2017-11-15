<template>
<div>
    <div class="title">
        <el-col :span="12">Dealer管理 > 编辑</el-col>
        <el-col :span="12" class="textRight">
            <router-link to="index"><el-button size="small">返回Dealer列表</el-button></router-link>
        </el-col>
    </div>
    <div class="content-container">
        <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
            <p>1.基本信息</p>
            <el-form-item label="公司全称：" prop='dealer.strDealerName' >
                <el-input v-model="ruleForm.dealer.strDealerName" placeholder='请输入公司全称' ></el-input>
            </el-form-item>

            <el-form-item label="公司地址：" class = 'mustStar'>
                <el-col :span="8">
                    <el-form-item prop="dealer.strAddrProvinceId">
                        <el-select v-model="ruleForm.dealer.strAddrProvinceId" filterable placeholder="请选择省份">
                            <el-option  v-for="item in dealer.provinces"  :label="item.strProvinceName"  :value="item.strProvinceId" :key="item.strProvinceId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop="dealer.strAddrCityId">
                        <el-select v-model="ruleForm.dealer.strAddrCityId" filterable placeholder="请选择城市">
                            <el-option  v-for="item in dealer.citys"  :label="item.strCityName"  :value="item.strCityId" :key="item.strCityId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop="dealer.strAddrAreaId">
                        <el-select v-model="ruleForm.dealer.strAddrAreaId" filterable placeholder="请选择区县">
                            <el-option  v-for="item in dealer.areas"  :label="item.strAreaName"  :value="item.strAreaId" :key="item.strAreaId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item  prop='dealer.strAddress'>
                <el-input v-model="ruleForm.dealer.strAddress" placeholder="请输入详细地址"></el-input>
            </el-form-item>

            <el-form-item type='number' label="营业执照号码：" prop='dealer.strLicenseNum' >
                <el-input v-model="ruleForm.dealer.strLicenseNum" disabled :maxlength='18' placeholder='请输入15或18位营业执照号'></el-input>
            </el-form-item>

            <el-form-item label="三证照片："  >

                <el-upload class="avatar-uploader" :name="fileName" :action=" apiRoot + '/upload ' " accept=".jpg,.png,.jpeg" :show-file-list="false" :on-success="handleAvatarSuccess1" :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <p>2.收款信息</p>
            <el-form-item label="银行卡号：" prop='dealer.account_bank.strAccountNum' >
                <el-input v-model="ruleForm.dealer.account_bank.strAccountNum" :type='number' :maxlength='30' placeholder='请输入10~30位银行卡号'></el-input>
            </el-form-item>
            <el-form-item label="开户名：" prop='dealer.account_bank.strAccountName' >
                <el-input v-model="ruleForm.dealer.account_bank.strAccountName" placeholder='请输入开户名' ></el-input>
            </el-form-item>
            <el-form-item label="开户地址：" class = 'mustStar'>
                <el-col :span="8">
                    <el-form-item prop="dealer.account_bank.strAddrProvinceId">
                        <el-select v-model="ruleForm.dealer.account_bank.strAddrProvinceId" filterable placeholder="请选择省份">
                            <el-option  v-for="item in bankAddr.provinces"  :label="item.strProvinceName"  :value="item.strProvinceId" :key="item.strProvinceId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop="dealer.account_bank.strAddrCityId">
                        <el-select v-model="ruleForm.dealer.account_bank.strAddrCityId" filterable placeholder="请选择城市">
                            <el-option  v-for="item in bankAddr.citys"  :label="item.strCityName"  :value="item.strCityId" :key="item.strCityId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop="dealer.account_bank.strAddrAreaId">
                        <el-select v-model="ruleForm.dealer.account_bank.strAddrAreaId" filterable placeholder="请选择区县">
                            <el-option  v-for="item in bankAddr.areas"  :label="item.strAreaName"  :value="item.strAreaId" :key="item.strAreaId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item label="开户银行：" prop="dealer.account_bank.strBankId">
               
                <el-select filterable v-model="ruleForm.dealer.account_bank.strBankId" placeholder="请选择">

                    <el-option v-for="item in bankList" :label='item.strName' :value="item.strId" :key="item.strId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="支行名称：" prop='dealer.account_bank.strBranchName' >
                <el-input v-model="ruleForm.dealer.account_bank.strBranchName" placeholder='请输入支行名称：' ></el-input>
            </el-form-item>

            <p>3.合作信息</p>
            <el-form-item label="合同有效时间：" prop='dateRange' >
                <div class="block">
                    <el-date-picker
                      v-model="ruleForm.dateRange"
                      :default-value="ruleForm.dateRange"
                      format="yyyy.MM.dd"
                      range-separator=" ~ "
                      type="daterange"
                      :clearable='false'
                      placeholder="选择日期范围">
                    </el-date-picker>
                </div>
            </el-form-item>
            
            <el-form-item label="合作协议照片：" >
                <el-upload class="avatar-uploader" :name="fileName" :action=" apiRoot + '/upload ' " accept=".jpg,.png,.jpeg" :show-file-list="false" :on-success="handleAvatarSuccess2" :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <p>4.合作状态</p>
            <el-form-item label="状态：" prop="dealer.account_bank.strBankId">
                <el-select v-model="ruleForm.dealer.strStatus" placeholder="请选择">
                    <el-option v-for="item in statusList" :label="item.strStatudName" :value="item.strStatusId" :key="item.strStatusId" ></el-option>
                    <!-- <el-option label="合作中" value="3"></el-option> -->
                    <!-- <el-option label="暂停合作" value="4"></el-option> -->
                </el-select>
            </el-form-item>

            <el-form-item class="textRight">
                <el-button type="primary" @click="submitnow('ruleForm')">确认更新</el-button>
                <el-button @click="cancelnow">取消</el-button>
            </el-form-item>
            
        </el-form>
        
    </div>

    </div>	
</template>

<script type="text/javascript">
	import api from '../../api/api'
	import util from '../../common/util'
    import commonData from '../../common/data'
	export default {
		data() {

            var validateName = (rule, value, callback) => {
                value = util.Trim(value)
                let len = value.gblen()
                if( len < 12|| len >100){
                    callback(new Error('请输入12~100个字符'))
                }else if( util.checkSpecialWord(value)){
                    callback(new Error('公司名称不能包含特殊字符'))
                }
                callback()
            }
           
            var validateAccountName = (rule, value, callback) => {
                let len = value.gblen()
                if( len < 4|| len >100){
                    callback(new Error('请输入4~100个字符'))
                }
                callback()
            }
            var validateBranchName = (rule, value, callback) => {
                let len = value.gblen()
                if( len < 4|| len >20){
                    callback(new Error('请输入4~20个字符'))
                }
                callback()
            }
            var validateDateRange = (rule, value, callback) => {
                if(!value[0]){
                    callback(new Error('请选择合同有效时间'))
                }
                callback()
            }
		    return {
                apiRoot:util.api,
                fileName:'fileName',
                bankList:[],
                statusList:[],
                
                defaultData:'',
                number:'number',
                imageUrl1: '',//三证照片
                imageUrl2: '',
                dealer:{
                	provinceChange : false,
                	cityChange : false,
                    provinces:commonData.addrList,
                    citys:'',
                    areas:''
                },
                bankAddr:{
                	provinceChange : false,
                	cityChange : false,
                    provinces:commonData.addrList,
                    citys:[],
                    areas:[],
                },
                ruleForm:{
                    'dateRange':[],
                    'dealer':{
                        'dealerid':'',
                    	'strStatus':'',
                        'strDealerName':'',
                        'strAddrProvinceId':'',
                        'strAddrCityId':'',
                        'strAddrAreaId':'',
                        'strAddress':'',
                        'strLicenseNum':'',
                        'strLicensePic':'',
                        'account_bank':{
                            'strAccountNum':'',
                            'strAccountName':'',
                            'strAddrProvinceId':'',
                            'strAddrCityId':'',
                            'strAddrAreaId':'',
                            'strBankId':'',
                            'strBranchName':''
                        },
                        'strContractBeginTime':'',
                        'strContractEndTime':'',
                        'strContractPic':''
                    }
                     
	            },
                rules:{
                    'dealer.strAddrProvinceId': [
                        {  required: true, message: '请选择省份', trigger: 'change' }
                    ],
                    'dealer.strAddrCityId': [
                        {  required: true, message: '请选择城市', trigger: 'change' }
                    ],
                    'dealer.strAddrAreaId': [
                        {  required: true, message: '请选择区域', trigger: 'change' }
                    ],
                    'dealer.strDealerName': [
                        {  required: true , validator: validateName, trigger: 'blur' }
                    ],
                    'dealer.strAddress': [
                        {  required: true , validator: util.validateAddr, trigger: 'blur' }
                    ],
                    'dealer.strLicenseNum': [
                        {  required: true , validator: util.validateLicenseNum, trigger: 'blur' }
                    ],

                    'dealer.account_bank.strAccountNum': [
                        {  required: true , validator: util.validateAccountNum, trigger: 'blur' }
                    ],
                    'dealer.account_bank.strAccountName': [
                        {  required: true , validator: validateAccountName, trigger: 'blur' }
                    ],
                    'dealer.account_bank.strBranchName': [
                        {  required: true , validator: validateBranchName, trigger: 'blur' }
                    ],

                    'dealer.account_bank.strAddrProvinceId': [
                        {  required: true, message: '请选择省份', trigger: 'change' }
                    ],
                    'dealer.account_bank.strAddrCityId': [
                        {  required: true, message: '请选择城市', trigger: 'change' }
                    ],
                    'dealer.account_bank.strAddrAreaId': [
                        {  required: true, message: '请选择区域', trigger: 'change' }
                    ],
                    'dealer.account_bank.strBankId': [
                        {  required: true, message: '请选择开户银行', trigger: 'change' }
                    ],
                    'dateRange': [
                        {required: true, validator: validateDateRange, trigger: 'blur' }
                    ]
                    
                }
		    }
		},
        watch: {
            // 省市区
            'ruleForm.dealer.strAddrProvinceId': function(val, oldVal) {
                this.ruleForm.dealer.strAddrCityId = ''
                this.getCitys(val , this.dealer.provinceChange)
                this.dealer.provinceChange = true
            },
            'ruleForm.dealer.strAddrCityId': function(val) {
                this.ruleForm.dealer.strAddrAreaId = ''
                this.getAreas(val , this.dealer.cityChange)
                this.dealer.cityChange = true
            },
            'ruleForm.dealer.account_bank.strAddrProvinceId': function(val, oldVal) {
                this.ruleForm.dealer.account_bank.strAddrCityId = ''
                this.getCitys(val , this.bankAddr.provinceChange , 'bank')
                this.bankAddr.provinceChange = true
            },
            'ruleForm.dealer.account_bank.strAddrCityId': function(val) {
                this.ruleForm.dealer.account_bank.strAddrAreaId = ''
                this.getAreas(val , this.bankAddr.cityChange , 'bank')
                this.bankAddr.cityChange = true
            }
        },
		mounted()  {
			this.getId()
            this.getdefaultData()
		},
		methods:{
			getId:function(){
	            this.ruleForm.dealer.dealerid= this.$route.query.id
	        },
            loadInfo: function() {
                api.getDStatus({'who':'dealer'}).then(res =>{
                    if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
                    this.statusList = res.data.list
                })
                api.getBank({}).then(res => {
                    if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
                    this.bankList = res.data.bankList
                })
                if(commonData.addrList.length == 0){
                    api.getAddress({}).then(res => {
                        if (res.ret != '0') {
                            this.$layer.alert(res.retinfo)
                            return
                        }
                        commonData.addrList = res.data.address
                        this.dealer.provinces = res.data.address
                        this.bankAddr.provinces = res.data.address

                        this.ruleForm.dealer.strAddrProvinceId = this.defaultData.strAddrProvinceId
                        this.ruleForm.dealer.account_bank.strAddrProvinceId = this.defaultData.account_bank.strAddrProvinceId
                    })
                }else{
                    this.ruleForm.dealer.strAddrProvinceId = this.defaultData.strAddrProvinceId
                    this.ruleForm.dealer.account_bank.strAddrProvinceId = this.defaultData.account_bank.strAddrProvinceId
                }
     //            api.getAddress({}).then(res => {
     //                if (res.ret != '0') {
     //                    this.$message(res.retinfo)
     //                    return
     //                }
     //                this.dealer.provinces = res.data.address
     //                this.bankAddr.provinces = res.data.address
     //            }).then(res => {
					// this.ruleForm.dealer.strAddrProvinceId = this.defaultData.strAddrProvinceId
					// this.ruleForm.dealer.account_bank.strAddrProvinceId = this.defaultData.account_bank.strAddrProvinceId
     //            })
                
            },
            getdefaultData : function(strStoreId){
            	api.getDealerInfo({dealerid:this.ruleForm.dealer.dealerid}).then(res => {
                	if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
					let msg = res.data
					this.defaultData = res.data
                    

					this.ruleForm.dealer.strDealerName = msg.strDealerName
					this.ruleForm.dealer.strLicenseNum = msg.strLicenseNum
					this.ruleForm.dealer.strAddress = msg.strAddress

					this.ruleForm.dealer.account_bank.strAccountName = msg.account_bank.strAccountName
					this.ruleForm.dealer.account_bank.strBankId = msg.account_bank.strBankId
					this.ruleForm.dealer.account_bank.strBranchName = msg.account_bank.strBranchName
					
					this.ruleForm.dealer.account_bank.strAccountNum = msg.account_bank.strAccountNum
					this.ruleForm.dealer.strStatus = msg.strStatusId

                    this.ruleForm.dealer.strLicensePic = msg.strLicensePic
                    this.ruleForm.dealer.strContractPic = msg.strContractPic
                    this.imageUrl1 =this.apiRoot+ '/static/upload/' + msg.strLicensePic
                    this.imageUrl2 =this.apiRoot+  '/static/upload/' + msg.strContractPic
                    //处理后台返回时间格式 为该时间组件默认格式
                    let beginTimeArr = msg.strContractBeginTime.split(' ')
                    let endTimeArr = msg.strContractEndTime.split(' ')

                    // this.ruleForm.dateRange = [beginTimeArr[0], endTimeArr[0]]
                    this.ruleForm.dateRange = [beginTimeArr[0]+'T'+beginTimeArr[1]+'.000Z', endTimeArr[0]+'T'+endTimeArr[1]+'.000Z']

					return true
				}).then((res) =>{
	                if(res) this.loadInfo()
	            })
            },
			//取消
            cancelnow: function() {
                this.$router.push({ path: '/Dealer/index' })
            },

            //确定
            submitnow(formName , GoOn) {
                let self = this
                this.$refs[formName].validate((valid) => {

                    if (valid) {
                        // if(!this.ruleForm.dealer.strLicensePic){
                        //     this.$layer.alert('请上传三证照片')
                        //     return
                        // } 
                        // if(!this.ruleForm.dealer.strLicensePic){
                        //     this.$layer.alert('请上传合同协议照片')
                        //     return
                        // }
                        this.ruleForm.dealer.strDealerName = util.Trim(this.ruleForm.dealer.strDealerName)

                        this.ruleForm.dealer.strContractBeginTime =  util.formatDate.format(this.ruleForm.dateRange[0] , 'y-M-d h:m:s')
                        this.ruleForm.dealer.strContractEndTime = util.formatDate.format(this.ruleForm.dateRange[1] , 'y-M-d h:m:s')

                        api.editDealerLogic(this.ruleForm).then(res => {
                            if (res.ret != '0') {
                                this.$message('失败！')
                                return
                            }
                            this.$message('成功！')
                            if(!GoOn) self.$router.push({ path: '/Dealer/index' })
                            else self.$refs['ruleForm'].resetFields()

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
                
            },
            // 获取当前对应城市
            getCitys: function(val ,change, bank) {
                if(bank == 'bank'){
                    var bankProvinces = this.bankAddr.provinces
                    for (var index in bankProvinces) {
                        if (bankProvinces[index].strProvinceId == val) {
                            this.bankAddr.citys = bankProvinces[index].citys
                            if(!change) this.ruleForm.dealer.account_bank.strAddrCityId = this.defaultData.account_bank.strAddrCityId
                        }
                    }
                }else{
                    var dealerProvinces = this.dealer.provinces
                    for (var index in dealerProvinces) {
                        if (dealerProvinces[index].strProvinceId == val) {
                            this.dealer.citys = dealerProvinces[index].citys
                            if(!change) this.ruleForm.dealer.strAddrCityId = this.defaultData.strAddrCityId
                        }
                    }
                }
            },
            // 获取当前对应区域
            getAreas: function(val ,change, bank) {
                if(bank == 'bank'){
                    var bankCitys = this.bankAddr.citys
                    for (var index in bankCitys) {
                        if (bankCitys[index].strCityId == val) {
                            this.bankAddr.areas = bankCitys[index].areas
                            if(!change) this.ruleForm.dealer.account_bank.strAddrAreaId = this.defaultData.account_bank.strAddrAreaId
                        }
                    }
                }else{
                    var dealerCitys = this.dealer.citys
                    for (var index in dealerCitys) {
                        if (dealerCitys[index].strCityId == val) {
                            this.dealer.areas = dealerCitys[index].areas
                            if(!change) this.ruleForm.dealer.strAddrAreaId = this.defaultData.strAddrAreaId
                        }
                    }
                }
            },

            handleAvatarSuccess1(res, file) {
                this.ruleForm.dealer.strLicensePic = file.response.fileName
                this.imageUrl1 = URL.createObjectURL(file.raw);
            },
            handleAvatarSuccess2(res, file) {
                this.ruleForm.dealer.strContractPic = file.response.fileName
                this.imageUrl2 = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJpeg = file.type === 'image/jpeg'
                const isPng = file.type === 'image/png'
                const isJPG = file.type === 'image/jpg'
                const isLt1M = file.size / 1024 / 1024 < 1
                var flags
                if ((!isJpeg) && (!isPng) && (!isJPG)) {
                    flags = false
                    this.$message.error('只能上传头像图片格式为.jpg .png .jpeg!')
                }
                if (!isLt1M) {
                  this.$message.error('上传头像图片大小不能超过 1MB!')
                }
                return flags && isLt1M
            }

		}
	}
</script>