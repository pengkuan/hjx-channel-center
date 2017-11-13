<template>
<div>
	<div class="title">渠道商 / 新增模板</div>
	<el-form   label-width="180px" class="content-width">
        <el-form-item label="渠道关系模板名称：" prop='strTemplateName'>
            <el-input v-model="dict.strTemplateName" placeholder='请输入模板名称'></el-input>
        </el-form-item>
        <el-form-item label="渠道关系模板描述："  prop='strTemplateDesc'>
            <el-input type="textarea" v-model="dict.strTemplateDesc" placeholder='请输入模板描述'></el-input>
        </el-form-item>
    
		<el-form-item>
	        <div class="tool">
		      	<el-button v-on:click="addone" type="primary" size="small">添加一行</el-button>
		    </div>
		    <el-table :data="list" stripe style="width: 100%">
			    <el-table-column  label="层级"  width="180">
			    	<template slot-scope="scope">
			    		<el-input v-model="scope.row.strLevel" placeholder='请输入层级'></el-input>
		            </template>
				</el-table-column>
				<el-table-column  label="层级名称"  width="180">
			    	<template slot-scope="scope">
			    		<el-input v-model="scope.row.strLevelName" placeholder='请输入层级名称'></el-input>
		            </template>
				</el-table-column>
				<el-table-column   label="层级描述"  width="180">
			    	<template slot-scope="scope">
			    		<el-input v-model="scope.row.strLevelDesc" placeholder='请输入描述'></el-input>
		            </template>
				</el-table-column>

				<el-table-column  prop="showRoles"  label="角色"  width="180"></el-table-column>
				
				<el-table-column label="操作">

		            <template slot-scope="scope">
		              	<el-button type="primary" @click="setindex(scope.$index)"  size="small">选择角色</el-button>
		              	<el-button type="primary" @click="removeTodo(scope.$index)"  size="small">删除此行</el-button>
		            </template>

		        </el-table-column>

			</el-table>
	    </el-form-item>

	    <el-dialog title="选择角色" :visible.sync="dialogTableVisible">
		  	<div class="tool">
		      	<!-- <el-button v-on:click="addone" type="primary" size="small">添加一行</el-button> -->
		    </div>
		    <el-table :data="currentFroles" stripe style="width: 100%">
			    <el-table-column  label="选择"  width="180">
			    	<template slot-scope="scope">
			    		<el-checkbox v-model="scope.row.strSelect"></el-checkbox>
		            </template>
				</el-table-column>
				<el-table-column  prop="strRoleId"  label="角色Id"  ></el-table-column>
				<el-table-column  prop="strRoleName"  label="角色名称"  ></el-table-column>
				<el-table-column  prop="strRoleDesc"  label="角色描述"  ></el-table-column>
				<el-table-column  prop="strAuthoritysName"  label="权限名称" ></el-table-column>
			</el-table>
				
			<div class="submitRight">
	        	<el-button type="primary" @click="setselect">确认</el-button>
			</div>
			
		</el-dialog>

	    <el-form-item class = 'submitRight'>
	        <el-button type="primary" @click="submitnow">立即创建</el-button>
	        <el-button @click="cancelnow">取消</el-button>
	    </el-form-item>
	</el-form>
</div>
</template>
<style type="text/css" scoped="scoped">
    .content-width{width: 1200px}
</style>
<script type="text/javascript">
import api from '../../api/api'
import util from '../../common/util'
export default {
	data() {
	    return {
	    	dialogTableVisible:false,
	    	list:[],
	        dict:{},
	        roles:[],
	        index:0,
	        searchkey:'',
	        currentFroles :[]
	    }
	},
	mounted:function(){
        this.loadInfo()
    },
	methods:{
        //初始化获取添加渠道模板页的必要数据
        loadInfo:function(){
            api.addChannelTemplatePageData({}).then(res => {
				if (res.ret != '0') {
                    this.$layer.alert(res.retinfo)
                    return
                }
                this.roles = res.data
                for (var i = this.roles.length - 1; i >= 0; i--) {
                    this.roles[i].strDisplay = ''
                    if(this.roles[i].strSelect == 'False') {
                        this.roles[i].strSelect = false;
                    }else{
                        this.roles[i].strSelect = true;
                    }
                }
                this.addone()


                this.dict.strTemplateName = ''
                this.dict.strTemplateDesc = ''
                
			}) 
        },
        //删除一行
        removeTodo: function (index) {
             this.list.splice(index, 1);
        },
        //增加一行
        addone:function(){
            var tmplist = []
            tmplist = this.roles
            let dicttmp = {"strTemplateName":"","strLevel":"","showRoles":"","strListRoles":tmplist,"strTemplateId":"","strPid":"","strLevelId":"","strLevelName":"","strLevelDesc":"","strUpdateTime":"","strTemplateDesc":"","strStatus":"","strCreateTime":""}
            this.list.push(dicttmp);
        },
        //选择角色
        setindex: function (index) {
        	this.dialogTableVisible = true
            this.index = index;
            this.currentFroles = this.list[index].strListRoles
        },
        //角色模态框：确定
        setselect: function(){
            this.list[this.index].strListRoles = this.currentFroles

            let strTmp = ''
            for (var i = this.list[this.index].strListRoles.length - 1; i >= 0; i--) {
                if(this.list[this.index].strListRoles[i].strSelect){
                    strTmp = strTmp + this.list[this.index].strListRoles[i].strRoleName + " "

                }
            }
            this.list[this.index].showRoles = strTmp
            this.dialogTableVisible = false
        },
        //取消
        cancelnow:function () {
            window.history.back();
        },
        //角色模态框：搜索
        searchrole:function () {
            for (var i = this.currentFroles.length - 1; i >= 0; i--) {
                var substr = (this.searchkey);
                if(substr == ""){
                    this.currentFroles[i].strDisplay = ''
                    continue
                }
                //判断角色名称中是否包括搜索关键词
                var srcstr = (this.currentFroles[i].strRoleName)
                if(srcstr == undefined) {
                    continue
                }
                if(srcstr.indexOf(substr) >= 0 ){
                    this.currentFroles[i].strDisplay = ''
                    continue
                }
                //判断角色描述中是否包括搜索关键词
                srcstr = this.currentFroles[i].strRoleDesc;
                if(srcstr == undefined) {
                    continue
                }
                if(srcstr.indexOf(substr) >= 0 ){
                    this.currentFroles[i].strDisplay = ''
                    continue
                }
                this.currentFroles[i].strDisplay = 'none'
            }
        },
        //确定
        submitnow:function () {

            if(!this.dict.strTemplateName){
                this.$layer.alert("请输入模板名称")
                return
            }
            if(!this.dict.strTemplateDesc){
                this.$layer.alert("请输入模板描述")
                return
            }
            if(this.list.length < 2){
                this.$layer.alert('层级不正确')
                return;
            }
            for (var i = this.list.length - 1; i >= 0; i--) {
                if(this.list[i].strLevelName == ""){
                    this.$layer.alert("请输入层级名称")
                    return
                }

                // this.list[i].strLevelName = util.Trim(this.list[i].strLevelName)
                // this.list[i].strLevel = util.Trim(this.list[i].strLevel)
                // this.list[i].strLevelDesc = (this.list[i].strLevelDesc)
                // this.list[i].strTemplateDesc = (this.dict.strTemplateDesc);
                // this.list[i].strTemplateName = util.Trim(this.dict.strTemplateName);
                // this.list[i].strTemplateId = (this.dict.strTemplateId);

                this.list[i].strLevelName = this.list[i].strLevelName
                this.list[i].strLevel = this.list[i].strLevel
                this.list[i].strLevelDesc = this.list[i].strLevelDesc
                this.list[i].strTemplateDesc = this.dict.strTemplateDesc
                this.list[i].strTemplateName = this.dict.strTemplateName
                this.list[i].strTemplateId = (this.dict.strTemplateId)
            };
            for (var i = this.list.length - 1; i >= 0; i--) {
                if(this.list[i].strLevel != (i+1)){
                    this.$layer.alert('层级不正确')
                    return;
                }
            }
            var sendData ={data:JSON.stringify(this.list)};
            api.addTemplateLogic(sendData).then(res => {
				if (res.ret != '0') {
                    this.$layer.alert(res.retinfo)
                    return
                }
                this.$message('成功！')
                this.$router.push({ path: '/channel/template' })
			})
        }
    }
}
</script>