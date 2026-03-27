<template>
  <div id="app">
    <!-- 导航栏 -->
    <el-header class="header">
      <div class="logo">
        <router-link to="/">心理健康促进系统</router-link>
      </div>
      <div class="nav-links">
        <router-link to="/articles">知识库</router-link>
        <router-link to="/user/reads">学习记录</router-link>
        <router-link to="/tools/gratitude">感恩日记</router-link>
        <router-link to="/tools/gratitude/history">日记历史</router-link>
        <router-link to="/assessment">测评中心</router-link>
        <router-link to="/admin/scales">量表管理</router-link>
        <router-link to="/community">社区</router-link>
        <router-link to="/appointment/counselors">咨询预约</router-link>
        <router-link v-if="userStore.isLoggedIn" to="/appointment/my">我的预约</router-link>
        <router-link to="/admin/appointments">预约管理</router-link>
        <router-link to="/assessment/history">测评历史</router-link>
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
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
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

    <!-- 主内容区域 -->
    <el-main>
      <router-view />
    </el-main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 页面加载时尝试恢复登录状态
onMounted(() => {
  if (userStore.token && !userStore.userInfo) {
    userStore.fetchUserInfo()
  }
})

// 处理下拉菜单命令
const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile') // 如果还没实现个人中心，可以暂时跳转首页
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