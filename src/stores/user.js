import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, getUserInfo } from '@/api/user'

export const useUserStore = defineStore('user', () => {
    const token = ref(localStorage.getItem('token') || '')
    const userInfo = ref(null)

    const isLoggedIn = computed(() => !!token.value)

    function setToken(newToken) {
        token.value = newToken
        localStorage.setItem('token', newToken)
    }

    function logout() {
        token.value = ''
        userInfo.value = null
        localStorage.removeItem('token')
    }

    async function login(credentials) {
        const res = await apiLogin(credentials)
        setToken(res.data.token)
        userInfo.value = {
            username: res.data.username,
            role: res.data.role,
            nickname: res.data.nickname,
            avatar: res.data.avatar
        }
        return res
    }

    async function register(userData) {
        const res = await apiRegister(userData)
        setToken(res.data.token)
        userInfo.value = {
            username: res.data.username,
            role: res.data.role,
            nickname: res.data.nickname,
            avatar: res.data.avatar
        }
        return res
    }

    async function fetchUserInfo() {
        if (!token.value) return null
        try {
            const res = await getUserInfo()
            userInfo.value = res.data
            return res.data
        } catch (error) {
            logout()
            return null
        }
    }

    return { token, userInfo, isLoggedIn, login, register, logout, fetchUserInfo }
})