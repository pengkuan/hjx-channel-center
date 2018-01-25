<template>
<div>
<hjx-header label="商户 / 编辑">
    <router-link to="index"><el-button size="small">返回商户列表</el-button></router-link>
</hjx-header>
<div class="channelInfo">
    <el-form ref="form" :model="form" label-width="180px" :rules="rules">
        <el-form-item label="O关系模型：" prop="strLevelId">
            <el-select v-model="form.strLevelId" filterable placeholder="请选择">
                <el-option  v-for="item in channelTemplateList"  :label="item.strTemplateName"  :value="item.strTemplateId" :key="item.strTemplateId">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="商户全称：" prop='strFullName'>
            <el-input v-model="form.strFullName" placeholder="请输入合同乙方营业执照名称"></el-input>
        </el-form-item>
        <el-form-item label="所属品牌商/合作方：">
            <el-select v-model="form.strPartner_id" filterable placeholder="请选择">
                <el-option  v-for="item in partnerList"  :label="item.strPartnerName"  :value="item.strPartnerId" :key="item.strPartnerId">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="营业执照地址：" class="mustStar">
            <el-col :span="6">
                <el-form-item prop="strAddr_province_id">
                    <el-select v-model="form.strAddr_province_id" filterable placeholder="请选择省份">
                        <el-option  v-for="item in provinces"  :label="item.strProvinceName"  :value="item.strProvinceId" :key="item.strProvinceId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item prop="strAddr_city_id">
                    <el-select v-model="form.strAddr_city_id" filterable placeholder="请选择城市">
                        <el-option  v-for="item in citys"  :label="item.strCityName"  :value="item.strCityId" :key="item.strCityId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item prop="strAddr_area_id">
                    <el-select v-model="form.strAddr_area_id" filterable placeholder="请选择区县">
                        <el-option  v-for="item in areas"  :label="item.strAreaName"  :value="item.strAreaId" :key="item.strAreaId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item prop="strDetailAddress">
                   <el-input v-model="form.strDetailAddress" placeholder="请输入详细地址"></el-input>
                </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item label="销售区域：">
            <el-select v-model="saleAddsId.strSaleProvinceId" filterable placeholder="请选择省份">
                <el-option label="全部" value="" ></el-option>
                <el-option  v-for="item in saleAdds.provinces"  :label="item.strProvinceName"  :value="item.strProvinceId +','+ item.strProvinceName"  :key="item.strProvinceId">
                </el-option>
            </el-select>
            <el-select v-model="saleAddsId.strSaleCityId" filterable placeholder="请选择城市">
                <el-option label="全部" value="" ></el-option>
                <el-option  v-for="item in saleAdds.citys"  :label="item.strCityName"  :value="item.strCityId +','+ item.strCityName" :key="item.strCityId">
                </el-option>
            </el-select>
            <el-select v-model="saleAddsId.strSaleAreaId" filterable placeholder="请选择区县">
                <el-option label="全部" value="" ></el-option>
                <el-option  v-for="item in saleAdds.areas"  :label="item.strAreaName"  :value="item.strAreaId +','+ item.strAreaName" :key="item.strAreaId">
                </el-option>
            </el-select>
            <el-button type="primary" icon="plus" size="small" v-on:click = "addSaleAddr()">添加</el-button>
            <div >
                <p class="add-addr-title">已添加地址：</p>
                <div class="addr-remind" v-show = 'addSaleList.length == 0'>当前未添加地址，请点击上方按钮添加！</div>
                <div class="addr-container">
                    <p class='add-addr-item' v-for = "(item , index) in addSaleList" v:key="index">
                        <el-col :span="18">
                            <span >{{ item.saleName }}</span>
                        </el-col>
                        <el-col :span="6" class = 'submitRightNoM'>
                            <el-button size="mini" v-on:click="delSaleAddr(index)"> 删除此项</el-button>
                        </el-col>
                    </p>
                </div>
            </div>
        </el-form-item>
        <el-form-item label="营业执照号码：" prop = 'strLicense_num'>
            <el-input v-model="form.strLicense_num" placeholder='请输入商户营业执照号码' disabled></el-input>
        </el-form-item>
        <el-form-item label="工号前缀：" prop = 'strPrefix_str' class="hjx-unnecessary">
            <el-input v-model="form.strPrefix_str" placeholder='2位或4位字母(渠道拼音首字母)+4位数字(渠道省份区号)'></el-input>
        </el-form-item>
        <el-form-item label="商户负责S4：" prop='strConnection_info'>
            <el-select v-model="form.strConnection_info" filterable placeholder="请选择">
                <el-option  v-for="item in channelUserList"  :label="item.strUserName + '/' + item.strUserTel"  :value="item.strUserId" :key="item.strUserId">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="月手机销量：">
            <el-input v-model="form.strMonth_sales"></el-input>
        </el-form-item>
        <el-form-item label="商户等级：">
            <el-select v-model="form.strChannelScore" placeholder="请选择">
                <el-option  v-for="item in scoreList"  :label="item.name"  :value="item.id" :key="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="估价模型：">
            <el-select v-model="form.strValuationId" placeholder="请选择">
                <el-option  v-for="item in valuationList"  :label="item.name"  :value="item.id" :key="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="商户分成：">
            <div style="width:300px;border:1px dashed #ddd;padding:10px 10px 10px 0">
                <el-form-item  label="分成比例（%）" prop='strPercent' >
                    <el-input type="number" v-model="form.strPercent"></el-input>
                </el-form-item>
                <div style="height:16px"></div>
                <el-form-item label="苹果机型封顶（元）" prop='strApplyMax' >
                    <el-input type="number"  v-model="form.strApplyMax"></el-input>
                </el-form-item>
            </div>
        </el-form-item>
        <el-form-item label="店员激励：">
            <el-button type="primary" size="small" v-model="form.strShopAwardId">+设置店员激励方案</el-button>
        </el-form-item>
        <el-form-item label="付款模式：">
            <el-select v-model="form.strPayMethodId" placeholder="请选择">
                <el-option  v-for="item in payMethodList"  :label="item.name"  :value="item.id" :key="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="店员/用户APP：">
            <el-checkbox-group v-model="form.selfFunction">
                <el-checkbox label="收集用户信息" ></el-checkbox>
                <el-checkbox label="环保回收"></el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="合作状态：">
            <el-select v-model="form.strStatus" placeholder="请选择合作状态">
                <el-option  v-for="item in statusList"  :label="item.name"  :value="item.id" :key="item.id">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item class = 'submitRight'>
            <el-button type="primary" @click="submitnow('form')">立即更新</el-button>
            <el-button @click="cancelnow">取消</el-button>
        </el-form-item>
        
    </el-form>
</div>
</div>
</template>
<script>
    import api from '../../api/api'
    import util from '../../common/util'
    import { mapGetters, mapActions } from 'vuex'
  export default {
    data() {
        var validateEmployeeNum = (rule, value, callback) => {
            if(!value) callback()
            if(!/^(([a-zA-Z]{2})|([a-zA-Z]{4}))\d{2,4}$/g.test(value)){
                callback(new Error('请输入正确工号（2位或4位字母(渠道拼音首字母)+4位数字(渠道省份区号)）'))
            }
            callback()
        }
        return {
            //渠道信息
            addS4Item:{},
            provinceChange : false ,
            cityChange : false ,
            form: {
              strShareId:'',
              strLevelId: '',
              strFullName: '',
              strPartner_id: '',
              strSecond_channel:'',
              strAddr_province_id: '',
              strAddr_city_id: '',
              strAddr_area_id: '',
              strDetailAddress: '',
              strSale_addr:'',
              strStatus:'1',
              strLicense_num: '',
              strPrefix_str: '',
              strConnection_info: '',
              strMonth_sales: '',
              strChannelPic:'',
              strChannelScore: '1',
              strValuationId: '',
              strPercent: '',
              strApplyMax: '',
              strShopAwardId: '0',
              strPayMethodId: '',
              selfFunction: [],
              strGreen_recycle:'0',
              strGather_userInfo:'0',
              strChannelId:''
            },
            saleAddsId: {
                strSaleProvinceId : '',
                strSaleCityId : '',
                strSaleAreaId : ''
            },
            channelTemplateList:[],
            partnerList:[],
            citys:[],
            areas:[],
            partnerList:[],
            saleAdds:{
                provinces:[],
                citys:[],
                areas:[]
            },
            addSaleList :[],
            channelUserList :[],
            defaultDate:'',//初始默认数据
            rules:{
                'strLevelId': [
                    {  required: true, message: '请选择O关系模型', trigger: 'change' }
                ],
                'strConnection_info': [
                    {  required: true, message: '请选择S4', trigger: 'change' }
                ],
                'strAddr_province_id': [
                    {  required: true, message: '请选择省份', trigger: 'change' }
                ],
                'strAddr_city_id': [
                    {  required: true, message: '请选择城市', trigger: 'change' }
                ],
                'strAddr_area_id': [
                    {  required: true, message: '请选择区域', trigger: 'change' }
                ],
                'strDetailAddress': [
                    {  required: true , validator: util.validateAddr, trigger: 'blur' }
                ],
                'strFullName': [
                    {  required: true , validator: util.validateName, trigger: 'blur' }
                ],
                'strLicense_num': [
                    {  required: true , validator: util.validateLicenseNum, trigger: 'blur' }
                ],
                'strPrefix_str': [
                    {  required: false , validator: validateEmployeeNum, trigger: 'blur' }
                ],
                'strPercent': [
                    {  required: true, message: '请填写分成比例', trigger: 'blur' }
                ],
                'strApplyMax': [
                    {  required: true, message: '请填写封顶金额', trigger: 'blur' }
                ]
            }
        }
    },
    computed:{
        ...mapGetters({
            provinces : 'commonData/adds',
            statusList : 'channel/status',
            scoreList : 'channel/score',
            payMethodList : 'channel/payMethod',
            valuationList : 'channel/valuation'
        }),
    },
    watch: {
        // 省市区
        'form.strAddr_province_id': function(val, oldVal) {
            this.form.strAddr_city_id = ''
            this.getCitys(val , this.provinceChange)
            this.provinceChange = true
        },
        'form.strAddr_city_id': function(val) {
            this.form.strAddr_area_id = ''
            this.getAreas(val,this.cityChange)
            this.cityChange = true
        },
        // 销售区域
        'saleAddsId.strSaleProvinceId': function(val, oldVal) {
            this.saleAddsId.strSaleCityId = ''
            this.getCitys(val.split(',')[0] ,false, 'sale')
        },
        'saleAddsId.strSaleCityId': function(val) {
            this.saleAddsId.strSaleAreaId = ''
            this.getAreas(val.split(',')[0] ,false, 'sale')
        }
    },
    mounted()  {
        this.getChannelId()
        this.getDefaultDate(this.form.strChannelId)
    },
    methods: {
        ...mapActions({
            getAddress: 'commonData/getAdds' 
        }),
        getChannelId:function(){
            this.form.strChannelId= this.$route.query.id
        },
        submitnow(formName) {
            var self = this
            for(var i in this.form.selfFunction){
                if(this.form.selfFunction[i] == '收集用户信息') this.form.strGather_userInfo = '1'
                if(this.form.selfFunction[i] == '环保回收') this.form.strGreen_recycle = '1'
            }
            let saleList = []
            for(var i in this.addSaleList){
                saleList.push(this.addSaleList[i].saleId)
            }
            this.form.strSale_addr = saleList
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    api.addChannelLogic(this.form).then(res => {
                        if (res.ret != '0') {
                            this.$alert(res.retinfo,"提示")
                            return
                        }
                        this.$message('成功！')
                        self.$router.push({ path: '/channel/index' })
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        loadInfo: function() {
            this.getAddress().then(()=>{
                this.saleAdds.provinces = this.$store.getters['commonData/adds']
                this.form.strAddr_province_id = this.defaultDate.strAddrProvinceId
            })
            api.getChannelTemplate({}).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.channelTemplateList = res.data.channelTemplateList
                this.form.strLevelId = this.defaultDate.strLevelId
            })
            api.getPartner({}).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.partnerList = res.data.partnerList
                this.form.strPartner_id = this.defaultDate.strPartnerId == '0'?'':this.defaultDate.strPartnerId

            })
            api.getAllS4({'strChannelId':this.form.strChannelId }).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.channelUserList = res.data
                if(this.addS4Item.strUserId) { //因为获取的列表是不包含当前自己，所以将自己加入列表
                    this.channelUserList.push(this.addS4Item)
                    this.form.strConnection_info =  this.addS4Item.strUserId
                }
                this.form.strConnection_info = this.defaultDate.strS4Id
            })
        },
        // 获取初始默认数据
        getDefaultDate : function(channelId){
            api.getChannelInfo({channelId:channelId}).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.defaultDate = res.data
                this.addS4Item = {
                    'strUserName':this.defaultDate.strS4Name,
                    'strUserTel':this.defaultDate.strS4Phone,
                    'strUserId':this.defaultDate.strS4Id
                },
                this.form.strShareId = this.defaultDate.strShareId
                this.form.strFullName = this.defaultDate.strChannelName
                this.form.strLicense_num = this.defaultDate.strLicenseNum
                this.form.strPrefix_str = this.defaultDate.strPrefix
                this.form.strMonth_sales = this.defaultDate.strMonthSales
                this.form.strChannelScore = this.defaultDate.strChannelScore //商户评分
                this.form.strPercent = this.defaultDate.strSharePercent
                this.form.strApplyMax = this.defaultDate.strAppleMax
                this.form.strDetailAddress = this.defaultDate.strAddress
                this.form.strSecond_channel = this.defaultDate.strSecondChannel
                this.form.strValuationId = this.defaultDate.strPlatformTypeId
                this.form.strPayMethodId = this.defaultDate.strPayId
                this.form.strStatus = this.defaultDate.strState
                if(this.defaultDate.strIsCollect == '1') this.form.selfFunction.push('收集用户信息')
                if(this.defaultDate.strIsRecycle == '1') this.form.selfFunction.push('环保回收')
                var saleAdds = this.defaultDate.saleAreaList
                for(var i in saleAdds){
                    if(!saleAdds[i].addr_province_name) saleAdds[i].addr_province_name = '全部'
                    if(!saleAdds[i].addr_city_name) saleAdds[i].addr_city_name = '全部'
                    if(!saleAdds[i].addr_area_name) saleAdds[i].addr_area_name = '全部'
                    var saleName = saleAdds[i].addr_province_name + ' ' + saleAdds[i].addr_city_name+ ' ' + saleAdds[i].addr_area_name
                    var saleId = {
                        'addr_province_id' : saleAdds[i].addr_province_id ,
                        'addr_city_id' : saleAdds[i].addr_city_id ,
                        'addr_area_id' : saleAdds[i].addr_area_id 
                    }
                    this.addSaleList.push({'saleName':saleName , 'saleId':saleId})
                }
            }).then(res => {this.loadInfo()})
        },
        // 获取当前对应城市
        getCitys: function(val ,change, sale) {
            if(sale == 'sale'){
                var saleProvinces = this.saleAdds.provinces
                for (var index in saleProvinces) {
                    if (saleProvinces[index].strProvinceId == val) {
                        this.saleAdds.citys = saleProvinces[index].citys
                    }
                }
                return
            }else{
                for (var index in this.provinces) {
                    if (this.provinces[index].strProvinceId == val) {
                        this.citys = this.provinces[index].citys
                        if(!change) this.form.strAddr_city_id = this.defaultDate.strAddrCityId
                    }
                }
            }
        },
        // 获取当前对应区域
        getAreas: function(val ,change, sale) {
            if(sale == 'sale'){
                var saleCity = this.saleAdds.citys
                for (var index in saleCity) {
                    if (saleCity[index].strCityId == val) {
                        this.saleAdds.areas = saleCity[index].areas
                    }
                }
            }else{
                for (var index in this.citys) {
                    if (this.citys[index].strCityId == val) {
                        this.areas = this.citys[index].areas
                        if(!change) this.form.strAddr_area_id = this.defaultDate.strAddrAreaId
                    }
                }
            }
        },
        //添加销售区域
        addSaleAddr: function(){
            let provinceName = this.saleAddsId.strSaleProvinceId.split(',')[1] ? this.saleAddsId.strSaleProvinceId.split(',')[1] :'全部'
            let cityName = this.saleAddsId.strSaleCityId.split(',')[1] ? this.saleAddsId.strSaleCityId.split(',')[1] :'全部'
            let areaName = this.saleAddsId.strSaleAreaId.split(',')[1] ? this.saleAddsId.strSaleAreaId.split(',')[1] :'全部'
            var willAddSale = {
                'saleName':provinceName+' / '+cityName+' / '+areaName ,
                'saleId':{
                    'addr_province_id' : this.saleAddsId.strSaleProvinceId.split(',')[0] ,
                    'addr_city_id' : this.saleAddsId.strSaleCityId.split(',')[0] ,
                    'addr_area_id' : this.saleAddsId.strSaleAreaId.split(',')[0] 
                }
            }
            // 判断是否重复添加
            for(var i in this.addSaleList){
                if(this.addSaleList[i].saleId.addr_province_id == willAddSale.saleId.addr_province_id
                    && this.addSaleList[i].saleId.addr_city_id == willAddSale.saleId.addr_city_id
                    && this.addSaleList[i].saleId.addr_area_id == willAddSale.saleId.addr_area_id
                    ){
                        this.$alert('该地址已添加！','提示')
                        return
                }
            }
            this.addSaleList.push(willAddSale)
        },
        //删除当前销售区域
        delSaleAddr: function(index){
            this.addSaleList.splice(index,1)
        },
        //取消
        cancelnow: function() {
            this.$router.push({ path: '/channel/index' })
        }
    }
  }
</script>
<style type="text/css" scoped>
    .channelInfo{width: 1000px}
</style>
