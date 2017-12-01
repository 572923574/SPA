<template>
	<div style="height:100%">
	    <div class="empType">
	    	<div class="tabHead">一工位</div>
	    	<div class="tabBody">
				<div class="tabEmp">
					<div v-for="(emp,key) in showEmps[0]" class="emp" :key="key" @click="chooseEmp(emp)">
						<span>{{emp.no}}</span>
						<span>{{emp.name}}</span>
					</div>
				</div>
			</div>
	    </div>
	    <div class="empType">
	    	<div class="tabHead">二工位</div>
			<div class="tabBody">
				<div class="tabEmp">
					<div v-for="(emp,key) in showEmps[1]" class="emp" :key="key" @click="chooseEmp(emp)">
						<span>{{emp.no}}</span>
						<span>{{emp.name}}</span>
					</div>
				</div>
			</div>
	    </div>
	    <div class="empType">
	    	<div class="tabHead">三工位</div>
	    	<div class="tabBody">
				<div class="tabEmp">
					<div v-for="(emp,key) in showEmps[2]" class="emp" :key="key" @click="chooseEmp(emp)">
						<span>{{emp.no}}</span>
						<span>{{emp.name}}</span>
					</div>
				</div>
			</div>
	    </div>
	</div>
</template>
<script>
export default{
	name:'Emps',
	props:{
		emps:{
			type:Array,
		},
	},
	data(){
		return{
			showEmps:[],
		};
	},
	methods:{
		loadEmps(){
			this.showEmps=[];
			let empType1=[],
				empType2=[],
				empType3=[];

			for(let emp of this.emps){
				if(emp.gType == '1'){
					empType1.push(emp);
				}else if(emp.gType == '2'){
					empType2.push(emp);
				}else{
					empType3.push(emp);
				}
			}
			this.showEmps.push(empType1);
			this.showEmps.push(empType2);
			this.showEmps.push(empType3);
		},
		chooseEmp(emp){
			console.log(emp,"emp")
			this.$emit('chooseEmp',emp);
		}
	},
	created(){
		this.loadEmps();
		console.log(this.showEmps,"showEmps到此一游");
	},
}

</script>
<style scoped lang="less">
.body{
	height: 100%;
	position: relative;
	width: 100%;
    .empType{
    	float: left;
    	text-align: center;
		width: 33%;
		height: 100%;
		overflow: hidden;
    	.tabHead{
    		height: 10%;
    		border-bottom: 2px solid #dfe4ed;
    		line-height: 40px;
		}
		.tabBody{
			margin-top: 20px;
			height: 80%;
			white-space: nowrap;
			overflow-x: hidden;
			overflow-y: scroll;
		} 
		.tabBody::-webkit-scrollbar {
			display: none;
		}
    	.emp{
    		height: 36px;
    		margin: 2px;
    		background-color: #dfe4ed;
    		line-height: 36px;
    	}
    }
}
</style>