<template>
<div>
    <hjx-header label="门店 / 编辑">
        <router-link to="store"><el-button size="small">返回门店列表</el-button></router-link>
    </hjx-header>
    <div id="Edit-store">
        <el-form label-width="100px">
            <el-form-item label="商户：" class="mustStar">
                <el-select
                    v-model="structAid" clearable filterable remote reserve-keyword placeholder="请输入商户名称搜索" :remote-method="getSearchChannel" :loading="loading">
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
            <el-form-item  label="合作状态" >
                <el-select v-model="strStatus"  placeholder="请选择合作状态">
                    <el-option  v-for="item in statusList"  :label="item.name"  :value="item.id" :key="item.id">
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
            timer:null,
            loading: false,
            structA:[],
            dialogFormVisible:false,
            id:'',
            channelorgs:[],
            citys:[],
            areas:[],
            ChannelManager:[],
            defaultDate:'',//初始默认数据
            provinceChange : false ,
            cityChange : false ,
            structAChange : false,
            tempList:[],
            modelList:{
                model_1:'',
                model_2:'',
                model_3:'',
                model_4:'',
                model_5:''
            },
            changeList:{
                change_1:false,
                change_2:false,
                change_3:false,
                change_4:false,
                change_5:false
            },
            // 新增次级组名
            getGroupRelationId : '',
            getGroupLevelId : '',
            addGroupName: '',
            strIndex: '',
            setTrue : 10 ,// 顶层
            structAid:'',
            ifValidateNext:false,//是否验证次级渠道
            // 接口入参
            strStatus:'',
            strAddress:'',
            strProvinceId:'',
            strCityId:'',
            strAreaId:'',
            strStoreName:'',
            strChannelManagerId:'',
            strRelationId:"", //最末层关系节点Id(门店的上一级)
            strLevelId:""//最末层关系节点层级id(门店的上一级)
        }
    },
    computed:{
        ...mapGetters({
            provinces : 'commonData/adds',
            statusList : 'store/status'
        })
    },
    watch: {
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
        // 渠道
        structAid: function(val, oldVal) {
            console.log(val)
            if(val){
                this.getNextList(val , 0)
                this.structAChange = true
                this.ifValidateNext = false
            }
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
            getAddress: 'commonData/getAdds' 
        }),
        getStoreId(){
            this.id= this.$route.query.id
        },
        async loadInfo() {
            if(!this.structAChange) {
                this.getSearchChannel(this.defaultDate.relationUp[0].strRelationName)
            }

            await this.getAddress()
            this.strProvinceId = this.defaultDate.storeInfo.strProvinceId
        },
        getSearchChannel(query) {
            query = util.Trim(query)
            if (query !== '') {
                if(this.timer) clearTimeout(this.timer)
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
                        if(!this.structAChange){
                            //此处设置值后 该组件依然会触发一次query 为this.defaultDate.relationUp[0].strRelationName 的搜索
                            this.structAid = this.defaultDate.relationUp[0].strRelationId + ',' + this.defaultDate.relationUp[0].strLevelId + ',0' ;
                        }
                    })
                
                }, 800)
            } else {
                this.structA = []
            }
        },
        // 获取默认数据
        getDefaultDate : function(strStoreId){
            api.getStoreInfo({strStoreId:strStoreId}).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.defaultDate = res.data
                this.defaultDate.relationUp = res.data.relationUp.filter(item =>item.strLevelCode != 'REL001') //过滤掉上级中的合作方
                this.strAddress = this.defaultDate.storeInfo.strAddress
                this.strStoreName = this.defaultDate.storeInfo.strStoreName
                this.strStatus = this.defaultDate.storeInfo.strStatus
                this.setTrue = res.data.relationUp.length - 1
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
        submitnow: function() {
            var self = this
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
                strStatus:this.strStatus
            }
            var _validateList = [
                {val:msgData.strRelationId , msg : "请选择商户"} ,
                { val: /^.{2,25}$/g.test(msgData.strStoreName), msg: "请输入2~25位门店名" },
                {val:this.strProvinceId , msg : "请选择省份"} ,
                {val:this.strAddress , msg : "请输入详细地址"} ,
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