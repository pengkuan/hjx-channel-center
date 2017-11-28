<template>
<div>
    <div class="title">门店 / 编辑</div>
    <div id="Edit-store">
        <el-tabs type="border-card">
            <el-tab-pane label="POS信息">
                <el-form ref="form" :model="form" label-width="100px">
                    <el-form-item label="商户：" class="mustStar">
                        <el-select v-model="structAid" filterable placeholder="请输入商户名称">
                            <el-option  v-for="item in structA"  :label="item.strRelationName"  :value="item.strRelationId+','+item.strLevelId + ',0'" :key="item.strRelationId">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item v-for = "(option,index) in tempList" :label="option.RelationName" :key="index" class="mustStar">
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
            </el-tab-pane>

            <el-tab-pane label="S1列表">
                <br>
                <span class="vue-title  vue-M-R30">已关联S1：</span><el-button type="primary" icon="plus" size="small" v-on:click = "add_s1_btn()">添加</el-button>
                <br><br>
                <p v-show = "get_store_s1_list.length == 0" class="vue-remind">未关联S1，请点击上方按钮添加S1</p>
                <p class='add-people-item' v-for = "(item , index) in get_store_s1_list">
                    <el-col :span="18">
                        <span class='sale_addr_name'>{{ item.strUserName + ' / '+ item.strUserTel }}</span>
                    </el-col>
                    <el-col :span="6" class = 'submitRightNoM'>
                        <el-button size="mini" type="primary" v-on:click="del_has_s1(index)"> 删除此项</el-button>
                    </el-col>
                </p>
                

            </el-tab-pane>
            <el-tab-pane label="S2列表">
                <br>
                <span class="vue-title  vue-M-R30">已关联S2：</span><el-button type="primary" icon="plus" size="small" v-on:click = "add_s2_btn()">添加</el-button>
                <br><br>
                <p v-show = "get_store_s2_list.length == 0" class="vue-remind">未关联S2，请点击上方按钮添加S2</p>
                <p class='add-people-item' v-for = "(item , index) in get_store_s2_list">
                    <el-col :span="18">
                        <span class='sale_addr_name'>{{ item.strUserName + ' / '+ item.strUserTel }}</span>
                    </el-col>
                    <el-col :span="6" class = 'submitRightNoM'>
                        <el-button size="mini" type="primary" v-on:click="del_has_s2(index)"> 删除此项</el-button>
                    </el-col>
                </p>

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
                <br>
                <span class="vue-title  vue-M-R30">已关联BD1：</span><el-button type="primary" icon="plus" size="small" v-on:click = "add_bd1_btn()">添加</el-button>
                <br><br>
                <p v-show = "get_store_bd1_list.length == 0" class="vue-remind">未关联BD1，请点击上方按钮添加BD1</p>
                <p class='add-people-item' v-for = "(item , index) in get_store_bd1_list">
                    <el-col :span="18">
                        <span class='sale_addr_name'>{{ item.strUserName + ' / '+ item.strPhoneNum }}</span>
                    </el-col>
                    <el-col :span="6" class = 'submitRightNoM'>
                        <el-button size="mini" type="primary" v-on:click="del_has_bd1(index)"> 删除此项</el-button>
                    </el-col>
                    
                    
                </p>
            </el-tab-pane>
            
        </el-tabs>

        <el-dialog title="关联S1" :visible.sync="SList.showS1">
            <div class="content">
                <template>
                  <el-select v-model="choose_s1_id" filterable placeholder="请选择S1">
                    <el-option  v-for="item in choose_s1_list"  :label="item.strUserName + '/' + item.strUserTel"  :value="item.strUserName + '/' + item.strUserTel+ ','+item.strUserId" :key="item.strUserId">
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

        <el-dialog title="关联S2" :visible.sync="SList.showS2">
            <div class="content">
                <template>
                  <el-select v-model="choose_s2_id" filterable placeholder="请选择S2">
                    <el-option  v-for="item in choose_s2_list"  :label="item.strUserName + '/' + item.strUserTel"  :value="item.strUserName + '/' + item.strUserTel+ ','+item.strUserId" :key="item.strUserId">
                    </el-option>
                  </el-select>
                </template>
                <el-button type="primary" icon="plus" size="small" v-on:click = "add_s2_list()">添加</el-button>
                <p v-show = "addS2List.length == 0" class="vue-remind">请点击上方按钮添加预关联S2</p>
                <div class="people-container">
                    <p   v-for = "(item , index) in addS2List">
                        <el-col :span="18">
                            <span class='sale_addr_name'>{{ item }}</span>
                        </el-col>
                        <el-col :span="6" class = 'submitRightNoM'>
                            <el-button size="mini" v-on:click="del_preChoose_s2(index)"> 删除此项</el-button>
                        </el-col>
                    </p>
                </div>
                <el-button type="primary" size="small" v-on:click = "final_add_S2('add')">提交</el-button>
                <el-button type="primary" size="small" v-on:click="SList.showS2 = false">取消</el-button>
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

        <el-dialog title="关联BD1" :visible.sync="SList.showBD1">
            <div class="content">
                <template>
                  <el-select v-model="choose_bd1_id" filterable placeholder="请选择BD1">
                    <el-option  v-for="item in choose_bd1_list"  :label="item.strUserName + '/' + item.strPhoneNum"  :value="item.strUserName + '/' + item.strPhoneNum+ ','+item.strUserId" :key="item.strUserId">
                    </el-option>
                  </el-select>
                </template>
                <el-button type="primary" icon="plus" size="small" v-on:click = "add_bd1_list()">添加</el-button>
                <p v-show = "addBD1List.length == 0" class="vue-remind">请点击上方按钮添加预关联BD1</p>
                <div class="people-container">
                    <p class="haveRelated"  v-for = "(item , index) in addBD1List">
                        <el-col :span="18">
                        <span class='sale_addr_name'>{{ item }}</span>
                        </el-col>
                        <el-col :span="6" class = 'submitRightNoM'>
                            <el-button size="mini" v-on:click="del_preChoose_bd1(index)"> 删除此项</el-button>
                        </el-col>
                    </p>
                </div>
                <el-button type="primary" size="small" v-on:click = "final_add_BD1('add')">提交</el-button>
                <el-button type="primary" size="small" v-on:click="SList.showBD1 = false">取消</el-button>
            </div>
        </el-dialog>

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
<style type="text/css" scope>
    #Edit-store{width: 1000px}
    .vue-remind{font-size: 12px;color:#999;margin: 8px 0}
    span{font-size: 13px}
    .people-container>p{overflow: hidden;}
    .people-container{padding: 10px 0}
    .addr-container>p{overflow: hidden;}
    .add-people-item{overflow: hidden;margin: 6px}
</style>
<script>
import api from '../../api/api'
import util from '../../common/util'
import commonData from '../../common/data'
export default {
	data() {
	    return {

            dialogFormVisible:false,
            form:{},
            id:'',
            S1Type : '1',
            S2Type : '2',
            channelorgs:[],
            provinces:commonData.addrList,
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
                provinces : commonData.addrList,
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

            D1:{  //D1列表相关
                defaultList:[],    //已关联列表
                defaultIdList:[],  //已关联ID列表
                chooseList:[],     //可添加列表
                chooseId:'',       //下来列表选中项ID
            },
            BD1:{  //D1列表相关
                defaultList:[],    //已关联列表
                defaultIdList:[],  //已关联ID列表
                chooseList:[],     //可添加列表
                chooseId:'',       //下来列表选中项ID
            },

            // 已关联S列表
            get_store_s1_list:[],
            get_store_s1Id_list:[],
            get_store_s2_list:[],
            get_store_s2Id_list:[],
            get_store_d1_list:[],
            get_store_d1Id_list:[],
            get_store_bd1_list:[],
            get_store_bd1Id_list:[],

            // S选项列表
            choose_s1_list:[],
            choose_s1_id:'',
            choose_s2_list:[],
            choose_s2_id:'',
            choose_d1_list:[],
            choose_d1_id:'',
            choose_bd1_list:[],
            choose_bd1_id:'',
            // 新增S
            showAddS1:[],
            addS1Id : [],
            addS1List :[],
            showAddS2:[],
            addS2Id : [],
            addS2List :[],
            showAddD1:[],
            addD1Id : [],
            addD1List :[],
            showAddBD1:[],
            addBD1Id : [],
            addBD1List :[],

            setTrue : 10 ,
            // 顶层
            structAid:'',
            structA:commonData.channelList,
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
        this.getS1()
        this.getS2()
        this.getD1()
        this.getBD1()
    },

	methods:{
        getStoreId:function(){
            this.id= this.$route.query.id
        },
		loadInfo: function() {
            //获取一级商户
            if(commonData.channelList.length != 0){
                // 设置默认值
                if(!this.structAChange) this.structAid = this.defaultDate.relationUp[0].strRelationId + ',' + this.defaultDate.relationUp[0].strLevelId + ',0'
            }else{
                var loading = this.$loading({
                    text:'正在获取信息',
                    target:'#Edit-store'
                })
                api.getAllChannels({}).then(res => {
                    loading.close()
                    if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
                    commonData.channelList = res.data.Relations
                    this.structA = res.data.Relations
                    // 设置默认值
                    if(!this.structAChange) this.structAid = this.defaultDate.relationUp[0].strRelationId + ',' + this.defaultDate.relationUp[0].strLevelId + ',0'
                })
            }
            
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

            // 地址
            if(commonData.addrList.length == 0){
                api.getAddress({}).then(res => {
                    if (res.ret != '0') {
                        this.$alert(res.retinfo,"提示")
                        return
                    }
                    commonData.addrList = res.data.address
                    this.provinces = res.data.address
                    this.saleAdds.provinces = res.data.address

                    this.strProvinceId = this.defaultDate.storeInfo.strProvinceId
                })
            }else{
                this.strProvinceId = this.defaultDate.storeInfo.strProvinceId
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


        //取消
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

        },
// 添加S1

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
                if(res) this.getS1()
                this.SList.showS1 = false
            })
        },

// 添加S2

        // 获取门店已关联S2
        getS2:function(){
            
            var sendData = {
                strStoreId:this.id,
                "strPeopleType": "S2",
            }
            // 获取该门店关联工号
            api.getStoreDS(sendData).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return
                } 
                if(!res.data) return
                var getStoreS2 = res.data
                this.get_store_s2_list = res.data
                this.get_store_s2Id_list = []
                for(var i in getStoreS2){
                    this.get_store_s2Id_list.push(String(getStoreS2[i].strUserId))
                }
            })
        },
        // 删除已关联S2
        del_has_s2:function(index){
            this.get_store_s2_list.splice(index,1)
            this.get_store_s2Id_list.splice(index,1)
            this.final_add_S2('del')
        },

        // 获取s2选项列表
        add_s2_btn:function() {
            this.addS2List = []
            this.SList.showS2 = true
            api.getAllDS({"strStoreId": this.id, "strPeopleType": "S2", "strLevelCode":"S2"}).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return
                }
                this.choose_s2_list = res.s2list
            })
            
        },
        // 添加将要添加S2列表
        add_s2_list:function(){
            if(!this.choose_s2_id) {
                this.$message('请选择要关联S2')
                return
            }

            for(var i in this.get_store_s2Id_list){
                if(this.choose_s2_id.split(',')[1] == this.get_store_s2Id_list[i]){
                    this.$message('该项已绑定或已添加！')
                    return
                }
            }

            if(this.addS2List.length == 0){
                this.addS2List.push(this.choose_s2_id.split(',')[0])
                this.addS2Id.push(this.choose_s2_id.split(',')[1])
            }else{
                for(var i in this.addS2Id){
                    if(this.choose_s2_id.split(',')[1] == this.addS2Id[i]){
                        this.$message('该项已绑定或已添加！')
                        return
                    }
                }
                this.addS2List.push(this.choose_s2_id.split(',')[0])
                this.addS2Id.push(this.choose_s2_id.split(',')[1])
            }
        },
        // 删除将要添加的S2列表
        del_preChoose_s2:function(index){
            this.addS2Id.splice(index,1)
            this.addS2List.splice(index,1)
        },
        // 提交添加的S2列表
        final_add_S2:function(handle){
            if(handle == 'add' && this.addS2Id.length == 0){
                this.$message('请选择要关联S2')
                return
            }else if(handle == 'del'){
                this.addS2Id = []
            }
            var hasList = [] 
            for(var i in this.get_store_s2_list){
                hasList.push(String(this.get_store_s2_list[i].strUserId))
            }
            var userList = hasList.length != 0 ? hasList.concat(this.addS2Id): this.addS2Id
            
            // var sendData = {
            //     strType : this.S2Type,
            //     strStoreId:this.id,
            //     listUserId : userList,
            //     listUserId : JSON.stringify(userList)
            // }
            var sendData = {
                strPeopleType : 'S2',
                strStoreId:this.id,
                strPeopleIdList : userList,
            }
            api.addStoreDS(sendData).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return false
                }
                this.addS2Id = []
                return true
            }).then((res) => {
                // 重新生成已关联S2
                if(res) this.getS2()
                this.SList.showS2 = false
            })
        },

//D1 
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
        },
//BD1 
        // 获取门店已关联bd1
        getBD1:function(){
            let self = this
            var sendData = {
                strStoreId:this.id,
                "strPeopleType": "BD1",
            }
            // 获取该门店关联工号
            api.getStoreDS(sendData).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return
                }
                if(!res.data) return
                var getStoreBD1 = res.data
                this.get_store_bd1_list = res.data
                this.get_store_bd1Id_list = []
                for(var i in getStoreBD1){
                    this.get_store_bd1Id_list.push(String(getStoreBD1[i].strUserId))
                }
            })
            
        },
        // 删除已关联bd1
        del_has_bd1:function(index){
            this.get_store_bd1_list.splice(index,1)
            this.get_store_bd1Id_list.splice(index,1)
            this.final_add_BD1('del')
        },

        // 获取bd1选项列表
        add_bd1_btn:function() {
            this.addBD1List = []
            this.SList.showBD1 = true
            api.getAllDS({"strStoreId": this.id, "strPeopleType": "BD1", "strLevelCode":"BD1"}).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return
                }
                this.choose_bd1_list = res.bdxlist
            })
            
        },
        // 添加将要添加BD1列表
        add_bd1_list:function(){
            if(!this.choose_bd1_id) {
                this.$message('请选择要关联BD1')
                return
            }

            for(var i in this.get_store_bd1Id_list){
                if(this.choose_bd1_id.split(',')[1] == this.get_store_bd1Id_list[i]){
                    this.$message('该项已绑定或已添加！')
                    return
                }
            }
            if(this.addBD1List.length == 0){
                this.addBD1List.push(this.choose_bd1_id.split(',')[0])
                this.addBD1Id.push(this.choose_bd1_id.split(',')[1])
            }else{
                for(var i in this.addBD1Id){
                    if(this.choose_bd1_id.split(',')[1] == this.addBD1Id[i]){
                        this.$message('该项已绑定或已添加！')
                        return
                    }
                }
                this.addBD1List.push(this.choose_bd1_id.split(',')[0])
                this.addBD1Id.push(this.choose_bd1_id.split(',')[1])
            }
        },
        // 删除将要添加的d1列表
        del_preChoose_bd1:function(index){
            this.addBD1Id.splice(index,1)
            this.addBD1List.splice(index,1)
        },
        // 提交添加的D1列表
        final_add_BD1:function(handle){
            if(handle == 'add' && this.addBD1Id.length == 0){
                this.$message('请选择要关联BD1')
                return
            }else if(handle == 'del'){
                this.addBD1Id = []
            }
            var hasList = this.get_store_bd1Id_list
            var userList = hasList.length != 0 ? hasList.concat(this.addBD1Id): this.addBD1Id
            var sendData = {
                strPeopleType : 'BD1',
                strStoreId:this.id,
                strPeopleIdList : userList,
            }
            api.addStoreDS(sendData).then(res => {
                if(res.ret != '0'){
                    this.$message(res.retinfo)
                    return false
                }
                this.addBD1Id = []
                return true
            }).then((res) => {
                // 重新生成已关联BD1
                if(res) this.getBD1()
                this.SList.showBD1 = false
            })
        }


	}



}
</script>