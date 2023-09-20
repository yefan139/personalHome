import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HomeCenter from '../views/homepage/homeCenter.vue'
import Profile from '../views/homepage/Profile.vue'

const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/home'},
    {
        name: 'home',
        path: '/home',
        redirect: '/home/homeCenter',
        component: HomeView,
        children: [
            {
                path: 'homeCenter',
                component: HomeCenter,
            },
            {
                path: 'profile',
                component: Profile,
            }
        ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
        path: '/raffle',
        name: 'raffle',
        component: () => import('../views/RaffleView.vue')
    }
  ]
})

export default router
