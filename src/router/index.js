import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
    // 原有登录注册路由...
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
        component: () => import('@/views/Dashboard.vue'),
        meta: { requiresAuth: true }
    },
    // 新增文章模块路由
    {
        path: '/articles',
        name: 'ArticleList',
        component: () => import('@/views/articles/ArticleList.vue'),
        meta: { requiresAuth: false }  // 允许未登录用户浏览文章
    },
    {
        path: '/articles/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/articles/ArticleDetail.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/',
        redirect: '/articles'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫（保持不变，但注意 requiresAuth 为 false 的页面允许未登录访问）
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const isLoggedIn = userStore.isLoggedIn

    if (isLoggedIn && !userStore.userInfo) {
        await userStore.fetchUserInfo()
    }

    if (to.meta.requiresAuth && !isLoggedIn) {
        next('/login')
    } else if (to.meta.requiresGuest && isLoggedIn) {
        next('/articles')
    } else {
        next()
    }
})

export default router