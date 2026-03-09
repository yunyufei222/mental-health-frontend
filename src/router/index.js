import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/Register.vue'),
        meta: { requiresGuest: true }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'), // 简单仪表盘
        meta: { requiresAuth: true }
    },
    {
        path: '/',
        redirect: '/dashboard'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const isLoggedIn = userStore.isLoggedIn

    if (isLoggedIn && !userStore.userInfo) {
        await userStore.fetchUserInfo()
    }

    if (to.meta.requiresAuth && !isLoggedIn) {
        next('/login')
    } else if (to.meta.requiresGuest && isLoggedIn) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router