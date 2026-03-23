<template>
  <div class="post-list-container">
    <!-- 头部：类型筛选 + 发布按钮 -->
    <div class="header">
      <div class="filter-bar">
        <el-select v-model="type" placeholder="全部类型" clearable @change="handleFilter" style="width: 150px;">
          <el-option
              v-for="item in POST_TYPES"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </div>
      <el-button type="primary" @click="$router.push('/community/create')" v-if="userStore.isLoggedIn">
        发布新帖
      </el-button>
      <el-button v-else type="info" @click="$router.push('/login')">登录后发布</el-button>
    </div>

    <!-- 帖子列表 -->
    <el-row :gutter="20" v-loading="communityStore.loading">
      <el-col :xs="24" :sm="12" :md="8" v-for="post in communityStore.posts" :key="post.id">
        <el-card class="post-card" @click="goToDetail(post.id)">
          <div class="post-info">
            <h3>{{ post.title }}</h3>
            <div class="meta">
              <span class="type-tag">{{ getTypeLabel(post.type) }}</span>
              <span v-if="post.isAnonymous" class="anonymous-tag">匿名</span>
              <span v-if="post.isEssence" class="essence-tag">精华</span>
            </div>
            <p class="summary">{{ post.summary }}</p>
            <div class="stats">
              <span><el-icon><View /></el-icon> {{ post.viewCount }}</span>
              <span><el-icon><Star /></el-icon> {{ post.likeCount }}</span>
              <span><el-icon><ChatDotRound /></el-icon> {{ post.commentCount }}</span>
              <span class="date">{{ formatDate(post.createdAt) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="communityStore.total"
        @current-change="loadPosts"
        layout="prev, pager, next"
        class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCommunityStore } from '@/stores/community'
import { POST_TYPES } from '@/constants/community'
import { View, Star, ChatDotRound } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/date'

const router = useRouter()
const userStore = useUserStore()
const communityStore = useCommunityStore()

const type = ref('')
const page = ref(1)
const pageSize = ref(12)

// 获取类型标签
const getTypeLabel = (value) => {
  const item = POST_TYPES.find(t => t.value === value)
  return item ? item.label : value
}

// 加载帖子列表
const loadPosts = () => {
  communityStore.fetchPosts({
    type: type.value || undefined,
    page: page.value - 1,
    size: pageSize.value
  })
}

// 筛选变化
const handleFilter = () => {
  page.value = 1
  loadPosts()
}

// 跳转详情
const goToDetail = (id) => {
  router.push(`/community/post/${id}`)
}

// 监听类型变化（可选）
watch(type, handleFilter)

onMounted(loadPosts)
</script>

<style scoped>
.post-list-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.filter-bar {
  display: flex;
  gap: 10px;
}
.post-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}
.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.post-info h3 {
  font-size: 18px;
  margin: 0 0 10px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.meta {
  margin-bottom: 10px;
}
.type-tag {
  display: inline-block;
  padding: 2px 8px;
  background-color: #ecf5ff;
  color: #409eff;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 5px;
}
.anonymous-tag {
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 5px;
}
.essence-tag {
  background-color: #fdf6ec;
  color: #e6a23c;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
.summary {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  height: 42px;
  overflow: hidden;
  margin-bottom: 10px;
}
.stats {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #999;
}
.stats span {
  margin-right: 15px;
  display: inline-flex;
  align-items: center;
}
.stats .el-icon {
  margin-right: 3px;
}
.date {
  margin-left: auto;
}
.pagination {
  text-align: center;
  margin-top: 30px;
}
</style>