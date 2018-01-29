<template>
<div class="hjx-show-detail">
    <hjx-header label="门店 / 详情">
        <router-link to="store"><el-button size="small">返回门店列表</el-button></router-link>
        <el-button type="primary" size="small" @click="goEdit(id)">编辑</el-button>
    </hjx-header>
    <div id="Edit-store">
        <div class="hjx-black mrg-b12">{{strStoreName}}</div>
        <el-tabs type="border-card">
            <el-tab-pane label="POS信息">
                <el-alert title="基本信息" type="info" :closable="false"></el-alert><br>
                <el-form label-width="100px">
                    <el-form-item label="商户：">
                        <span v-for="item in structA" v-if="structAid == item.strRelationId+','+item.strLevelId + ',0' ">{{item.strRelationName}}</span>
                    </el-form-item>
                    <el-form-item v-for = "(option,index) in tempList" :label="option.RelationName+'：' " :key="index" >
                        <span v-for="item in option.Relations" v-if="modelList['model_'+(index+1)] == item.strRelationId+','+item.strLevelId+','+(index+1)  ">{{item.strRelationName}}</span>
                    </el-form-item>
                    <el-form-item label="门店名称：" >{{strStoreName}}</el-form-item>
                    <el-form-item label="门店地址：">
                        <span v-for="item in provinces" v-if="strProvinceId == item.strProvinceId">{{item.strProvinceName}}</span>
                        <span v-for="item in citys" v-if="strCityId == item.strCityId">{{item.strCityName}}</span>
                        <span v-for="item in areas" v-if="strAreaId == item.strAreaId">{{item.strAreaName}}</span>
                        <span>{{strAddress}}</span>
                    </el-form-item>

                    <el-form-item label="销售区域：">
                        <p class='hjx-overflow' v-for = "(item , index) in addSaleList" v:key="index">{{ item.saleName }}</p>
                    </el-form-item>
                    <el-form-item label="合作状态：" >{{strStatusName}}</el-form-item>
                </el-form>
                <!-- 操作流水 -->
                <br>
                <el-alert title="操作流水" type="info" :closable="false"></el-alert><br>
                <hjx-pipe v-for="(item,index) in pipeList" :key="index"  :strF1="item.strF1" :strF2="item.strF2">{{item.strF3+' '+item.strF4}}</hjx-pipe>
                <br>
                <div class="comment"><el-input  v-model="comment" :maxlength="400" placeholder="在此输入备注内容（最多400字）"></el-input></div>
                <el-button  @click="setComment" :disabled="comment?false:true">确认备注</el-button><br><br>
            </el-tab-pane>

            <el-tab-pane label="S1列表">
                <br>
                <span class="vue-title  vue-M-R30">已关联S1：</span><el-button type="primary" icon="plus" size="small" v-on:click = "add_s1_btn()">添加</el-button>
                <br><br>
                <p v-show = "get_store_s1_list.length == 0" class="vue-remind">未关联S1，请点击上方按钮添加S1</p>
                <p class='add-people-item' v-for = "(item , index) in get_store_s1_list">
                    <el-col :span="18">
                        <span class='sale_addr_name'>{{ item.strUserName + ' / '+ item.strPhoneNum }}</span>
                    </el-col>
                    <el-col :span="6" class = 'submitRightNoM'>
                        <el-button size="mini" type="primary" v-on:click="del_has_s1(index)"> 删除此项</el-button>
                    </el-col>
                </p>
            </el-tab-pane>
            <el-tab-pane label="S2列表">
                <div v-if="!s2Info.toChoose">
                    <span class='sale_addr_name'>{{s2Info.choosed}}</span>&nbsp;&nbsp;&nbsp;
                    <el-button size="small" @click="s2Info.toChoose = true"> 替换</el-button>
                </div>
                <div v-else  >
                    <el-select v-model="s2Info.toChooseId" filterable placeholder="请选择S2">
                        <el-option  v-for="item in s2Info.preChooseList"  :label="item.strUserName + ' / ' + item.strPhoneNum"  :value="item.strUserId" :key="item.strUserId">
                        </el-option>
                    </el-select>
                    <el-button size="small" @click="submitAddS2">确认关联</el-button>
                    <el-button v-show="s2Info.choosed" size="small" @click="s2Info.toChoose = false">取消</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="D1列表">
                <br>
                <span class="vue-title  vue-M-R30">已关联D1：</span><el-button type="primary" icon="plus" size="small" v-on:click = "add_d1_btn()">添加</el-button>
                <br><br>
                <p v-show = "get_store_d1_list.length == 0" class="vue-remind">未关联D1，请点击上方按钮添加D1</p>
                <p class='add-people-item' v-for = "(item , index) in get_store_d1_list">
                    <el-col :span="18">
                        <span class='sale_addr_name'>{{ item.strUserName + ' / '+ item.strPhoneNum }}</span>
                    </el-col>
                    <el-col :span="6" class = 'submitRightNoM'>
                        <el-button size="mini" type="primary" v-on:click="del_has_d1(index)"> 删除此项</el-button>
                    </el-col>
                </p>
            </el-tab-pane>
            <el-tab-pane label="BD1列表">
                <div v-if="!bd1Info.toChoose">
                    <span class='sale_addr_name'>{{bd1Info.choosed}}</span>&nbsp;&nbsp;&nbsp;
                    <el-button size="small" @click="bd1Info.toChoose = true"> 替换</el-button>
                </div>
                <div v-else  >
                    <el-select v-model="bd1Info.toChooseId" filterable placeholder="请选择BD1">
                        <el-option  v-for="item in bd1Info.preChooseList"  :label="item.strUserName + ' / ' + item.strPhoneNum"  :value="item.strUserId" :key="item.strUserId">
                        </el-option>
                    </el-select>
                    <el-button size="small" @click="submitAddBD1">确认关联</el-button>
                    <el-button v-show="bd1Info.choosed" size="small" @click="bd1Info.toChoose = false">取消</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="关联S1" :visible.sync="SList.showS1">
            <div class="content">
                <template>
                  <el-select v-model="choose_s1_id" filterable placeholder="请选择S1">
                    <el-option  v-for="item in choose_s1_list"  :label="item.strUserName + '/' + item.strPhoneNum"  :value="item.strUserName + '/' + item.strPhoneNum+ ','+item.strUserId" :key="item.strUserId">
                    </el-option>
                  </el-select>
                </template>
                <el-button type="primary" icon="plus" size="small" v-on:click = "add_s1_list()">添加</el-button>
                <p v-show = "addS1List.length == 0" class="vue-remind">请点击上方按钮添加预关联S1</p>
                <div class="people-container">
                    <p   v-for = "(item , index) in addS1List">
                        <el-col :span="18">
                            <span class='sale_addr_name'>{{ item }}</span>
                        </el-col>
                        <el-col :span="6" class = 'submitRightNoM'>
                            <el-button size="mini" v-on:click="del_preChoose_s1(index)"> 删除此项</el-button>
                        </el-col>
                    </p>
                </div>
                <el-button type="primary" size="small" v-on:click = "final_add_S1('add')">提交</el-button>
                <el-button type="primary" size="small" v-on:click="SList.showS1 = false">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="关联D1" :visible.sync="SList.showD1">
            <div class="content">
                <template>
                  <el-select v-model="choose_d1_id" filterable placeholder="请选择D1">
                    <el-option  v-for="item in choose_d1_list"  :label="item.strUserName + '/' + item.strPhoneNum"  :value="item.strUserName + '/' + item.strPhoneNum+ ','+item.strUserId" :key="item.strUserId">
                    </el-option>
                  </el-select>
                </template>
                <el-button type="primary" icon="plus" size="small" v-on:click = "add_d1_list()">添加</el-button>
                <p v-show = "addD1List.length == 0" class="vue-remind">请点击上方按钮添加预关联D1</p>
                <div class="people-container">
                    <p class="haveRelated"  v-for = "(item , index) in addD1List">
                        <el-col :span="18">
                        <span class='sale_addr_name'>{{ item }}</span>
                        </el-col>
                        <el-col :span="6" class = 'submitRightNoM'>
                            <el-button size="mini" v-on:click="del_preChoose_d1(index)"> 删除此项</el-button>
                        </el-col>
                    </p>
                </div>
                <el-button type="primary" size="small" v-on:click = "final_add_D1('add')">提交</el-button>
                <el-button type="primary" size="small" v-on:click="SList.showD1 = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
   
    
</div>
</template>

<script>
import api from '../../api/api'
import hjxPipe from '@/base/hjx_pipe'
import util from '../../common/util'
import { mapGetters, mapActions } from 'vuex'
export default {
    components:{hjxPipe},
    data() {
	    return {
            comment:'', //备注
            pipeList:[],//操作流水
            id:'',
            citys:[],
            areas:[],
            strStatusName:'',
            defaultDate:'',//初始默认数据
            structAChange : false,
            tempList:[],
            modelList:{
                model_1:'',
                model_2:'',
                model_3:'',
                model_4:'',
                model_5:''
            },
            addSaleList :[],
            changeList:{
                change_1:false,
                change_2:false,
                change_3:false,
                change_4:false,
                change_5:false
            },
            setTrue : 10 ,// 顶层
            structAid:'',
            strAddress:'',
            strProvinceId:'',
            strCityId:'',
            strAreaId:'',
            strStoreName:'',
            strRelationId:"", //最末层关系节点Id(门店的上一级)
            strLevelId:"",//最末层关系节点层级id(门店的上一级)
            /****** S2 / BD1 /S1 /D1 *******/
            s2Info:{
                preChooseList:[], //可选or可替换
                choosed:'', //已选
                toChoose:false, //是否要选择or替换
                toChooseId:'', //将要提交的ID
            },
            bd1Info:{
                preChooseList:[], //可选or可替换
                choosed:'', //已选
                toChoose:false, //是否要选择or替换
                toChooseId:'', //将要提交的ID
            },
            SList:{
                showS1 : false,
                showD1 : false
            },
            get_store_s1_list:[],
            get_store_s1Id_list:[],
            addS1Id : [],
            addS1List :[],
            choose_s1_list:[],
            choose_s1_id:'',
            
            get_store_d1_list:[],
            get_store_d1Id_list:[],
            choose_d1_list:[],
            choose_d1_id:'',
            addD1Id : [],
            addD1List :[],
        }
	},
    computed:{
        ...mapGetters({
            provinces : 'commonData/adds',
            structA : 'commonData/channel',
            'pipeType':'commonData/pipeType'
        })
    },
	watch: {
        // 渠道
        structAid: function(val, oldVal) {
            this.getNextList(val , 0)
            this.structAChange = true
        },
        'modelList.model_1' : function(val, oldVal) {
            if(val) this.getNextList(val , 1) , this.changeList['change_1'] = true
        },
        'modelList.model_2' : function(val, oldVal) {
            if(val) this.getNextList(val , 2) , this.changeList['change_2'] = true
        },
        'modelList.model_3' : function(val, oldVal) {
            if(val) this.getNextList(val , 3) , this.changeList['change_3'] = true
        },
        'modelList.model_4' : function(val, oldVal) {
            if(val) this.getNextList(val , 4) , this.changeList['change_4'] = true
        },
        'modelList.model_5' : function(val, oldVal) {
            if(val) this.getNextList(val , 5) , this.changeList['change_5'] = true
        }
    },
    mounted()  {
        this.getStoreId()
        this.getDefaultDate(this.id)
        this.getRelationData("S2",this.s2Info ,'s2list')
        this.getRelationData("BD1",this.bd1Info ,'bdxlist')
        this.getS1()
        this.getD1()
    },

	methods:{
        ...mapActions({
            getChannel: 'commonData/getChannel' ,
            getAddress: 'commonData/getAdds' 
        }),
        getStoreId(){
            this.id= this.$route.query.id
        },
		async loadInfo() {
            //获取一级商户
            var loading = this.$loading({
                text:'正在获取商户信息',
                target:'#Edit-store'
            })
            await this.getChannel()
            setTimeout(()=>{loading.close()},100)
            if(!this.structAChange) this.structAid = this.defaultDate.relationUp[0].strRelationId + ',' + this.defaultDate.relationUp[0].strLevelId + ',0'

            this.getAddress().then(()=>{
                this.getCitys(this.strProvinceId)
                this.getAreas(this.strCityId)
            })
            //获取操作流水
            this.getPipeline()
        },
        // 获取默认数据
        getDefaultDate(strStoreId){
            api.getStoreInfo({strStoreId:strStoreId}).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.defaultDate = res.data
                this.defaultDate.relationUp = res.data.relationUp.filter(item =>item.strLevelCode != 'REL001') //过滤掉上级中的合作方
                this.strAddress = this.defaultDate.storeInfo.strAddress
                this.strStoreName = this.defaultDate.storeInfo.strStoreName
                this.strStatusName = this.defaultDate.storeInfo.strStatusName
                this.setTrue = res.data.relationUp.length - 1

                this.strProvinceId = this.defaultDate.storeInfo.strProvinceId
                this.strCityId = this.defaultDate.storeInfo.strCityId
                this.strAreaId = this.defaultDate.storeInfo.strAreaId

                var saleAdds = this.defaultDate.storeInfo.saleAddrList //新建时销售区域为必传字段，此处不用做兼容处理

                for(var i in saleAdds){ //新建时销售区域选择为全部时 对应 id='',所以获取详情时
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
        
        getNextList(val, strIndex , setAddDefault) {
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
        
        // 获取当前对应城市
        getCitys: function(val) {
            console.log(val)
            for(var index in this.provinces){
                if(this.provinces[index].strProvinceId == val){
                    this.citys = this.provinces[index].citys
                }
            }
        },
        // 获取当前对应区域
        getAreas: function(val) {
            for(var index in this.citys){
                if(this.citys[index].strCityId == val){
                    this.areas = this.citys[index].areas
                }
            }
        },
        async getPipeline(){
            const reqData = {
                strPipeUserId:this.$route.query.id,
                strPipeType : this.pipeType.o
            }
            let res = await api.getPipelineList(reqData)
            if (res.ret != '0') {
                this.$message(res.retinfo)
                return
            }
            this.pipeList = res.data
        },
        async setComment(){
            if(!this.comment) {
                this.$message('请输入备注信息！')
                return
            }
            const reqData = {
                strComment : this.comment,
                strPipeType:this.pipeType.o,
                strPipeUserId:this.$route.query.id
            }
            let res = await api.setComment(reqData)
            if (res.ret != '0') {
                this.$message(res.retinfo)
                return
            }
            this.getPipeline()
            this.comment = ''
        },
        //跳至编辑页面
        goEdit:function(id){
            this.$router.push({
                name:'editStore',
                query:{id:id}
            })
        },

        //取消
        cancelnow: function() {
            this.$router.push({ path: '/channel/store' })
        },
        // 获取门店已关联数据 及 可关联数据
        async getRelationData(strPeopleType,obj,preChooseList){ 
            var sendData = {
                strStoreId:this.id,
                "strPeopleType": strPeopleType,
            }
            let res = await api.getStoreDS(sendData)
            if(res.ret != '0'){
                this.$message(res.retinfo)
                return
            } 
            if(!res.data) {
                obj.toChoose = true
                this.getCanRelationData(strPeopleType,obj,preChooseList)
                return
            }else{
                const choosedInfo = res.data[0]
                obj.choosed = choosedInfo.strUserName +' / '+choosedInfo.strPhoneNum
            }
            this.getCanRelationData(strPeopleType,obj,preChooseList)
        },
        async getCanRelationData(strPeopleType,obj,preChooseList){
            let res = await api.getAllDS({"strStoreId": this.id, "strPeopleType": strPeopleType, "strLevelCode":strPeopleType})
            if(res.ret != '0'){
                this.$message(res.retinfo)
                return
            }
            obj.preChooseList = res[preChooseList]
        },

        // 添加S2 
        submitAddS2:function(handle){ 
            if(!this.s2Info.toChooseId){
                this.$message('请选择S2')
                return
            }
            var sendData = {
                strPeopleType : 'S2',
                strStoreId:this.id,
                strPeopleIdList : [this.s2Info.toChooseId],//(现改为只能绑定一个)
            }
            api.addStoreDS(sendData).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return false
                }
                this.s2Info.toChoose = false
                this.getRelationData("S2",this.s2Info ,'s2list')
                this.s2Info.toChooseId = ''
            })
        },
        // 添加BD1 
        submitAddBD1:function(handle){ 
            if(!this.bd1Info.toChooseId){
                this.$message('请选择BD1')
                return
            }
            var sendData = {
                strPeopleType : 'BD1',
                strStoreId:this.id,
                strPeopleIdList : [this.bd1Info.toChooseId],//(现改为只能绑定一个)
            }
            api.addStoreDS(sendData).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return false
                }
                this.bd1Info.toChoose = false
                this.getRelationData("BD1",this.bd1Info ,'bdxlist')
                this.bd1Info.toChooseId = ''
            })
        },
        /************************* 添加S1 **********************/ 
        // 获取门店已关联S1
        getS1:function(){
            let self = this
            var sendData = {
                strStoreId:this.id,
                "strPeopleType": "S1",
            }
            // 获取该门店关联工号
            api.getStoreDS(sendData).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return
                }
                if(!res.data) return
                var getStoreS1 = res.data
                this.get_store_s1_list = res.data
                this.get_store_s1Id_list = []
                for(var i in getStoreS1){
                    this.get_store_s1Id_list.push(String(getStoreS1[i].strUserId))
                }
            })
        },
        // 删除已关联S1
        del_has_s1:function(index){
            this.get_store_s1_list.splice(index,1)
            this.get_store_s1Id_list.splice(index,1)
            this.final_add_S1('del')
        },
        // 获取s1选项列表
        add_s1_btn:function() {
            this.addS1List = []
            this.SList.showS1 = true
            api.getAllDS({"strStoreId": this.id, "strPeopleType": "S1", "strLevelCode":"S1"}).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return
                }
                this.choose_s1_list = res.s1list
            })
            
        },
        // 添加将要添加S1列表
        add_s1_list:function(){
            if(!this.choose_s1_id) {
                this.$message('请选择要关联S1')
                return
            }
            for(var i in this.get_store_s1Id_list){
                if(this.choose_s1_id.split(',')[1] == this.get_store_s1Id_list[i]){
                    this.$message('该项已绑定或已添加！')
                    return
                }
            }
            if(this.addS1List.length == 0){
                this.addS1List.push(this.choose_s1_id.split(',')[0])
                this.addS1Id.push(this.choose_s1_id.split(',')[1])
            }else{
                for(var i in this.addS1Id){
                    if(this.choose_s1_id.split(',')[1] == this.addS1Id[i]){
                        this.$message('该项已绑定或已添加！')
                        return
                    }
                }
                this.addS1List.push(this.choose_s1_id.split(',')[0])
                this.addS1Id.push(this.choose_s1_id.split(',')[1])
            }
        },
        // 删除将要添加的S1列表
        del_preChoose_s1:function(index){
            this.addS1Id.splice(index,1)
            this.addS1List.splice(index,1)
        },
        // 提交添加的S1列表
        final_add_S1:function(handle){
            if(handle == 'add' && this.addS1Id.length == 0){
                this.$message('请选择要关联S1')
                return
            }else if(handle == 'del'){
                this.addS1Id = []
            }
            var hasList = this.get_store_s1Id_list
            var userList = hasList.length != 0 ? hasList.concat(this.addS1Id): this.addS1Id
            var sendData = {
                strPeopleType : 'S1',
                strStoreId:this.id,
                strPeopleIdList : userList,
            }
            api.addStoreDS(sendData).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return false
                }
                this.addS1Id = []
                return true
            }).then((res) => {
                // 重新生成已关联S1
                if(res) {
                    this.getS1()
                    this.getRelationData("S2",this.s2Info ,'s2list')
                }
                this.SList.showS1 = false
            })
        },
        
        
        /************************* 添加D1 **********************/ 
        // 获取门店已关联d1
        getD1:function(){
            let self = this
            var sendData = {
                strStoreId:this.id,
                "strPeopleType": "D1",
            }
            // 获取该门店关联工号
            api.getStoreDS(sendData).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return
                }
                if(!res.data) return
                var getStoreD1 = res.data
                this.get_store_d1_list = res.data
                this.get_store_d1Id_list = []
                for(var i in getStoreD1){
                    this.get_store_d1Id_list.push(String(getStoreD1[i].strUserId))
                }
            })
            
        },
        // 删除已关联d1
        del_has_d1:function(index){
            this.get_store_d1_list.splice(index,1)
            this.get_store_d1Id_list.splice(index,1)
            this.final_add_D1('del')
        },
        // 获取d1选项列表
        add_d1_btn:function() {
            this.addD1List = []
            this.SList.showD1 = true
            api.getAllDS({"strStoreId": this.id, "strPeopleType": "D1", "strLevelCode":"D1"}).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return
                }
                this.choose_d1_list = res.dxlist
            })
        },
        // 添加将要添加D1列表
        add_d1_list:function(){
            if(!this.choose_d1_id) {
                this.$message('请选择要关联D1')
                return
            }
            for(var i in this.get_store_d1Id_list){
                if(this.choose_d1_id.split(',')[1] == this.get_store_d1Id_list[i]){
                    this.$message('该项已绑定或已添加！')
                    return
                }
            }
            if(this.addD1List.length == 0){
                this.addD1List.push(this.choose_d1_id.split(',')[0])
                this.addD1Id.push(this.choose_d1_id.split(',')[1])
            }else{
                for(var i in this.addD1Id){
                    if(this.choose_d1_id.split(',')[1] == this.addD1Id[i]){
                        this.$message('该项已绑定或已添加！')
                        return
                    }
                }
                this.addD1List.push(this.choose_d1_id.split(',')[0])
                this.addD1Id.push(this.choose_d1_id.split(',')[1])
            }
        },
        // 删除将要添加的d1列表
        del_preChoose_d1:function(index){
            this.addD1Id.splice(index,1)
            this.addD1List.splice(index,1)
        },
        // 提交添加的D1列表
        final_add_D1:function(handle){
            if(handle == 'add' && this.addD1Id.length == 0){
                this.$message('请选择要关联D1')
                return
            }else if(handle == 'del'){
                this.addD1Id = []
            }
            var hasList = this.get_store_d1Id_list
            var userList = hasList.length != 0 ? hasList.concat(this.addD1Id): this.addD1Id
            var sendData = {
                strPeopleType : 'D1',
                strStoreId:this.id,
                strPeopleIdList : userList,
            }
            api.addStoreDS(sendData).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return false
                }
                this.addD1Id = []
                return true
            }).then((res) => {
                // 重新生成已关联D1
                if(res) this.getD1()
                this.SList.showD1 = false
            })
        }
        
	}
}
</script>
<style type="text/css" scoped>
    /*#Edit-store{width: 1000px}*/
    .vue-remind{font-size: 12px;color:#999;margin: 8px 0}
    span{font-size: 13px}
    .people-container>p{overflow: hidden;}
    .people-container{padding: 10px 0}
    .addr-container>p{overflow: hidden;}
    .add-people-item{overflow: hidden;margin: 6px}
    .comment{display: inline-block;width: 500px;}
</style>