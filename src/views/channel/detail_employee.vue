<template>
	<div class="hjx-show-detail">
		<hjx-header label="S / 详情">
		    <router-link to="employee"><el-button size="small">返回S列表</el-button></router-link>
		    <el-button type="primary" size="small" @click="goEdit(ruleForm.strUserId)">编辑</el-button>
		</hjx-header>
		<el-alert title="基本信息" type="info" :closable="false"></el-alert><br>
	    <el-form ref="ruleForm" label-width="120px">
	        <el-form-item label="姓名：" prop='strUserName'>{{ruleForm.strUserName}}</el-form-item>
            <el-form-item label="手机号码："  prop='strUserTel'>{{ruleForm.strUserTel}}</el-form-item>
            <el-form-item label="身份证："  prop='strCardNum'>{{ruleForm.strCardNum}} </el-form-item>
            <!-- <el-form-item label="邮箱："  >{{ruleForm.strEmail}}</el-form-item> -->
	        <el-form-item label="状态：">
			    <span v-for="item in statusList" v-if="ruleForm.strStatus == item.id">{{item.name}}</span>
			</el-form-item>
			<el-form-item label="所属商户：">{{S4_list}}</el-form-item>
	        <el-form-item label="二级子公司：">{{S3_list}}</el-form-item>
	        <el-form-item label="所在门店："><router-link :to="`/channel/detail_store?id=${storeInfo.id}`">{{storeInfo.name}}</router-link></el-form-item>
	        <el-form-item label="门店工号：">{{strUserNum}}</el-form-item>
	        <el-form-item label="组织身份：">{{strIdentityList}}</el-form-item>
	    </el-form>
		<!-- 操作流水 -->
		<br>
		<el-alert title="操作流水" type="info" :closable="false"></el-alert><br>
		<hjx-pipe v-for="(item,index) in pipeList" :key="index"  :strF1="item.strF1" :strF2="item.strF2">{{item.strF3+' '+item.strF4}}</hjx-pipe>
		<br>
	    <div class="comment"><el-input  v-model="comment" :maxlength="400" placeholder="在此输入备注内容（最多400字）"></el-input></div>
        <el-button  @click="setComment" :disabled="comment?false:true">确认备注</el-button><br><br>
	</div>
</template>
<script type="text/javascript">
	import api from '../../api/api'
	import util from '../../common/util'
	import hjxPipe from '@/base/hjx_pipe'
	import {mapGetters} from 'vuex'
	export default {
		components:{hjxPipe},
		data() {
		    return {
		    	comment:'', //备注
		    	pipeList:[],//操作流水
	            strUserNum:'',//工号
	            strIdentityList:'',
	            S4_list:'',//商户
	            S3_list:'',//二级渠道
	            storeInfo:'',//门店
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
				'statusList':'employee/status',
				'pipeType':'commonData/pipeType'
			})
		},
		mounted()  {
			this.getEmployeeId(),
			this.loadInfo()
		},
		methods:{
			getEmployeeId(){
	            this.ruleForm.strUserId= this.$route.query.id
	        },
            //跳至编辑页面
	        goEdit(id){
	            this.$router.push({
	                name:'editEmployee',
	                query:{id:id}
	            })
	        },
            async loadInfo() {
                let res = await api.getEmployeeInfo({strUserId:this.ruleForm.strUserId})
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
                    if(this.relationInfo[i].strRelationCode == 'REL002'){ //商户
                        this.S4_list +=this.relationInfo[i].strRelationNmae+'    '
                    }
                    if(this.relationInfo[i].strRelationCode == 'REL003'){ //门店组
                        this.S3_list +=this.relationInfo[i].strRelationNmae+'    '
                    }
                    if(this.relationInfo[i].strRelationCode == 'REL004'){ //门店 只对S1、S2身份才展示门店，S1、S2在同一个门店
                        this.storeInfo = {
                        	name:this.relationInfo[i].strRelationNmae,
                        	id:this.relationInfo[i].strRelationId
                        }
                    }
                }
				//获取操作流水
				this.getPipeline()
            },
            async getPipeline(){
            	const reqData = {
					strPipeUserId:this.ruleForm.strUserId,
					strPipeType : this.pipeType.s
				}
				let res = await api.getPipelineList(reqData)
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
				this.pipeList = res.data
            },
            async setComment(){
            	if(!this.comment) {
            		this.$message('请输入备注信息！')
            		return
            	}
            	const reqData = {
            		strComment : this.comment,
            		strPipeType:this.pipeType.s,
            		strPipeUserId:this.ruleForm.strUserId
            	}
            	let res = await api.setComment(reqData)
            	if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                this.getPipeline()
                this.comment = ''
            }
		}
	}
</script>
<style type="text/css" scoped="scoped">
    .comment{display: inline-block;width: 500px;}
</style>