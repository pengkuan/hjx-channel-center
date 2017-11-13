<template>
<div>
    <div class="title">门店 / 列表</div>
	<!--工具条-->
    <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.strStoreId" @keyup.13.native="search($event)" placeholder="请输入门店ID" style="min-width: 240px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="filters.strStoreName" @keyup.13.native="search($event)" placeholder="请输入门店名称" style="min-width: 240px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="clearForm()">清空</el-button>
        </el-form-item>
    </el-form>

    <div class="tool">
    	<router-link to="add_store"><el-button type="primary" size="small">添加</el-button></router-link>
    </div>

	<el-table
	    :data="dataList"
	    border
	    style="width: 100% ; min-height:300px">
	    <el-table-column prop="strStoreId" label="门店ID" >
	    	
	    </el-table-column>
	    <el-table-column prop="strStoreName" label="门店名称" ></el-table-column>
	    <el-table-column prop="strProvinceName" label="门店地址">
	    	<template slot-scope="scope">
	            {{scope.row.strProvinceName + scope.row.strCityName + scope.row.strAreaName +scope.row.strAddress}}
	        </template>
	    </el-table-column>
	    <el-table-column prop="strChannelName" label="渠道商" ></el-table-column>
	    <el-table-column prop="strChannelManagerName" label="渠道经理" ></el-table-column>
	    <el-table-column  label="合作状态" >
	    	<template slot-scope="scope">
	            {{scope.row.strStatus == 1 ?'正常':'停止'}}
	        </template>
	    </el-table-column>
	    <el-table-column 
	        label="操作"
	        >
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
</div>
</template>
	

<script>
import api from '../../api/api'
import util from '../../common/util'
export default {
	data() {
	    return {
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

	methods:{
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
				'searchkeys':this.filters
			}
			api.getStoreList(data).then(res => {
				if (res.ret != '0') {
                    this.$layer.alert(res.retinfo)
                    return
                }
				this.dataList = res.data.list
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
                    this.$layer.alert(res.retinfo)
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
                    this.$layer.alert(res.retinfo)
                    return
                }
				this.$message({
	                message: '启用成功',
	                type: 'success'
	            });
	            this.showList()
			})

		},
		//search
		search:function(){
			console.log(364)
			this.filters.strStoreId = util.Trim(this.filters.strStoreId)
			this.filters.strStoreName = util.Trim(this.filters.strStoreName)
			this.showList()
		},
		clearForm(){
			this.filters.strStoreId = ''
			this.filters.strStoreName = ''
			this.showList()
		},
		// 添加门店
	},
	mounted()  {
		this.showList()
	}


}
</script>