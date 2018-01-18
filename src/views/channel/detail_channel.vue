<template>
<div>
<div class="title">商户 / 详情</div>
    <el-row class="mrg-b12">
        <el-col :span="12"><div class="hjx-black">{{form.strFullName}}</div></el-col>
        <el-col :span="12"><div class="hjx-right "><el-button type="primary" size="small" @click="goEdit(form.strChannelId)">编辑</el-button></div></el-col>
    </el-row>
    <el-tabs type="border-card">
        <el-tab-pane label="商家信息" class='channelInfo'>
            <el-form  :model="form" label-width="180px" >
                <el-form-item label="O关系模型：" prop="strLevelId">
                    <span v-for="item in channelTemplateList" v-if="form.strLevelId == item.strTemplateId">{{item.strTemplateName}}</span>
                </el-form-item>
                <el-form-item label="商户全称：">{{form.strFullName}}</el-form-item>
                <el-form-item label="所属品牌商/合作方：">
                    <span v-for="item in partnerList" v-if="form.strPartner_id == item.strPartnerId">{{item.strPartnerName}}</span>
                </el-form-item>
                <el-form-item label="营业执照地址：" class="mustStar">
                    <span v-for="item in provinces" v-if="form.strAddr_province_id == item.strProvinceId">{{item.strProvinceName}}</span>
                    <span v-for="item in citys" v-if="form.strAddr_city_id == item.strCityId">{{item.strCityName}}</span>
                    <span v-for="item in areas" v-if="form.strAddr_area_id == item.strAreaId">{{item.strAreaName}}</span>
                    <span>{{form.strDetailAddress}}</span>
                </el-form-item>
                <el-form-item label="销售区域：">
                    <p class='add-addr-item' v-for = "(item , index) in addSaleList" v:key="index">{{ item.saleName }}</p>
                </el-form-item>
                <el-form-item label="营业执照号码：">{{form.strLicense_num}}</el-form-item>
                <el-form-item label="工号前缀：">{{form.strPrefix_str}}</el-form-item>
                <el-form-item label="商户负责S4：">
                    <span v-for="item in channelUserList" v-if="form.strConnection_info == item.strUserId">{{item.strUserName + '/' + item.strUserTel}}</span>
                </el-form-item>
                <el-form-item label="月手机销量：">{{form.strMonth_sales}}</el-form-item>
                <el-form-item label="商户等级：">
                    <span v-for="item in scoreList" v-if="form.strChannelScore == item.id">{{item.name}}</span>
                </el-form-item>
                <el-form-item label="估价模型：">
                    <span v-for="item in valuationList" v-if="form.strValuationId == item.id">{{item.name}}</span>
                </el-form-item>
                <el-form-item label="商户分成：">
                    <p>分成比例{{form.strPercent}}%</p>
                    <p>苹果机型封顶{{form.strApplyMax}}元</p>
                </el-form-item>
                <el-form-item label="店员激励：">无</el-form-item>
                <el-form-item label="付款模式：">
                    <span v-for="item in payMethodList" v-if="form.strPayMethodId == item.id">{{item.name}}</span>
                </el-form-item>
                <el-form-item label="店员/用户APP：">
                    <el-checkbox-group v-model="form.selfFunction">
                        <el-checkbox disabled label="收集用户信息" ></el-checkbox>
                        <el-checkbox disabled label="环保回收"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="合作状态：">
                    <span v-for="item in statusList" v-if="form.strStatus == item.id">{{item.name}}</span>
                </el-form-item>
            </el-form>
        </el-tab-pane>
        <el-tab-pane label="门店列表">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                  <el-input v-model="filters.strStoreId" placeholder="请输入门店ID" style="min-width: 240px;"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-input v-model="filters.strStoreName" placeholder="请输入门店名称" style="min-width: 240px;"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
            </el-form>
            <div class="tool">
                <router-link to="add_store"><el-button type="primary" size="small">添加</el-button></router-link>
            </div>
            <el-table :data="dataList" border style="width: 100% ; min-height:300px">
                <el-table-column prop="strStoreId" label="门店ID" ></el-table-column>
                <el-table-column prop="strStoreName" label="门店名称" ></el-table-column>
                <el-table-column prop="strProvinceName" label="门店地址">
                    <template slot-scope="scope">
                        {{scope.row.strProvinceName + scope.row.strCityName + scope.row.strAreaName +scope.row.strAddress}}
                    </template>
                </el-table-column>
                <el-table-column prop="strRelationD1List" label="D1" >
                    <template slot-scope="scope">
                        <span v-if="scope.row.strRelationD1List.length == 1">
                            {{scope.row.strRelationD1List[0].strUserName+' / '+scope.row.strRelationD1List[0].strPhoneNum}}
                        </span>
                        <span v-else-if="scope.row.strRelationD1List.length>1">
                            {{scope.row.strRelationD1List[0].strUserName+' / '+scope.row.strRelationD1List[0].strPhoneNum}}  ...
                        </span>
                        <span v-else>暂无</span>
                    </template>
                </el-table-column>
                <el-table-column  label="合作状态" >
                    <template slot-scope="scope">{{scope.row.strStatus == '1' ?'正常':'停止'}}</template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button class = 'indexFunBtn' type="primary" @click="editStore(scope.row.strStoreId)"  size="small">编辑</el-button>
                        <el-button class = 'indexFunBtn' type="danger" @click="disableStore(scope.row.strStoreId)"  size="small">禁用</el-button>
                        <el-button class = 'indexFunBtn' type="primary" @click="enableStore(scope.row.strStoreId)"  size="small">启用</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="currentPage4"
                  :page-sizes="[10, 20, 30, 40]"
                  :page-size="10"
                  layout="total, prev, pager, next, jumper"
                  :total="total">
                </el-pagination>
            </div>
        </el-tab-pane>
        <el-tab-pane label="产品价格配置">
        </el-tab-pane>
    </el-tabs>
</div>
</template>
<script>
    import api from '../../api/api'
    import util from '../../common/util'
    import { mapGetters, mapActions } from 'vuex'
  export default {
    data() {
        var validateEmployeeNum = (rule, value, callback) => {
            if(!value){
                callback()
            }
            if( !/^(([a-zA-Z]{2})|([a-zA-Z]{4}))\d{2,4}$/g.test(value)){
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
            channelTemplateList:[],
            partnerList:[],
            citys:[],
            areas:[],
            partnerList:[],
            addSaleList :[],
            channelUserList :[],
            defaultDate:'',//初始默认数据
            //门店信息
            dataList:[],
            pageIndex:'0',
            pageSize:'10',
            currentPage4:1,
            total:0,
            filters:{
                'strStoreId':'',
                'strStoreName':''
            }
        }
    },
    computed:{
        ...mapGetters({
            provinces : 'heavyDate/adds',
            statusList : 'channel/status',
            scoreList : 'channel/score',
            payMethodList : 'channel/payMethod',
            valuationList : 'channel/valuation'
        })
    },
    mounted()  {
        this.getChannelId()
        this.getDefaultDate(this.form.strChannelId)
        this.showList() //门店列表
    },
    methods: {
        ...mapActions({
            getAddress: 'heavyDate/getAdds' 
        }),
        getChannelId:function(){
            this.form.strChannelId= this.$route.query.id
        },
        loadInfo() {
            this.getAddress().then(()=>{
                this.getCitys(this.form.strAddr_province_id)
                this.getAreas(this.form.strAddr_city_id)
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
            api.getAllS4({'strChannelId':''}).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.channelUserList = res.data
                this.channelUserList.push({strUserName :'无' ,strUserTel:'' , strUserId:'0'})
                if(this.addS4Item.strUserId) {
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
                this.form.strAddr_province_id = this.defaultDate.strAddrProvinceId
                this.form.strAddr_city_id = this.defaultDate.strAddrCityId
                this.form.strAddr_area_id = this.defaultDate.strAddrAreaId

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
                    this.addSaleList.push({'saleName':saleName})
                }
            }).then(res => {this.loadInfo()})
        },
        // 获取当前对应城市
        getCitys: function(val) {
            for (var index in this.provinces) {
                if (this.provinces[index].strProvinceId == val) {
                    this.citys = this.provinces[index].citys
                }
            }
        },
        // 获取当前对应区域
        getAreas: function(val) {
            for (var index in this.citys) {
                if (this.citys[index].strCityId == val) {
                    this.areas = this.citys[index].areas
                }
            }
        },
        //跳至编辑页面
        goEdit:function(id){
            this.$router.push({
                name:'editChannel',
                query:{id:id}
            })
        },
        
        //取消
        cancelnow: function() {
            this.$router.push({ path: '/channel/index' })
        },
        //所关联门店
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`)
        },
        handleCurrentChange(val) {
            this.pageIndex = (val- 1) * 10
            this.showList()
        },
        showList:function(){
            let data ={
                pageinfo:{
                    'pageIndex':String(this.pageIndex),
                    'pageSize':this.pageSize,
                },
                'searchkeys':this.filters,
                "strChannelId":this.form.strChannelId
            }
            api.getChannelStoreList(data).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.dataList = res.data.list
                this.dataList.forEach( item => {
                    item.strChannelName = this.form.strFullName //门店列表返回字段无渠道名
                })
                this.total = res.data.nums
            })
        },
        //跳至编辑页面
        editStore:function(strStoreId){
            this.$router.push({
                name:'editStore',
                query:{id:strStoreId}
            })
        },
        // 禁用启用
        disableStore:function(strStoreId){
            api.disableStore({strStoreId:strStoreId}).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.$message({
                    message: '禁用成功',
                    type: 'success'
                });
                this.showList()
            })
        },
        enableStore:function(strStoreId){
            api.enableStore({strStoreId:strStoreId}).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.$message({
                    message: '启用成功',
                    type: 'success'
                });
                this.showList()
            })
        },
        search:function(){
            this.showList()
        }
    }
  }
</script>
<style type="text/css" scoped>
    .channelInfo{width: 1000px}
    .el-form-item{margin-bottom: 0px}
</style>