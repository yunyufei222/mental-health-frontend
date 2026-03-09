<template>
  <div>
    <h1>欢迎，{{ userStore.userInfo?.nickname || userStore.userInfo?.username }}</h1>
    <el-button @click="logout">退出登录</el-button>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const logout = () => {
  userStore.logout()
  router.push('/login')
}
</script>