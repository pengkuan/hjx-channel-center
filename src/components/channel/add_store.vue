<template>
<div>
    <div class="title">门店 / 新增</div>
    
	<div id="Add-store">

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="渠道商：" prop='structAid'>
                <el-select v-model="ruleForm.structAid" filterable placeholder="请选择渠道商" >
                    <el-option  v-for="item in structA"  :label="item.strRelationName"  :value="item.strRelationId+','+item.strLevelId + ',0'" :key="item.strRelationId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item v-for = "(option,index) in tempList" :label="option.RelationName" :key="index">
                <el-select v-model="modelList['model_'+(index+1)]" placeholder="请选择">
                    <el-option  v-for="item in option.Relations"  :label="item.strRelationName"  :key="item.strRelationId"  :value="item.strRelationId+','+item.strLevelId+','+(index+1) " >
                    </el-option>
                </el-select>
                <el-button type="primary" v-on:click="addGroup(option.upStrRelationId , option.upStrLevelId ,index)" >新增</el-button>
            </el-form-item>

            <el-form-item label="门店名称：" prop='strStoreName'>
                <el-input v-model="ruleForm.strStoreName" placeholder="请输入门店名称"></el-input>
            </el-form-item>

            <el-form-item label="门店地址：" class = 'mustStar'>
                <el-col :span="8">
                    <el-form-item prop="strProvinceId">
                        <el-select v-model="ruleForm.strProvinceId" filterable placeholder="请选择省份">
                            <el-option  v-for="item in provinces"  :label="item.strProvinceName"  :value="item.strProvinceId" :key="item.strProvinceId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop="strCityId">
                        <el-select v-model="ruleForm.strCityId" filterable placeholder="请选择城市">
                            <el-option  v-for="item in citys"  :label="item.strCityName"  :value="item.strCityId" :key="item.strCityId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item prop="strAreaId">
                        <el-select v-model="ruleForm.strAreaId" filterable placeholder="请选择区县">
                            <el-option  v-for="item in areas"  :label="item.strAreaName"  :value="item.strAreaId" :key="item.strAreaId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

            </el-form-item>
            <el-form-item  prop='strAddress'>
                <el-input v-model="ruleForm.strAddress" placeholder="请输入详细地址"></el-input>
            </el-form-item>

            <el-form-item label="销售区域：" class = 'mustStar'>
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
                <el-button type="primary" icon="plus"  v-on:click = "addSaleAddr()">添加</el-button>
                <div >
                    <p class="add-addr-title">已添加地址：</p>
                    <div class="addr-remind" v-show = 'addSaleList.length == 0'>当前未添加地址，请点击上方按钮添加！</div>
                    <div class="addr-container">
                        <p class='add-addr-item' v-for = "(item , index) in addSaleList" v:key="index">
                            <el-col :span="18">
                                <span >{{ item.saleName }}</span>
                            </el-col>
                            <el-col :span="6" class = 'submitRightNoM'>
                                <el-button size="mini" v-on:click="delSaleAddr(index)"> 删除此行</el-button>
                            </el-col>
                        </p>
                    </div>
                </div>
            </el-form-item>

            <el-form-item label="渠道经理：" style='display:none'>
                <el-select v-model="strChannelManagerId" filterable placeholder="请选择渠道经理">
                    <el-option  v-for="item in ChannelManager"  :label="item.strChannelManagerName"  :value="item.strChannelManagerId" :key="item.strChannelManagerId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item class='submitRight'>
                <el-button type="primary" @click="submitnow('ruleForm')">立即创建</el-button>
                <el-button @click="cancelnow">取消</el-button>
            </el-form-item>

        </el-form>
		
	</div>

    <el-dialog title="新增门店" :visible.sync="dialogFormVisible">
        <el-input v-model="addGroupName" placeholder="请输入门店名"></el-input>
        <br><br>
        <div class = 'textRight'>
            <el-button type="primary" icon="plus" size="small" v-on:click = "submitAddGroup()">提交</el-button>
        </div>
    </el-dialog>
</div>
</template>
<style type="text/css" scoped>
    #Add-store{width: 900px}
</style>
<script>
import api from '../../api/api'
import util from '../../common/util'
import commonData from '../../common/data'
export default {
	data() {
       
	    return {
            dialogFormVisible:false,
            ruleForm:{},
            channelorgs: [],
            provinces: commonData.addrList,
            citys: [],
            areas: [],
            ChannelManager: [],
            tempList:[],
            // 
            modelList:{
                model_1:'',
                model_2:'',
                model_3:'',
                model_4:'',
                model_5:''
            },
            saleAdds:{
                provinces : commonData.addrList,
                citys : '',
                areas : ''
            },
            
            addSaleList :[],
            saleAddsId:{
                strSaleProvinceId : '',
                strSaleCityId : '',
                strSaleAreaId : ''
            },
            // 
            structAid: '',
            structA: commonData.channelList,
            ifValidateNext:false,//是否验证次级渠道
            // 新增次级组名
            getGroupRelationId : '',
            getGroupLevelId : '',
            addGroupName: '',
            strIndex: '',
            // 接口入参
            strAddress: '',
            strProvinceId: '',
            strCityId: '',
            strAreaId: '',
            strStoreName: '',
            strChannelManagerId: '',
            strRelationId : '', //最末层关系节点Id
            strLevelId: "" ,//最末层关系节点层级id
            ruleForm:{
                'structAid':'',
                'strStoreName':'',
                'strProvinceId':'',
                'strCityId':'',
                'strAreaId':'',
                'strAddress':'',

                'strContractBeginTime':'',
                'strContractEndTime':'',
               
            },
            rules:{
                'structAid': [
                    {  required: true, message: '请选择渠道商', trigger: 'change' }
                ],
                'strStoreName': [
                    {  required: true , validator: util.validateName, trigger: 'blur' }
                ],
                'strAddress': [
                    {  required: true , validator: util.validateAddr, trigger: 'blur' }
                ],
                'strProvinceId': [
                    {  required: true, message: '请选择省份', trigger: 'change' }
                ],
                'strCityId': [
                    {  required: true, message: '请选择城市', trigger: 'change' }
                ],
                'strAreaId': [
                    {  required: true, message: '请选择区域', trigger: 'change' }
                ]
                
            }

        }
	},
	watch: {
            
        // 省市区
        'ruleForm.strProvinceId': function(val, oldVal) {
            this.ruleForm.strCityId = ''
            this.getCitys(val)
        },
        'ruleForm.strCityId': function(val) {
            this.ruleForm.strAreaId = ''
            this.getAreas(val)
        },
        // 销售区域
        'saleAddsId.strSaleProvinceId': function(val, oldVal) {
            this.saleAddsId.strSaleCityId = ''
            this.getCitys(val.split(',')[0] , 'sale')
        },
        'saleAddsId.strSaleCityId': function(val) {
            this.saleAddsId.strSaleAreaId = ''
            this.getAreas(val.split(',')[0] , 'sale')
        },
        // 渠道
        'ruleForm.structAid': function(val, oldVal) {
            this.getNextList(val)
            this.ifValidateNext = false
        },
        'modelList.model_1' : function(val, oldVal) {
            if(val) this.getNextList(val)
            this.ifValidateNext = false
        },
        'modelList.model_2' : function(val, oldVal) {
            if(val) this.getNextList(val)
            this.ifValidateNext = false
        },
        'modelList.model_3' : function(val, oldVal) {
            if(val) this.getNextList(val)
            this.ifValidateNext = false
        },
        'modelList.model_4' : function(val, oldVal) {
            if(val) this.getNextList(val)
            this.ifValidateNext = false
        },
        'modelList.model_5' : function(val, oldVal) {
            if(val) this.getNextList(val)
            this.ifValidateNext = false
        }
    },

	methods:{
		loadInfo: function() {
            //获取一级渠道商
            if(commonData.channelList.length == 0){
                var loading = this.$loading({
                    text:'获取渠道商列表',
                    target:'#Add-store'
                })
                api.getAllChannels({}).then(res => {
                    loading.close()
                    if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
                    commonData.channelList = res.data.Relations
                    this.structA = res.data.Relations
                })
            }
            
            // 获取渠道经理 
            api.getChannelManager({}).then(res => {
                if (res.ret != '0') {
                    this.$layer.alert(res.retinfo)
                    return
                }
				this.ChannelManager = res.data.managers;
			})

            // 地址
            
            if(commonData.addrList.length == 0){
                api.getAddress({}).then(res => {
                    if (res.ret != '0') {
                        this.$layer.alert(res.retinfo)
                        return
                    }
                    commonData.addrList = res.data.address
                    this.provinces = res.data.address
                    this.saleAdds.provinces = res.data.address
                })
            }

        },

        // 新增
        addGroup: function(upStrRelationId , upStrLevelId , strIndex) {
            var self = this
            this.dialogFormVisible = true

            this.getGroupRelationId =  upStrRelationId
            this.getGroupLevelId =  upStrLevelId
            this.strIndex =  strIndex

        },
        //提交新增
        submitAddGroup:function(){
            var self = this
            var data = {
                strRelationId:this.getGroupRelationId,
                strLevelId:this.getGroupLevelId ,
                strOrgName : this.addGroupName
            }
            api.addOrgLogic(data).then(res => {
                if (res.ret != '0') {
                    this.$layer.res(res.retinfo)
                    return
                }
                this.dialogFormVisible = false
                return  res.data
                
            }).then(
                (msg) => {
                    if(self.strIndex == '0'){
                        self.getNextList(self.ruleForm.structAid , {keyIndex : String(self.strIndex+1) , val : msg.strRelationId + ','+msg.strLevelId+','+(self.strIndex+1)})
                    } 
                    else{
                        self.getNextList(self.modelList['model_'+self.strIndex] , {keyIndex : String(self.strIndex+1) , val : msg.strRelationId + ','+msg.strLevelId+','+(self.strIndex+1) })
                    }
                }
            )

        },
        getNextList: function(val, setDefault) {
            var self = this
            var valList = val.split(',') 
            this.strRelationId = valList[0]
            this.strLevelId = valList[1]
            // 删除该change选项 对应tempList后面的数组,且清除对应Model值
            this.tempList = this.tempList.splice(0,valList[2])
            for(var key in this.modelList){
                if(key.split('_')[1] >  valList[2]) this.modelList[key] = ''
            }

            // 获取渠道商下级
            api.getChannelsChild({ 'strRelationId': valList[0] }).then(res => {
				if (res.ret != '0') {
                    this.$layer.alert(res.retinfo)
                    return
                }
                if(res.data) {
                    this.ifValidateNext = true //存在下级，所以需要验证
                    var obj = res.data
                    obj.upStrRelationId = this.strRelationId
                    obj.upStrLevelId = this.strLevelId
                    this.tempList.push(obj)
                    // 新增后默认设置新增的值
                    if(setDefault) {
                        self.modelList['model_'+setDefault.keyIndex] = setDefault.val
                    }
                }
			})
        },
        // 获取当前对应城市
        getCitys: function(val , sale) {
            if(sale == 'sale'){
                var saleProvinces = this.saleAdds.provinces
                for (var index in saleProvinces) {
                    if (saleProvinces[index].strProvinceId == val) {
                        this.saleAdds.citys = saleProvinces[index].citys
                    }
                }
            }else{
                for (var index in this.provinces) {
                    if (this.provinces[index].strProvinceId == val) {
                        this.citys = this.provinces[index].citys
                    }
                }
            }
        },
        // 获取当前对应区域
        getAreas: function(val , sale) {
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
                'saleName':provinceName+'  '+cityName+'  '+areaName ,
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
                        this.$layer.alert('该地址已添加！')
                        return
                }
            }
            

            this.addSaleList.push(willAddSale)
        },
        //删除当前销售区域
        delSaleAddr: function(index){
            console.log(index)
            this.addSaleList.splice(index,1)
        },


        //取消
        cancelnow: function() {
            this.$router.push({ path: '/channel/store' })
        },

        //确定
        submitnow: function(formName) {

        	var self = this
            // 获取销售范围ID列表
            var saleList = []
            for(var i in this.addSaleList){
                saleList.push(this.addSaleList[i].saleId)
            }


            var msgData = {
                strAddress: util.Trim(this.ruleForm.strAddress),
                strProvinceId: this.ruleForm.strProvinceId,
                strCityId: this.ruleForm.strCityId,
                strAreaId: this.ruleForm.strAreaId,
                strStoreName: util.Trim(this.ruleForm.strStoreName),
                strChannelManagerId: this.strChannelManagerId,
                strRelationId: this.strRelationId,
                strLevelId: this.strLevelId,
                saleAddrList  :  JSON.stringify(saleList), 
            }

            var _validateList = [
                // { val: msgData.strRelationId, msg: "请选择关联渠道" },
                // { val: /^.{2,25}$/g.test(msgData.strStoreName), msg: "请输入2~25位门店名" },
                // { val: msgData.strProvinceId, msg: "请选择省份" },
                // { val: msgData.strAddress, msg: "请输入详细地址" },
                { val: msgData.saleAddrList == '[]' ? false : true , msg: "请添加销售范围" },
                // { val: msgData.strChannelManagerId, msg: "请选择渠道经理" }
            ]
            if(this.ifValidateNext) _validateList.splice(1,0,{ val: this.structBid, msg: "请选择次级渠道" })

            this.$refs[formName].validate((valid) => {
                if (valid && util.Validate(_validateList)) {
                     api.addStoreLogic(msgData).then(res => {
                        if (res.ret != '0') {
                            this.$layer.alert(res.retinfo)
                            return
                        }
                        self.$message("成功！")
                        self.$router.push({ path: '/channel/store' })

                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })

        }
	},
	mounted()  {
		this.loadInfo();
	}


}
</script>