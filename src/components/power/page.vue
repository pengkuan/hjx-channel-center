<template>
<div>
	<div class="title">
		<el-col :span="12">页面管理</el-col>
		<el-col :span="12" class="textRight"><router-link to="index"><el-button size="small">返回权限管理</el-button></router-link></el-col>
	</div>
	
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
			<el-col :span="4">
				<div class="searchItem">
					<p class="searchTitle">所属模块：</p>
					<el-select v-model="searchkeys.s_module_id" placeholder="请选择">
		                <el-option label="全部" value=""></el-option>
		                <el-option v-for="item in moduleList.Search" :label="item.Fname" :value="item.Fauthority_id" :key="item.Fauthority_id"></el-option>
		            </el-select>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="searchItem">
					<p class="searchTitle">权限标识码：</p>
					<el-select v-model="searchkeys.s_is_flags" placeholder="请选择">
		                <el-option label="全部" value=""></el-option>
		                <el-option label="为空" value="1"></el-option>
		                <el-option label="不为空" value="2"></el-option>
		            </el-select>
				</div>
			</el-col>
			<el-col :span="4">
				<div class="searchItem">
					<p class="searchTitle">页面名称：</p>
					<el-input v-model="searchkeys.s_page_name" @keyup.13.native="search($event)" :maxlength="40" placeholder="请输入页面名称"></el-input>
				</div>
			</el-col>
			<el-col :span="8">
				<p class='searchTitle'>&nbsp;</p>
				<div class="goSearch ">
					<el-button @click="search">搜索</el-button>
		      		<el-button @click="clearForm('searchkeys')">清空</el-button>
				</div>
			</el-col>
    	</el-row>
	</div>

    <div class="tool">
    	
    	<el-button type="primary" size="small" @click="Add()">新增页面</el-button>
    </div>


    <table class="el-table el-table--border border-RB-none" cellspacing="0" cellpadding="0" border="0">
    <tr>
    	<th width="15%" class="is-leaf"><div class="cell">系统</div></th>
    	<th width="15%" class="is-leaf"><div class="cell">模块</div></th>
    	<th width="10%" class="is-leaf"><div class="cell">页面名称</div></th>
    	<th width="20%" class="is-leaf"><div class="cell">描述</div></th>
    	<th width="20%" class="is-leaf"><div class="cell">查看权限标识码</div></th>
    	<th width="10%" class="is-leaf"><div class="cell">状态</div></th>
    	<th width="10%" class="is-leaf"><div class="cell">操作</div></th>
    </tr>
    <tr v-for="(item , index) in dataList">
	    <td  :rowspan="item.Fsystem_idSpan" :class="{hidden: item.Fsystem_idDis}"><div class="cell">{{item.Fsystem_name}}</div></td>
	    <td  :rowspan="item.Fmodule_idSpan" :class="{hidden: item.Fmodule_idDis}"><div class="cell">{{item.Fmodule_name}}</div></td>
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
	    	<div class="cell" v-if="item.Fstatus == 1">
	        	<el-button class='indexFunBtn' type="primary" @click="getEditData(index)"  size="small">编辑</el-button>
	        	<el-button class='indexFunBtn' type="danger" @click="setStatusConfirm(item.Fauthority_id , item.Fstatus)"  size="small">禁用</el-button>
        	</div>
        	<div class="cell" v-else>
        		<el-button  type="primary" @click="setStatusConfirm(item.Fauthority_id , item.Fstatus)" :disabled="item.upStatus" size="small">启用</el-button>
        	</div>
	    </td>
	    
	</tr>
    </table>
    <!-- <br><br><br> -->

	<!-- <el-table
	    :data="dataList"
	    border
	    style="width: 100% ; min-height:300px">
	    
	    <el-table-column prop="Fname" label="页面名称" ></el-table-column>
	    <el-table-column prop="Fdesc" label="描述"></el-table-column>
	    <el-table-column prop="Fmodule_name" label="所属模块"></el-table-column>
	    <el-table-column prop="Fsystem_name" label="所属系统"></el-table-column>
	    <el-table-column prop="Faccess_flags" label="查看权限标识码"></el-table-column>
	    <el-table-column  label="状态" >
	    	<template scope="scope">
	    		<span v-if="scope.row.upStatus">上级被禁用，当前无法操作</span>
	    		<span v-else-if="scope.row.Fstatus == '1' ">启用</span>
	    		<span v-else>禁用</span>
	        </template>
	    </el-table-column>
	    <el-table-column label="操作" >
	        <template scope="scope" >
	        	<div v-if="scope.row.Fstatus == 1">
		        	<el-button class='indexFunBtn' type="primary" @click="getEditData(scope.$index)"  size="small">编辑</el-button>
		        	<el-button class='indexFunBtn' type="danger" @click="setStatusConfirm(scope.row.Fauthority_id , scope.row.Fstatus)"  size="small">禁用</el-button>
	        	</div>
	        	<div v-else>
	        		<el-button  type="primary" @click="setStatusConfirm(scope.row.Fauthority_id , scope.row.Fstatus)" :disabled="scope.row.upStatus" size="small">启用</el-button>
	        	</div>
	        </template>
	    </el-table-column>
	</el-table> -->

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
        <el-form  :model="addPage" :rules="rules" ref="addPage" label-width="140px">
            <el-form-item label="所属系统：" prop='c_system_id'>
                <el-select v-model="addPage.c_system_id" placeholder="请选择">
	                <el-option v-for="item in enableSystemList" :label="item.name" :value="item.system_id" :key="item.system_id"></el-option>
	            </el-select>
            </el-form-item>
            <el-form-item label="所属模块：" prop='c_system_id'>
                <el-select v-model="addPage.c_pid" placeholder="请选择">
	                <el-option v-for="item in moduleList.Add" :label="item.Fname" :value="item.Fauthority_id" :key="item.Fauthority_id"></el-option>
	            </el-select>
            </el-form-item>
            <el-form-item label="页面名称："  prop='c_name'>
                <el-input :maxlength='40'  v-model="addPage.c_name"  placeholder='请输入页面名称'></el-input>
            </el-form-item>
            <el-form-item label="描述："  prop='c_desc'>
                <el-input type="textarea" :rows="3" :maxlength='100'  v-model="addPage.c_desc"  placeholder='请输入页面描述'></el-input>
            </el-form-item>
            <el-form-item label="查看权限标识码："  prop='c_access_flags'>
                <el-input v-model="addPage.c_access_flags" :maxlength="20"  placeholder='请输入查看权限标识码'></el-input>
            </el-form-item>
            <el-form-item class='submitRight'>
                <el-button type="primary" @click="submitnow('addPage')">确认</el-button>
                <el-button @click="cancelnow">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 编辑 -->
	<el-dialog title="编辑" :visible.sync="editDialog">
        <el-form  :model="editPage" :rules="rules" ref="editPage" label-width="140px">
            <el-form-item label="所属系统：" prop='e_system_id'>
                <el-select v-model="editPage.e_system_id" disabled placeholder="请选择">
	                <el-option v-for="item in systemList" :label="item.name" :value="item.system_id" :key="item.system_id"></el-option>
	            </el-select>
            </el-form-item>
            <el-form-item label="所属模块：" prop='e_system_id'>
                <el-select v-model="editPage.e_pid" placeholder="请选择">
	                <el-option v-for="item in moduleList.Edit" :label="item.Fname" :value="item.Fauthority_id" :key="item.Fauthority_id"></el-option>
	            </el-select>
            </el-form-item>
            <el-form-item label="页面名称："  prop='e_name'>
                <el-input :maxlength='40' v-model="editPage.e_name"  placeholder='请输入页面名称'></el-input>
            </el-form-item>
            <el-form-item label="描述："  prop='e_desc'>
                <el-input type="textarea" :rows="3" :maxlength='100'  v-model="editPage.e_desc"  placeholder='请输入页面描述'></el-input>
            </el-form-item>
            <el-form-item label="查看权限标识码："  prop='e_access_flags'>
                <el-input v-model="editPage.e_access_flags" :maxlength="20"  placeholder='请输入查看权限标识码'></el-input>
            </el-form-item>
            <el-form-item class='submitRight'>
                <el-button type="primary" @click="submitnow('editPage')">确认</el-button>
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
        // var validateFlag = (rule, value, callback) => {
        //     value = util.Trim(value)
        //     let len = value.gblen()
        //     if( len >20){
        //         callback(new Error('请输入20个以内字符'))
        //     }
        //     callback()
        // }
	    return {
	    	addDialog:false,
	    	editDialog:false,
	    	dataList:[],
	    	systemList:[],
	    	enableSystemList:[],
	    	moduleList:{
	    		Search:[],
	    		Add:[],
	    		Edit:[]
	    	},
	    	pageIndex:'0',
        	pageSize:'10',
        	currentPage:1,
        	total:0,
        	searchkeys:{
        		"s_system_id":'',
		        "s_module_id":"",
		        "s_page_name":"",
		        "s_is_flags":"",
		        "s_status":""
        	},
        	getSearchModule:{
        		"s_system_id":'',
				"s_module_name":'',
				'pageIndex':'0',
				'pageSize':'9999'
        	},
        	getAddModule:{
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
        	addPage:{
        		"c_system_id":"",
        		"c_access_flags":"",
				"c_pid":"",
				"c_type":"2",
				"c_desc":"",
				"c_name":""
        	},
        	editPage:{
        		"e_authority_id":"",
				"e_system_id":"",
				"e_access_flags":"",
				"e_pid":"",
				"e_type":"2",
				"e_desc":"",
				"e_name":""
        	},
        	rules:{
        		c_system_id: [{  required: true,  message: '请选择所属系统'}],
                c_name: [{  required: true , validator: util.validateName1, trigger: 'blur' }],
                c_desc: [{ required: true , validator: util.validateDesc, trigger: 'blur' }],
                // c_access_flags: [{ required: true , validator: validateFlag, trigger: 'blur' }],

                e_system_id: [{  required: true,  message: '请选择所属系统'}],
                e_name: [{  required: true , validator: util.validateName1, trigger: 'blur' }],
                e_desc: [{ required: true , validator: util.validateDesc, trigger: 'blur' }],
                // e_access_flags: [{ required: true , validator: validateFlag, trigger: 'blur' }],
            }
	    }
	},
	watch: {
        'searchkeys.s_system_id': function(val, oldVal) {
            this.searchkeys.s_module_id = ''
            this.moduleList.Search = []
            this.getSystemModule(val , 'Search')
        },
        'addPage.c_system_id': function(val, oldVal) {
            this.addPage.c_pid = ''
            this.moduleList.Add = []
            this.getSystemModule(val , 'Add')
        },
        'editPage.e_system_id': function(val, oldVal) {
            // this.editPage.e_pid = ''
            this.moduleList.Edit = []
            this.getSystemModule(val , 'Edit')
        },
        
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
	    	let data = {'pageSize':'100'}
	    	api.getSystemList(data).then(res =>{
	    		if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.systemList = res.data.list
                this.enableSystemList = this.getEnableList(res.data.list)
                
	    	})
	    },
	    //关联上级状态 如上层为禁用，下层全为禁用
	    relateFstatus:function(list){
	    	for(var i in list){
	    		if(list[i].system_status != '1' || list[i].Fmodule_status != '1') list[i].Fstatus = '2',list[i].upStatus = true
	    	}
	    	return list
	    },
	    getEnableList:function(list){
	    	let Lists = []
	    	for(var i in list){
	    		if(list[i].status == '1' || list[i].Fstatus == '1') Lists.push(list[i])
	    	}
	    	return Lists
	    },
	    getSystemModule:function(val , searchOrHandle){
	    	this['get'+searchOrHandle+'Module'].s_system_id = val
	    	api.getModuleList(this['get'+searchOrHandle+'Module']).then(res => {
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                if(searchOrHandle == 'Search'){
                	this.moduleList[searchOrHandle] = this.handleModuleList(res.data.list)
                }else{
                	this.moduleList[searchOrHandle] = this.getEnableList(this.handleModuleList(res.data.list))
                }
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
		showList:function(){
			
			let data = {
		        "s_system_id":this.searchkeys.s_system_id,
				"s_module_id":this.searchkeys.s_module_id,
				"s_page_name":this.searchkeys.s_page_name,
				"s_is_flags":this.searchkeys.s_is_flags,
				"s_status":this.searchkeys.s_status,
				'pageIndex':String(this.pageIndex),
				'pageSize':this.pageSize
			}
			api.getPageList(data).then(res => {
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.dataList = this.combineCell(this.relateFstatus(res.data.list))
				this.total = Number(res.data.nums)
			})
		},
		combineCell:function(list) {
		    for (var field in list[0]) {
		        var k = 0
		        while (k < list.length) {
		            list[k][field + 'Span'] = 1
		            list[k][field + 'Dis'] = false
		            for (var i = k + 1; i <= list.length - 1; i++) {
		                if (list[k][field] == list[i][field] && list[k][field] != '') {
		                    list[k][field + 'Span']++
		                    list[k][field + 'Dis'] = false
		                    list[i][field + 'Span'] = 1
		                    list[i][field + 'Dis'] = true
		                } else {
		                    break
		                }
		            }
		            k = i
		        }
		    }
		    return list
		},
		//设置状态
		setStatus:function(id , status){
			let data = {
				"e_type":this.editPage.e_type,
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
		//新增
		Add:function(){
			// this.addPage.c_system_id = ''
			this.addPage.c_name = ''
			this.addPage.c_desc = ''
			this.addPage.c_access_flags = ''
			this.addDialog = true
		},
		//编辑
		getEditData:function(index){
			let roleInfo = this.dataList[index]
			this.editPage.e_authority_id = String(roleInfo.Fauthority_id)
			this.editPage.e_name = roleInfo.Fname
			this.editPage.e_desc = roleInfo.Fdesc
			this.editPage.e_pid = roleInfo.Fmodule_id
			console.log(this.editPage.e_pid)
			this.editPage.e_access_flags = roleInfo.Faccess_flags
			this.editPage.e_system_id = roleInfo.Fsystem_id
            this.editDialog = true
		},
		//search
		search:function(){
			this.searchkeys.s_page_name = util.Trim(this.searchkeys.s_page_name)
			this.showList()
		},
		clearForm(){
			this.searchkeys.s_system_id = ''
			this.searchkeys.s_module_id = ''
			this.searchkeys.s_page_name = ''
			this.searchkeys.s_is_flags = ''
			this.showList()
		},
		/*****  新增/编辑  *****/ 
		submitnow:function(formName){
			if(this.addDialog){
				this.addPage.c_name = util.Trim(this.addPage.c_name)
				this.addPage.c_desc = util.Trim(this.addPage.c_desc)
				this.addPage.c_access_flags = util.Trim(this.addPage.c_access_flags)
				this.addPage.c_system_id = this.addPage.c_system_id

				
	            this.$refs[formName].validate((valid) => { 
	                if (valid) {
	                    api.addAuth(this.addPage).then(res => {
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
	                    return false
	                }
	            })

			}else{
				this.editPage.e_name = util.Trim(this.editPage.e_name)
				this.editPage.e_desc = util.Trim(this.editPage.e_desc)
				this.addPage.e_access_flags = util.Trim(this.addPage.e_access_flags)

				this.$refs[formName].validate((valid) => { 
	                if (valid) {
		            	api.editAuth(this.editPage).then(res => {
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
                        h('p',{style:'color:#ff4949'},'• 该页面中所有内容将被禁用'),
                        h('p',{style:'color:#ff4949'},'• 将无法往该模块中新增内容'),
                        h('p',{style:'margin-top:6px'},'请谨慎操作！')
                    ])
            }else{
                warnInfo.content = h('div',null,[
                        h('p',{style:'margin-bottom:6px'},'启用后：'),
                        h('p',{style:'color:#ff4949'},'• 该页面中的内容将恢复至禁用前的状态'),
                        h('p',{style:'margin-top:6px'},'请谨慎操作！')
                    ])
            }
	        this.$confirm(warnInfo.content, warnInfo.title, {
	          //type: 'warning'`
	        }).then(() => {
	        	this.setStatus(id , status)
	        }).catch(() => {})
      	},
		cancelnow:function(id){
			this.addDialog = false
			this.editDialog = false
		},
	}


}
</script>