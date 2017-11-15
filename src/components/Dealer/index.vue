<template>
<div>
	<div class="title">Dealer列表</div>
	
	<!--工具条-->
    <el-form :model="filters" ref='filters' class = 'searchTool' style='overflow:hidden'>
    	<el-row :gutter="20">
    		<el-col :span="3">
	    		<p class='searchTitle'>状态：</p>
		    	<el-form-item prop='strStatus' >
		            <el-select v-model="filters.strStatus" placeholder="请选择" >
		            	<el-option label="全部" value=""></el-option>
		                <el-option label="待审核" value="1"></el-option>
		                <el-option label="资料不全" value="2"></el-option>
		                <el-option label="合作中" value="3"></el-option>
		                <el-option label="暂停合作" value="4"></el-option>
		            </el-select>
		        </el-form-item>
		    </el-col>
		    <el-col :span="4">
		    	<p class='searchTitle'>公司全称：</p>
		        <el-form-item prop='strDealerName' >
		          	<el-input v-model="filters.strDealerName" @keyup.13.native="search($event)" placeholder="请输入公司全称" style="min-width: 240px;"></el-input>
		        </el-form-item>
	        </el-col>

	        <el-col :span="4">
	        	<p class='searchTitle'>D4姓名：</p>
		        <el-form-item prop='strUserName' >
		          	<el-input v-model="filters.strUserName" @keyup.13.native="search($event)" placeholder="请输入D4姓名" style="min-width: 240px;"></el-input>
		        </el-form-item>
	        </el-col>
	        <el-col :span="9">
	        	<p class='searchTitle'>地址区域：</p>
	        	<el-col :span='8'>
	        		<el-form-item prop='strAddrProvinceId'>
		                <el-select v-model="filters.strAddrProvinceId" filterable placeholder="请选择省份">
		                    <el-option  v-for="item in searchAddr.provinces"  :label="item.strProvinceName"  :value="item.strProvinceId" :key="item.strProvinceId">
		                    </el-option>
		                </el-select>
		            </el-form-item>
	        	</el-col>

	        	<el-col :span='8'>
	        		<el-form-item prop='strAddrCityId'>
		                <el-select v-model="filters.strAddrCityId" filterable placeholder="请选择城市">
		                    <el-option  v-for="item in searchAddr.citys"  :label="item.strCityName"  :value="item.strCityId" :key="item.strCityId">
		                    </el-option>
		                </el-select>
		            </el-form-item>
	        	</el-col>

	        	<el-col :span='8'>
	        		<el-form-item prop='strAddrAreaId'>
		                <el-select v-model="filters.strAddrAreaId" filterable placeholder="请选择区县">
		                    <el-option  v-for="item in searchAddr.areas"  :label="item.strAreaName"  :value="item.strAreaId" :key="item.strAreaId">
		                    </el-option>
		                </el-select>
		            </el-form-item>
	        	</el-col>
	            
	        </el-col>

		    <el-col :span="4">
		    	<p class='searchTitle'>&nbsp;</p>
		    	<el-form-item class='textRight' >
	          		<el-button @click="search">搜索</el-button>
	          		<el-button @click="clearForm('filters')">清空</el-button>
	          	</el-form-item>
		    </el-col>
    	</el-row>
    	
    </el-form>
    
    <div class="tool">
    	<router-link to="add"><el-button type="primary" size="small">创建Dealer</el-button></router-link>
    </div>
	<el-table
	    :data="dataList"
	    border
	    style="width: 100% ; min-height:300px">
	    <el-table-column prop="strDealerId" label="ID" >
	    	
	    </el-table-column>
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
	    <el-table-column
	        label="操作"
	        >
	        <template slot-scope="scope">
	        	<el-button class = 'indexFunBtn' type="primary" @click="detailDealer(scope.row.strDealerId)"  size="small">详情</el-button>
	        	<el-button class = 'indexFunBtn' type="primary" @click="editDealer(scope.row.strDealerId)"  size="small">编辑</el-button>
	        	<el-button class = 'indexFunBtn' type="primary" @click="relateD4(scope.row.strDealerId , scope.row.strUserName)"  size="small">关联D4</el-button>
	        	
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
import commonData from '../../common/data'
export default {
	data() {
	    return {
	    	searchAddr:{provinces:commonData.addrList},
	    	dataList:[],
	    	pageIndex:'0',
        	pageSize:'10',
        	currentPage:1,
        	total:0,
        	filters:{
        		strStatus:'',
        		strDealerName:'',
        		strUserName:'',
        		strAddrProvinceId:'',
        		strAddrCityId:'',
        		strAddrAreaId:''
        	}
	        
	    }
	},
	watch:{
		'filters.strAddrProvinceId': function(val, oldVal) {
            this.filters.strAddrCityId = ''
            util.getCitys(val , this.searchAddr)
        },
        'filters.strAddrCityId': function(val) {
        	this.filters.strAddrAreaId = ''
            util.getAreas(val, this.searchAddr)
        }
	},
	mounted()  {
		this.showList()
		this.searchInfo()
	},

	methods:{
		handleSizeChange(val) {
	        console.log(`每页 ${val} 条`);
	    },
	    handleCurrentChange(val) {
	    	this.pageIndex = (val- 1) * 10
	        this.showList()

	    },
	    changeEndTime:function(val){
	    	let endTimeArr = val.split(' ')
	    	let time = endTimeArr[0]+'T'+endTimeArr[1]+'.000Z'
	    	return util.formatDate.format(time , "yy-MM-dd")
	    },
		showList:function(){
			this.filters.strDealerName = util.Trim(this.filters.strDealerName)
			this.filters.strUserName = util.Trim(this.filters.strUserName)
			let data ={
				'pageinfo':{
					'pageIndex':String(this.pageIndex),
					'pageSize':this.pageSize,
				},
				'searchkeys':this.filters
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
		searchInfo(){
            if(commonData.addrList.length == 0){
                api.getAddress({}).then(res => {
                    if (res.ret != '0') {
                        this.$layer.alert(res.retinfo)
                        return
                    }
                    commonData.addrList = res.data.address
                    this.searchAddr.provinces = res.data.address
                })
            }
		},
		//跳至详情页面
		detailDealer:function(strDealerId){
			this.$router.push({
				name:'detailDealer',
				query:{id:strDealerId}
			})
		},
		//跳至编辑页面
		editDealer:function(strDealerId){
			this.$router.push({
				name:'editDealer',
				query:{id:strDealerId}
			})
		},
		//跳至添加下级页面
		relateD4:function(strDealerId , strUserName){
			var ifD4 = strUserName?true:false
			this.$router.push({
				name:'relateD4',
				query:{id:strDealerId , ifD4:ifD4}
			})
		},
		
		//search
		search:function(){
			this.showList()
		},
		clearForm(){
			this.$refs['filters'].resetFields()
			// this.filters.strAddrProvinceId = ''
			this.showList()
		}
	}
	


}
</script>