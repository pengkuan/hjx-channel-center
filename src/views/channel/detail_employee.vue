<template>
	<div class="hjx-show-detail">
		<hjx-header label="S / 详情">
		    <router-link to="employee"><el-button size="small">返回S列表</el-button></router-link>
		    <el-button type="primary" size="small" @click="goEdit(ruleForm.strUserId)">编辑</el-button>
		</hjx-header>
		<div class="content-container">
		    <el-form ref="ruleForm" label-width="100px">
		        <el-form-item label="姓名：" prop='strUserName'>{{ruleForm.strUserName}}</el-form-item>
	            <el-form-item label="手机号码："  prop='strUserTel'>{{ruleForm.strUserTel}}</el-form-item>
	            <el-form-item label="身份证："  prop='strCardNum'>{{ruleForm.strCardNum}} </el-form-item>
	            <el-form-item label="邮箱："  >{{ruleForm.strEmail}}</el-form-item>
		        <el-form-item label="状态：">
				    <span v-for="item in statusList" v-if="ruleForm.strStatus == item.id">{{item.name}}</span>
				</el-form-item>
				<el-form-item label="所属商户：">{{S4_list}}</el-form-item>
		        <el-form-item label="二级子公司：">{{S3_list}}</el-form-item>
		        <el-form-item label="所在门店：">{{S2_list}}</el-form-item>
		        <el-form-item label="门店工号：">{{strUserNum}}</el-form-item>
		        <el-form-item label="组织身份：">{{strIdentityList}}</el-form-item>
		    </el-form>
		</div>
		<div class="tool">
	        <router-link to="employee"><el-button size="small">返回</el-button></router-link>
	    </div>
	</div>
</template>
<script type="text/javascript">
	import api from '../../api/api'
	import util from '../../common/util'
	import {mapGetters} from 'vuex'
	export default {
		data() {
		    return {
	            strUserNum:'',//工号
	            strIdentityList:'',
	            S4_list:'',//商户
	            S3_list:'',//二级渠道
	            S2_list:'',//门店
		        relationInfo:[],
	            ruleForm:{
	            	strUserId:'',
	            	strStatus:'1',
		            strUserName:'',
		            strUserTel:'',
		            strCardNum:'',
		            strEmail:''
	            },
	            rules:{
                    strUserName: [
                        {  required: true , validator: util.validateName, trigger: 'blur' }
                    ],
                    strUserTel: [
                        { required: true , validator: util.validateTel, trigger: 'blur' }
                    ],
                    strCardNum:[
                        { required: true , validator: util.validatestrCardNum, trigger: 'blur' }
                    ],
                    strEmail:[
                        { required: true , validator: util.validatestrEmail, trigger: 'blur' }
                    ]
                }
		    }
		},
		computed:{
			...mapGetters({
				'statusList':'employee/status'
			})
		},
		mounted()  {
			this.getEmployeeId(),
			this.loadInfo()
		},
		methods:{
			getEmployeeId:function(){
	            this.ruleForm.strUserId= this.$route.query.id
	        },
            //跳至编辑页面
	        goEdit:function(id){
	            this.$router.push({
	                name:'editEmployee',
	                query:{id:id}
	            })
	        },
            loadInfo: function() {
                api.getEmployeeInfo({strUserId:this.ruleForm.strUserId}).then(res => {
                	if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
					let msg = res.data
                    this.strUserNum = msg.strUserNum
                    this.strIdentityList = msg.strIdentityList
                    this.ruleForm.strStatus = msg.strStatus
                    this.ruleForm.strUserName = msg.strUserName
                    this.ruleForm.strUserTel = msg.strUserTel
                    this.ruleForm.strCardNum = msg.strCardNum
                    this.ruleForm.strEmail = msg.strEmail
                    this.relationInfo = msg.relationInfo
                    for(var i in this.relationInfo){
                        if(this.relationInfo[i].strRelationCode == 'REL002'){
                            this.S4_list +=this.relationInfo[i].strRelationNmae+'    '
                        }
                        if(this.relationInfo[i].strRelationCode == 'REL003'){
                            this.S3_list +=this.relationInfo[i].strRelationNmae+'    '
                        }
                        if(this.relationInfo[i].strRelationCode == 'REL004'){
                            this.S2_list +=this.relationInfo[i].strRelationNmae+'    '
                        }
                    }
				})
            }
		}
	}
</script>
<style type="text/css" scoped="scoped">
    .content-container{width: 800px}
</style>