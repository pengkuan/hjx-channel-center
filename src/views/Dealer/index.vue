<template>
<div>
	<hjx-header label="Dealer管理 / 列表">
        <router-link to="add"><el-button type="primary" size="small">创建Dealer</el-button></router-link>
    </hjx-header>
	<!--工具条-->
	<el-form :inline="true" :model="searchkeys" ref="searchkeys" label-position="top">
        <el-form-item label="区域：">
            <el-cascader :options="addrList" :props="selectAddrSetting" placeholder="请选择区域" v-model="addrIds" change-on-select></el-cascader>
        </el-form-item>
        <el-form-item prop="strStatus" label="状态：">
            <el-select v-model="searchkeys.strStatus" placeholder="请选择">
                <el-option label="全部" value=""></el-option>
                <el-option label="待审核" value="1"></el-option>
                <el-option label="资料不全" value="2"></el-option>
                <el-option label="合作中" value="3"></el-option>
                <el-option label="暂停合作" value="4"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop='strDealerName' label="公司全称：">
          	<el-input v-model="searchkeys.strDealerName" @keyup.13.native="search($event)" placeholder="请输入公司全称" style="min-width: 240px;"></el-input>
        </el-form-item>
        <el-form-item prop='strUserName' label="D4姓名：">
          	<el-input v-model="searchkeys.strUserName" @keyup.13.native="search($event)" placeholder="请输入D4姓名" style="min-width: 240px;"></el-input>
        </el-form-item>
        
        <el-form-item label="handle" class="hjx-search-handle">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="clearForm('searchkeys')">清空</el-button>
        </el-form-item>
    </el-form>
	<el-table :data="dataList" border style="width: 100% ; min-height:300px">
	    <el-table-column prop="strDealerId" label="ID" ></el-table-column>
	    <el-table-column prop="strDealerName" label="公司全称" ></el-table-column>
	    <el-table-column prop="strDealerName" label="地区" >
	    	<template slot-scope="scope">
	            {{scope.row.strProvinceName + scope.row.strCityName + scope.row.strAreaName }}
	        </template>
	    </el-table-column>
	    <el-table-column prop="strUserName" label="D4"></el-table-column>
	    <el-table-column prop="strContractEndTime" label="合同结束时间"></el-table-column>
	    <el-table-column  label="状态" >
	    	<template slot-scope="scope">
	    		<span v-if="scope.row.strStatus == '1' ">待审核</span>
	    		<span v-else-if="scope.row.strStatus == '2' ">资料不全</span>
	    		<span v-else-if="scope.row.strStatus == '3' ">合作中</span>
	    		<span v-else-if="scope.row.strStatus == '4' ">暂停合作</span>
	    	</template>
	    </el-table-column>
	    <el-table-column label="操作">
	        <template slot-scope="scope">
	        	<el-button class = 'indexFunBtn' type="text" @click="detailDealer(scope.row.strDealerId)"  size="small">详情</el-button>
	        	<el-button class = 'indexFunBtn' type="text" @click="editDealer(scope.row.strDealerId)"  size="small">编辑</el-button>
	        	<el-button class = 'indexFunBtn' type="text" @click="relateD4(scope.row.strDealerId , scope.row.strUserName)"  size="small">关联D4</el-button>
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
	    	addrIds:[],
	    	dataList:[],
	    	pageIndex:'0',
        	pageSize:'10',
        	currentPage:1,
        	total:0,
        	searchkeys:{
        		strStatus:'',
        		strDealerName:'',
        		strUserName:''
        	}
	        
	    }
	},
	computed:{
        ...mapGetters({
            addrList : 'commonData/adds',
            selectAddrSetting : 'commonData/selectAddrSetting'
        })
    },
	mounted()  {
		this.getAddress()
		this.showList()
	},

	methods:{
		...mapActions({
            getAddress: 'commonData/getAdds' 
        }),
		handleSizeChange(val) {
	        console.log(`每页 ${val} 条`);
	    },
	    handleCurrentChange(val) {
	    	this.pageIndex = (val- 1) * 10
	    	this.currentPage = val
	        this.showList()

	    },
	    changeEndTime:function(val){
	    	let endTimeArr = val.split(' ')
	    	let time = endTimeArr[0]+'T'+endTimeArr[1]+'.000Z'
	    	return util.formatDate.format(time , "yy-MM-dd")
	    },
		showList:function(){
			let [strProvinceId='', strCityId='', strAreaId=''] = this.addrIds
			this.searchkeys.strDealerName = util.Trim(this.searchkeys.strDealerName)
			this.searchkeys.strUserName = util.Trim(this.searchkeys.strUserName)
			let data ={
				'pageinfo':{
					'pageIndex':String(this.pageIndex),
					'pageSize':this.pageSize,
				},
				'searchkeys':Object.assign(this.searchkeys , {'strAddrProvinceId':strProvinceId,strAddrCityId:strCityId,strAddrAreaId:strAreaId})
			}
			api.getDealerList(data).then(res => {
				if (res.ret != '0') {
                    this.$message(res.retinfo)
                    return
                }
				let List = res.data.list
                for(var i in List){
                	List[i].strContractEndTime = this.changeEndTime(List[i].strContractEndTime)
                }
                this.dataList = List
				this.total = Number(res.data.nums)
			})
		},
		
		//跳至详情页面
		detailDealer:function(strDealerId){
			this.$router.push({
				name:'detailDealer',
				query:{id:strDealerId}
			})
		},
		//跳至编辑页面
		editDealer(strDealerId){
			this.$router.push({
				name:'editDealer',
				query:{id:strDealerId}
			})
		},
		//跳至添加下级页面
		relateD4(strDealerId , strUserName){
			var ifD4 = strUserName?true:false
			this.$router.push({
				name:'relateD4',
				query:{id:strDealerId , ifD4:ifD4}
			})
		},
		search(){
			this.currentPage = 1
            this.pageIndex = '0'
			this.showList()
		},
		clearForm(){
			this.$refs['searchkeys'].resetFields()
			this.addrIds = []
			this.showList()
		}
	}
}
</script>