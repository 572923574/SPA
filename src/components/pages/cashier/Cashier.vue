<template>
    <div class="body">
        <div class="leftContainer">
            <Item :ItemTypes="ItemTypes" :Items="Items" v-on:chooseItem="chooseItem"></Item>
        </div>
        <div class="leftShade" v-if="leftShade"></div>
        <div class="rightContainer">
            <div class="topMain">
                <div class="leftEmps">
                    <Emps :emps="emps" v-on:chooseEmp="chooseEmp"></Emps>
                </div>
                <div class="rightMember">
                    <div class="queryDiv">
                        <div class="inputKey">
                            <el-input placeholder="车牌/手机/姓名/拼音/卡号,查询会员" prefix-icon="el-icon-search"
                            select-when-unmatched @select="queryMember" v-model="key">
                            </el-input>
                        </div>
                        <div class="queryBtn">
                            <el-button type="primary" @click="queryMember" v-popover:popover4>查询会员</el-button>
                        </div>
                    </div>
                    <div class="memberDiv" v-show="showMemInfo">
                        <div class="txtLine">
                            <div class="txt"><i class="el-icon-service"></i><span>{{member.name}}</span></div>
                            <div class="txt"><i class="el-icon-mobile-phone"></i><span>{{member.mobile}}</span></div>
                            <div class="txt"><i class="el-icon-bell"></i><span>{{member.plateNumber}}</span></div>
                        </div>
                        <div class="txtLine">
                            <div class="txt">
                                <span>卡金：{{member.cardFee}}元</span>
                            </div>
                            <div class="txt">
                                <span>赠金：{{member.presentFee}}元</span>
                            </div>
                        </div>
                        <div v-if="member.itemPackages.length>0" @click="chooseMember(member)">
                            <el-table :data="member.itemPackages" border >
                                <el-table-column prop="itemName" min-width="130" label="套餐" ></el-table-column>
                                <el-table-column prop="remainingTimes" min-width="50" label="次数" ></el-table-column>
                                <el-table-column prop="sunTimes" min-width="60" label="总次数" ></el-table-column>
                                <el-table-column prop="onceMoney" min-width="60" label="单价" ></el-table-column>
                                <el-table-column prop="validDate" min-width="90" label="失效日期"> </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div v-show="showMemList"  class="memberListClass">
                        <el-table  v-show="showMemList" :data="members" style="width: 100%" height="270" 
                        @row-click="chooseMember" ref="memberListTable" border>
                            <el-table-column property="name" min-width="90" label="姓名"></el-table-column>
                            <el-table-column property="mobile" min-width="110" label="手机号码"></el-table-column>
                            <el-table-column property="brand" min-width="90" label="品牌"></el-table-column>
                            <el-table-column property="plateNumber" min-width="100" label="车牌"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
            <div class="bottomMain">
                <div class="billDiv">
                    <div class="billTitle">单据</div>
                    <!-- <div> -->
                        <el-table :data="details"  ref="detailsTable" highlight-current-row show-summary @row-click="detailChange"
                        :summary-method="getSummaries" style="width: 100%" border height="270">
                            <el-table-column prop="itemName" label="项目" min-width="100">
                                <template slot-scope="scope">
                                    <span class="txt" :title="scope.row.itemName">{{scope.row.itemName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="rawPrice" label="原价" min-width="60"></el-table-column>
                            <el-table-column prop="price" label="实价" min-width="60" class-name="inputCell">
                                <template slot-scope="scope">
                                    <el-input v-model.number="scope.row.price" :disabled="scope.row.priceDisabled"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column label="一工位" min-width="80">
                                <template slot-scope="scope">
                                    <span v-for="(emp,i) in scope.row.emps" :key="i" v-if="emp.gType=='1'">
                                        <span>{{emp.no}}</span>{{ emp.name }}
                                        </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="二工位" min-width="80">
                                <template slot-scope="scope">
                                    <span v-for="(emp,i) in scope.row.emps" :key="i" v-if="emp.gType=='2'">
                                        <span>{{emp.no}}</span>{{ emp.name }}
                                        </span>
                                </template>
                            </el-table-column>
                            <el-table-column label="三工位" min-width="80">
                                <template slot-scope="scope">
                                    <span v-for="(emp,i) in scope.row.emps" :key="i" v-if="emp.gType=='3'">
                                        <span>{{emp.no}}</span>{{ emp.name }}
                                        </span>
                                </template>
                            </el-table-column>
                            <el-table-column  label="操作" min-width="80"> 
                                <template slot-scope="scope">
                                    <el-button @click.native.prevent="deleteRow(scope.$index, details)" type="text" size="medium">
                                        移除
                                    </el-button>
                                    <el-button v-if="scope.row.priceDisabled" @click.native.prevent="itemPriceDiscount(scope.row, false)" type="text" size="medium">
                                        不用套餐
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    <!-- </div> -->
                </div>
                <div class="footDiv">
                    <el-button type="warning" class="footBtn" :disabled="details.length ==0">挂单</el-button>
                    <el-button type="primary" class="footBtn">取单</el-button>
                    <el-button type="success" class="footBtn" :disabled="details.length ==0" @click="checkOut">结账</el-button>
                </div>
            </div>
        </div>
        <el-dialog title="提示" :visible.sync="checkOutDialog" :before-close="handleClose" center 
        :modal-append-to-body="false" append-to-body custom-class="checkOutDialog">
            <span>需要注意的是内容是默认不居中的</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="warning" @click="handleClose" >取消结算</el-button>
                <el-button type="success" @click="checkOutDialog = false" class="checkOutBtn">确定结算</el-button>
            </span>
        </el-dialog>
    </div>
   
</template>
<script>
import Item from '@/components/pages/cashier/assembly/Item'
import Emps from '@/components/pages/cashier/assembly/Emps'
export default {
    name: 'Home',
    components:{
        Item,
        Emps,
    },
    data () {
        return {
            key:null,
            bindModel:'first',
            ItemTypes:[{name:'洗车',no:'1'},{name:'钣金',no:'2'},{name:'喷漆',no:'3'},],
            Items:[{
                img:"http://img.baidu.com/img/iknow/avarta/66/r6s1g3.gif",
                name:'纳米高科技无泡洗车',
                price:'1399.00',
                typeNo:'1',
                type:'1',
                id:1,
            },{
                img:"http://img.baidu.com/img/iknow/avarta/66/r6s1g3.gif",
                name:'急速修补轮胎超',
                price:'88.00',
                typeNo:'1',
                type:'1',
                id:2,
            },{
                img:"http://img.baidu.com/img/iknow/avarta/66/r6s1g3.gif",
                name:'抛光',
                price:'1099.00',
                typeNo:'1',
                type:'1',
                id:3,
            },{
                img:"http://img.baidu.com/img/iknow/avarta/66/r6s1g3.gif",
                name:'打蜡',
                price:'1399.00',
                typeNo:'1',
                type:'1',
                id:4,
            },{
                img:"http://img.baidu.com/img/iknow/avarta/66/r6s1g3.gif",
                name:'原装喷漆',
                price:'2965.00',
                typeNo:'3',
                type:'1',
                id:5,
            },{
                img:"http://img.baidu.com/img/iknow/avarta/66/r6s1g3.gif",
                name:'保险杠修复',
                price:'888.00',
                typeNo:'2',
                type:'1',
                id:6,
            }],
            emps:[{
                no:"801",
                name:'王大锤',
                gType:'1',
            },{
                no:"802",
                name:'报告老板',
                gType:'1',
            },{
                no:"601",
                name:'大鹏',
                gType:'2',
            },{
                no:"602",
                name:'屌丝女士',
                gType:'2',
            },{
                no:"999",
                name:'性感女神',
                gType:'3',
            },{
                no:"801",
                name:'王大锤',
                gType:'1',
            },{
                no:"802",
                name:'报告老板',
                gType:'1',
            },{
                no:"601",
                name:'大鹏',
                gType:'2',
            },{
                no:"602",
                name:'屌丝女士',
                gType:'2',
            },{
                no:"999",
                name:'性感女神',
                gType:'3',
            },{
                no:"801",
                name:'王大锤',
                gType:'1',
            },{
                no:"802",
                name:'报告老板',
                gType:'1',
            },{
                no:"601",
                name:'大鹏',
                gType:'2',
            },{
                no:"602",
                name:'屌丝女士',
                gType:'2',
            },{
                no:"999",
                name:'凤姐',
                gType:'3',
            },{
                no:"801",
                name:'王大锤',
                gType:'1',
            },{
                no:"802",
                name:'报告老板',
                gType:'1',
            },{
                no:"601",
                name:'大鹏',
                gType:'2',
            },{
                no:"602",
                name:'屌丝女士',
                gType:'2',
            },{
                no:"999",
                name:'凤姐',
                gType:'3',
            },{
                no:"801",
                name:'王大锤',
                gType:'1',
            },{
                no:"802",
                name:'报告老板',
                gType:'1',
            },{
                no:"601",
                name:'大鹏',
                gType:'2',
            },{
                no:"602",
                name:'屌丝女士',
                gType:'2',
            },{
                no:"999",
                name:'性感女神',
                gType:'3',
            },{
                no:"801",
                name:'王大锤',
                gType:'1',
            },{
                no:"802",
                name:'报告老板',
                gType:'1',
            },{
                no:"601",
                name:'大鹏',
                gType:'2',
            },{
                no:"602",
                name:'屌丝女士',
                gType:'2',
            },{
                no:"999",
                name:'白娘子',
                gType:'3',
            },],
            members:[{
                id:1,
                name:"李建",
                pinYin:"LJ",
                mobile:"18682028219",
                sex:'M',
                cardFee:1800,
                presentFee:200,
                point:2000,
                plateNumber:'粤L7Z053',
                brand:'现代',
                discount:8,
                itemPackages:[{
                    itemId:1,
                    itemName:"纳米高科技无泡洗车",
                    remainingTimes:907,
                    sunTimes:999,
                    onceMoney:19899,
                    validDate:'2018-02-10',
                }],
            },{
                id:2,
                name:"李建1",
                pinYin:"LJ1",
                mobile:"18682028219",
                sex:'M',
                cardFee:1800,
                presentFee:200,
                point:2000,
                plateNumber:'粤B7Z053',
                brand:'奔驰',
                discount:5,
                 itemPackages:[],
            }],
            member:{
                id:0,
                itemPackages:[],
                cardTypeId:0,
                discount:10,
                name:"",
                pinYin:"",
                mobile:"",
                sex:'M',
                cardFee:0,
                presentFee:0,
                point:0,
                plateNumber:'',
                brand:'',
            },
            details:[],
            detail:null,
            detailIndex:-1,
            showMemList:false,//是否显示查询出的会员列表
            showMemInfo:false,//是否显示会员信息
            carddiscList:[],//卡级折扣会员价
            checkOutDialog:false,//显示结账收钱页面
            leftShade:false,//选择项目阴影
        }
    },
    methods: {
        handleClick(path) {
        },
        /**
         * 移除选中项目
         */
        deleteRow(index, rows) {
            rows.splice(index, 1);
        },
        //选择消费项目
        chooseItem(item){
            let detail={
                itemId: item.id,
                itemNo: item.no,
                typeNo: item.typeNo,
                itemName: item.name,
                rawPrice: item.price,
                price: item.price,
                btype: "1",
                ctype: "1",
                emps:[],
                priceDisabled:false,
            }
            if(this.member.id){
                detail = this.itemPriceDiscount(detail,true);
            }
            this.detail= detail;
            this.details.push(detail);
            this.detailIndex = this.details.indexOf(detail);
            this.leftShade=true;
        },
        //表单中选择项目
        detailChange(row,event,column){
            this.detailIndex = this.details.indexOf(row);
            console.log(this.details.indexOf(row),"val");
            this.detail = row;
        },
        //选择员工
        chooseEmp(emp){
            if(!this.detail ||this.detailIndex == -1){
                this.$message({
                    message: '请先选择项目，再选择员工',
                    type: 'warning'
                });
                return;
            }
            let empBoolean = true
            for(let i in this.detail.emps){
                let staff = this.detail.emps[i];
                if(emp.gType == staff.gType){
                    this.detail.emps.splice(i, 1,emp);
                    empBoolean = false;
                }
            }
            if(empBoolean){
                this.detail.emps.push(emp);
            }
            this.details.splice(this.detailIndex, 1,this.detail);
            this.leftShade = false;
        },
        queryMember(){
            if(!this.key){
                this.$message({
                    message: '请输入会员查询信息',
                    type: 'warning'
                });
                return;
            }
            this.showMemInfo= false;
            this.showMemList=true;
        },
        //选择消费的会员
        chooseMember(member){
            this.member = member;
            this.showMemList=false;
            this.showMemInfo=true;
            for(let detail of this.details){
                detail= this.itemPriceDiscount(detail,true);
            }
        },
        //获取合计消费金额
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '总价';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[index] = values.reduce((prev, curr) => {
                        const value = Number(curr);
                        if (!isNaN(value)) {
                        return prev + curr;
                        } else {
                        return prev;
                        }
                    }, 0);
                    sums[index] += ' 元';
                    } else {
                    sums[index] = '';
                }
            });
            return sums;
        },
        //计算项目实际价格
        itemPriceDiscount(detail,bool){
            //bool是否使用套餐,默认使用
            for(let itemPackage of this.member.itemPackages){
                if(itemPackage.itemId == detail.itemId){
                    if(bool){
                        detail.price = itemPackage.onceMoney;
                        detail.priceDisabled = true;
                        itemPackage.remainingTimes--;
                        return detail;
                    }else{
                        detail.priceDisabled = false;
                        itemPackage.remainingTimes++;
                    }
                }
            }
            for(let carddisc of this.carddiscList ){
                if(carddisc.itemId == detail.itemId && (carddisc.cardTypeId == this.member.cardTypeId || carddisc.cardTypeId =='ALL')){
                    if(carddisc.way =='1'){
                        detail.price = carddisc.disc;
                    }else{
                        detail.price = (carddisc.disc*detail.rawPrice/10).toFixed(0);
                    }
                    return detail;
                }
            }
            if(this.member.discount){
                detail.price = (this.member.discount*detail.rawPrice/10).toFixed(0);
            }else{
                detail.price = detail.rawPrice.toFixed(0);
            }
            return detail;
        },
        checkOut(){
            this.checkOutDialog=true;
        },
        //关闭结账弹窗
        handleClose(done){
            this.$confirm('放弃结算，确认关闭弹窗？',{
                confirmButtonText: '确定放弃',
                cancelButtonText: '继续结算',
                cancelButtonClass:'cancelClass',
                confirmButtonClass:'confimClass'
            })
            .then(_ => {
                console.log(done,"done")
                this.checkOutDialog = false;
            })
            .catch(_ => {});
        }
    },
    mounted(){
        console.log(this.$refs,"快进来");
    }
}
</script>
<style scoped lang="less">
    .body{
        .leftContainer{
            margin-right: 0.4%;
            padding: 0 0.5%;
            width: 32.7%;
            height: 100%;
            float: left;
            background-color: #fff;
        }
        .leftShade{
            position: fixed;
            z-index: 2001;
            top: 0;
            left:0;
            width:calc(~'((100% - 85px) -10px) * 0.338 + 90px');
            height: 100%;
            opacity: .2;
            background: #000;
        }
        .center{
            margin-right: 0.4%;
        }
        .rightContainer{
            float: left;
            width: 65.9%;
            height: 100%;
            background-color: #fff;
            .topMain{
                height: 50%;
                background-color: #E0E0E0;
                padding-bottom: 0.5%;
                .leftEmps{
                    width: 49.5%;
                    margin-right: 0.5%;
                    float: left;
                    height: 100%;
                    background-color: #fff;
                }   
                .rightMember{
                    width: 50%;
                    float: left;
                    height: 100%;
                    background-color: #fff;
                    .queryDiv{
                        padding: 2.5% 1%;
                        .inputKey{
                            width: 72%;
                            display: inline-block;
                        }
                        .queryBtn{
                            width: 27%;
                            display: inline-block;
                            text-align: center;
                        }
                    }
                    .memberDiv{
                        background-color: red;
                        .txtLine{
                            padding: 5px;
                            .txt{
                                width: 32%;
                                text-align: left;
                                display: inline-block;
                                white-space:nowrap;
                                overflow:hidden;
                                text-overflow:ellipsis;
                            }
                        }
                    }
                    .memberListClass{
                        width: 100%;
                        min-height: 200px;
                        max-height: 80%;
                        overflow: hidden;
                        .el-table{
                            overflow: scroll;
                            height: 270px !important;
                        }
                    }
                }
            }
            .bottomMain{
                height: 50%;
                .billDiv{
                    overflow: hidden;
                    background-color: green;
                    .billTitle{
                        font-size: 18px;
                        font-weight: bold;
                        padding: 6px 15px;
                    }
                    .txt{
                        white-space:nowrap;
                        overflow:hidden;
                        text-overflow:ellipsis;
                    }
                    .inputCell{
                        padding: 0 !important;
                        .el-input{
                            .el-input__inner{
                                padding: 0 !important;
                                border:none;
                            }
                        }
                    }
                }
                .footDiv{
                    // background-color: yellow;
                    text-align: center;
                    padding: 10px 30px;
                    .footBtn{
                        width: 25%;
                    }
                }
            }
        }
        .Container{
            width: 32.7%;
            height: 100%;
            float: left;
            background-color: #fff;
        }
        .checkOutDialog{
            .checkOutBtn{
                margin-left: 58.9% !important;
            }
        }
        
    }
</style>
<style lang="less">
.inputCell{
    padding: 0 !important;
    .cell{
        padding: 0 !important;
        .el-input{
            .el-input__inner{
                height: 30px;
                border:none;
            }
        }
        
    }
}
.el-button--medium{
    color:#eb9e05 !important;
    padding: 0 !important;
}
.current-row td{
    background-color: #409EFF !important;
    color:#fff !important;
}
.cancelClass{
    background-color: #409EFF !important;
    border-color:#409EFF;
    color: #fff !important;     
}
.confimClass{
    background-color: #fa5555 !important;
    border-color:#fa5555;
    color: #fff !important;
    margin-left:58.9% !important;
}
.checkOutBtn{
    margin-left: 58.9% !important;
}
</style>
