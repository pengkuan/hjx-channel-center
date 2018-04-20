<template>
    <div id="store-relations">
        <hjx-header :label=" '门店管理 > 批量关联 '+pageDescribe">
            <router-link to="index" v-if="steps.step_1"><el-button size="small">返回门店列表</el-button></router-link>
            <el-button size="small" v-else @click="reChooseFile">返回批量管理S1</el-button>
        </hjx-header>
        <!-- S1/BD1关联切换 -->
        <el-tabs v-model="relationType" @tab-click="handleClick">
            <el-tab-pane label="S1关联O1" name="1"></el-tab-pane>
            <el-tab-pane label="BD1关联O1" name="2"></el-tab-pane>
        </el-tabs>

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
                    <span class="instructions">下载信息模板，批量填写信息</span> <a class="download-btn" :href=" _Config.API + downloadAddr " download="">下载</a>
                    <p class="instructions-limit">如已有模板，可跳过第一步</p>
                </div>
                <div class="step-choose-file">
                    <span class="instructions">上传填写好的"{{expectExcelName}}" </span>
                    <span class="instructions-limit">（仅支持xls、xlsx格式文件，最大1M）</span>
                    <br>
                    <br>
                    <el-upload class="upload-demo" :name="fileName" :limit="limit" ref="upload"  :on-change="verification" :on-remove="reChooseFile" :action=" _Config.API + '/upload' " :file-list="fileList" :on-success="successUpload"  :auto-upload="false">
                        <el-button slot="trigger"  size="small" type="primary" :disabled="hasChoosed">选择文件</el-button>

                        <span slot="tip" class="el-upload__tip">
                            <i :class="iconClass"></i>{{upload__tip}}
                        </span>
                    </el-upload>
                </div>
                <el-button style="margin-left: 10px;" size="small" type="primary" @click="submitUpload" :disabled="!canSubmit">上传</el-button>
                <router-link to="store"><el-button size="small">取消</el-button></router-link>
            </div>
            <div class="hjx-clear">
                <br><br><br><br>
                <p class="instructions-limit">
                    单次上传最多处理<span class="hjx-danger">150条数据</span>
                    <br>
                    请将所有列的单元格格式设置成<span class="hjx-danger">文本格式</span>
                    <br>
                </p>
            </div>
        </div>
        
        <div class="step-3-mostSuccess" v-else-if="steps.step_2">
            <!-- 为0代表全部成功 -->
            <div v-if="step2Data.result == '0' "> 
                <div class="hjx-alert hjx-alert-warning" >
                    <span class="hjx-info">上传表格所有数据完成关联，预览如下:</span>
                    <span class="hjx-danger" v-if="step2Data.totalNum>150">（第152行及之后的数据未做校验）</span>
                </div>
                <br>
                <table class="el-table el-table--border border-RB-none" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                        <th width="10%" class="is-leaf"><div class="cell">行数</div></th>
                        <th width="15%" class="is-leaf"><div class="cell">身份证号码</div></th>
                        <th width="10%" class="is-leaf"><div class="cell">姓名</div></th>
                        <th width="15%" class="is-leaf"><div class="cell">O1名称</div></th>
                        <th width="15%" class="is-leaf"><div class="cell">校验结果</div></th>
                    </tr>
                    <tr v-for="(item , index) in step2Data.rowList">
                        <td><div class="cell">{{item.row}}</div></td>
                        <td><div class="cell">{{item.cardNum}}</div></td>
                        <td><div class="cell">{{item.name}}</div></td>
                        <td><div class="cell">{{item.o1Name}}</div></td>
                        <td>
                             <i class="iconfont icon-duigou1 hjx-success table-icon"></i>
                        </td>
                        
                    </tr>
                </table>
                <br>
                <i v-if="step2Data.totalRow>3" class="iconfont icon-more_android_light"></i>
                <p class="instructions">共{{step2Data.totalRow}}条</p>
            </div>
            <div v-else>
                <div class="hjx-alert hjx-alert-warning" >
                    <span class="hjx-info">共提交{{step2Data.totalRow}}条数据，</span>
                    <span class="hjx-blue">{{step2Data.successRow}}条关联成功。</span>
                    <span class="hjx-danger">另发现{{step2Data.failedRow}}条关联失败</span>
                    <span class="hjx-danger" v-if="step2Data.totalNum>150">（第152行及之后的数据未做校验） </span>
                </div>
                <br>
                <el-table :data="step2Data.rowList" border style="width: 100% ;">
                    <el-table-column prop="row" label="行数"></el-table-column>
                    <el-table-column prop="cardNum" label="身份证号码"></el-table-column>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="o1Name" label="O1名称"></el-table-column>
                    <el-table-column prop="errInfo" label="错误详情" class-name="hjx-danger hjx-ft12"></el-table-column>
                </el-table>
            </div>
            <br><br>
            <div class="hjx-center">
                <router-link to="store">
                    <el-button size="middle">完成</el-button>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script type="text/javascript">
import api from '../../api/api'
export default {
    data() {

        return {
            relationType:'1',//关联类型
            downloadAddr:'/downloads1o1', //下载模板地址
            expectExcelName:'S1_O1信息表',
            hasChoosed:false,
            limit:1,
            steps: {
                step_1: true,
                step_2: false,
            },
            iconClass:'iconfont icon-gantanhao-',
            active: 1,
            fileName: 'fileName',
            excelname: '',
            fileList: [],
            upload__tip: '未选择文件',
            canSubmit: false,
            step2Data: {}
        }
    },
    computed : {
        pageDescribe() {
            if(this.steps.step_1){ return ''}
            else if(this.steps.step_2_success || this.steps.step_2_fail){ return ' > 提交结果'}
            else{ return ' > 关联结果'}
        }
    },
    methods: {
        handleClick(tab, event) {
            if(this.expectExcelName == (tab.name == '1'?'S1_O1信息表':'BD1_O1信息表')){
                return 
            }else{
                this.downloadAddr = tab.name == '1'?'/downloads1o1':'/downloadbd1o1'
                this.expectExcelName = tab.name == '1'?'S1_O1信息表':'BD1_O1信息表'
                this.reChooseFile()
                if(this.$refs.upload) this.$refs.upload.clearFiles()
            }
        },
        verification(file, fileList) {
            let getFileNameInfo = file.name.split('.')

            if (getFileNameInfo[0] != this.expectExcelName) {  //取消名字校验
                // this.upload__tip = `选择文件失败，请确认文件名为“${this.expectExcelName}”`
                // this.iconClass = "iconfont icon-gantanhao hjx-danger"
                // this.$refs.upload.clearFiles()
                // return
            } else if ( (getFileNameInfo[1] != 'xls' && getFileNameInfo[1] != 'xlsx') || file.size / 1024 / 1024 > 1 ) {
                this.$refs.upload.clearFiles()
                this.upload__tip = ' 选择文件失败，请确认文件格式为xls、xlsx，1M以内'
                this.iconClass = "iconfont icon-gantanhao hjx-danger"
                return
            }
            this.upload__tip = ` ${this.expectExcelName}已选择`
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
            this.confirmSubmit()
        },

        setFalse(){
            for(let key in this.steps){
                this.steps[key] = false
            }
            
        },
        reChooseFile(autoOpenChoose) {
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
        },
        confirmSubmit() {
            var loading = this.$loading({
                text:'正在关联',
                target:'#store-relations'
            })
            api.bindO1Excel({ 'excelName': this.excelname ,bindType:this.relationType}).then(res => {
                loading.close()
                if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
                let msg = res.data
                this.setFalse()
                this.steps.step_2 = true
                this.step2Data = msg
            })
        }
    }
}

</script>
<style type="text/css">
    #store-relations .el-upload-list.el-upload-list--text{width:53%;}
</style>
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

    .step-download{height: 153px;}
    .step-choose-file {height: 150px;}

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
