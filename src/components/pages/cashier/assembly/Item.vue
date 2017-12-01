<template>
	
        <el-tabs v-model="bindModel">
            <el-tab-pane :label="type.name" :name="type.no" v-for="(type,key) in showItems" :key="key" v-if="type.items.length">
                <div class="">
                    <el-card class="card" :body-style="{ padding: '0px' }" v-for="(item,i) in type.items" :key="i">
                        <div style="width:100%;height:100%"  @click="chooseItem(item)">
							<img :src="item.img" class="image"  >
							<div>
								<div class="txt" :title="item.name">{{item.name}}</div>
								<div :title="item.price">￥<span class="red">{{item.price}}</span>元</div>
							</div>
						</div>
                    </el-card>
                </div>
            </el-tab-pane>
            
        </el-tabs>
    </div>
</template>
<script>
export default{
	name:'Item',
	props:{
		ItemTypes:{
			type:Array,
		},
		Items:{
			type:Array,
		},
	},
	data(){
		return{
			showItems:[],
			bindModel:null,
		};
	},
	methods:{
		loadItems(){
			let commonType = {
				items:[],
				name:"常用",
				no:"common",
			};
			this.showItems=[];
			for(let item of this.Items){
				if(item.common == '1'){
					commonType.items.push(item);
				}
			}
			if(commonType.items.length){
				this.showItems.push(commonType);
			}
			for(let type of this.ItemTypes){
				let object = type;

				object.items = [];
				for(let item of this.Items){
					if(type.no == item.typeNo){
						object.items.push(item);
					}
				}
				if(object.items.length){
					this.showItems.push(object);
				}
			}
			this.bindModel = this.showItems[0].no;
		},
		chooseItem(item){
			console.log(item,"有些啥")
			this.$emit('chooseItem',item);
		},
	},
	created(){
	
		this.loadItems();
		console.log(this.showItems,"到此一游");
	},
}

</script>
<style scoped lang="less">

    img{
        width: 66px;
        height: 66px;
    }
    .card{
        width:100px;
        padding:0 !important;
        text-align:center;
        font-size:14px;
        display: inline-block;
        margin: 5px;
        .txt{
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
        }
        .red{
            color: red;
        }
    }

</style>