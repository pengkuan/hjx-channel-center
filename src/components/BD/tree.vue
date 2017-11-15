<template>
<div>
    <div class="title">BD tree管理</div>
    <el-form :inline="true">
        <el-form-item label="请选择BD4：">
            <el-select v-model="strRelationId" filterable placeholder="请选择BD4">
                <el-option  v-for="item in BD4List"  :label="item.strUserName + ' / ' + item.strPhoneNum" :value="item.strRelationId" :key="item.strRelationId">
                </el-option>
            </el-select>
        </el-form-item>

        <el-form-item label="节点搜索：">
            <el-input placeholder="请输入姓名或手机号" icon="search" @keyup.13.native="handleIconClick($event)" v-model="searchNode">
                <el-button slot="append" icon="search" @click="handleIconClick()"></el-button>
            </el-input>
        </el-form-item>

        <el-form-item v-if='showNext'>
            <el-button @click='getNext()'>下一个</el-button>
        </el-form-item>

       
    </el-form>
    <el-row>
        <el-col :span="6">
            <div class="grid-content bg-purple">
                <el-tree class='Dtree' :data="treeList" :props="defaultProps" node-key='strRelationId' :default-expanded-keys='defaultExpand' :highlight-current='true' accordion @node-click="handleNodeClick"  :indent='20' :current-node-key="defaultChecked"></el-tree>
            </div>
        </el-col>
        <el-col :span="18" id="loading-area">
            <div class="grid-content bg-purple-light">
                <div class="rightInfo" v-if='showRightInfo'>
                    <div class="top-title">节点信息</div>

                    <div class="right-title">修改节点信息</div>
                    <el-form  :model="replaceNodeForm" :rules="rules" ref="replaceNodeForm" label-width="120px">
                        <el-form-item label="节点负责人：" prop='strUserName' >
                            <el-select v-model="replaceNodeForm.strUserId" filterable placeholder="请选择">
                                <el-option  v-for="item in replaceNodeForm.replaceNodeList"  :label="item.strUserName + ' / ' + item.strPhoneNum" :value="item.strUserId" :key="item.strUserId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="节点组织身份：" >
                            {{replaceNodeForm.level}}
                        </el-form-item>
                        <el-form-item label="节点销售区域：">
                            <el-select v-model="replaceNodeForm.saleAddsId.strSaleProvinceId" filterable placeholder="请选择省份">
                                <el-option label="全部" value="" ></el-option>
                                <el-option  v-for="item in replaceNodeAddr.provinces"  :label="item.strProvinceName"  :value="item.strProvinceId +','+ item.strProvinceName"  :key="item.strProvinceId">
                                </el-option>
                            </el-select>
                            <el-select v-model="replaceNodeForm.saleAddsId.strSaleCityId" filterable placeholder="请选择城市">
                                <el-option label="全部" value="" ></el-option>
                                <el-option  v-for="item in replaceNodeAddr.citys"  :label="item.strCityName"  :value="item.strCityId +','+ item.strCityName" :key="item.strCityId">
                                </el-option>
                            </el-select>
                            <el-select v-model="replaceNodeForm.saleAddsId.strSaleAreaId" filterable placeholder="请选择区县">
                                <el-option label="全部" value="" ></el-option>
                                <el-option  v-for="item in replaceNodeAddr.areas"  :label="item.strAreaName"  :value="item.strAreaId +','+ item.strAreaName" :key="item.strAreaId">
                                </el-option>
                            </el-select>
                            <el-button type="primary" icon="plus" size="small" v-on:click = "addSaleAddr(replaceNodeForm)">添加</el-button>
                            <div >
                                <p class="add-addr-title">已添加地址：</p>
                                <div class="addr-remind" v-show = 'replaceNodeForm.addSaleList.length == 0'>当前未添加地址，请点击上方按钮添加！</div>
                                <div class="addr-container">
                                    <p class='add-addr-item' v-for = "(item , index) in replaceNodeForm.addSaleList" v:key="index">
                                        <el-col :span="18">
                                            <span >{{ item.saleName }}</span>
                                        </el-col>
                                        <el-col :span="6" class = 'submitRightNoM'>
                                            <el-button size="mini" v-on:click="delSaleAddr(index , replaceNodeForm)"> 删除此行</el-button>
                                        </el-col>
                                    </p>
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item class = 'text-right'>
                            <el-button type="primary" @click="submitForm(replaceNodeForm , 'replaceNodeForm')">确认更新</el-button>
                        </el-form-item>
                        
                    </el-form>
                    <div v-if = 'delNode.showDelNodeModel'>
                        <div class="right-title">删除节点</div>
                        <el-col :span="18">
                            {{delNode.info}} 
                        </el-col>
                        <el-col :span="6" class = 'textRight'>
                            <el-button type="primary" icon="" size="small" v-on:click = "delThisNode(relationIdFn)">删除此节点</el-button>
                        </el-col>
                        <br><br>
                    </div>

                    <div v-if = 'showAddNext'>
                        <div class="right-title">新增下级</div>
                        <el-form  :model="AddNextForm" :rules="rules" ref="AddNextForm" label-width="100px">
                            <el-form-item label="节点负责人：" prop='strUserName' >
                                <el-select v-model="AddNextForm.strUserId" filterable placeholder="请选择">
                                    <el-option  v-for="item in AddNextList"  :label="item.strUserName + ' / ' + item.strPhoneNum" :value="item.strUserId" :key="item.strUserId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="节点组织身份：" >
                                {{AddNextForm.level}}
                            </el-form-item>
                            <el-form-item label="节点销售区域：">

                                <el-select v-model="AddNextForm.saleAddsId.strSaleProvinceId" filterable placeholder="请选择省份">
                                    <el-option label="全部" value="" ></el-option>
                                    <el-option  v-for="item in AddNextSaleAddr.provinces"  :label="item.strProvinceName"  :value="item.strProvinceId +','+ item.strProvinceName"  :key="item.strProvinceId">
                                    </el-option>
                                </el-select>
                                <el-select v-model="AddNextForm.saleAddsId.strSaleCityId" filterable placeholder="请选择城市">
                                    <el-option label="全部" value="" ></el-option>
                                    <el-option  v-for="item in AddNextSaleAddr.citys"  :label="item.strCityName"  :value="item.strCityId +','+ item.strCityName" :key="item.strCityId">
                                    </el-option>
                                </el-select>
                                <el-select v-model="AddNextForm.saleAddsId.strSaleAreaId" filterable placeholder="请选择区县">
                                    <el-option label="全部" value="" ></el-option>
                                    <el-option  v-for="item in AddNextSaleAddr.areas"  :label="item.strAreaName"  :value="item.strAreaId +','+ item.strAreaName" :key="item.strAreaId">
                                    </el-option>
                                </el-select>
                                <el-button type="primary" icon="plus" size="small" v-on:click = "addSaleAddr(AddNextForm)">添加</el-button>
                                <div >
                                    <p class="add-addr-title">已添加地址：</p>
                                    <div class="addr-remind" v-show = 'AddNextForm.addSaleList.length == 0'>当前未添加地址，请点击上方按钮添加！</div>
                                    <div class="addr-container">
                                        <p class='add-addr-item' v-for = "(item , index) in AddNextForm.addSaleList" v:key="index">
                                            <el-col :span="18">
                                                <span >{{ item.saleName }}</span>
                                            </el-col>
                                            <el-col :span="6" class = 'submitRightNoM'>
                                                <el-button size="mini" v-on:click="delSaleAddr(index , AddNextForm)"> 删除此行</el-button>
                                            </el-col>
                                        </p>
                                    </div>

                                </div>
                            </el-form-item>

                            <el-form-item class = 'text-right'>
                                <el-button type="primary" @click="submitForm(AddNextForm,'AddNextForm')">确认添加</el-button>
                            </el-form-item>
                            
                        </el-form>
                    </div>
                </div>
            </div>
        </el-col>
    </el-row>
</div>

	
</template>

<style type="text/css" scoped>
    .top-title{color: #20a0ff ; font-size: 16px ; margin-bottom: 18px}
    .text-right{text-align: right;}
    .right-title{border-top:1px solid #000;height: 50px;line-height: 50px;margin-bottom: 18px;font-weight: 600;font-size: 14px}
  .content-container{width: 600px}
  .el-form-item{margin-bottom: 16px}
  .rightInfo{width: 600px;padding: 18px;border:1px solid #999;border-radius: 8px;background: #eee;margin:auto;}
  .Dtree{width: 300px}
</style>

<script type="text/javascript">
	import api from '../../api/api'
	import util from '../../common/util'
    import commonData from '../../common/data'
	export default {
		data() {
            
		    return {
                icon:'',
                searchNode:'',
                searchResult:[],
                searchResultLength:0,
                searchResultIndex:0,
                showNext:false,
                maxLevel:4, //最大层数
                currentKey:'',//当前选中树节点key
                defaultExpand:[],//默认展开key数组
                defaultChecked:'',//选中
                showAddNext:true,
                showRightInfo:false,
                relationIdFn:'',//选择的树形层级ID
                userIdFn:'',//选择的树形节点ID
                saleAddrFn:'',//选择的树形节点销售区域
                BD4List:[],
                level:{
                    '1':'BD4',
                    '2':'BD3',
                    '3':'BD2',
                    '4':'BD1'
                },
                
                number:'number',
		    	statusId:'1',
                strRelationId:'',//对应不同tree
	            treeList:[],
	            ruleForm:{
                    strStatus:'1',
		            strUserName:'',
		            strUserTel:'',
		            strCardNum:'',
		            strEmail:''
	            },
                defaultProps: {
                    children: 'subList', 
                    label: function(data , node){

                        return data.strLevelName + ' ' + data.strUserName + ' / ' + data.strPhoneNum
                    }
                },
                //替换节点
                replaceNodeForm:{
                    replaceNodeList:[],
                    addSaleList:[],
                    saleAddsId: {
                        strSaleProvinceId : '',
                        strSaleCityId : '',
                        strSaleAreaId : ''
                    },
                    strUserId:'',
                    level:'BD3'
                },
                replaceNodeList:[],
                replaceNodeAddr:{
                    provinces:commonData.addrList,
                    citys:[],
                    areas:[]
                },
                //删除节点
                delNode:{
                    showDelNodeModel : false,
                    info:''
                },
                //新增下级
                AddNextForm:{
                    addSaleList:[],
                    saleAddsId: {
                        strSaleProvinceId : '',
                        strSaleCityId : '',
                        strSaleAreaId : ''
                    },
                    strUserId:'',
                    level:''
                },
                AddNextList:[],
                AddNextSaleAddr:{
                    provinces:commonData.addrList,
                    citys:[],
                    areas:[]
                },
                rules:{
                    // strUserName: [
                    //     {  required: true , validator: validateName, trigger: 'blur' }
                    // ]
                }
		    }
		},
        watch: {
            strRelationId : function (val, oldVal) {
                this.delNode.showDelNodeModel = false
                this.showRightInfo = false
                if(val) this.getTree(val)
            } ,
            'replaceNodeForm.saleAddsId.strSaleProvinceId': function(val, oldVal) {
                this.replaceNodeForm.saleAddsId.strSaleCityId = ''
                this.getCitys(val.split(',')[0] , this.replaceNodeAddr)
            },
            'replaceNodeForm.saleAddsId.strSaleCityId': function(val) {
                this.replaceNodeForm.saleAddsId.strSaleAreaId = ''
                this.getAreas(val.split(',')[0], this.replaceNodeAddr)
            },
            'AddNextForm.saleAddsId.strSaleProvinceId': function(val, oldVal) {
                this.AddNextForm.saleAddsId.strSaleCityId = ''
                this.getCitys(val.split(',' )[0], this.AddNextSaleAddr)
            },
            'AddNextForm.saleAddsId.strSaleCityId': function(val) {
                this.AddNextForm.saleAddsId.strSaleAreaId = ''
                this.getAreas(val.split(',')[0], this.AddNextSaleAddr)
            },
            'relationIdFn' : function(val){ //获取可替换列表 / 下级列表
                if(!val) return
                this.getAddNextBDList(val)
                this.getReplaceBDxList(val)
            }
        },
		mounted()  {
            this.index()
            this.getBD4List()
		},
		methods:{
            index:function(){
                if(commonData.addrList.length == 0){
                    api.getAddress({}).then(res => {
                        if (res.ret != '0') {
                            this.$layer.alert(res.retinfo)
                            return
                        }
                        commonData.addrList = res.data.address
                        this.AddNextSaleAddr.provinces = res.data.address
                        this.replaceNodeAddr.provinces = res.data.address
                    })
                }
            },
            //刷新BD4List
            getBD4List(){
                api.getBD4List({'strBDType':'BD4'}).then(res =>{
                    if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
                    this.BD4List = res.bdxlist
                    
                })
            },

            reloadList:function(isRootReplaced){
                this.getTree(this.strRelationId)
                this.relationIdFn = ''
                this.replaceNodeForm.strUserId = ''
                this.AddNextForm.strUserId = ''
                this.showRightInfo = false
                if(isRootReplaced){
                    this.getBD4List()
                }
            },

            getTree:function(strRelationId){
                this.delNode.showDelNodeModel = false
                api.getBD4Tree({'strRelationId':strRelationId}).then(res =>{
                    if (res.ret != '0') {
                        this.$layer.alert(res.retinfo)
                        return
                    }
                    this.treeList = []
                    this.treeList.push(res.bdtree) 
                })
            },
           
            //节点搜索
            handleIconClick(){
                this.showNext = false
                this.searchNode = util.Trim(this.searchNode)
                if(!this.searchNode){
                    this.$message('请输入姓名或手机号搜索')
                    return
                } 
                let self = this
                
                this.searchResult = []
                this.defaultExpand = []
                this.defaultChecked = ''
                this.searchResultIndex = 0
                this.searchResultLength = 0
                function getSearchResult(data){
                    for(var i in data){
                        if(data[i].strUserName.search(self.searchNode) != -1 || data[i].strPhoneNum.search(self.searchNode) != -1  ) self.searchResult.push(data[i].strRelationId)
                        if(data[i].subList) getSearchResult(data[i].subList)
                    }
                }
                getSearchResult(this.treeList)

                this.searchResultLength = this.searchResult.length
                if(this.searchResultLength == 0) {
                    this.$message('无结果')
                    return
                }
                // 选取搜索结果第一个
                this.defaultExpand = [this.searchResult[0]]
                this.defaultChecked = this.searchResult[0]
                setTimeout(function(){
                    document.querySelectorAll('.is-current>.el-tree-node__content')[0].click()
                },0)
                
                this.showNext = true

            },
            // 下一个节点
            getNext(){
                if(++this.searchResultIndex == this.searchResultLength){
                    this.searchResultIndex = 0
                    this.defaultExpand = [this.searchResult[0]]
                    this.defaultChecked = this.searchResult[0]
                }else{
                    this.defaultExpand = [this.searchResult[this.searchResultIndex]]
                    this.defaultChecked = this.searchResult[this.searchResultIndex]
                }
                setTimeout(function(){
                    document.querySelectorAll('.is-current>.el-tree-node__content')[0].click()
                },0)
            },
            handleNodeClick(data,node) {


                this.replaceNodeForm.level = this.level[node.level] 

                if(node.level < this.maxLevel){
                    this.showAddNext = true
                    this.AddNextForm.level = this.level[Number(node.level)+1] 
                }else{
                    this.showAddNext = false
                }
                this.showRightInfo = true
                this.relationIdFn = data.strRelationId
                this.userIdFn = data.strUserId
                this.saleAddrFn = data.saleAddrList
                if(!data.subList) {
                    this.defaultExpand = [node.parent.data.strRelationId]
                    this.delNode.showDelNodeModel = true
                    this.delNode.info = data.strUserName + ' / ' + data.strPhoneNum
 
                }else {
                    this.defaultExpand = [data.strRelationId]
                    this.delNode.showDelNodeModel = false
                } 
            },
            /*替换负责人*/
                //获取可替换的D工号列表
            getReplaceBDxList(strRelationId){
                api.getReplaceBDxList({'strRelationId':strRelationId}).then(res =>{
                    if (res.ret != '0') {
                        this.$layer.alert(res.retinfo)
                        return
                    }
                    this.replaceNodeForm.replaceNodeList = res.dlist
                    //设置默认值
                    this.replaceNodeForm.strUserId = this.userIdFn
                    // this.replaceNodeForm.addSaleList = this.saleAddrFn
                    if(this.saleAddrFn.length == 0) {
                        return
                    }
                    this.replaceNodeForm.addSaleList = []
                    for(var i in this.saleAddrFn){
                        let item = this.saleAddrFn[i]
                        
                        if(!item.strProvinceName) item.strProvinceName = '全部'
                        if(!item.strCityName) item.strCityName = '全部'
                        if(!item.strAreaName) item.strAreaName = '全部'
                        this.replaceNodeForm.addSaleList.push({
                            'saleName':item.strProvinceName+' '+item.strCityName+' '+item.strAreaName ,
                            'saleId':{
                                'addr_province_id' : item.strProvinceId,
                                'addr_city_id' : item.strCityId ,
                                'addr_area_id' : item.strAreaId
                            }
                        })
                    }
                })
            },
            /*删除节点*/
            delThisNode(strRelationId){
                var loading = this.$loading({
                    text:'正在删除',
                    target:'#loading-area'
                })
                api.delBDLeafNode({'strRelationId':strRelationId}).then(res =>{
                    loading.close()
                    if (res.ret != '0') {
                        this.$layer.alert(res.retinfo)
                        return
                    }
                    this.$message('成功')
                    if(this.replaceNodeForm.level == 'BD4'){
                        this.treeList = []
                        this.strRelationId = ''
                        this.relationIdFn = ''
                        this.replaceNodeForm.strUserId = ''
                        this.AddNextForm.strUserId = ''
                        this.showRightInfo = false
                        this.getBD4List()
                    }else{
                        this.reloadList()
                    }
                })

            },

            /*新增下级*/
            getAddNextBDList(strRelationId){
                api.getAddNextBDList({'strRelationId':strRelationId}).then(res =>{
                    if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
                    this.AddNextList = res.dlist
                })
            },
            // 获取当前对应城市
            getCitys: function(val , addrList) {
                let provinces = addrList.provinces
                for (var index in provinces) {
                    if (provinces[index].strProvinceId == val) {
                        addrList.citys = provinces[index].citys
                    }
                }
            },
            // 获取当前对应区域
            getAreas: function(val , addrList) {
                let citys = addrList.citys
                for (var index in citys) {
                    if (citys[index].strCityId == val) {
                        addrList.areas = citys[index].areas
                    }
                }
            },
            //添加销售区域
            addSaleAddr: function(whichForm){

                let provinceName = whichForm.saleAddsId.strSaleProvinceId.split(',')[1] ? whichForm.saleAddsId.strSaleProvinceId.split(',')[1] :'全部'
                let cityName = whichForm.saleAddsId.strSaleCityId.split(',')[1] ? whichForm.saleAddsId.strSaleCityId.split(',')[1] :'全部'
                let areaName = whichForm.saleAddsId.strSaleAreaId.split(',')[1] ? whichForm.saleAddsId.strSaleAreaId.split(',')[1] :'全部'
                var willAddSale = {
                    'saleName':provinceName+' '+cityName+' '+areaName ,
                    'saleId':{
                        'addr_province_id' : whichForm.saleAddsId.strSaleProvinceId.split(',')[0] ,
                        'addr_city_id' : whichForm.saleAddsId.strSaleCityId.split(',')[0] ,
                        'addr_area_id' : whichForm.saleAddsId.strSaleAreaId.split(',')[0] 
                    }
                }
                // 判断是否重复添加
                for(var i in whichForm.addSaleList){
                    if(whichForm.addSaleList[i].saleId.addr_province_id == willAddSale.saleId.addr_province_id
                        && whichForm.addSaleList[i].saleId.addr_city_id == willAddSale.saleId.addr_city_id
                        && whichForm.addSaleList[i].saleId.addr_area_id == willAddSale.saleId.addr_area_id
                        ){
                            this.$layer.alert('该地址已添加！')
                            return
                    }
                }

                

                whichForm.addSaleList.push(willAddSale)
            },
            delSaleAddr: function(index , whichForm){
                whichForm.addSaleList.splice(index,1)
            },
            submitForm:function(whichForm , judge){
                
                var saleAddrList = []
                var saleList = whichForm.addSaleList
                for(var i in saleList){
                    saleAddrList.push({
                        'strProvinceId':saleList[i].saleId.addr_province_id,
                        'strCityId':saleList[i].saleId.addr_city_id,
                        'strAreaId':saleList[i].saleId.addr_area_id
                    })
                }
                let data = {
                    'strRelationId' : this.relationIdFn,
                    'saleAddrList' : saleAddrList ,
                    'strUserId' : whichForm.strUserId
                }
                if(judge == 'AddNextForm'){
                    if(!data.strUserId) {
                        this.$layer.alert('请选择节点负责人')
                        return
                    }
                    if(data.saleAddrList.length == 0) {
                        this.$layer.alert('请添加销售地址')
                        return
                    }
                    var loading = this.$loading({
                        text:'正在提交',
                        target:'#loading-area'
                    })
                    api.setAddBDNext(data).then(res => {
                        loading.close()
                        if (res.ret != '0') {
                            this.$layer.alert(res.retinfo)
                            return
                        }
                        this.$message("成功！")
                        this.reloadList()

                    })
                }else if(judge == 'replaceNodeForm'){
                    if(!data.strUserId) {
                        this.$layer.alert('请选择节点负责人')
                        return
                    }
                    if(data.saleAddrList.length == 0) {
                        this.$layer.alert('请添加销售地址')
                        return
                    }
                    var loading = this.$loading({
                        text:'正在更新',
                        target:'#loading-area'
                    })
                    api.replaceBDxNode(data).then(res => {
                        loading.close()
                        if (res.ret != '0') {
                            this.$layer.alert(res.retinfo)
                            return
                        }
                        this.$message("成功！")
                        this.reloadList( this.replaceNodeForm.level == 'BD4' )

                    })
                }
            },


            cancelnow: function() {
                this.$router.push({ path: '/D/index' });
            },

            //确定
            submitnow: function(formName) {
                let self = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        api.addEmployeeLogic(this.ruleForm).then(res => {
                            if (res.ret != '0') {
                                return
                            }
                            this.$message("成功！")
                            self.$router.push({ path: '/D/index' });

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