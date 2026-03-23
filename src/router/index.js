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
        path: '/tools/gratitude',
        name: 'GratitudeEdit',
        component: () => import('@/views/tools/GratitudeEdit.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/tools/gratitude/history',
        name: 'GratitudeHistory',
        component: () => import('@/views/tools/GratitudeHistory.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/admin/scales',
        name: 'ScaleList',
        component: () => import('@/views/admin/ScaleList.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/scales/create',
        name: 'ScaleCreate',
        component: () => import('@/views/admin/ScaleEdit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/scales/edit/:id',
        name: 'ScaleEdit',
        component: () => import('@/views/admin/ScaleEdit.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/admin/scales/:id/questions',
        name: 'QuestionManage',
        component: () => import('@/views/admin/QuestionManage.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
        path: '/assessment',
        name: 'AssessmentList',
        component: () => import('@/views/assessment/ScaleList.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/assessment/:id',
        name: 'Assessment',
        component: () => import('@/views/assessment/Assessment.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/assessment/result/:id',
        name: 'AssessmentResult',
        component: () => import('@/views/assessment/Result.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/assessment/history',
        name: 'AssessmentHistory',
        component: () => import('@/views/assessment/History.vue'),
        meta: { requiresAuth: true }
    },
    // 社区模块
    {
        path: '/community',
        name: 'Community',
        component: () => import('@/views/community/PostList.vue'),
        meta: { requiresAuth: false } // 允许未登录用户浏览
    },
    {
        path: '/community/post/:id',
        name: 'PostDetail',
        component: () => import('@/views/community/PostDetail.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/community/create',
        name: 'CreatePost',
        component: () => import('@/views/community/PostEdit.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/community/edit/:id',
        name: 'EditPost',
        component: () => import('@/views/community/PostEdit.vue'),
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