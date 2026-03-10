import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const request = axios.create({
    baseURL: '/api',  // 通过 Vite 代理转发
    timeout: 10000
})

// 请求拦截器：添加 token
request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

// 响应拦截器：处理错误
request.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    localStorage.removeItem('token')
                    router.push('/login')
                    ElMessage.error('登录已过期，请重新登录')
                    break
                case 403:
                    ElMessage.error('没有权限访问')
                    break
                case 500:
                    ElMessage.error('服务器错误')
                    break
                default:
                    ElMessage.error(error.response.data?.message || '请求失败')
            }
        } else {
            ElMessage.error('网络错误')
        }
        return Promise.reject(error)
    }
)

export default request

export function formatDate(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function formatTime(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${formatDate(dateStr)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}