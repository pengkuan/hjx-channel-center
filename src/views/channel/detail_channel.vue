<template>
    <div class="hjx-show-detail">
        <hjx-header label="商户 / 详情">
            <router-link to="index">
                <el-button size="small">返回商户列表</el-button>
            </router-link>
            <el-button type="primary" size="small" @click="goEdit(form.strChannelId)">编辑</el-button>
        </hjx-header>
        <div class="hjx-black mrg-b12">{{form.strFullName}}</div>
        <el-tabs type="border-card" >
            <el-tab-pane label="商家信息" >
                <el-alert title="基本信息" type="info" :closable="false"></el-alert><br>
                <el-form :model="form" label-width="180px">
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
                        <p class='add-addr-item' v-for="(item , index) in addSaleList" v:key="index">{{ item.saleName }}</p>
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
                            <el-checkbox disabled label="收集用户信息"></el-checkbox>
                            <el-checkbox disabled label="环保回收"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="合作状态：">
                        <span v-for="item in statusList" v-if="form.strStatus == item.id">{{item.name}}</span>
                    </el-form-item>
                </el-form>
                <!-- 操作流水 -->
                <br>
                <el-alert title="操作流水" type="info" :closable="false"></el-alert><br>
                <hjx-pipe v-for="(item,index) in pipeList" :key="index" :strF1="item.strF1" :strF2="item.strF2">{{item.strF3+' '+item.strF4}}</hjx-pipe>
                <br>
                <div class="comment"><el-input  v-model="comment" :maxlength="400" placeholder="在此输入备注内容（最多400字）"></el-input></div>
                <el-button  @click="setComment" :disabled="comment?false:true">确认备注</el-button><br><br>
            </el-tab-pane>
            <el-tab-pane label="门店列表">
                <div class="hjx-overflow">
                    <el-form class="hjx-fl" :inline="true" :model="filters" ref="filters" label-position="top">
                        <el-form-item label="地址：">
                            <el-cascader :options="addrList" :props="selectAddrSetting" placeholder="请选择地址" v-model="addrIds" change-on-select></el-cascader>
                        </el-form-item>
                        <el-form-item prop="strStatus" label="合作状态：">
                            <el-select v-model="filters.strStatus" placeholder="请选择合作状态">
                                <el-option label="全部" value=""></el-option>
                                <el-option  v-for="item in statusList"  :label="item.name" :value="item.id" :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="strStoreRelateStatus" label="关联状态：">
                            <el-select v-model="filters.strStoreRelateStatus" placeholder="请选择关联状态">
                                <el-option label="全部" value=""></el-option>
                                <el-option  v-for="item in relatedStatusList"  :label="item.name" :value="item.id" :key="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="门店ID：" prop="strStoreId">
                          <el-input v-model="filters.strStoreId" @keyup.13.native="search($event)" placeholder="请输入门店ID" ></el-input>
                        </el-form-item>
                        <el-form-item label="门店名称：" prop="strStoreName">
                          <el-input v-model="filters.strStoreName" @keyup.13.native="search($event)" placeholder="请输入门店名称" ></el-input>
                        </el-form-item>
                        <el-form-item label="handle" class="hjx-search-handle">
                            <el-button type="primary" @click="search">查询</el-button>
                            <el-button @click="clearForm('filters')">清空</el-button>
                        </el-form-item>
                    </el-form><br><br>
                    <div class="hjx-fr" style="padding-bottom:12px"><router-link to="add_store"><el-button type="primary" size="small">添加</el-button></router-link></div>
                </div>
                <el-table :data="dataList" border style="width: 100% ; min-height:300px">
                    <el-table-column prop="strStoreId" label="门店ID" ></el-table-column>
                    <el-table-column prop="strStoreName" label="门店名称" ></el-table-column>
                    <el-table-column prop="strChannelName" label="商户" ></el-table-column>
                    <el-table-column  label="合作状态" >
                        <template slot-scope="scope">
                            <span v-for="item in storeStatusList" v-if="scope.row.strStatus == item.id">{{item.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="关联状态" >
                        <template slot-scope="scope">
                            <span v-for = "item in relatedStatusList" v-if="scope.row.strRelatedStatus == item.id">{{item.name}}</span>
                            <p v-if="scope.row.strRelatedStatus == '0' " class="unUseStatus">{{scope.row.strRelatedStatusTips}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作">
                        <template slot-scope="scope">
                            <el-button class = 'indexFunBtn'  type="primary" @click="showDetail(scope.row.strStoreId)"  size="small">详情</el-button>
                            <el-button class = 'indexFunBtn' type="primary" @click="editStore(scope.row.strStoreId)"  size="small">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
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
import hjxPipe from '@/base/hjx_pipe'
import util from '../../common/util'
import { mapGetters, mapActions } from 'vuex'
export default {
    components:{hjxPipe},
    data() {
        var validateEmployeeNum = (rule, value, callback) => {
            if (!value) {
                callback()
            }
            if (!/^(([a-zA-Z]{2})|([a-zA-Z]{4}))\d{2,4}$/g.test(value)) {
                callback(new Error('请输入正确工号（2位或4位字母(渠道拼音首字母)+4位数字(渠道省份区号)）'))
            }
            callback()
        }
        return {
            comment:'', //备注
            pipeList:[],//操作流水
            addrIds:[],
            //渠道信息
            addS4Item: {},
            provinceChange: false,
            cityChange: false,
            form: {
                strShareId: '',
                strLevelId: '',
                strFullName: '',
                strPartner_id: '',
                strSecond_channel: '',
                strAddr_province_id: '',
                strAddr_city_id: '',
                strAddr_area_id: '',
                strDetailAddress: '',
                strSale_addr: '',
                strStatus: '1',
                strLicense_num: '',
                strPrefix_str: '',
                strConnection_info: '',
                strMonth_sales: '',
                strChannelPic: '',
                strChannelScore: '1',
                strValuationId: '',
                strPercent: '',
                strApplyMax: '',
                strShopAwardId: '0',
                strPayMethodId: '',
                selfFunction: [],
                strGreen_recycle: '0',
                strGather_userInfo: '0',
                strChannelId: ''
            },
            channelTemplateList: [],
            partnerList: [],
            citys: [],
            areas: [],
            partnerList: [],
            addSaleList: [],
            channelUserList: [],
            defaultDate: '', //初始默认数据
            //门店信息
            dataList: [],
            pageIndex: '0',
            pageSize: '10',
            currentPage4: 1,
            total: 0,
            filters:{
                'strStoreId':'',
                'strStoreName':'',
                'strChannelKey':'',
                'strStatus': '',
                'strStoreRelateStatus':''
            }
        }
    },
    computed: {
        ...mapGetters({
            'pipeType':'commonData/pipeType',
            provinces: 'commonData/adds',
            statusList: 'channel/status',
            storeStatusList: 'store/status',
            scoreList: 'channel/score',
            payMethodList: 'channel/payMethod',
            valuationList: 'channel/valuation',
            relatedStatusList : 'store/relatedStatus',
            addrList : 'commonData/adds',
            selectAddrSetting : 'commonData/selectAddrSetting'
        })
    },

    mounted() {
        this.getChannelId()
        this.getDefaultDate(this.form.strChannelId)
        this.getPipeline()
        this.showList() //门店列表
    },
    methods: {
        ...mapActions({
            getAddress: 'commonData/getAdds'
        }),
        getChannelId: function() {
            this.form.strChannelId = this.$route.query.id
        },
        loadInfo() {
            this.getAddress().then(() => {
                this.getCitys(this.form.strAddr_province_id)
                this.getAreas(this.form.strAddr_city_id)
            })

            api.getChannelTemplate({}).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo, "提示")
                    return
                }
                this.channelTemplateList = res.data.channelTemplateList
                this.form.strLevelId = this.defaultDate.strLevelId
            })
            api.getPartner({}).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo, "提示")
                    return
                }
                this.partnerList = res.data.partnerList
                this.form.strPartner_id = this.defaultDate.strPartnerId == '0' ? '' : this.defaultDate.strPartnerId

            })
            api.getAllS4({ 'strChannelId': '' }).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo, "提示")
                    return
                }
                this.channelUserList = res.data
                if (this.addS4Item.strUserId) {
                    this.channelUserList.push(this.addS4Item)
                    this.form.strConnection_info = this.addS4Item.strUserId
                }
                this.form.strConnection_info = this.defaultDate.strS4Id
            })
        },
        // 获取初始默认数据
        getDefaultDate(channelId) {
            api.getChannelInfo({ channelId: channelId }).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo, "提示")
                    return
                }
                this.defaultDate = res.data
                this.addS4Item = {
                        'strUserName': this.defaultDate.strS4Name,
                        'strUserTel': this.defaultDate.strS4Phone,
                        'strUserId': this.defaultDate.strS4Id
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
                if (this.defaultDate.strIsCollect == '1') this.form.selfFunction.push('收集用户信息')
                if (this.defaultDate.strIsRecycle == '1') this.form.selfFunction.push('环保回收')
                var saleAdds = this.defaultDate.saleAreaList
                for (var i in saleAdds) {
                    if (!saleAdds[i].addr_province_name) saleAdds[i].addr_province_name = '全部'
                    if (!saleAdds[i].addr_city_name) saleAdds[i].addr_city_name = '全部'
                    if (!saleAdds[i].addr_area_name) saleAdds[i].addr_area_name = '全部'
                    var saleName = saleAdds[i].addr_province_name + ' ' + saleAdds[i].addr_city_name + ' ' + saleAdds[i].addr_area_name
                    this.addSaleList.push({ 'saleName': saleName })
                }
            }).then(res => { this.loadInfo() })
        },
        // 获取当前对应城市
        getCitys(val) {
            for (var index in this.provinces) {
                if (this.provinces[index].strProvinceId == val) {
                    this.citys = this.provinces[index].citys
                }
            }
        },
        // 获取当前对应区域
        getAreas(val) {
            for (var index in this.citys) {
                if (this.citys[index].strCityId == val) {
                    this.areas = this.citys[index].areas
                }
            }
        },
        //跳至编辑页面
        goEdit(id) {
            this.$router.push({
                name: 'editChannel',
                query: { id: id }
            })
        },
        editStore(strStoreId){
            this.$router.push({
                name:'editStore',
                query:{id:strStoreId}
            })
        },
        showDetail(id){
            this.$router.push({
                name:'detailStore',
                query:{id:id}
            })
        },
        handleCurrentChange(val) {
            this.pageIndex = (val - 1) * 10
            this.showList()
        },
        showList() {
            let [strProvinceId='', strCityId='', strAreaId=''] = this.addrIds
            let data ={
                pageinfo:{
                    'pageIndex':String(this.pageIndex),
                    'pageSize':this.pageSize,
                },
                'searchkeys':Object.assign(this.filters , {'strProvinceId':strProvinceId,strCityId:strCityId,strAreaId:strAreaId}),
                "strChannelId": this.form.strChannelId
            }
            api.getChannelStoreList(data).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo, "提示")
                    return
                }
                this.dataList = res.data.list
                this.total = res.data.nums
            })
        },
        //跳至编辑页面
        editStore(strStoreId) {
            this.$router.push({
                name: 'editStore',
                query: { id: strStoreId }
            })
        },
        search(){
            this.filters.strStoreId = util.Trim(this.filters.strStoreId)
            this.filters.strStoreName = util.Trim(this.filters.strStoreName)
            this.currentPage = 1
            this.pageIndex = '0'
            this.showList()
        },
        clearForm(formName){
            this.$refs[formName].resetFields()
            this.addrIds= []
            this.showList()
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
        }
    }
}

</script>
<style type="text/css" scoped>
.comment{display: inline-block;width: 500px;}
</style>
