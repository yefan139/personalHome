import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import Developing from '../views/Developing.vue'
import HomeCenter from '../views/homepage/HomeCenter.vue'
import Profile from '../views/homepage/Profile.vue'

const router = createRouter({
//   history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  routes: [
    // 将匹配所有内容并将其放在 `$route.params.pathMatch` 下
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
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
                path: 'journalList',
                component: Developing,
            },
            {
                path: 'email',
                component: Developing,
            },
            {
                path: 'message',
                component: Developing,
            },
            {
                path: 'like',
                component: Developing,
            },
            {
                path: 'profile',
                component: Developing,
            }
            
        ]
    },
    {
        path: '/raffle',
        name: 'raffle',
        component: () => import('../views/RaffleView.vue')
    },
      {
        path: '/raffle2',
        name: 'raffle2',
        component: () => import('../views/Raffle2View.vue')
    }
  ]
})

export default router
