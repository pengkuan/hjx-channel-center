<template>
    <div>
        <div class="title">
            <el-col :span="12"> BD管理 > 批量创建BD {{pageDescribe}}</el-col>
            <el-col :span="12" class="textRight">
                <router-link to="index" v-if="steps.step_1"><el-button size="small">返回BD列表</el-button></router-link>
                <el-button size="small" v-else @click="reChooseFile">返回批量创建BD</el-button>
            </el-col>
        </div>
        <div class="step-1" v-if="steps.step_1">
            <div class="hjx-fl">
                <el-steps :space='150' direction="vertical" :active="active">
                    <el-step title=""></el-step>
                    <el-step title=""></el-step>
                    <el-step title=""></el-step>
                </el-steps>
            </div>
            <div class="hjx-fl">
                <div class="step-download">
                    <span class="instructions">下载BD信息模板，批量填写BD信息</span> <a class="download-btn" :href=" apiRoot + '/download' " download="">下载</a>
                    <p class="instructions-limit">如已有模板，可跳过第一步</p>
                </div>
                <div class="step-choose-file">
                    <span class="instructions">上传填写好的"BD信息表" </span>
                    <span class="instructions-limit">（仅支持xls、xlsx格式文件，最大1M）</span>
                    <br>
                    <br>
                    <el-upload class="upload-demo" :name="fileName" :limit="limit" ref="upload"  :on-change="verification" :on-remove="reChooseFile" :action=" apiRoot + '/upload' " :file-list="fileList" :on-success="successUpload"  :auto-upload="false">
                        <el-button slot="trigger" ref="aaa" size="small" type="primary" :disabled="hasChoosed">选择文件</el-button>

                        <span slot="tip" class="el-upload__tip">
                            <i :class="iconClass"></i>{{upload__tip}}
                        </span>
                    </el-upload>
                </div>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" :disabled="!canSubmit">上传到服务器</el-button>
                <router-link to="index"><el-button size="small">取消</el-button></router-link>
            </div>
            <div class="hjx-clear">
                <br>
                <p class="instructions-limit">
                    单次上传最多处理100条数据
                    <br>
                </p>
                <p class="instructions-limit">
                    表格字段填写说明：
                    <br> • 姓名：4~50字符，不支持特殊字符
                    <br> • 手机号：11位数字，不能与已有BD重复
                    <br> • 身份证号码：15或18位数字，最后一位可以为x，不能与已有BD重复
                    <br> • email：4~50字符，包含@
                </p>
            </div>
        </div>
        <!-- 提交成功页 -->
        <div class="step-2-success" v-else-if="steps.step_2_success">
            <div class="hjx-alert hjx-alert-warning" >
                <span class="hjx-info">上传表格所有数据</span>
                <span class="hjx-blue">校验通过，</span>
                <span class="hjx-info">预览如下</span>
                <span class="hjx-danger">（第102行及之后的数据未做校验）</span>
            </div>
            <br>

            <table class="el-table el-table--border border-RB-none" cellspacing="0" cellpadding="0" border="0">
                <tr>
                    <th width="10%" class="is-leaf"><div class="cell">姓名</div></th>
                    <th width="15%" class="is-leaf"><div class="cell">手机号</div></th>
                    <th width="15%" class="is-leaf"><div class="cell">身份证号码</div></th>
                    <th width="15%" class="is-leaf"><div class="cell">校验结果</div></th>
                </tr>
                <tr v-for="(item , index) in step2_success_data.rowList">
                    <td><div class="cell">{{item.name}}</div></td>
                    <td><div class="cell">{{item.phonenum}}</div></td>
                    <td><div class="cell">{{item.cardnum}}</div></td>
                    <td>
                         <i class="iconfont icon-duigou1 hjx-success table-icon"></i>
                    </td>
                    
                </tr>
            </table>
            <br>
            <i class="iconfont icon-more_android_light"></i>
            <p class="instructions">共{{step2_success_data.okRowNum}}条</p>
            <br>
            <p class="hjx-center">
                <el-button type="primary" @click="confirmSubmit" size="small">确认上传</el-button>
                <el-button @click="reChooseFile" size="small">取消</el-button>
            </p>
        </div>
        <!-- 提交失败页 -->
        <div class="step-2-fail" v-else-if="steps.step_2_fail">
            <div class="hjx-alert hjx-alert-warning" >
                <span class="hjx-info">当前表格中有</span>
                <span class="hjx-danger">{{step2_fail_data.errorRowNum}}条</span>
                <span class="hjx-info">错误，请修改完成后重新上传</span>
                <span class="hjx-danger">（如有误，请调整excel后全部重新上传<span v-if="step2_fail_data.totalNum>100">；第102行及之后的数据未做校验</span>）</span>
            </div>
            <br>
            <el-table :data="step2_fail_data.rowList" border style="width: 100% ;">
                <el-table-column prop="locaterow" label="行数"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="phonenum" label="手机号"></el-table-column>
                <el-table-column prop="cardnum" label="身份证号码"></el-table-column>
                <el-table-column prop="errinfo" label="错误详情" class-name="hjx-danger"></el-table-column>
            </el-table>
            <br>
            <p class="hjx-center">
                <el-button type="primary" @click="reChooseFile('yes')" size="small">重新上传</el-button>
            </p>
        </div>
        <!-- 创建成功（部分） -->
        <div class="step-3-mostSuccess" v-else-if="steps.step_3_most">
            
            <div class="hjx-alert hjx-alert-warning" >
                <span class="hjx-info">共提交{{step3_most_data.totalNum}}条数据，</span>
                <span class="hjx-success">{{step3_most_data.successNum}}条创建成功。</span>
                <span class="hjx-danger">{{step3_most_data.errorNum}}条发现与已有数据重复，请检查<span v-if="step3_most_data.totalNum>100">（第102行及之后的数据未做校验）</span>：</span>
            </div>
            <br>
            <el-table :data="step3_most_data.rowList" border style="width: 100% ;">
                <el-table-column prop="locaterow" label="行数"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="phonenum" label="手机号"></el-table-column>
                <el-table-column prop="cardnum" label="身份证号码"></el-table-column>
                <el-table-column prop="errinfo" label="重复详情"></el-table-column>
            </el-table>
            <br>
            <div class="hjx-center">
                <router-link to="index">
                    <el-button size="middle">完成</el-button>
                </router-link>
            </div>
        </div>
        <!-- 创建成功（全部） -->
        <div class="step-3 hjx-center" v-else>
            <br>
            <br>
            <br>
            <p class="hjx-ft16 hjx-info"><i class="iconfont icon-duigou1 hjx-success"></i> {{step3_success_data.okRowNum}}条数据已经全部创建</p>
            <p class="hjx-ft13 hjx-danger" v-if="step3_success_data.totalNum>100">（第102行及之后的数据未做校验）</p>
            <br>
            <br>
            <router-link to="index">
                <el-button size="middle">完成</el-button>
            </router-link>
        </div>
        
    </div>
</template>
<style scoped lang="scss">
    .instructions {
        color: #666;
        font-size: 13px
    }
    .icon-duigou1{font-size:26px}
    .icon-duigou1.table-icon{font-size:20px;margin-left:18px}
    .el-upload__tip .iconfont{
        margin-left:12px;
        font-size:20px;
        vertical-align:sub;

    }
    .instructions-limit {
        color: #999;
        font-size: 12px;
        line-height: 20px
    }

    .step-download,
    .step-choose-file {
        height: 155px;
    }

    .download-btn {
        padding: 7px 9px;
        font-size: 12px;
        border-radius: 4px;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        background: #fff;
        border: 1px solid #c4c4c4;
        color: #1f2d3d;
        margin: 0;
    }

    .download-btn:hover {
        color: #20a0ff;
        border-color: #20a0ff;
    }

</style>
<script type="text/javascript">
import api from '../../api/api'
import util from '../../common/util'
export default {
    data() {

        return {
            hasChoosed:false,
            limit:1,
            steps: {
                step_1: true,
                step_2_success: false,
                step_2_fail: false,
                step_3_success: false,
                step_3_most: false,
            },
            iconClass:'iconfont icon-gantanhao-',
            fixedName: 'BD信息表',
            pageDescribe: '',
            active: 1,
            fileName: 'fileName',
            excelname: '',
            apiRoot: util.api,
            fileList: [],
            upload__tip: '未选择文件',
            canSubmit: false,

            step2_fail_data: { errorRowNum: 0 },
            step2_success_data: {},

            step3_most_data: {},
            step3_success_data: {}

        }
    },
  
    mounted() {

    },
    methods: {
      
        verification(file, fileList) {

            let getFileNameInfo = file.name.split('.')

            if (getFileNameInfo[0] != this.fixedName) {
                this.upload__tip = ' 选择文件失败，请确认文件名为“BD信息表”'
                this.iconClass = "iconfont icon-gantanhao hjx-danger"
                this.$refs.upload.clearFiles()
                return
            } else if ( (getFileNameInfo[1] != 'xls' && getFileNameInfo[1] != 'xlsx') || file.size / 1024 / 1024 > 1 ) {
                this.$refs.upload.clearFiles()
                this.upload__tip = ' 选择文件失败，请确认文件格式为xls、xlsx，1M以内'
                this.iconClass = "iconfont icon-gantanhao hjx-danger"
                return
            }
            this.upload__tip = ' BD信息表已选择'
            this.iconClass = "iconfont icon-duigou hjx-success"

            this.active = 2
            this.canSubmit = true
            this.hasChoosed = true
        },
        submitUpload() {
            this.$refs.upload.submit()
        },
        handleRemove(){
            this.upload__tip = "未选择文件"
        },

        successUpload(data) {
            this.excelname = data.fileName
            this.checkBdExcel(data.fileName)
        },

        checkBdExcel(excelname) {
            api.checkBdExcel({ 'excelname': excelname }).then(res => {
                if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                let msg = res.data

                this.setFalse()
                if (msg.okRowNum == msg.totalNum) { //检验通过
                    this.steps.step_2_success = true
                    this.step2_success_data = msg

                } else { //未通过

                    this.steps.step_2_fail = true
                    this.step2_fail_data = msg
                }

            })
        },
        setFalse(){
            for(let key in this.steps){
                this.steps[key] = false
            }
            
        },
        reChooseFile(autoOpenChoose) {
            
            this.steps.step_1 = true
            this.upload__tip = '未选择文件'
            this.iconClass = 'iconfont icon-gantanhao-'
            this.active = 1
            this.canSubmit = false
            this.hasChoosed = false
            this.setFalse()
            this.steps.step_1 = true


            if(autoOpenChoose == 'yes'){ 
                setTimeout(()=>{
                    document.querySelector(".el-upload__input").click()
                },200)
            }
            
            // this.$refs.upload.clearFiles()

        },
        confirmSubmit() {
            api.createBdExcel({ 'excelname': this.excelname }).then(res => {
                if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                let msg = res.data

                this.setFalse()
                if (msg.oneOver == '1') { //全部通过
                    this.steps.step_3_success = true
                    this.step3_success_data = msg

                } else { //部分通过
                    this.steps.step_3_most = true
                    this.step3_most_data = msg
                }


            })
        }

    }
}

</script>
