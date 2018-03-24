<template>
<div>
	<hjx-header label="工号 / 列表">
        <router-link to="add_employee"><el-button type="primary" size="small">添加</el-button></router-link>
    </hjx-header>
	<!--工具条-->
	<el-form :inline="true" :model="searchkeys" ref="searchkeys" label-position="top">
        <el-form-item prop="strLevelCodeList" label="组织身份：">
            <el-checkbox-group v-model="searchkeys.strLevelCodeList">
			    <el-checkbox label="S1"></el-checkbox>
			    <el-checkbox label="S2"></el-checkbox>
			    <el-checkbox label="S4"></el-checkbox>
			</el-checkbox-group>
        </el-form-item>
        <el-form-item prop="strStatus" label="状态：">
            <el-select v-model="searchkeys.strStatus" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in statusList" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop='strName' label="S姓名/ID：">
          	<el-input v-model="searchkeys.strName" @keyup.13.native="search($event)" placeholder="请输入S姓名/ID"></el-input>
        </el-form-item>
        <el-form-item prop='strPhone' label="手机号：">
          	<el-input v-model="searchkeys.strPhone" @keyup.13.native="search($event)" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop='strCard' label="身份证号码：">
          	<el-input v-model="searchkeys.strCard" @keyup.13.native="search($event)" placeholder="请输入身份证号码"></el-input>
        </el-form-item>
        <el-form-item label="handle" class="hjx-search-handle">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="clearForm('searchkeys')">清空</el-button>
        </el-form-item>
    </el-form>
	<el-table
	    :data="dataList" border style="width: 100% ; min-height:300px">
	    <el-table-column prop="strUserId" label="ID" ></el-table-column>
	    <el-table-column prop="strUserName" label="姓名" ></el-table-column>
	    <el-table-column prop="strCardNum" label="身份证号码"></el-table-column>
	    <el-table-column prop="strPhoneNum" label="手机号" ></el-table-column>
	    <el-table-column prop="strChannelName" label="所属商家" ></el-table-column>
	    <el-table-column prop="strStoreName" label="S1所属门店" ></el-table-column>
	    <el-table-column prop="strChannelRole" label="组织身份" ></el-table-column>
	    <el-table-column  label="状态" >
	    	<template slot-scope="scope">
	            <span v-for = "item in statusList" v-if="scope.row.strStatus == item.id">{{item.name}}</span>
	        </template>
	    </el-table-column>
	    <el-table-column label="操作">
	        <template slot-scope="scope">
	        	<el-button class = 'indexFunBtn'  type="text" @click="showDetail(scope.row.strUserId)"  size="small">详情</el-button>
        		<el-button class = 'indexFunBtn' type="text" @click="editEmployee(scope.row.strUserId)"  size="small">编辑</el-button>
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
import {mapGetters} from 'vuex'
export default {
	data() {
	    return {
	    	dataList:[],
	    	pageIndex:'0',
        	pageSize:'10',
        	currentPage:1,
        	total:0,
        	// filters:{
        	// 	searchkey:''
        	// }
        	searchkeys:{
        		"strLevelCodeList":[],
		        "strStatus":"",
		        "strName":"",
		        "strPhone":"",
		        "strCard":""
        	}
	        
	    }
	},
	computed:{
		...mapGetters({
			'statusList':'employee/status'
		})
	},
	methods:{
		handleSizeChange(val) {
	        console.log(`每页 ${val} 条`);
	    },
	    handleCurrentChange(val) {
	    	this.pageIndex = val- 1
	    	this.currentPage = val
	        this.showList()
	    },
		showList(){
			let reqData ={
				pageIndex:String(this.pageIndex),
				pageSize:this.pageSize
			}
			Object.assign(reqData,this.searchkeys) 
			api.getEmployeeList(reqData).then(res => {
				if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
				this.dataList = res.data.list
				this.total = Number(res.data.strTotalNum)
			})
		},
		//跳至编辑页面
		editEmployee(strUserId){
			this.$router.push({
				name:'editEmployee',
				query:{id:strUserId}
			})
		},
		showDetail(id){
			this.$router.push({
				name:'detailEmployee',
				query:{id:id}
			})
		},
		search(){
			this.currentPage = 1
            this.pageIndex = '0'
			this.showList()
		},
		clearForm(){
			this.$refs['searchkeys'].resetFields()
			this.showList()
		}
		// 添加门店
	},
	mounted()  {
		this.showList()
	}


}
</script>