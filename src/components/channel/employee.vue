<template>
<div>
	<div class="title">工号 / 列表</div>
	<!--工具条-->
    <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.searchkey" @keyup.13.native="search($event)" placeholder="按工号/姓名/电话搜索" style="min-width: 240px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="clearForm()">清空</el-button>
        </el-form-item>
    </el-form>

    <div class="tool">
    	<router-link to="add_employee"><el-button type="primary" size="small">添加</el-button></router-link>
    </div>

	<el-table
	    :data="dataList"
	    border
	    style="width: 100% ; min-height:300px">
	    <el-table-column prop="strUserNum" label="工号ID" >
	    	
	    </el-table-column>
	    <el-table-column prop="strUserName" label="姓名" ></el-table-column>
	    <el-table-column prop="strCardNum" label="身份证"></el-table-column>
	    <el-table-column prop="strUserTel" label="手机号码" ></el-table-column>
	    <el-table-column  label="合作状态" >
	    	<template slot-scope="scope">
	            {{scope.row.strStatus == 1 ?'正常':'停止'}}
	        </template>
	    </el-table-column>
	    <el-table-column
	        label="操作"
	        >
	        <template slot-scope="scope">
	        	<el-button class = 'indexFunBtn' type="primary" @click="editEmployee(scope.row.strUserId)"  size="small">编辑</el-button>
	        	<el-button class = 'indexFunBtn' type="danger" @click="setEmployee(scope.row.strUserId , 0)"  size="small">禁用</el-button>
	        	<el-button class = 'indexFunBtn' type="primary" @click="setEmployee(scope.row.strUserId , 1)"  size="small">启用</el-button>
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
	        console.log(`每页 ${val} 条`);
	    },
	    handleCurrentChange(val) {
	    	this.pageIndex = (val- 1) * 10
	        this.showList()
	    },
		showList:function(){
			let data ={
				pageIndex:String(this.pageIndex),
				pageSize:this.pageSize,
				search:this.filters.searchkey
				// csrfmiddlewaretoken:getCookie('csrftoken')
			}
			api.getEmployeeList(data).then(res => {
				if (res.ret != '0') {
                    this.$layer.alert(res.retinfo)
                    return
                }
				this.dataList = res.data.jobNumList
				this.total = Number(res.data.total)
			})
		},
		//跳至编辑页面
		editEmployee:function(strUserId){
			this.$router.push({
				name:'editEmployee',
				query:{id:strUserId}
			})
		},
		// 禁用启用
		setEmployee:function(userId , status){
			api.setEmployee({strUserId:userId , strStatus: status}).then(res => {
				if (res.ret != '0') {
                    this.$layer.alert(res.retinfo)
                    return
                }
				if(status == 0) this.$message({message: '禁用成功',type: 'success'})
				if(status == 1) this.$message({message: '启用成功',type: 'success'})
	            this.showList()
			})
		},
		
		//search
		search:function(){
			this.filters.searchkey = util.Trim(this.filters.searchkey)
			this.showList()
		},
		clearForm(){
			this.filters.searchkey = ''
			this.showList()
		},
		// 添加门店
	},
	mounted()  {
		this.showList()
	}


}
</script>