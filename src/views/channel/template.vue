<template>
    <div>
        <hjx-header label="商户 / 模板列表">
            <router-link to="add_template"><el-button type="primary" size="small">添加</el-button></router-link>
        </hjx-header>
        <!--工具条-->
        <el-form :inline="true" :model="filters">
            <el-form-item>
                <el-input v-model="filters.searchkey" @keyup.13.native="search($event)" placeholder="请输入模板名称/ID" style="min-width: 240px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button @click="clearForm()">清空</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList" border style="width: 100% ; min-height:300px">
            <el-table-column prop="strTemplateId" label="模板ID">
            </el-table-column>
            <el-table-column prop="strTemplateName" label="模板名称"></el-table-column>
            <el-table-column prop="strTemplateDesc" label="模板描述"></el-table-column>
            <el-table-column prop="strCreateTime" label="创建日期"></el-table-column>
            <el-table-column prop="strStatus" label="状态"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
	        		<el-button class = 'indexFunBtn' type="text" @click="edit(scope.row.strTemplateId)"  size="small">编辑</el-button>
	        		<el-button v-if="scope.row.strStatus == '有效' " class = 'indexFunBtn hjx-danger' type="text" @click="delchnn(scope.row.strTemplateId)"  size="small">禁用</el-button>
	        		<el-button v-else class = 'indexFunBtn' type="text" @click="upchnn(scope.row.strTemplateId)"  size="small">启用</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import api from '../../api/api'
import util from '../../common/util'
export default {
    data() {
        return {
            dataList: [],
            pageIndex: '0',
            pageSize: '10',
            currentPage: 1,
            total: 0,
            filters: {
                searchkey: ''
            }
        }
    },
    methods: {
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.pageIndex = (val - 1) * 10
            this.currentPage = val
            this.showList()
        },
        showList: function() {
            let data = {
                pageIndex: String(this.pageIndex),
                pageSize: this.pageSize,
                searchkey: this.filters.searchkey
            }
            api.getTemplateList(data).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo, "提示")
                    return
                }
                this.dataList = res.data.channelTemplates
                this.total = Number(res.data.total)
            })
        },
        //跳至编辑页面
        edit: function(Id) {
            this.$router.push({
                name: 'editTemplate',
                query: { id: Id }
            })
        },
        //启用渠道关系模板
        upchnn: function(templateid) {
            var data = { id: templateid }
            api.upChannelTemplate(data).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo, "提示")
                    return
                }
                this.$message('启用成功')
                this.showList()
            })

        },
        //禁用渠道关系模板
        delchnn: function(templateid) {
            var data = { id: templateid }
            api.delChannelTemplate(data).then(res => {
                if (res.ret != '0') {
                    this.$alert(res.retinfo, "提示")
                    return
                }
                this.$message('禁用成功')
                this.showList()
            })
        },
        search: function() {
            this.filters.searchkey = util.Trim(this.filters.searchkey)
            this.currentPage = 1
            this.pageIndex = '0'
            this.showList()
        },
        clearForm() {
            this.filters.searchkey = ''
            this.showList()
        }
    },
    mounted() {
        this.showList()
    }
}
</script>
