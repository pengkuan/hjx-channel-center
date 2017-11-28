<template>
<div>
    <div class="title">商户 / 列表</div>
    <!--工具条-->
    <el-form :inline="true" :model="filters">
        <el-form-item>
            <el-select v-model="provinceId" placeholder="请选择省份">
                <el-option  v-for="item in provinces"  :label="item.strProvinceName" :value="item.strProvinceId" :key="item.strProvinceId">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-input v-model="filters.searchkey" @keyup.13.native="search($event)" placeholder="按商户ID、名称搜索" style="min-width: 240px;"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="clearForm('searchkeys')">清空</el-button>
        </el-form-item>
    </el-form>

    <div class="tool">
        <router-link to="add_channel"><el-button type="primary" size="small">添加</el-button></router-link>
    </div>

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
                {{scope.row.strState == 1 ?'合作中':'停止合作'}}
            </template>
        </el-table-column>

        <el-table-column prop="strChannelScore" label="商户评分" >
            <template slot-scope="scope">
                <span v-if="scope.row.strChannelScore == '0' ">S</span>
                <span v-else-if="scope.row.strChannelScore == '1' ">A</span>
                <span v-else-if="scope.row.strChannelScore == '2' ">B</span>
                <span v-else-if="scope.row.strChannelScore == '3' ">C</span>
                <span v-else-if="scope.row.strChannelScore == '4' ">D</span>
            </template>
        </el-table-column>
        <el-table-column prop="strS4Name" label="S4" ></el-table-column>
        <el-table-column prop="strS4Tel" label="S4手机号" ></el-table-column>

        <el-table-column prop="strCreateTime" label="合作时间" ></el-table-column> -->
        <el-table-column
            label="操作"
            >
            <template slot-scope="scope">
                <!-- <el-button type="primary" @click="showChannel(scope.row.strChannelId)"  size="small">详情</el-button> -->
                <el-button type="primary" @click="editChannel(scope.row.strChannelId)"  size="small">编辑</el-button>
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
export default {
    data() {
        return {
            dataList:[],
            provinces:[],
            provinceId:'',
            pageIndex:'0',
            pageSize:'10',
            currentPage:1,
            total:0,
            filters:{
                searchkey:''
            }
        }
    },

    methods:{
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`)
        },
        handleCurrentChange(val) {
            this.pageIndex = (val- 1) * 10
            this.currentPage = val
            this.showList()
        },
        init(){
            api.getProvince().then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.provinces = res.data.provinceList
            })
        },
        showList:function(){
            let data ={
                pageIndex:String(this.pageIndex),
                pageSize:this.pageSize,
                provinceId:this.provinceId,
                search:this.filters.searchkey
            }
            api.getChannelList(data).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.dataList = res.data.channelList
                this.total = res.data.nums
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
        clearForm(){
            this.provinceId= ''
            this.filters.searchkey = ''
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
