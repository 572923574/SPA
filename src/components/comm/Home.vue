<template>
    <div class="body">
        <!-- <el-header>  
            <div class="shopLogo">这是未来的头部</div>
        </el-header> -->
        <el-container class="container">
            <el-aside class="leftAside">
                <el-menu class="menus"
                    :router="true"
                    default-active="Cashier"
                    @select="handleSelect"
                    background-color="#545c64"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item :index="menu.path" v-for="(menu,key) in menus" :key="key">
                        <i :class="menu.icon"></i>
                        <span slot="title">{{menu.title}}</span>
                    </el-menu-item>
                </el-menu>
                
            </el-aside>
            <el-main class="main">
                <router-view/>
            </el-main>
        </el-container>
    </div>
</template>

<script>

export default {
    name: 'Home',
    data () {
        return {
            menus:[{
                title: '收银',
                icon: 'el-icon-menu',
                path: 'Cashier',
                code: 'M1'
            },{
                title: '财务',
                icon: 'el-icon-setting',
                path: 'Finance',
                code: 'M2'
            }]
        }
    },
  methods: {
    handleSelect(path) {
        // this.$router.push(this.menus[index].path);
     
    },
  },
}
</script>
<style scoped lang="less">
.body{
    height:100%;
    width:100%;
    .el-header{
        background-color: rgb(84, 92, 100);
        color:#fff;
        .shopLogo{
            line-height:60px;
            text-align:center;
            background-color: rgb(84, 92, 100);
        }
    }
    .container{
        position:fixed;
        bottom:0;
        top:0;
        left:0;
        right:0;
        .leftAside{
            width:85px !important;
            max-width: 100px;
            .menus{
                height:100%;
                .el-menu-item{
                    width: 100% !important;
                    margin: 0  !important;
                    padding: 0 !important;
                    text-align: center;
                    i{
                        margin-right:0 !important; 
                    }
                }
            }
        }
        .main{
            background-color: #E0E0E0;
            padding: 5px !important;
        }
        
    }
    
}


</style>
