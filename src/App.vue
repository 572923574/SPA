<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
#app,
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  overflow: auto;
  font-weight: 400;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  margin:0;
  padding:0;
  height:100%;
  .el-table td{
    padding: 0 0 !important;
    height: 30px;
  }
  .el-table th{
    padding: 2px 0 !important;
    height: 30px;
  }
}
#app,html,body {
    height: 100%;
    .ui-popup{
        z-index:100;
    }
}
</style>
