/*eslint-disable*/
import Vue from 'vue'
import VueRouter from 'vue-router'
import Gallery from '../views/Gallery.vue'
import WatchHistory from '../views/WatchHistory.vue'
import Home from '../views/Home.vue'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/gallery',
        name: 'Gallery',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import( /* webpackChunkName: "about" */ '../views/Gallery.vue')
    },
    {
        path: '/watched',
        name: 'WatchHistory',
        component: WatchHistory
    }
]

const router = new VueRouter({
    routes
})

export default router