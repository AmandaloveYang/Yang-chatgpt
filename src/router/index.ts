import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/chat'
        },
        {
            path: '/chat',
            name: 'chat',
            component: () => import('@/views/Chat.vue')
        },
    ]
})

export default router