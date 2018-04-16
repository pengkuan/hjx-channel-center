<template>
<div>
    <hjx-header label="门店 / 新增">
        <router-link to="store"><el-button size="small">返回门店列表</el-button></router-link>
    </hjx-header>
	<div id="Add-store">

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="商户：" prop='structAid'>
                <el-select
                    v-model="ruleForm.structAid" clearable filterable remote reserve-keyword placeholder="请输入商户名称搜索" :remote-method="getSearchChannel" :loading="loading">
                    <el-option  v-for="item in structA"  :label="item.strRelationName"  :value="item.strRelationId+','+item.strLevelId + ',0'" :key="item.strRelationId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item v-for = "(option,index) in tempList" :label="option.RelationName+'：' " :key="index" class="mustStar">
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
            <el-form-item class='submitRight'>
                <el-button type="primary" @click="submitnow('ruleForm')">立即创建</el-button>
                <el-button @click="cancelnow">取消</el-button>
            </el-form-item>
        </el-form>
	</div>

    <el-dialog title="新增" :visible.sync="dialogFormVisible">
        <el-input v-model="addGroupName" placeholder="请输入名称"></el-input>
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
import { mapGetters, mapActions } from 'vuex'
export default {
	data() {
	    return {
            timer:null,
            loading: false,
            structA:[],
            dialogFormVisible:false,
            ruleForm:{},
            channelorgs: [],
            citys: [],
            areas: [],
            ChannelManager: [],
            tempList:[],
            modelList:{
                model_1:'',
                model_2:'',
                model_3:'',
                model_4:'',
                model_5:''
            },
            structAid: '',
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
            strRelationId : '', //最末层关系节点Id(门店的上一级)
            strLevelId: "" ,//最末层关系节点层级id(门店的上一级)
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
                    {  required: true, message: '请选择商户', trigger: 'change' }
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
    computed:{
        ...mapGetters({
            provinces : 'commonData/adds',
            statusList : 'store/status'
        })
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
        // 渠道
        'ruleForm.structAid': function(val, oldVal) {
            if(val){
                this.getNextList(val)
                this.ifValidateNext = false
            }
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
        ...mapActions({
            getAddress: 'commonData/getAdds' 
        }),
		async loadInfo() {
            await this.getAddress()
        },
        getSearchChannel(query) {
            query = util.Trim(query)
            if (query !== '') {
                if(this.timer) clearTimeout(this.timer)
                //限制手机号输入三位以上才调用搜索
                if (!isNaN(Number(query)) && query.length<3) return;
                this.loading = true;
                this.timer = setTimeout(() => {
                    //获取搜索结果
                    api.getAllChannelsByContion({'strKeyName':query}).then(res => {
                        if (res.ret != '0') {
                            this.$alert(res.retinfo,"提示")
                            return
                        }
                        this.loading = false;
                        this.structA = res.data.Relations
                    })
                
                }, 800)
            } else {
                this.structA = []
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
                    this.$alert(res.retinfo,"提示")
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
            // 获取商户下级
            api.getChannelsChild({ 'strRelationId': valList[0] }).then(res => {
				if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
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
        cancelnow: function() {
            this.$router.push({ path: '/channel/store' })
        },
        submitnow: function(formName) {
        	var self = this
            var msgData = {
                strAddress: util.Trim(this.ruleForm.strAddress),
                strProvinceId: this.ruleForm.strProvinceId,
                strCityId: this.ruleForm.strCityId,
                strAreaId: this.ruleForm.strAreaId,
                strStoreName: util.Trim(this.ruleForm.strStoreName),
                strChannelManagerId: this.strChannelManagerId,
                strRelationId: this.strRelationId,
                strLevelId: this.strLevelId,
            }

            var _validateList = []
            if(this.ifValidateNext) _validateList.splice(1,0,{ val: this.structBid, msg: "请选择门店组" })

            this.$refs[formName].validate((valid) => {
                if (valid && util.Validate(_validateList)) {
                     api.addStoreLogic(msgData).then(res => {
                        if (res.ret != '0') {
                            this.$alert(res.retinfo,"提示")
                            return
                        }
                        self.$message("成功！")
                        self.$router.push({ path: '/channel/store' })
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })

        }
	},
	mounted()  {
		this.loadInfo()
	}
}
</script>