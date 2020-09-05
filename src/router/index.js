import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Add from '../components/Add.vue'
// import Item from '../components/Item.vue'
import Home from '../components/Home.vue'
import Detail from '../components/Detail.vue'
import MyNews from '../components/MyNews.vue'
import Department from '../components/Department.vue'
import Notice from '../components/Notice.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/add',
    name: 'Add',
    component: Add
  },
  {
    path: '/detail',
    name: 'Detail',
    component: Detail
  },
  {
    path: '/myNews',
    name: 'MyNews',
    component: MyNews
  },
  {
    path: '/department',
    name: 'Department',
    component: Department
  },
  {
    path: '/author',
    name: 'Author',
    component: MyNews
  },
  {
    path: '/search',
    name: 'Search',
    component: MyNews
  },
  {
    path: '/notice',
    name: 'Notice',
    component: Notice
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
