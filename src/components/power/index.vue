<template>
<div>
	<div class="title">权限管理</div>
	<!--工具条-->
	<div style='overflow:hidden'>
		<el-row :gutter="20">
    		<el-col :span="4">
				<div class="searchItem">
					<p class="searchTitle">所属系统：</p>
					<el-select v-model="searchkeys.s_system_id" placeholder="请选择">
		                <el-option label="全部" value=""></el-option>
		                <el-option v-for="item in systemList" :label="item.name" :value="item.system_id" :key="item.system_id"></el-option>
		            </el-select>
				</div>
			</el-col>
			<el-col :span="3">
				<div class="searchItem">
					<p class="searchTitle">所属模块：</p>
					<el-select v-model="searchkeys.s_module_id" placeholder="请选择">
		                <el-option label="全部" value=""></el-option>
		                <el-option v-for="item in moduleList.Search" :label="item.Fname" :value="item.Fauthority_id" :key="item.Fauthority_id"></el-option>
		            </el-select>
				</div>
			</el-col>
			<el-col :span="3">
				<div class="searchItem">
					<p class="searchTitle">页面名称：</p>
					<el-input v-model="searchkeys.s_page_name" @keyup.13.native="search($event)" :maxlength="40" placeholder="请输入页面名称"></el-input>
				</div>
			</el-col>
			<el-col :span="3">
				<div class="searchItem">
					<p class="searchTitle">权限标识码：</p>
					<el-select v-model="searchkeys.s_is_flags" placeholder="请选择">
		                <el-option label="全部" value=""></el-option>
		                <el-option label="为空" value="1"></el-option>
		                <el-option label="不为空" value="2"></el-option>
		            </el-select>
				</div>
			</el-col>
			<el-col :span="3">
				<div class="searchItem">
					<p class="searchTitle">状态：</p>
					<el-select v-model="searchkeys.s_status" placeholder="请选择">
		                <el-option label="全部" value=""></el-option>
		                <el-option label="启用" value="1"></el-option>
		                <el-option label="禁用" value="2"></el-option>
		            </el-select>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="searchItem">
					<p class="searchTitle">权限名称：</p>
					<el-input v-model="searchkeys.s_auth_name" @keyup.13.native="search($event)" :maxlength="40" placeholder="请输入权限名称"></el-input>
				</div>
			</el-col>
			<el-col :span="4">
				<p class='searchTitle'>&nbsp;</p>
				<div class="goSearch ">
					<el-button @click="search">搜索</el-button>
		      		<el-button @click="clearForm('searchkeys')">清空</el-button>
				</div>
			</el-col>
    	</el-row>
	</div><br>

    <div class="tool">
    	<router-link to="module"><el-button size="small">模块管理</el-button></router-link>
    	<router-link to="page"><el-button size="small">页面管理</el-button></router-link>
    	<router-link to="add"><el-button type="primary" size="small">新增权限</el-button></router-link>
    </div>
    <table class="el-table el-table--border border-RB-none" cellspacing="0" cellpadding="0" border="0">
    <tr>
    	<th width="10%" class="is-leaf"><div class="cell">系统</div></th>
    	<th width="15%" class="is-leaf"><div class="cell">模块</div></th>
    	<th width="15%" class="is-leaf"><div class="cell">页面</div></th>
    	<th width="15%" class="is-leaf"><div class="cell">权限</div></th>
    	<th width="15%" class="is-leaf"><div class="cell">描述</div></th>
    	<th width="10%" class="is-leaf"><div class="cell">权限标识码</div></th>
    	<th width="10%" class="is-leaf"><div class="cell">状态</div></th>
    	<th width="10%" class="is-leaf"><div class="cell">操作</div></th>
    </tr>
    <tr v-for="(item , index) in dataList">
	    <td  :rowspan="item.Fsystem_idSpan" :class="{hidden: item.Fsystem_idDis}"><div class="cell">{{item.Fsystem_name}}</div></td>
	    <td  :rowspan="item.Fmodule_idSpan" :class="{hidden: item.Fmodule_idDis}"><div class="cell">{{item.Fmodule_name}}</div></td>
	    <td  :rowspan="item.FpidSpan" :class="{hidden: item.FpidDis}"><div class="cell">{{item.Fpage_name}}</div></td>
	    <td><div class="cell">{{item.Fname}}</div></td>
	    <td><div class="cell">{{item.Fdesc}}</div></td>
	    <td><div class="cell">{{item.Faccess_flags}}</div></td>
	    <td>
	    	<div class="cell">
		    	<span v-if="item.upStatus">禁用<br><span class="unUseStatus">上级被禁用，当前无法操作</span></span>
	    		<span v-else-if="item.Fstatus == '1' ">启用</span>
	    		<span v-else>禁用</span>
    		</div>
	    </td>
	    <td>
	    	<div v-if="item.Fname == '查看'">
	        		
	        </div>
	    	<div class="cell" v-else-if="item.Fstatus == 1">
	        	<el-button class='indexFunBtn' type="primary" @click="getEditData(index)"  size="small">编辑</el-button>
	        	<el-button class='indexFunBtn' type="danger" @click="setStatusConfirm(item.Fauthority_id , item.Fstatus)"  size="small">禁用</el-button>
        	</div>
        	<div class="cell" v-else>
        		<el-button  type="primary" @click="setStatusConfirm(item.Fauthority_id , item.Fstatus)" :disabled="item.upStatus" size="small">启用</el-button>
        	</div>
	    </td>
	    
	</tr>
    </table>

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
	<!-- 编辑 -->
	<el-dialog title="编辑" :visible.sync="editDialog">
        <el-form  :model="editPower" :rules="rules" ref="editPower" label-width="140px">
            <el-form-item label="所属系统：" prop='e_system_id'>
                <el-select v-model="editPower.e_system_id"  placeholder="请选择" disabled>
	                <el-option v-for="item in systemList" :label="item.name" :value="item.system_id" :key="item.system_id"></el-option>
	            </el-select>
            </el-form-item>
            <el-form-item label="所属模块：" prop='e_module_id'>
                <el-select v-model="editPower.e_module_id" placeholder="请选择">
	                <el-option v-for="item in moduleList.Edit" :label="item.Fname" :value="item.Fauthority_id" :key="item.Fauthority_id"></el-option>
	            </el-select>
            </el-form-item>
            <el-form-item label="所属页面：" prop='e_pid'>
                <el-select v-model="editPower.e_pid" placeholder="请选择">
	                <el-option v-for="item in editPageList" :label="item.Fname" :value="item.Fauthority_id" :key="item.Fauthority_id"></el-option>
	            </el-select>
            </el-form-item>
            <el-form-item label="权限名称："  prop='e_name'>
                <el-input :maxlength='40' v-model="editPower.e_name"  placeholder='请输入权限名称'></el-input>
            </el-form-item>
            <el-form-item label="描述："  prop='e_desc'>
                <el-input type="textarea" :rows="3" :maxlength='100' v-model="editPower.e_desc"  placeholder='请输入页面描述'></el-input>
            </el-form-item>
            <el-form-item label="权限标识码："  prop='e_access_flags'>
                <el-input v-model="editPower.e_access_flags" :maxlength="20"  placeholder='请输入权限标识码'></el-input>
            </el-form-item>
            <el-form-item class='submitRight'>
                <el-button type="primary" @click="submitnow('editPower')">确认</el-button>
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
	    	editDialog:false,
        	EditInfo:'',
	    	dataList:[],
	    	systemList:[],
	    	moduleList:{
	    		Search:[],
	    		Add:[],
	    		Edit:[]
	    	},
	    	editPageList:[],
	    	pageIndex:'0',
        	pageSize:'10',
        	currentPage:1,
        	total:0,
        	searchkeys:{
        		"s_system_id":'',
		        "s_module_id":"",
		        "s_page_name":"",
		        "s_is_flags":"",
		        "s_auth_name":"",
		        "s_status":""
        	},
        	editPower:{
        		"e_authority_id":"",
				"e_system_id":"",
				"e_module_id":"",
				"e_access_flags":"",
				"e_pid":"",
				"e_type":"1",
				"e_desc":"",
				"e_name":""
        	},
        	getSearchModule:{
        		"s_system_id":'',
				"s_module_name":'',
				'pageIndex':'0',
				'pageSize':'9999'
        	},
        	getEditModule:{
        		"s_system_id":'',
				"s_module_name":'',
				'pageIndex':'0',
				'pageSize':'9999'
        	},
        	getEditPages:{
        		"s_system_id":'',
				"s_module_id":'',
				"s_page_name":'',
				"s_is_flags":'',
				"s_status":'',
				'pageIndex':'0',
				'pageSize':'9999'
        	},
        	rules:{
                e_system_id: [{  required: true,  message: '请选择所属系统'}],
                e_module_id: [{  required: true,  message: '请选择所属模块'}],
                e_pid: [{  required: true,  message: '请选择所属页面'}],
                e_name: [{  required: true , validator: util.validateName1, trigger: 'blur' }],
                e_desc: [{ required: true , validator: util.validateDesc, trigger: 'blur' }]
            }
	    }
	},
	watch: {
        'searchkeys.s_system_id': function(val, oldVal) {
            this.searchkeys.s_module_id = ''
            this.moduleList.Search = []
            this.getSystemModules(val , 'Search')
        },
        'editPower.e_system_id': function(val, oldVal) {
            this.getEditPages.s_module_id = ''
            // this.editPower.e_module_id = ''
            this.moduleList.Edit = []
            if(val != ''){
	            this.getSystemModules(val , 'Edit')
            }
        },
        'editPower.e_module_id': function(val, oldVal) {
            this.editPower.e_pid = ''
            this.editPageList = []
            if(val != ''){
            	this.getModulePages(val)
        	}
        }
    },
	mounted()  {
		this.showList()
		this.loadInfo()
	},
	methods:{
		handleSizeChange(val) {},
	    handleCurrentChange(val) {
	    	this.pageIndex = (val- 1)
	    	this.currentPage = val
	        this.showList()
	    },
	    
	    loadInfo:function(){
	    	let data = {'pageSize':'100'}
	    	api.getSystemList(data).then(res =>{
	    		if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.systemList = res.data.list
                
	    	})
	    },
	    getSystemModules:function(val , searchOrHandle ){
	    	this['get'+searchOrHandle+'Module'].s_system_id = val
	    	if(searchOrHandle == 'Edit') this.getEditPages.s_system_id = val 
	    	api.getModuleList(this['get'+searchOrHandle+'Module']).then(res => {
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.moduleList[searchOrHandle] = this.handleModuleList(res.data.list)
                if( searchOrHandle== 'Edit') this.getEditPages.s_module_id = this.EditInfo.Fmodule_id , this.editPower.e_module_id = this.EditInfo.Fmodule_id
			})
	    },
	    getModulePages:function(val){
	    	this.getEditPages.s_module_id = val
	    	this.editPower.e_module_id = val
	    	api.getPageList(this.getEditPages).then(res => {
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.editPageList = this.relateFstatus(res.data.list) 
                this.editPower.e_pid = this.EditInfo.Fpid
			})
	    },
	    handleModuleList:function(list){
	    	let arr = []
	    	for(var m in list){
	    		let modules = list[m].system_module_list
	    		for(var n in modules ){
	    			arr.push(modules[n])
	    		}
	    	}
	    	return arr
	    },
	    //关联上级状态 如上层为禁用，下层全为禁用
	    relateFstatus:function(list){
	    	for(var i in list){
	    		if(list[i].system_status != '1' || list[i].Fmodule_status != '1' || list[i].Fpage_status != '1') list[i].Fstatus = '2',list[i].upStatus = true
	    	}
	    	return list
	    },
		showList:function(){
			
			let data = {
		        "s_system_id":this.searchkeys.s_system_id,
				"s_module_id":this.searchkeys.s_module_id,
				"s_page_name":this.searchkeys.s_page_name,
				"s_auth_name":this.searchkeys.s_auth_name,
				"s_is_flags":this.searchkeys.s_is_flags,
				"s_status":this.searchkeys.s_status,
				'pageIndex':String(this.pageIndex),
				'pageSize':this.pageSize
			}
			api.getActionAuthList(data).then(res => {
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                console.log(res)
                this.dataList = util.combineCell(this.relateFstatus(res.data.list))
				this.total = Number(res.data.nums)
			})
		},
		//编辑
		getEditData:function(index){
			this.EditInfo = this.dataList[index]
			this.editPower.e_authority_id = String(this.EditInfo.Fauthority_id)
			this.editPower.e_name = this.EditInfo.Fname
			this.editPower.e_desc = this.EditInfo.Fdesc
			this.editPower.e_access_flags = this.EditInfo.Faccess_flags
			this.editPower.e_system_id = this.EditInfo.Fsystem_id
            this.editDialog = true

		},
		//设置状态
		setStatus:function(id , status){
			let data = {
				"e_type":'1',
				"e_authority_id":id,
        		"e_status": status == '1'?'2':'1'
			}
			api.changeAuthStatus(data).then(res => {
                if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.$message('成功！')
                this.showList()
            })
		},
		//search
		search:function(){
			this.searchkeys.s_page_name = util.Trim(this.searchkeys.s_page_name)
			this.searchkeys.s_auth_name = util.Trim(this.searchkeys.s_auth_name)
			this.currentPage = 1
            this.pageIndex = '0'
			this.showList()
		},
		clearForm(){
			this.searchkeys.s_system_id = ''
			this.searchkeys.s_module_id = ''
			this.searchkeys.s_page_name = ''
			this.searchkeys.s_auth_name = ''
			this.searchkeys.s_is_flags = ''
			this.searchkeys.s_status = ''
			this.showList()
		},
		/*****  编辑  *****/ 
		submitnow:function(formName){
			this.editPower.e_name = util.Trim(this.editPower.e_name)
			this.editPower.e_desc = util.Trim(this.editPower.e_desc)
			this.editPower.e_access_flags = util.Trim(this.editPower.e_access_flags)
			
            this.$refs[formName].validate((valid) => { 
                if (valid) {
                    api.editAuth(this.editPower).then(res => {
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
                    return false
                }
            })

		},
		setStatusConfirm:function(id , status){
			let warnInfo = {
				title  : status == '1'?'禁用':'启用'
			}
			const h = this.$createElement
			if(status == '1'){
                warnInfo.content = h('div',null,[
                        h('p',{style:'margin-bottom:6px'},'禁用后：'),
                        h('p',{style:'color:#ff4949'},'• 将导致该权限不可用'),
                        h('p',{style:'margin-top:6px'},'请谨慎操作！')
                    ])
            }else{
                warnInfo.content = h('div',null,[
                        h('p',{style:'margin-bottom:6px'},'启用后：'),
                        h('p',{style:'color:#ff4949'},'• 该权限将可恢复使用'),
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
		}

	}


}
</script>