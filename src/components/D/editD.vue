<template>
<div>
<div class="title">
    <el-col :span="12">D管理 > 编辑</el-col>
    <el-col :span="12" class="textRight">
        <router-link to="index"><el-button size="small">返回D列表</el-button></router-link>
    </el-col>
</div>
<div class="content-container">
    <el-form  :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
    	<p>1.基本信息</p>
        <el-form-item label="姓名：" prop='strUserName' >
            <el-input v-model="ruleForm.strUserName" placeholder='请输入姓名' ></el-input>
        </el-form-item>
        <el-form-item type='number' label="手机号码：" prop='strPhoneNum' >
            <el-input v-model="ruleForm.strPhoneNum" :type='number' :maxlength='11' placeholder='请输入11位手机号'></el-input>
        </el-form-item>
        <el-form-item label="身份证：" prop='strCardNum'>
            <el-input v-model="ruleForm.strCardNum"  :maxlength='18' placeholder='请输入18位身份证号' disabled></el-input>
        </el-form-item>
        <el-form-item label="身份证正面：" >
            <el-upload class="avatar-uploader" :name="fileName" :action=" apiRoot + '/upload ' " :show-file-list="false" :on-success="handleAvatarSuccess1" :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl1" :src="imageUrl1" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="身份证背面：" >
            <el-upload class="avatar-uploader" :name="fileName" :action=" apiRoot + '/upload ' "  :show-file-list="false" :on-success="handleAvatarSuccess2" :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl2" :src="imageUrl2" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="上传头像：" >
            <el-upload class="avatar-uploader" :name="fileName" :action=" apiRoot + '/upload ' "   :show-file-list="false" :on-success="handleAvatarSuccess3" :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl3" :src="imageUrl3" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>

        

        <p>2.合作状态</p>
        <el-form-item label="状态：">
            <el-select v-model="ruleForm.strStatus" placeholder="请选择">
                <el-option v-for="item in statusList" :label="item.strStatudName" :value="item.strStatusId" :key="item.strStatusId"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item class="textRight">
            <el-button type="primary" @click="submitnow('ruleForm')">确认更新</el-button>
            <el-button @click="cancelnow">取消</el-button>
        </el-form-item>
        
    </el-form>
    
</div>

</div>	
</template>

<style type="text/css" scoped>
    .content-container{width: 600px}
</style>

<script type="text/javascript">
	import api from '../../api/api';
	import util from '../../common/util';
	export default {
		data() {
            
		    return {
                apiRoot:util.api,
                fileName:'fileName',
                number:'number',
                statusList:'',
                imageUrl1: '',
                imageUrl2: '',
                imageUrl3: '',
	            ruleForm:{
	            	'strStatus':'',
		    		'strUserId':'',
                    'strCardPicFront':'',
                    'strCardPicBack':'',
                    'strHeadPic':'',
		            'strUserName':'',
		            'strPhoneNum':'',
		            'strCardNum':''
	            },
                rules:{
                    strUserName: [
                        {  required: true , validator: util.validateName, trigger: 'blur' }
                    ],
                    strPhoneNum: [
                        { required: true , validator: util.validateTel, trigger: 'blur' }
                    ],
                    strCardNum:[
                        { required: true , validator: util.validatestrCardNum, trigger: 'blur' }
                    ]
                }
		    }
		},
		mounted()  {
            this.getId()
			this.loadInfo()
		},
		methods:{
			getId:function(){
	            this.ruleForm.strUserId= this.$route.query.id
	            // this.ruleForm.strUserId= '1111'
	        },
            loadInfo:function(){
                api.getDStatus({'who':'d'}).then(res =>{
                    if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
                    this.statusList = res.data.list
                }).then(res =>{
                    this.getDefaultDate()
                })
            },
			//取消
            cancelnow: function() {
                this.$router.push({ path: '/D/index' })
            },
            getDefaultDate : function(strStoreId){
            	api.getDInfo({strUserId:this.ruleForm.strUserId}).then(res => {
	                if (res.ret != '0') {
                        this.$message(res.retinfo)
                        return
                    }
                    let baseInfo = res.baseinfo
                    this.ruleForm.strUserName = baseInfo.strUserName
                    this.ruleForm.strPhoneNum = baseInfo.strPhoneNum
                    this.ruleForm.strCardNum = baseInfo.strCardNum
                    this.ruleForm.strStatus = baseInfo.strStatusId

                    this.ruleForm.strCardPicFront = baseInfo.strCardPicFront
                    this.ruleForm.strCardPicBack = baseInfo.strCardPicBack
                    this.ruleForm.strHeadPic = baseInfo.strHeadPic
                    // this.imageUrl1 = '/WebService/static/upload/' + baseInfo.strCardPicFront
                    // this.imageUrl2 = '/WebService/static/upload/' + baseInfo.strCardPicBack
                    // this.imageUrl3 = '/WebService/static/upload/' + baseInfo.strHeadPic

                    this.imageUrl1 = this.apiRoot + '/static/upload/' + baseInfo.strCardPicFront
                    this.imageUrl2 = this.apiRoot + '/static/upload/' + baseInfo.strCardPicBack
                    this.imageUrl3 = this.apiRoot + '/static/upload/' + baseInfo.strHeadPic
                })
            },

            //确定
            submitnow(formName , GoOn) {
                let self = this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // if(!this.ruleForm.strCardPicFront){
                        //     this.$layer.alert('请上传身份证正面照片')
                        //     return
                        // } 
                        // if(!this.ruleForm.strCardPicBack) {
                        //     this.$layer.alert('请上传身份证背面照片')
                        //     return
                        // }
                        // if(!this.ruleForm.strHeadPic) {
                        //     this.$layer.alert('请上传头像')
                        //     return
                        // }
                        api.editDLogic({duser:this.ruleForm}).then(res => {
                            if (res.ret != '0') {
                                self.$message(res.retinfo)
                                return
                            }
                            this.$message('成功！')
                            if(!GoOn) self.$router.push({ path: '/D/index' })
                            else self.$refs['ruleForm'].resetFields()

                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
                
            },
            handleAvatarSuccess1(res, file) {
                this.ruleForm.strCardPicFront = file.response.fileName
                this.imageUrl1 = URL.createObjectURL(file.raw);
            },
            handleAvatarSuccess2(res, file) {
                this.ruleForm.strCardPicBack = file.response.fileName
                this.imageUrl2 = URL.createObjectURL(file.raw);
            },
            handleAvatarSuccess3(res, file) {
                this.ruleForm.strHeadPic = file.response.fileName
                this.imageUrl3 = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJpeg = file.type === 'image/jpeg'
                const isPng = file.type === 'image/png'
                const isJPG = file.type === 'image/jpg'
                const isLt1M = file.size / 1024 / 1024 < 1
                var flags
                if ((!isJpeg) && (!isPng) && (!isJPG)) {
                    flags = false
                    this.$message.error('只能上传头像图片格式为.jpg .png .jpeg!')
                }
                if (!isLt1M) {
                  this.$message.error('上传头像图片大小不能超过 1MB!')
                }
                return flags && isLt1M
            }


		}
	}
</script>