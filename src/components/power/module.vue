<template>
<div>
	<div class="title">
		<el-col :span="12">模块管理</el-col>
		<el-col :span="12" class="textRight"><router-link to="index"><el-button size="small">返回权限管理</el-button></router-link></el-col>
	</div>
	<!--工具条-->
	<div style='overflow:hidden'>
		<div class="searchItem">
			<span class="searchTitle">所属系统：</span>
			<el-select v-model="searchkeys.s_system_id" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in systemList" :label="item.name" :value="item.system_id" :key="item.system_id"></el-option>
            </el-select>
		</div>
		<div class="searchItem">
			<span class="searchTitle">模块名称：</span>
			<el-input v-model="searchkeys.s_module_name" @keyup.13.native="search($event)" :maxlength="40" placeholder="请输入模块名称"></el-input>
		</div>
		<div class="goSearch">
			<el-button @click="search">搜索</el-button>
      		<el-button @click="clearForm('searchkeys')">清空</el-button>
		</div>
	</div>

    <div class="tool">
    	<el-button type="primary" size="small" @click="Add()">新增模块</el-button>
    </div>

    <table class="el-table el-table--border border-RB-none" cellspacing="0" cellpadding="0" border="0">
    <tr>
    	<th width="15%" class="is-leaf"><div class="cell">系统</div></th>
    	<th width="15%" class="is-leaf"><div class="cell">模块</div></th>
    	<th width="40%" class="is-leaf"><div class="cell">描述</div></th>
    	<th width="15%" class="is-leaf"><div class="cell">状态</div></th>
    	<th width="15%" class="is-leaf"><div class="cell">操作</div></th>
    </tr>
    <tr v-for="(item , index) in dataList">
	    <!-- <td width="3%">{{ $index + 1 }}</td> -->
	    <td  :rowspan="item.Fsystem_idSpan" :class="{hidden: item.Fsystem_idDis}"><div class="cell">{{item.Fsystem_name}}</div></td>
	    <td  :rowspan="item.Fauthority_idSpan" :class="{hidden: item.Fauthority_idDis}"><div class="cell">{{item.Fname}}</div></td>
	    <td><div class="cell">{{item.Fdesc}}</div></td>
	    <td><div class="cell">
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
        <el-form  :model="addModule" :rules="rules" ref="addModule" label-width="100px">
            <el-form-item label="所属系统：" prop='c_system_id'>
                <el-select v-model="addModule.c_system_id" placeholder="请选择">
	                <el-option v-for="item in enableSystemList" :label="item.name" :value="item.system_id" :key="item.system_id"></el-option>
	            </el-select>
            </el-form-item>
            <el-form-item label="模块名称："  prop='c_name'>
                <el-input :maxlength='40' v-model="addModule.c_name"  placeholder='请输入模块名称'></el-input>
            </el-form-item>
            <el-form-item label="描述："  prop='c_desc'>
                <el-input type="textarea" :rows="3" :maxlength='100' v-model="addModule.c_desc"  placeholder='请输入模块描述'></el-input>
            </el-form-item>
            <el-form-item class='submitRight'>
                <el-button type="primary" @click="submitnow('addModule')">确认</el-button>
                <el-button @click="cancelnow">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 编辑 -->
	<el-dialog title="编辑" :visible.sync="editDialog">
        <el-form  :model="editModule" :rules="rules" ref="editModule" label-width="100px">
            <el-form-item label="所属系统：" prop='e_system_id'>
                <el-select v-model="editModule.e_system_id" placeholder="请选择" disabled>
	                <el-option v-for="item in systemList" :label="item.name" :value="item.system_id" :key="item.system_id"></el-option>
	            </el-select>
            </el-form-item>
            <el-form-item label="模块名称："  prop='e_name'>
                <el-input :maxlength='40' v-model="editModule.e_name"  placeholder='请输入模块名称'></el-input>
            </el-form-item>
            <el-form-item label="描述："  prop='e_desc'>
                <el-input type="textarea" :rows="3" :maxlength='100' v-model="editModule.e_desc"  placeholder='请输入模块描述'></el-input>
            </el-form-item>
            <el-form-item class='submitRight'>
                <el-button type="primary" @click="submitnow('editModule')">确认</el-button>
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
		var validateName = (rule, value, callback) => {
            value = util.Trim(value)
            let len = value.gblen()
            if( len < 1|| len >40){
                callback(new Error('请输入40个以内字符'))
            }else if( util.checkSpecialWord(value)){
                callback(new Error('不能包含特殊字符'))
            }
            callback()
        }
        var validateDesc = (rule, value, callback) => {
            value = util.Trim(value)
            let len = value.gblen()
            if( len < 1|| len >100){
                callback(new Error('请输入100个以内字符'))
            }
            callback()
        }
	    return {
	    	addDialog:false,
	    	editDialog:false,
	    	dataList:[],
	    	systemList:[],
	    	enableSystemList:[],
	    	pageIndex:'0',
        	pageSize:'10',
        	currentPage:1,
        	total:0,
        	searchkeys:{
        		"s_system_id":'',
		        "s_module_name":""
        	},
        	addModule:{
        		"c_system_id":"",
				"c_type":"3",
				"c_desc":"",
				"c_name":""
        	},
        	editModule:{
        		"e_authority_id":"",
				"e_system_id":"",
				"e_type":"3",
				"e_desc":"",
				"e_name":""
        	},
        	rules:{
        		c_system_id: [{  required: true,  message: '请选择所属系统'}],
                c_name: [{  required: true , validator: validateName, trigger: 'blur' }],
                c_desc: [{ required: true , validator: validateDesc, trigger: 'blur' }],

                e_system_id: [{  required: true,  message: '请选择所属系统'}],
                e_name: [{  required: true , validator: validateName, trigger: 'blur' }],
                e_desc: [{ required: true , validator: validateDesc, trigger: 'blur' }]
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
	    	this.currentPage = val
	        this.showList()
	    },
	    
	    loadInfo:function(){
	    	let data = {'pageSize':'9999'}
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
	    		if(list[i].system_status != '1') list[i].Fstatus = '2',list[i].upStatus = true
	    	}
	    	return list
	    },
	    getEnableList:function(list){
	    	let systemList = []
	    	for(var i in list){
	    		if(list[i].status == '1') systemList.push(list[i])
	    	}
	    	return systemList
	    },
	    setRowspan:function(list){
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
				"s_module_name":this.searchkeys.s_module_name,
				'pageIndex':String(this.pageIndex),
				'pageSize':this.pageSize
			}
			api.getModuleList(data).then(res => {
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                
                this.dataList =util.combineCell(this.relateFstatus(this.setRowspan(res.data.list)))
				this.total = Number(res.data.nums)
			})
		},
		//设置状态
		setStatus:function(id , status){
			console.log(id , status)
			let data = {
				"e_type":this.editModule.e_type,
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
			// this.addModule.c_system_id = ''
			this.addModule.c_name = ''
			this.addModule.c_desc = ''
			this.addDialog = true
		},
		//编辑
		getEditData:function(index){
			let roleInfo = this.dataList[index]
			this.editModule.e_authority_id = String(roleInfo.Fauthority_id)
			this.editModule.e_name = roleInfo.Fname
			this.editModule.e_desc = roleInfo.Fdesc
			this.editModule.e_system_id = roleInfo.Fsystem_id
            this.editDialog = true
		},
		//search
		search:function(){
			this.searchkeys.s_module_name = util.Trim(this.searchkeys.s_module_name)
			this.currentPage = 1
            this.pageIndex = '0'
			this.showList()
		},
		clearForm(){
			this.searchkeys.s_system_id = ''
			this.searchkeys.s_module_name = ''
			this.showList()
		},
		/*****  新增/编辑  *****/ 
		submitnow:function(formName){
			if(this.addDialog){
				this.addModule.c_name = util.Trim(this.addModule.c_name)
				this.addModule.c_desc = util.Trim(this.addModule.c_desc)
				
	            this.$refs[formName].validate((valid) => { 
	                if (valid) {
	                    api.addAuth(this.addModule).then(res => {
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
				this.editModule.e_name = util.Trim(this.editModule.e_name)
				this.editModule.e_desc = util.Trim(this.editModule.e_desc)
				this.$refs[formName].validate((valid) => { 
	                if (valid) {	
		            	api.editAuth(this.editModule).then(res => {
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
                        h('p',{style:'color:#ff4949'},'• 该模块中所有内容将被禁用'),
                        h('p',{style:'color:#ff4949'},'• 将无法往该模块中新增内容'),
                        h('p',{style:'margin-top:6px'},'请谨慎操作！')
                    ])
            }else{
                warnInfo.content = h('div',null,[
                        h('p',{style:'margin-bottom:6px'},'启用后：'),
                        h('p',{style:'color:#ff4949'},'• 该模块中的内容将恢复至禁用前的状态'),
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