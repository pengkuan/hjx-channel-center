<template>
<div>
	<div class="title">渠道商 / 模板列表</div>
	<!--工具条-->
    <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.searchkey" @keyup.13.native="search($event)" placeholder="按ID/名称搜索" style="min-width: 240px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="clearForm()">清空</el-button>
        </el-form-item>
    </el-form>

    <div class="tool">
    	<router-link to="add_template"><el-button type="primary" size="small">添加</el-button></router-link>
    </div>

	<el-table
	    :data="dataList"
	    border
	    style="width: 100% ; min-height:300px">
	    <el-table-column prop="strTemplateId" label="模板ID" >
	    	
	    </el-table-column>
	    <el-table-column prop="strTemplateName" label="模板名称" ></el-table-column>
	    <el-table-column prop="strTemplateDesc" label="模板描述" ></el-table-column>
	    <el-table-column prop="strCreateTime" label="创建日期" ></el-table-column>
	    <el-table-column prop="strStatus" label="合作状态" ></el-table-column>
	    <el-table-column
	        label="操作"
	        >
	        <template slot-scope="scope">
	        	<el-button class = 'indexFunBtn' type="primary" @click="edit(scope.row.strTemplateId)"  size="small">编辑</el-button>
	        	<el-button class = 'indexFunBtn' type="danger" @click="delchnn(scope.row.strTemplateId)"  size="small">禁用</el-button>
	        	<el-button class = 'indexFunBtn' type="primary" @click="upchnn(scope.row.strTemplateId)"  size="small">启用</el-button>
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
	    	this.currentPage = val
	        this.showList()
	    },
		showList:function(){
			let data ={
				pageIndex:String(this.pageIndex),
				pageSize:this.pageSize,
				searchkey:this.filters.searchkey
			}
			api.getTemplateList(data).then(res => {
				if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
				this.dataList = res.data.channelTemplates
				this.total = Number(res.data.total)
			})
		},
		//跳至编辑页面
		edit:function(Id){
			this.$router.push({
				name:'editTemplate',
				query:{id:Id}
			})
		},
		//启用渠道关系模板
	  	upchnn:function(templateid) { 
	  		var data = {id:templateid}
	  		api.upChannelTemplate(data).then(res => {
	  			if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.$message('启用成功')
				this.showList()
			})
	  		
	  	},
	  	//禁用渠道关系模板
	  	delchnn:function(templateid) { 
	  		var data = {id:templateid}
	  		api.delChannelTemplate(data).then(res => {
	  			if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
                this.$message('禁用成功')
				this.showList()
			})
	  		
	  	},
		
		//search
		search:function(){
			this.filters.searchkey = util.Trim(this.filters.searchkey)
			this.currentPage = 1
            this.pageIndex = '0'
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
<style type="text/css">
	.pagination{text-align: right;margin: 20px 0}
	
</style>