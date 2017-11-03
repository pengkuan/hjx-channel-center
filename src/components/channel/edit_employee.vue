<template>
	<div>
		<div class="title">工号 / 编辑</div>
		<div class="content-container">
		    <el-form ref="ruleForm" :rules="rules" :model="ruleForm" label-width="100px">
		        <el-form-item label="姓名：" prop='strUserName'>
	                <el-input v-model="ruleForm.strUserName" placeholder='请输入姓名'></el-input>
	            </el-form-item>
	            <el-form-item label="手机号码："  prop='strUserTel'>
	                <el-input v-model="ruleForm.strUserTel" :type="'number'" :maxlength='11' placeholder='请输入手机号'></el-input>
	            </el-form-item>
	            <el-form-item label="身份证："  prop='strCardNum'>
	                <el-input v-model="ruleForm.strCardNum"  placeholder='请输入18位身份证号'></el-input>
	            </el-form-item>
	            <el-form-item label="邮箱："  prop='strEmail'>
	                <el-input v-model="ruleForm.strEmail" placeholder='请输入邮箱'></el-input>
	            </el-form-item>
		        
		        <el-form-item label="状态：">
				    <el-select v-model="ruleForm.strStatus" placeholder="请选择状态">
				      	<el-option  v-for="item in statusList"  :label="item.statusName"  :value="item.statusId" :key="item.statusId" >
		                </el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="所属商户：">
		            <el-input v-model="S4_list" disabled></el-input>
		        </el-form-item>
		        <el-form-item label="二级子公司：">
		            <el-input v-model="S3_list" disabled></el-input>
		        </el-form-item>
		        <el-form-item label="所在门店：">
		            <el-input v-model="S2_list" disabled></el-input>
		        </el-form-item>
		        <el-form-item label="门店工号：">
		            <el-input v-model="strUserNum" disabled></el-input>
		        </el-form-item>

		        <el-form-item>
		            <el-button type="primary" @click="submitnow('ruleForm')">确定</el-button>
		            <el-button @click="cancelnow">取消</el-button>
		        </el-form-item>
		    </el-form>
		    
		</div>
	</div>

	
</template>
<style type="text/css" scoped="scoped">
    .content-container{width: 800px}
</style>
<script type="text/javascript">
	import api from '../../api/api'
	import util from '../../common/util'
	export default {
		data() {
			
		    return {
		    	id:'',
	            statusList:[
	                {statusName : '正常' , statusId : '1'},
	                {statusName : '停用' , statusId : '0'}
	            ],
	            strUserNum:'',//工号
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
		mounted()  {
			this.getEmployeeId(),
			this.loadInfo()
		},
		methods:{
			getEmployeeId:function(){
	            this.ruleForm.strUserId= this.$route.query.id
	        },
			//取消
            cancelnow: function() {
            	this.$router.push({ path: '/channel/employee' });
            },

            loadInfo: function() {
                api.getEmployeeInfo({strUserId:this.ruleForm.strUserId}).then(res => {
                	if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
					let msg = res.data
                    this.strUserNum = msg.strUserNum

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

            },

            //确定
            submitnow: function(formName) {
                let self = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        api.editEmployeeLogic(this.ruleForm).then(res => {
                            if (res.ret != '0') {
                                this.$message(res.retinfo)
                                return
                            }
                            this.$message("成功！")
                            self.$router.push({ path: '/channel/employee' })

                        })
                    } else {
                        console.log('error submit!!')
                        return false;
                    }
                })

            }
		}
	}
</script>