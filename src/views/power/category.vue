<template>
<div>
	<hjx-header label="分类管理 / 新增">
	    <router-link to="user"><el-button size="small">返回角色管理</el-button></router-link>
	    <el-button type="primary" size="small" @click="addCateRole">新增分类</el-button>
	</hjx-header>
	<el-table
	    :data="dataList"
	    border
	    style="width: 100% ; min-height:300px">
	    <el-table-column prop="Fname" label="分类名称" ></el-table-column>
	    <el-table-column prop="Fdesc" label="分类描述" ></el-table-column>
	    <el-table-column  label="状态" >
	    	<template slot-scope="scope">
	            <span v-if="scope.row.Fstatus == '1' ">启用</span>
	    		<span v-else-if="scope.row.Fstatus == '2' ">禁用</span>
	        </template>
	    </el-table-column>
	    <el-table-column label="操作" >
	        <template slot-scope="scope" >
	        	<el-button class='indexFunBtn' type="text" @click="getEditData(scope.$index)"  size="small">编辑</el-button>
	        	<el-button v-if="scope.row.Fstatus == 1" class='indexFunBtn' type="text hjx-danger" @click="setStatusConfirm(scope.row.Fcate_id , scope.row.Fstatus)"  size="small">禁用</el-button>
        		<el-button v-else class='indexFunBtn'  type="text" @click="setStatusConfirm(scope.row.Fcate_id , scope.row.Fstatus)"  size="small">启用</el-button>
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
	<!-- 新增 -->
	<el-dialog title="新增" :visible.sync="addDialog">
        <el-form  :model="handelAddCateRole" :rules="rules" ref="handelAddCateRole" label-width="100px">
            <el-form-item label="分类名称："  prop='c_name'>
                <el-input :maxlength='40' v-model="handelAddCateRole.c_name"  placeholder='请输入分类名称'></el-input>
            </el-form-item>
            <el-form-item label="描述："  prop='c_desc'>
                <el-input type="textarea" :rows="3" :maxlength='100' v-model="handelAddCateRole.c_desc"  placeholder='请输入分类描述'></el-input>
            </el-form-item>
            <el-form-item class='submitRight'>
                <el-button type="primary" @click="submitnow('handelAddCateRole')">确认</el-button>
                <el-button @click="cancelnow">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 新增 -->
	<el-dialog title="编辑" :visible.sync="editDialog">
        <el-form  :model="handelEditCateRole" :rules="rules" ref="handelEditCateRole" label-width="100px">
            <el-form-item label="分类名称："  prop='e_name'>
                <el-input :maxlength='40' v-model="handelEditCateRole.e_name"  placeholder='请输入分类名称'></el-input>
            </el-form-item>
            <el-form-item label="描述："  prop='e_desc'>
                <el-input type="textarea" :rows="3" :maxlength='100' v-model="handelEditCateRole.e_desc"  placeholder='请输入分类描述'></el-input>
            </el-form-item>
            <el-form-item class='submitRight'>
                <el-button type="primary" @click="submitnow('handelEditCateRole')">确认</el-button>
                <el-button @click="cancelnow">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</div>
</template>
	

<script>
import api from '../../api/api'
import util from '../../common/util'
export default {
	data() {
		
	    return {
	    	addDialog:false,
	    	editDialog:false,
	    	ifAdd:true,
	    	dataList:[],
	    	cateRoleList:[],
	    	pageIndex:'0',
        	pageSize:'10',
        	currentPage:1,
        	total:0,
        	searchkeys:{
        		"cateId":'',
		        "roleName":""
        	},
        	handelAddCateRole:{
        		c_cate_id:'',
        		c_name:'',
        		c_desc:'',
        		c_status:'1',
        	},
        	handelEditCateRole:{
        		e_cate_id:'',
        		e_name:'',
        		e_desc:'',
        		e_status:'1',
        	},
        	rules:{
                c_name: [{  required: true , validator: util.validateName1, trigger: 'blur' }],
                c_desc: [{ required: true , validator: util.validateDesc, trigger: 'blur' }],

                e_name: [{  required: true , validator: util.validateName1, trigger: 'blur' }],
                e_desc: [{ required: true , validator: util.validateDesc, trigger: 'blur' }]
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
	    	this.pageIndex = (val- 1)
	        this.showList()
	    },
	    
	    loadInfo:function(){
	    	
	    },
		showList:function(){
			
			let data = {
				'pageIndex':String(this.pageIndex),
				'pageSize':this.pageSize
			}
			api.getCateRoleList(data).then(res => {
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
				let List = res.data.list
                this.dataList = List
				this.total = Number(res.data.nums)
			})
		},
		//设置状态
		setStatus:function(id , status){
			let data = {
				"s_cate_id":id,
        		"s_status": status == '1'?'2':'1'
			}
			api.changeCateRoleStatus(data).then(res => {
                if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.$message('成功！')
                this.showList()
            })
		},
		//新增
		addCateRole:function(){
			this.handelAddCateRole.c_cate_id = ''
			this.handelAddCateRole.c_name = ''
			this.handelAddCateRole.c_desc = ''
			this.addDialog = true
		},
		//编辑
		getEditData:function(index){
			let roleCateInfo = this.dataList[index]
			this.handelEditCateRole.e_cate_id = roleCateInfo.Fcate_id
			this.handelEditCateRole.e_name = roleCateInfo.Fname
			this.handelEditCateRole.e_desc = roleCateInfo.Fdesc
            this.editDialog = true
		},
		//search
		search:function(){
			this.showList()
		},
		/*****  新增/编辑  *****/ 
		submitnow:function(formName){
			if(this.addDialog){
				this.handelAddCateRole.c_name = util.Trim(this.handelAddCateRole.c_name)
				this.handelAddCateRole.c_desc = util.Trim(this.handelAddCateRole.c_desc)
				
	            this.$refs[formName].validate((valid) => { 
	                if (valid) {
	                    api.addCateRole(this.handelAddCateRole).then(res => {
	                        if (res.ret != '0') {
	                            this.$message(res.retinfo)
	                            return
	                        }
	                        this.$message('成功！')
	                        this.showList()
	                        this.addDialog = false
	                    })
	                } else {
	                    console.log('error submit!!')
	                    return false;
	                }
	            })

			}else{
				this.handelEditCateRole.e_name = util.Trim(this.handelEditCateRole.e_name)
				this.handelEditCateRole.e_desc = util.Trim(this.handelEditCateRole.e_desc)
				this.$refs[formName].validate((valid) => { 
	                if (valid) {
		            	api.editCateRole(this.handelEditCateRole).then(res => {
			                if (res.ret != '0') {
			                    this.$message(res.retinfo)
			                    return
			                }
			                this.$message('成功！')
		                    this.showList()
		                    this.editDialog = false
			            })
			        } else {
	                    console.log('error submit!!')
	                    return false;
	                }
	            })
			}
		},
		setStatusConfirm:function(id , status){
			let warnInfo = {
				title  : status == '1'?'禁用':'启用'
			}
			const h = this.$createElement
			if(status == '1'){
                warnInfo.content = h('div',null,[
                        h('p',{style:'margin-bottom:6px'},'禁用后：'),
                        h('p',{style:'color:#ff4949'},'• 该分类中所有内容将被禁用•'),
                        h('p',{style:'color:#ff4949'},'• 将无法往该分类中新增内容请谨慎操作！'),
                        h('p',{style:'margin-top:6px'},'请谨慎操作！')
                    ])
            }else{
                warnInfo.content = h('div',null,[
                        h('p',{style:'margin-bottom:6px'},'禁用后：'),
                        h('p',{style:'color:#ff4949'},'• 该分类中的内容将恢复至禁用前的状态'),
                        h('p',{style:'margin-top:6px'},'请谨慎操作！')
                    ])
            }
	        this.$confirm(warnInfo.content, warnInfo.title, {
	          //type: 'warning'
	        }).then(() => {
	        	this.setStatus(id , status)
	        }).catch(() => {})
      	},
		cancelnow:function(id){
			this.editDialog = false
			this.addDialog = false
		}
	}


}
</script>
<style type="text/css">
	.pagination{text-align: right;margin: 20px 0}
	
</style>