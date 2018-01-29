<template>
<div>
	<hjx-header label="BD管理 / BD列表">
	    <router-link to="adds"><el-button size="small">批量创建</el-button></router-link>
    	<router-link to="add"><el-button type="primary" size="small">创建BD用户</el-button></router-link>
	</hjx-header>
	<!--工具条-->
	<el-form :inline="true" :model="searchkeys" ref="searchkeys" label-position="top">
        <el-form-item prop="strLevelCode" label="组织身份：">
            <el-checkbox-group v-model="searchkeys.strLevelCode">
			    <el-checkbox label="BD1"></el-checkbox>
			    <el-checkbox label="BD2"></el-checkbox>
			    <el-checkbox label="BD3"></el-checkbox>
			    <el-checkbox label="BD4"></el-checkbox>
			</el-checkbox-group>
        </el-form-item>
        <el-form-item prop="strStatus" label="状态：">
            <el-select v-model="searchkeys.strStatus" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in statusList" :label="item.strStatudName" :value="item.strStatusId" :key="item.strStatusId"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop='strBDUserName' label="姓名：">
          	<el-input v-model="searchkeys.strBDUserName" @keyup.13.native="search($event)" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item prop='strPhoneNum' label="手机号：">
          	<el-input v-model="searchkeys.strPhoneNum" @keyup.13.native="search($event)" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop='strCardNum' label="身份证号码：">
          	<el-input v-model="searchkeys.strCardNum" @keyup.13.native="search($event)" placeholder="请输入身份证号码"></el-input>
        </el-form-item>
        <el-form-item label="handle" class="hjx-search-handle">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="clearForm('searchkeys')">清空</el-button>
        </el-form-item>
    </el-form>
	<el-table
	    :data="dataList"
	    border
	    style="width: 100% ; min-height:300px">
	    <el-table-column label="ID" prop="strPrefixUserId" ></el-table-column>
	    <el-table-column prop="strUserName" label="姓名" ></el-table-column>
	    <el-table-column prop="strPhoneNum" label="手机号码" ></el-table-column>
	    <el-table-column prop="strCardNum" label="身份证号码"></el-table-column>
	    <el-table-column prop="strLevelNames" label="组织身份"></el-table-column>
	    <el-table-column prop="strStatusName" label="状态"></el-table-column>
	    <el-table-column
	        label="操作"
	        >
	        <template slot-scope="scope">
	        	<el-button type="text" @click="detailBD(scope.row.strUserId)"  size="small">详情</el-button>
	        	<el-button type="text" @click="eidtBD(scope.row.strUserId)"  size="small">编辑</el-button>
	        	<!-- <el-button type="primary" @click="addNext(scope.row.strUserId)"  size="small">添加下级</el-button> -->
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
	    	statusList:[],
	    	pageIndex:'0',
        	pageSize:'10',
        	currentPage:1,
        	total:0,
        	searchkeys:{
        		"strLevelCode":[],
		        "strStatus":"",
		        "strBDUserName":"",
		        "strPhoneNum":"",
		        "strCardNum":""
        	}
	    }
	},
	mounted()  {
		this.showList()
		this.loadInfo()
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
	    addPrefix:function(val){
	    	let addLen = 8 - val.length
	    	let prefix = 'bd'
	    	if(addLen > 0){
	    		for(var i = 0 ; i<addLen ; i++){
	    			prefix += '0'
	    		}
	    		return prefix + val
	    	}
	    	return val
	    },
	    loadInfo:function(){
	    	api.getDStatus({'who':'d'}).then(res =>{
	    		if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.statusList = res.data.list
	    	})
	    },
		showList:function(){
			this.searchkeys.strBDUserName = util.Trim(this.searchkeys.strBDUserName)
			this.searchkeys.strPhoneNum = util.Trim(this.searchkeys.strPhoneNum)
			this.searchkeys.strCardNum = util.Trim(this.searchkeys.strCardNum)
			let data ={
				pageinfo:{
					'pageIndex':String(this.pageIndex),
					'pageSize':this.pageSize,
				},
				searchkeys:this.searchkeys
			}
			api.getBDList(data).then(res => {
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
				let List = res.data.list
                for(var i in List){
                	List[i].strPrefixUserId = this.addPrefix(List[i].strUserId)
                }
                this.dataList = List

				this.total = Number(res.data.nums)
			})
		},
		//跳至详情页面
		detailBD:function(strUserId){
			this.$router.push({
				name:'detailBD',
				query:{id:strUserId}
			})
		},
		//跳至编辑页面
		eidtBD:function(strUserId){
			this.$router.push({
				name:'editBD',
				query:{id:strUserId}
			})
		},
		//跳至添加下级页面
		addNext:function(strUserId){
			this.$router.push({
				name:'DAddNext',
				query:{id:strUserId}
			})
		},
		//search
		search:function(){
			this.currentPage = 1
            this.pageIndex = '0'
			this.showList()
		},
		clearForm(){
			this.$refs['searchkeys'].resetFields()
			this.showList()
		}
	}
}
</script>