<template>
  <div id="app">
    <el-header class="header">
      <div class="logo">
        <router-link to="/">心理健康促进系统</router-link>
      </div>
      <div class="nav-links">
        <template v-for="item in visibleMenus" :key="item.path">
          <router-link :to="item.path">{{ item.name }}</router-link>
        </template>
      </div>
      <div class="user-area">
        <template v-if="userStore.isLoggedIn">
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              {{ userStore.userInfo?.nickname || userStore.userInfo?.username }}
              <el-icon><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="dashboard">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
        <template v-else>
          <el-button type="primary" size="small" @click="$router.push('/login')">登录</el-button>
          <el-button size="small" @click="$router.push('/register')">注册</el-button>
        </template>
      </div>
    </el-header>

    <el-main>
      <router-view />
    </el-main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import { MENU_ITEMS } from '@/constants/menu'

const router = useRouter()
const userStore = useUserStore()

// 根据用户角色过滤菜单
const visibleMenus = computed(() => {
  if (!userStore.isLoggedIn) {
    // 未登录用户只显示公开菜单（例如知识库、社区等）
    return MENU_ITEMS.filter(item => item.roles.includes('USER'))
  }
  const role = userStore.userInfo?.role
  if (role === 'ADMIN') return MENU_ITEMS.filter(item => item.roles.includes('ADMIN'))
  if (role === 'COUNSELOR') return MENU_ITEMS.filter(item => item.roles.includes('COUNSELOR'))
  return MENU_ITEMS.filter(item => item.roles.includes('USER'))
})

onMounted(() => {
  if (userStore.token && !userStore.userInfo) {
    userStore.fetchUserInfo()
  }
})

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } else if (command === 'dashboard') {
    router.push('/dashboard')
  }
}
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
}

.header {
  background-color: #409EFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.logo a {
  color: white;
  font-size: 20px;
  font-weight: bold;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 16px;
}

.nav-links a:hover {
  text-decoration: underline;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-dropdown {
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  gap: 5px;
}

.el-main {
  padding: 0;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}
</style>