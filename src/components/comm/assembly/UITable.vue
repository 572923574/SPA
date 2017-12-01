<template>
  <div>
      <div>
            <table>
                    <thead>
                        <tr>
                            <th v-for="(head,key) in tableData.header" :key="key">{{head}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td v-for="(item,key) in tableData.body" :key="key">{{item}}</td>
                        </tr>
                    </tbody>
            </table>
      </div>
  </div>
</template>
<script>
export default {
  props:{
      tableData:{
          type:Array,
      }
  }
}
</script>

