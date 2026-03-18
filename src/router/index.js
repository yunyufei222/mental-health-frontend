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
        component: () => import('@/views/Dashboard.vue'),
        meta: { requiresAuth: true }
    },
    // 文章模块
    {
        path: '/articles',
        name: 'ArticleList',
        component: () => import('@/views/articles/ArticleList.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/articles/:id',
        name: 'ArticleDetail',
        component: () => import('@/views/articles/ArticleDetail.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/user/reads',
        name: 'ReadHistory',
        component: () => import('@/views/user/ReadHistory.vue'),
        meta: { requiresAuth: true }
    },
    // 管理员文章管理
    {
        path: '/admin/articles/create',
        name: 'ArticleCreate',
        component: () => import('@/views/admin/ArticleEdit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/articles/edit/:id',
        name: 'ArticleEdit',
        component: () => import('@/views/admin/ArticleEdit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
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

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()
    const isLoggedIn = userStore.isLoggedIn

    // 如果已登录但未加载用户信息，尝试加载
    if (isLoggedIn && !userStore.userInfo) {
        await userStore.fetchUserInfo()
    }

    // 需要登录但未登录 -> 跳转登录
    if (to.meta.requiresAuth && !isLoggedIn) {
        next('/login')
        return
    }

    // 需要管理员但非管理员 -> 跳转首页
    if (to.meta.requiresAdmin && !userStore.isAdmin) {
        next('/articles')
        return
    }

    // 需要未登录但已登录 -> 跳转首页
    if (to.meta.requiresGuest && isLoggedIn) {
        next('/articles')
        return
    }

    next()
})

export default router