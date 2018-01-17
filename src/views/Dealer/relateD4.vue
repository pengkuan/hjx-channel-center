<template>
	<div>
		<div class="title">
	        <el-col :span="12">Dealer管理 > 关联D4</el-col>
	        <el-col :span="12" class="textRight">
	            <router-link to="index"><el-button size="small">返回Dealer列表</el-button></router-link>
	        </el-col>
	    </div>
		
		<div v-if ='ifD4' class="haveD4">
			<br><br><br><br><br>
        	<p class="hjx-black">{{D4Name + ' / ' + D4Tel}}</p>
        	<br>
        	<p class="note">在tree中替换D4负责人，此处关联D4工号将随之替换</p>
        </div>
		<el-form v-else ref="ruleForm" :rules="rules" :model="ruleForm" label-width="100px">
			<el-form-item label="关联D4：" prop="did">
		        <el-select v-model="ruleForm.did" filterable placeholder="请选择关联的D用户">
		            <el-option  v-for="item in Dlist"  :label="item.strUserName + ' / ' + item.strPhoneNum"  :value="item.strUserId" :key="item.strUserId">
		            </el-option>
		        </el-select>
		    </el-form-item>

		    <el-form-item>
	            <el-button type="primary" @click="submitnow('ruleForm')">立即关联</el-button>
	            <router-link to="index"><el-button>取消</el-button></router-link>
	        </el-form-item>
        </el-form>
        
	</div>
</template>
<style type="text/css" scoped>
	div.haveD4{text-align: center;margin-top: 30px}
	p.note{font-size: 12px;color: #888}
</style>
<script type="text/javascript">
	import api from '../../api/api';
	import util from '../../common/util';
	export default {
		data() {
		    return {
		    	ifD4 : true,
		    	D4Name:'',
		    	D4Tel:'',
		        Dlist:[],
		        ruleForm:{
		        	'did':'',
		        	'dealerid':''
		        },
		        rules:{
		        	did: [
                        {  required: true, message: '请选择D4', trigger: 'change' }
                    ],
		        }
	           
		    }
		},
		mounted()  {
			this.getId()
			this.loadInfo()
		},
		methods:{
			getId:function(){
	            this.ruleForm.dealerid= this.$route.query.id
	            this.ifD4= this.$route.query.ifD4
	        },
            loadInfo: function() {
                api.getWillRelateD4({dealerid:this.ruleForm.dealerid}).then(res => {
                	if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
					
                   	var msg = res.data
                   	console.log(msg.currentD4)
                   	if(!msg.currentD4.strUserId) {
                   		this.Dlist = msg.listD4.concat(msg.listD)
                   		this.ifD4 = false
                   	}else{
                   		this.D4Name = msg.currentD4.strUserName
                   		this.D4Tel = msg.currentD4.strPhoneNum
                   	}
				})

            },

            //确定
            submitnow: function(formName) {
                let self = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        api.relateD4(this.ruleForm).then(res => {
                            if (res.ret != '0') {
                            	this.$message(res.retinfo)
                                return
                            }
                            this.$message("成功！")
                            self.$router.push({ path: '/Dealer/index' });

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