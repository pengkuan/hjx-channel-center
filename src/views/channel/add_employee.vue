<template>
<div>
    <hjx-header label="S / 新增">
        <router-link to="employee"><el-button size="small">返回S列表</el-button></router-link>
    </hjx-header>
    <div class="content-container">
        <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="姓名：" prop='strUserName'>
                <el-input v-model="ruleForm.strUserName" placeholder='请输入姓名'></el-input>
            </el-form-item>
            <el-form-item label="手机号码："  prop='strUserTel'>
                <el-input v-model="ruleForm.strUserTel" :type='number' :maxlength='11' placeholder='请输入手机号'></el-input>
            </el-form-item>
            <el-form-item label="身份证："  prop='strCardNum'>
                <el-input v-model="ruleForm.strCardNum" :maxlength='18'  placeholder='请输入18位身份证号'></el-input>
            </el-form-item>
            <!-- <el-form-item label="邮箱：" >
                <el-input v-model="ruleForm.strEmail" placeholder='请输入邮箱'></el-input>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="submitnow('ruleForm')">立即创建</el-button>
                <el-button type="primary" @click="submitnow('ruleForm',true)">确认并继续创建</el-button>
                <el-button @click="cancelnow">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>
<script type="text/javascript">
	import api from '../../api/api';
	import util from '../../common/util';
	export default {
		data() {
		    return {
                number:'number',
		    	statusId:'1',
	            statusList:[
	                {statusName : '正常' , statusId : '1'},
	                {statusName : '停用' , statusId : '0'}
	            ],
	            ruleForm:{
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

		},
		methods:{
            cancelnow: function() {
                this.$router.push({ path: '/channel/employee' });
                api.cancelAddEmployeeLogic(this.ruleForm) //记录取消操作
            },
            //确定
            submitnow: function(formName,bool) {
                
                let self = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        api.addEmployeeLogic(this.ruleForm).then(res => {
                            if (res.ret != '0') {
                                this.$alert(res.retinfo,"提示")
                                return
                            }
                            this.$message("成功！")
                            if(bool){
                                this.$refs[formName].resetFields()
                            }else{
                                self.$router.push({ path: '/channel/employee' });
                            }

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })

            }

		}
	}
</script>
<style type="text/css" scoped>
  .content-container{width: 600px}
</style>