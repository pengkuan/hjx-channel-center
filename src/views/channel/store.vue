<template>
<div>
    <hjx-header label="门店 / 列表">
        <router-link to="add_store"><el-button type="primary" size="small">添加</el-button></router-link>
    </hjx-header>
	<!--工具条-->
    <el-form :inline="true" :model="filters" ref="filters" label-position="top">
    	<el-form-item label="地址：">
            <el-cascader :options="addrList" :props="selectAddrSetting" placeholder="请选择地址" v-model="addrIds" change-on-select></el-cascader>
        </el-form-item>
        <el-form-item prop="strStatus" label="合作状态：">
            <el-select v-model="filters.strStatus" placeholder="请选择合作状态">
                <el-option label="全部" value=""></el-option>
                <el-option  v-for="item in statusList"  :label="item.name" :value="item.id" :key="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="strStoreRelateStatus" label="关联状态：">
            <el-select v-model="filters.strStoreRelateStatus" placeholder="请选择关联状态">
                <el-option label="全部" value=""></el-option>
                <el-option  v-for="item in relatedStatusList"  :label="item.name" :value="item.id" :key="item.id">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="门店ID：" prop="strStoreId">
          <el-input v-model="filters.strStoreId" @keyup.13.native="search($event)" placeholder="请输入门店ID" ></el-input>
        </el-form-item>
        <el-form-item label="门店名称：" prop="strStoreName">
          <el-input v-model="filters.strStoreName" @keyup.13.native="search($event)" placeholder="请输入门店名称" ></el-input>
        </el-form-item>
        <el-form-item label="所属商户：" prop="strChannelKey">
          <el-input v-model="filters.strChannelKey" @keyup.13.native="search($event)" placeholder="请输入商户名或id" ></el-input>
        </el-form-item>
        <el-form-item label="handle" class="hjx-search-handle">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="clearForm('filters')">清空</el-button>
        </el-form-item>
    </el-form>
	<el-table :data="dataList" border style="width: 100% ; min-height:300px">
	    <el-table-column prop="strStoreId" label="门店ID" ></el-table-column>
	    <el-table-column prop="strStoreName" label="门店名称" ></el-table-column>
	    <el-table-column prop="strProvinceName" label="门店地址">
	    	<template slot-scope="scope">
	            {{scope.row.strProvinceName + scope.row.strCityName + scope.row.strAreaName +scope.row.strAddress}}
	        </template>
	    </el-table-column>
	    <el-table-column prop="strChannelName" label="商户" ></el-table-column>
	    <el-table-column prop="strRelationD1List" label="D1" >
            <template slot-scope="scope">
                <span v-if="scope.row.strRelationD1List.length == 1">
                    {{scope.row.strRelationD1List[0].strUserName+' / '+scope.row.strRelationD1List[0].strPhoneNum}}
                </span>
                <span v-else-if="scope.row.strRelationD1List.length>1">
                    {{scope.row.strRelationD1List[0].strUserName+' / '+scope.row.strRelationD1List[0].strPhoneNum}}  ...
                </span>
                <span v-else>暂无</span>
            </template>
        </el-table-column>
	    <el-table-column  label="合作状态" >
	    	<template slot-scope="scope">
	            <span v-for="item in statusList" v-if="scope.row.strStatus == item.id">{{item.name}}</span>
	        </template>
	    </el-table-column>
	    <el-table-column  label="关联状态" >
	    	<template slot-scope="scope">
	            <span v-for = "item in relatedStatusList" v-if="scope.row.strRelatedStatus == item.id">{{item.name}}</span>
	            <p v-if="scope.row.strRelatedStatus == '0' " class="unUseStatus">{{scope.row.strRelatedStatusTips}}</p>
	        </template>
	    </el-table-column>
	    <el-table-column  label="操作">
	        <template slot-scope="scope">
	        	<el-button class = 'indexFunBtn'  type="text" @click="showDetail(scope.row.strStoreId)"  size="small">详情</el-button>
        		<el-button class = 'indexFunBtn' type="text" @click="editStore(scope.row.strStoreId)"  size="small">编辑</el-button>
	        </template>
	    </el-table-column>
	</el-table>
	<div class="pagination">
	    <el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="currentPage"
	      :page-sizes="[10, 20, 30, 40]"
	      :page-size="10"
	      layout="total, prev, pager, next, jumper"
	      :total="total">
	    </el-pagination>
	</div>
</div>
</template>
<script>
import api from '../../api/api'
import util from '../../common/util'
import { mapGetters , mapActions} from 'vuex'
export default {
	data() {
	    return {
	    	dataList:[],
	    	pageIndex:'0',
        	pageSize:'10',
        	currentPage:1,
        	total:0,
        	addrIds:[],
        	filters:{
        		'strStoreId':'',
        		'strStoreName':'',
        		'strChannelKey':'',
        		'strStatus': '',
        		'strStoreRelateStatus':''
        	}
	    }
	},
	computed:{
        ...mapGetters({
            statusList : 'store/status',
            relatedStatusList : 'store/relatedStatus',
            addrList : 'commonData/adds',
            selectAddrSetting : 'commonData/selectAddrSetting'
        })
    },
	methods:{
		...mapActions({
            getAddress: 'commonData/getAdds' 
        }),
		handleSizeChange(val) {
	        console.log(`每页 ${val} 条`)
	    },
	    handleCurrentChange(val) {
	    	this.pageIndex = val- 1
	    	this.currentPage = val
	        this.showList()
	    },
	    init(){
            this.getAddress()
        },
		showList(){
			let [strProvinceId='', strCityId='', strAreaId=''] = this.addrIds
			let data ={
				pageinfo:{
					'pageIndex':String(this.pageIndex),
					'pageSize':this.pageSize,
				},
				'searchkeys':Object.assign(this.filters , {'strProvinceId':strProvinceId,strCityId:strCityId,strAreaId:strAreaId})
			}
			api.getStoreList(data).then(res => {
				if (res.ret != '0') {
                    this.$alert(res.retinfo,"提示")
                    return
                }
				this.dataList = res.data.list
				this.total = res.data.nums
			})
		},
		editStore(strStoreId){
			this.$router.push({
				name:'editStore',
				query:{id:strStoreId}
			})
		},
		showDetail(id){
			this.$router.push({
				name:'detailStore',
				query:{id:id}
			})
		},
		search(){
			this.filters.strStoreId = util.Trim(this.filters.strStoreId)
			this.filters.strStoreName = util.Trim(this.filters.strStoreName)
			this.currentPage = 1
            this.pageIndex = '0'
			this.showList()
		},
		clearForm(formName){
			this.$refs[formName].resetFields()
			this.addrIds= []
			this.showList()
		},
		// 添加门店
	},
	mounted()  {
		this.init()
		this.showList()
	}
}
</script>