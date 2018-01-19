<template>
<div>
    <div class="title">门店 / 编辑</div>
    <div id="Edit-store">
        <el-form label-width="100px">
            <el-form-item label="商户：" class="mustStar">
                <el-select v-model="structAid" filterable placeholder="请输入商户名称">
                    <el-option  v-for="item in structA"  :label="item.strRelationName"  :value="item.strRelationId+','+item.strLevelId + ',0'" :key="item.strRelationId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-for = "(option,index) in tempList" :label="option.RelationName+'：' " :key="index" class="mustStar">
                <el-select v-model="modelList['model_'+(index+1)]" placeholder="请选择">
                    <el-option  v-for="item in option.Relations"  :label="item.strRelationName"  :key="item.strRelationId"  :value="item.strRelationId+','+item.strLevelId+','+(index+1) " >
                    </el-option>
                </el-select>
                <el-button type="primary" v-on:click="addGroup(option.upStrRelationId , option.upStrLevelId ,index)" size="small">新增</el-button>
            </el-form-item>
            <el-form-item label="门店名称：" class="mustStar">
                <el-input v-model="strStoreName" placeholder="请输入门店名称"></el-input>
            </el-form-item>

            <el-form-item label="门店地址：" class="mustStar">
                <el-select v-model="strProvinceId" filterable placeholder="请选择省份">
                    <el-option  v-for="item in provinces"  :label="item.strProvinceName"  :value="item.strProvinceId" :key="item.strProvinceId" >
                    </el-option>
                </el-select>
                <el-select v-model="strCityId" filterable placeholder="请选择城市">
                    <el-option  v-for="item in citys"  :label="item.strCityName"  :value="item.strCityId" :key="item.strCityId" >
                    </el-option>
                </el-select>
                <el-select v-model="strAreaId" filterable placeholder="请选择区县">
                    <el-option  v-for="item in areas"  :label="item.strAreaName"  :value="item.strAreaId" :key="item.strAreaId">
                    </el-option>
                </el-select>
                <br><br>
                <el-input v-model="strAddress" placeholder="请输入详细地址"></el-input>
            </el-form-item>

            <el-form-item label="销售区域：" class="mustStar">
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
                    <el-option  v-for="item in saleAdds.areas"  :label="item.strAreaName"  :value="item.strAreaId +','+ item.strAreaName"
                    :key="item.strAreaId">
                    </el-option>
                </el-select>
                <el-button type="primary" icon="plus" size="small" v-on:click = "addSaleAddr()">添加</el-button>
                <div >
                    <p class="add-addr-title">已添加地址：</p>
                    <div class="addr-remind" v-show = 'addSaleList.length == 0'>当前未添加地址，请点击上方按钮添加！</div>
                    <div class="addr-container">
                        <div class='hjx-overflow' v-for = "(item , index) in addSaleList" v:key="index">
                            <el-col :span="18">
                                <span >{{ item.saleName }}</span>
                            </el-col>
                            <el-col :span="6" class = 'submitRightNoM'>
                                <el-button size="mini" v-on:click="delSaleAddr(index)"> 删除此行</el-button>
                            </el-col>
                        </div>
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
                <el-button type="primary" @click="submitnow">确认更新</el-button>
                <el-button @click="cancelnow">取消</el-button>
            </el-form-item>

        </el-form>
    </div>
    <el-dialog title="新增门店或门店组" :visible.sync="dialogFormVisible">
        <el-input v-model="addGroupName" placeholder="请输入门店或门店组名"></el-input>
        <br><br>
        <div class = 'textRight'>
            <el-button type="primary" icon="plus" size="small" v-on:click = "submitAddGroup()">提交</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import api from '../../api/api'
import util from '../../common/util'
import { mapGetters, mapActions } from 'vuex'
export default {
	data() {
	    return {
            dialogFormVisible:false,
            form:{},
            id:'',
            S1Type : '1',
            S2Type : '2',
            channelorgs:[],
            citys:[],
            areas:[],
            ChannelManager:[],
            defaultDate:'',//初始默认数据
            provinceChange : false ,
            cityChange : false ,
            structAChange : false,

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
                provinces : '',
                citys : '',
                areas : ''
            },
            saleAddsId:{
                strSaleProvinceId : '',
                strSaleCityId : '',
                strSaleAreaId : ''
            },
            addSaleList :[],
            changeList:{
                change_1:false,
                change_2:false,
                change_3:false,
                change_4:false,
                change_5:false
            },
            SList:{
                showS1 : false,
                showS2 : false,
                showD1 : false,
                showBD1 : false
            },
            // 新增次级组名
            getGroupRelationId : '',
            getGroupLevelId : '',
            addGroupName: '',
            strIndex: '',

            setTrue : 10 ,
            // 顶层
            structAid:'',
            ifValidateNext:false,//是否验证次级渠道
            // 接口入参
            strAddress:'',
            strProvinceId:'',
            strCityId:'',
            strAreaId:'',
            strStoreName:'',
            strChannelManagerId:'',
            strRelationId:"", //最末层关系节点Id
            strLevelId:""//最末层关系节点层级id
        }
	},
    computed:{
        ...mapGetters({
            provinces : 'heavyDate/adds',
            structA : 'heavyDate/channel'
        })
    },
	watch: {
            
        // 省市区
        strProvinceId : function (val, oldVal) {
          this.strCityId = ''
          this.getCitys(val , this.provinceChange)
          this.provinceChange = true
        } ,
        strCityId : function(val){
            this.strAreaId = ''
            this.getAreas(val , this.cityChange)
            this.cityChange = true
        },
        // 销售区域
        'saleAddsId.strSaleProvinceId': function(val, oldVal) {
            this.saleAddsId.strSaleCityId = ''
            this.getCitys(val.split(',')[0] ,false, 'sale')
        },
        'saleAddsId.strSaleCityId': function(val) {
            this.saleAddsId.strSaleAreaId = ''
            this.getAreas(val.split(',')[0] , false ,'sale')
        },
        // 渠道
        structAid: function(val, oldVal) {
            this.getNextList(val , 0)
            this.structAChange = true
            this.ifValidateNext = false
        },
        'modelList.model_1' : function(val, oldVal) {
            if(val) this.getNextList(val , 1) , this.changeList['change_1'] = true
            this.ifValidateNext = false
        },
        'modelList.model_2' : function(val, oldVal) {
            if(val) this.getNextList(val , 2) , this.changeList['change_2'] = true
            this.ifValidateNext = false
        },
        'modelList.model_3' : function(val, oldVal) {
            if(val) this.getNextList(val , 3) , this.changeList['change_3'] = true
            this.ifValidateNext = false
        },
        'modelList.model_4' : function(val, oldVal) {
            if(val) this.getNextList(val , 4) , this.changeList['change_4'] = true
            this.ifValidateNext = false
        },
        'modelList.model_5' : function(val, oldVal) {
            if(val) this.getNextList(val , 5) , this.changeList['change_5'] = true
            this.ifValidateNext = false
        }
    },
    mounted()  {
        this.getStoreId()
        this.getDefaultDate(this.id)
    },

	methods:{
        ...mapActions({
            getChannel: 'heavyDate/getChannel' ,
            getAddress: 'heavyDate/getAdds' 
        }),
        getStoreId:function(){
            this.id= this.$route.query.id
        },
		loadInfo: function() {
            //获取一级商户
            var loading = this.$loading({
                text:'正在获取信息',
                target:'#Edit-store'
            })
            this.getChannel().then( ()=>{
                loading.close()
            })
            if(!this.structAChange) this.structAid = this.defaultDate.relationUp[0].strRelationId + ',' + this.defaultDate.relationUp[0].strLevelId + ',0'
            /*
            //获取渠道经理 
            api.getChannelManager({}).then(res => {
                if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
				this.ChannelManager = res.data.managers;
                this.strChannelManagerId = this.defaultDate.storeInfo.strChannelManagerId
			})
            */
            this.getAddress().then(()=>{
                this.strProvinceId = this.defaultDate.storeInfo.strProvinceId
                this.saleAdds.provinces = this.$store.getters['heavyDate/adds']
            })
        },
        // 获取默认数据
        getDefaultDate : function(strStoreId){
            api.getStoreInfo({strStoreId:strStoreId}).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.defaultDate = res.data
                this.strAddress = this.defaultDate.storeInfo.strAddress
                this.strStoreName = this.defaultDate.storeInfo.strStoreName
                this.setTrue = res.data.relationUp.length - 1
                var saleAdds = this.defaultDate.storeInfo.saleAddrList
                for(var i in saleAdds){
                    if(!saleAdds[i].strProvinceName) saleAdds[i].strProvinceName = '全部'
                    if(!saleAdds[i].strCityName) saleAdds[i].strCityName = '全部'
                    if(!saleAdds[i].strAreaName) saleAdds[i].strAreaName = '全部'
                    var saleName = saleAdds[i].strProvinceName + ' ' + saleAdds[i].strCityName+ ' ' + saleAdds[i].strAreaName
                    var saleId = {
                        addr_province_id : saleAdds[i].strProvinceId ,
                        addr_city_id : saleAdds[i].strCityId ,
                        addr_area_id : saleAdds[i].strAreaId 
                    }
                    this.addSaleList.push({saleName:saleName , saleId:saleId})
                }
                return true
            }).then((res) =>{
                if(res) this.loadInfo()
            })
        },
        
        getNextList: function(val, strIndex , setAddDefault) {
            var strIndex = strIndex +1
            var valList = val.split(',') 
            this.strRelationId = valList[0]
            this.strLevelId = valList[1]
            // 删除该change选项 对应tempList后面的数组,且清除对于Model值
            this.tempList = this.tempList.splice(0,valList[2])
            for(var key in this.modelList){
                if(key.split('_')[1] >  valList[2]) this.modelList[key] = ''
                if(key.split('_')[1] >  this.setTrue) this.changeList['change_'+key.split('_')[1]] = true
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
                    // 设置默认值
                    if(!this.changeList['change_'+(strIndex)]){
                        this.modelList['model_'+(strIndex)] = this.defaultDate.relationUp[strIndex].strRelationId + ',' + this.defaultDate.relationUp[strIndex].strLevelId + ','+(strIndex)
                    }
                    if(setAddDefault){
                        this.modelList['model_'+(strIndex)] = setAddDefault.val
                    }
                }
			})
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
                        self.getNextList(self.structAid , self.strIndex , {keyIndex : String(self.strIndex+1) , val : msg.strRelationId + ','+msg.strLevelId+','+(self.strIndex+1)})
                    } 
                    else{
                        self.getNextList(self.modelList['model_'+self.strIndex] , self.strIndex , {keyIndex : String(self.strIndex+1) , val : msg.strRelationId + ','+msg.strLevelId+','+(self.strIndex+1) })
                    }
                }
            )
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
                for(var index in this.provinces){

                    if(this.provinces[index].strProvinceId == val){
                        this.citys = this.provinces[index].citys
                        if(!change) this.strCityId = this.defaultDate.storeInfo.strCityId
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
                return
            }
            for(var index in this.citys){
                if(this.citys[index].strCityId == val){
                    this.areas = this.citys[index].areas
                    if(!change) this.strAreaId = this.defaultDate.storeInfo.strAreaId
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
        cancelnow: function() {
            this.$router.push({ path: '/channel/store' })
        },
        Validate :function(list){
            for(var index in list){
                if(!list[index].val) {
                    this.$message(list[index].msg) 
                    return false 
                }
            }
            return true
        },
        //确定
        submitnow: function() {
            var self = this
        	var saleList = []
            for(var i in this.addSaleList){
                saleList.push(this.addSaleList[i].saleId)
            }
            var msgData = {
                strStoreId:this.id,
                strAddress:this.strAddress,
                strProvinceId:this.strProvinceId,
                strCityId:this.strCityId,
                strAreaId:this.strAreaId,
                strStoreName:this.strStoreName,
                strChannelManagerId:this.strChannelManagerId,
                strRelationId:this.strRelationId, //最末层关系节点Id
                strLevelId:this.strLevelId,//最末层关系节点层级id
                saleAddrList  :  JSON.stringify(saleList), 
            }
            var _validateList = [
                {val:msgData.strRelationId , msg : "请选择商户"} ,
                { val: /^.{2,25}$/g.test(msgData.strStoreName), msg: "请输入2~25位门店名" },
                {val:this.strProvinceId , msg : "请选择省份"} ,
                {val:this.strAddress , msg : "请输入详细地址"} ,
                { val: msgData.saleAddrList == '[]' ? false : true , msg: "请添加销售范围" },
            ]
            if(this.ifValidateNext) _validateList.splice(1,0,{ val: this.structBid, msg: "请选择门店组" })

            if (this.Validate(_validateList)) {
            	// 地址
	            api.editStoreLogic(msgData).then(res => {
					if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
                    this.$message("成功！")
                    self.$router.push({ path: '/channel/store' })
				})
            }
        }
	}
}
</script>
<style type="text/css" scoped>
    #Edit-store{width: 1000px}
    .vue-remind{font-size: 12px;color:#999;margin: 8px 0}
    span{font-size: 13px}
    .people-container>p{overflow: hidden;}
    .people-container{padding: 10px 0}
    .addr-container>p{overflow: hidden;}
    .add-people-item{overflow: hidden;margin: 6px}
</style>