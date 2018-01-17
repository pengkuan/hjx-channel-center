<template>
<div>
	<div class="title">
		<el-col :span="12">新增权限</el-col>
		<el-col :span="12" class="textRight"><router-link to="index"><el-button size="small">返回权限管理</el-button></router-link></el-col>
	</div>
	<div class="tool textRight">
    </div>
	<el-form  :model="addData" :rules="rules" ref="addData" label-width="0">
        <el-form-item>
    		<el-col :span="5">
    			<el-col :span="16">
					<el-form-item class="searchItem" prop="c_system_id">
						<p class="searchTitle">所属系统：</p>
						<el-select v-model="addData.c_system_id" placeholder="请选择">
			                <el-option v-for="item in upList.system" :label="item.name" :value="item.system_id" :key="item.system_id"></el-option>
			            </el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<p class="searchTitle">&nbsp;</p>
					<router-link to="system"><el-button size="small" type="primary">管理系统</el-button></router-link>
				</el-col>
			</el-col>
			<el-col :span="5">
				<el-col :span="16">
					<el-form-item class="searchItem" prop="c_module_id">
						<p class="searchTitle">所属模块：</p>
						<el-select v-model="addData.c_module_id" placeholder="请选择">
			                <el-option v-for="item in upList.module" :label="item.Fname" :value="item.Fauthority_id" :key="item.Fauthority_id"></el-option>
			            </el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<p class="searchTitle">&nbsp;</p>
					<router-link to="module"><el-button size="small" type="primary">管理模块</el-button></router-link>
				</el-col>
			</el-col>
			<el-col :span="5">
				<el-col :span="16">
					<el-form-item class="searchItem" prop="c_page_id">
						<p class="searchTitle">所属页面：</p>
		                <el-select v-model="addData.c_page_id" placeholder="请选择">
			                <el-option v-for="item in upList.page" :label="item.Fname" :value="item.Fauthority_id" :key="item.Fauthority_id"></el-option>
			            </el-select>
					</el-form-item>
				</el-col>
				<el-col :span="8">
					<p class="searchTitle">&nbsp;</p>
					<router-link to="page"><el-button size="small" type="primary">管理页面</el-button></router-link>
				</el-col>
			</el-col>
        </el-form-item>
        <br>
        <el-form-item>
        	<el-table
			    :data="addData.c_datas"
			    border
			    style="width: 100% ">
			    <el-table-column label="序号" type="index" width="70px">
			    </el-table-column>
			    <el-table-column label="权限名称">
			    	<template slot-scope="scope">
			    		<el-form-item  
		    			:prop=" 'c_datas.' + scope.$index + '.name' "
			    		:rules="{
					      	required: true, validator: validateName, trigger: 'blur'
					    }">	
			    			<el-input v-model="scope.row.name" :value="scope.row.name" :maxlength="40" placeholder="请输入权限名称"></el-input>
			    		</el-form-item>
			    	</template>
			    </el-table-column>

			    <el-table-column label="描述">
			    	<template slot-scope="scope">
			    		<el-form-item  
		    			:prop=" 'c_datas.' + scope.$index + '.desc' "
			    		:rules="{
					      	required: true, validator: validateDesc, trigger: 'blur'
					    }">	
			    			<el-input v-model="scope.row.desc" :value="scope.row.desc" :maxlength="100" placeholder="请输入权限描述"></el-input>
			    		</el-form-item>
			    	</template>
			    </el-table-column>
			    <el-table-column label="权限标识码">
			    	<template slot-scope="scope">
			    		<el-input  v-model="scope.row.access_flags" :value="scope.row.access_flags" :maxlength="20" placeholder="请输入权限标识码"></el-input>
			    	</template>
			    </el-table-column>

			    <el-table-column label="操作" >
			        <template slot-scope="scope" >
			        	<el-button @click="handleItem(scope.$index , 'add')" icon="plus" type="text"></el-button>
			        	<el-button class='delete' v-if="scope.$index != 0" @click="handleItem(scope.$index , 'del')" icon="close" type="text"></el-button>
			        </template>
			    </el-table-column>
			</el-table>
        </el-form-item>
       
    </el-form>

	<p class='submitRight'>
        <el-button type="primary" @click="submitnow('addData')">确认</el-button>
        <el-button @click="cancelnow">取消</el-button>
    </p>
</div>
</template>
<style type="text/css" scoped="scoped">
	div.cell .el-form-item.is-error.is-required{padding: 18px 0}
	p.searchTitle{line-height: 20px}
	.delete.el-button--text{color:#FF4949;}
</style>
<script>
import api from '../../api/api'
import util from '../../common/util'
export default {
	data() {
	    return {
	    	upList:{
	    		system:[],
	    		module:[],
	    		page:[]
	    	},
	    	getModuleData:{//获取系统下模块所需数据
        		"s_system_id":'',
				"s_module_name":'',
				'pageIndex':'0',
				'pageSize':'9999'
        	},
        	getPageData:{//获取系统下模块所需数据
        		"s_system_id":'',
				"s_module_id":'',
				"s_page_name":'',
				"s_is_flags":'',
				"s_status":'',
				'pageIndex':'0',
				'pageSize':'9999'
        	},
	    	addData:{
	    		"c_type":"1",
				"c_system_id":"",
				"c_module_id":"",
				"c_page_id":"",
				"pageIndex":"0",
        		"pageSize":"9999",
        		"c_datas":[
					{
					"name":"",
					"desc":"",
					"access_flags":""
					}
				]
	    	},
	    	dataList:[],
	    	systemList:[],
	    	moduleList:{
	    		Search:[],
	    		Add:[],
	    		Edit:[]
	    	},
        	addPower:{
        		"s_system_id":'',
		        "s_module_id":"",
		        "s_page_name":"",
		        "s_is_flags":"",
		        "s_auth_name":"",
		        "s_status":""
        	},
        	getSearchModule:{
        		"s_system_id":'',
				"s_module_name":'',
				'pageIndex':'0',
				'pageSize':'9999'
        	},
        	rules:{
                'c_system_id': [{  required: true, message: '请选择系统', trigger: 'change' }],
                'c_module_id': [{  required: true, message: '请选择模块', trigger: 'change' }],
                'c_page_id': [{  required: true, message: '请选择页面', trigger: 'change' }]
            }
	    }
	},
	watch: {
        'addData.c_system_id': function(val, oldVal) {
            this.addData.c_module_id = ''
            this.getSystemModules(val)
        },
        'addData.c_module_id': function(val, oldVal) {
            this.addData.c_page_id = ''
            if(val != '')this.getModulePages(val)
        }
    },
	mounted()  {
		this.showList()
		this.loadInfo()
	},
	methods:{
		validateName:function(rule, value, callback){
            value = util.Trim(value)
            let len = value.gblen()
            if( len < 1|| len >40){
                callback(new Error('请输入40个以内字符'))
            }else if( util.checkSpecialWord(value)){
                callback(new Error('不能包含特殊字符'))
            }
            callback()
		},
		validateDesc:function(rule, value, callback){
            value = util.Trim(value)
            let len = value.gblen()
            if( len < 1|| len >100){
                callback(new Error('请输入100个以内字符'))
            }
            callback()
		},
	    loadInfo:function(){
	    	let data = {'pageSize':'100'}
	    	api.getSystemList(data).then(res =>{
	    		if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.upList.system = this.getEnableList(res.data.list)
                
	    	})
	    },
	    getSystemModules:function(val){
	    	this.getModuleData.s_system_id = val
	    	api.getModuleList(this.getModuleData).then(res => {
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.upList.module = this.getEnableList(this.setRowspan(res.data.list))
                console.log(this.upList.module)
			})
	    },
	    getModulePages:function(val){
	    	this.getPageData.s_system_id = this.addData.s_system_id
	    	this.getPageData.s_module_id = val
	    	api.getPageList(this.getPageData).then(res => {
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.upList.page = this.getEnableList(res.data.list) 
			})
	    },
	    //筛选出合作状态列表
	    getEnableList:function(list){
	    	let systemList = []
	    	for(var i in list){
	    		if(list[i].status == '1' || list[i].Fstatus == '1') systemList.push(list[i])
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
		        "s_system_id":this.addPower.s_system_id,
				"s_module_id":this.addPower.s_module_id,
				"s_page_name":this.addPower.s_page_name,
				"s_auth_name":this.addPower.s_auth_name,
				"s_is_flags":this.addPower.s_is_flags,
				"s_status":this.addPower.s_status,
			}
			api.getActionAuthList(data).then(res => {
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.dataList = res.data.list
			})
		},
		/*****  新增  *****/ 
		submitnow:function(formName){
            this.$refs[formName].validate((valid) => { 
                if (valid) {
                    api.addActionAuths(this.addData).then(res => {
                        if (res.ret != '0') {
                            this.$message(res.retinfo)
                            return
                        }
                        this.$message('成功！')
                        this.$router.push({ path: 'index' })
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })

		},
		handleItem:function(index,handle){
			if(handle == 'del'){
				if(index == 0) return
				this.addData.c_datas.splice(index,1)
			}else{
				this.addData.c_datas.splice(index+1,0,{
					"name":"",
					"desc":"",
					"access_flags":""
				})
			}
		},
		cancelnow:function(id){
			this.$router.push({ path: 'index' })
		},
	}

}
</script>
