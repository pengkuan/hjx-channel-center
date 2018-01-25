<template>
<div>
    <hjx-header label="商户 / 列表">
        <router-link to="add_channel"><el-button type="primary" size="small">添加</el-button></router-link>
    </hjx-header>
    <!--工具条-->
    <el-form :inline="true" :model="filters" ref="filters" label-position="top">
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
        <el-form-item  prop="scoreId" label="商户等级：">
            <el-select v-model="filters.scoreId" placeholder="请选择商户等级">
                <el-option  v-for="item in scoreList"  :label="item.name" :value="item.id" :key="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="searchkey" label="商户ID、名称：">
            <el-input v-model="filters.searchkey" @keyup.13.native="search($event)" placeholder="按商户ID、名称搜索" ></el-input>
        </el-form-item>
        <el-form-item label="handle" class="hjx-search-handle">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="clearForm('filters')">清空</el-button>
        </el-form-item>
    </el-form>

    <el-table
        :data="dataList"
        border
        style="width: 100% ; min-height:300px">
        <el-table-column prop="strChannelId" label="商户ID" >
        </el-table-column>
        <el-table-column prop="strChannelName" label="商户名称" ></el-table-column>
        <el-table-column prop="strProvinceName" label="商户地址">
            <template slot-scope="scope">
                {{scope.row.strProvinceName + scope.row.strCityName + scope.row.strAreaName}}
            </template>
        </el-table-column>
        <!-- <el-table-column prop="strChannelName" label="商户" ></el-table-column>
        <el-table-column prop="strChannelManagerName" label="渠道经理" ></el-table-column> -->
        <el-table-column  label="合作状态" >
          <template slot-scope="scope">
                <span v-for="item in statusList" v-if="scope.row.strStatus == item.id">{{item.name}}</span>
            </template>
        </el-table-column>

        <el-table-column prop="strChannelScore" label="商户评分" >
            <template slot-scope="scope">
                <span v-for="item in scoreList" v-if="scope.row.strChannelScore == item.id">{{item.name}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="strS4Name" label="S4" ></el-table-column>
        <el-table-column prop="strS4Tel" label="S4手机号" ></el-table-column>

        <el-table-column prop="strCreateTime" label="创建时间" ></el-table-column> -->
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="text" @click="showDetail(scope.row.strChannelId)"  size="small">详情</el-button>
                <el-button type="text" @click="editChannel(scope.row.strChannelId)"  size="small">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </div>
</div>
</template>
<script>
import api from '../../api/api'
import util from '../../common/util'
import { mapGetters , mapActions} from 'vuex'
export default {
    data() {
        return {
            addrIds:[],
            dataList:[],
            provinces:[],
            provinceId:'',
            pageIndex:'0',
            pageSize:'10',
            currentPage:1,
            total:0,
            filters:{
                searchkey:'',
                scoreId:'',
                strStatus:''
            }
        }
    },
    computed:{
        ...mapGetters({
            addrList : 'commonData/adds',
            selectAddrSetting : 'commonData/selectAddrSetting',
            statusList : 'channel/status',
            scoreList : 'channel/score'
        })
    },
    methods:{
        ...mapActions({
            getAddress: 'commonData/getAdds' 
        }),
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`)
        },
        handleCurrentChange(val) {
            this.pageIndex = val- 1
            this.currentPage = val
            this.showList()
        },
        init(){
            this.getAddress()
        },
        showList:function(){
            let [strProvinceId='', strCityId='', strAreaId=''] = this.addrIds
            let data ={
                pageIndex:String(this.pageIndex),
                pageSize:this.pageSize,
                
                strKey:this.filters.searchkey,
                //
                strStatus:this.filters.strStatus,
                strChannelScore:this.filters.scoreId,
                strProvinceId:strProvinceId,
                strCityId:strCityId,
                strAreaId:strAreaId
            }
            api.getChannelList(data).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.dataList = res.data.channelList
                this.total = Number(res.data.strTotalNum)
            })
            
        },
        //跳至编辑页面
        showDetail:function(strChannelId){
            this.$router.push({
                name:'detailChannel',
                query:{id:strChannelId}
            })
        },
        //跳至编辑页面
        editChannel:function(strChannelId){
            this.$router.push({
                name:'editChannel',
                query:{id:strChannelId}
            })
        },
        //search
        search:function(){
            this.provinceId = util.Trim(this.provinceId)
            this.filters.searchkey = util.Trim(this.filters.searchkey)
            this.currentPage = 1
            this.pageIndex = '0'
            this.showList()

        },
        clearForm(formName){
            this.$refs[formName].resetFields()
            this.addrIds= []
            this.showList()
        },
        // 添加门店
    },
    mounted()  {
        this.init()
        this.showList()
    }

}
</script>
