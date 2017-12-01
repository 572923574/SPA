import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/comm/Home'
import Cashier from '@/components/pages/cashier/Cashier'
import Finance from '@/components/pages/finance/Finance'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      children:[
        // {path:'/',component:Home},
        {path:'Cashier',component:Cashier},//收银台
        {path:'Finance',component:Finance},//财务
        {path:'Cashier',component:Cashier},//收银台
      ]
    }
  ]
})
