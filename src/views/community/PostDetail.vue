<template>
  <div class="post-detail-container" v-loading="communityStore.postLoading">
    <el-card v-if="communityStore.currentPost" class="post-card">
      <!-- 帖子头部 -->
      <div class="post-header">
        <div class="author-info">
          <el-avatar :size="40" :src="communityStore.currentPost.avatar" />
          <div class="author-meta">
            <span class="author-name">
              {{ communityStore.currentPost.nickname || communityStore.currentPost.username }}
              <span v-if="communityStore.currentPost.isAnonymous" class="anonymous-badge">匿名</span>
            </span>
            <span class="post-time">{{ formatDateTime(communityStore.currentPost.createdAt) }}</span>
          </div>
        </div>
        <div class="post-type">
          <el-tag :type="getTypeTagType(communityStore.currentPost.type)">
            {{ getTypeLabel(communityStore.currentPost.type) }}
          </el-tag>
          <el-tag v-if="communityStore.currentPost.isEssence" type="success" size="small">精华</el-tag>
        </div>
      </div>

      <!-- 帖子标题和内容 -->
      <h2>{{ communityStore.currentPost.title }}</h2>
      <div class="post-content" v-html="formattedContent"></div>

      <!-- 标签 -->
      <div v-if="communityStore.currentPost.tags" class="post-tags">
        <el-tag
            v-for="tag in communityStore.currentPost.tags.split(',')"
            :key="tag"
            size="small"
            effect="plain"
            style="margin-right: 5px;"
        >
          {{ tag }}
        </el-tag>
      </div>

      <!-- 统计信息 -->
      <div class="post-stats">
        <span><el-icon><View /></el-icon> {{ communityStore.currentPost.viewCount }}</span>
        <span @click="handleLike" :class="{ 'liked': communityStore.currentPost.likedByCurrentUser }">
          <el-icon><Star /></el-icon> {{ communityStore.currentPost.likeCount }}
        </span>
        <span><el-icon><ChatDotRound /></el-icon> {{ communityStore.currentPost.commentCount }}</span>
      </div>

      <!-- 举报按钮（仅登录用户） -->
      <div v-if="userStore.isLoggedIn" class="post-actions">
        <el-button type="danger" size="small" @click="handleReport">举报</el-button>
      </div>
    </el-card>

    <!-- 评论区 -->
    <el-card class="comment-section">
      <template #header>
        <span>评论 ({{ communityStore.commentTotal }})</span>
      </template>

      <!-- 发表评论 -->
      <div v-if="userStore.isLoggedIn" class="write-comment">
        <el-input
            v-model="newComment"
            type="textarea"
            :rows="3"
            placeholder="写下你的评论..."
            show-word-limit
            maxlength="500"
        />
        <el-button type="primary" @click="submitComment" style="margin-top:10px;">发表评论</el-button>
      </div>
      <div v-else class="login-tip">
        <el-alert type="info" :closable="false">
          <template #default>
            请先<el-link type="primary" @click="$router.push('/login')">登录</el-link>后发表评论
          </template>
        </el-alert>
      </div>

      <!-- 评论列表 -->
      <div v-loading="communityStore.commentsLoading" class="comments-list">
        <CommentItem
            v-for="comment in communityStore.comments"
            :key="comment.id"
            :comment="comment"
            :post-id="postId"
            @reply-submitted="refreshComments"
            @comment-deleted="refreshComments"
        />
        <el-empty v-if="!communityStore.comments.length && !communityStore.commentsLoading" description="暂无评论" />
      </div>

      <!-- 分页 -->
      <el-pagination
          v-model:current-page="commentPage"
          v-model:page-size="commentPageSize"
          :total="communityStore.commentTotal"
          @current-change="loadComments"
          layout="prev, pager, next"
          class="pagination"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useCommunityStore } from '@/stores/community'
import CommentItem from '@/components/CommentItem.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { View, Star, ChatDotRound } from '@element-plus/icons-vue'
import { formatDateTime } from '@/utils/date'
import { POST_TYPES } from '@/constants/community'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const communityStore = useCommunityStore()

const postId = ref(route.params.id)
const newComment = ref('')
const commentPage = ref(1)
const commentPageSize = ref(10)

// 获取类型标签
const getTypeLabel = (value) => {
  const item = POST_TYPES.find(t => t.value === value)
  return item ? item.label : value
}

const getTypeTagType = (type) => {
  const map = {
    SHARE: 'success',
    ASK: 'warning',
    GRATITUDE: 'info',
    GROWTH: 'primary'
  }
  return map[type] || 'default'
}

// 格式化内容（将换行转为 <br>）
const formattedContent = computed(() => {
  if (!communityStore.currentPost) return ''
  return communityStore.currentPost.content.replace(/\n/g, '<br>')
})

// 加载帖子详情
const loadPost = () => {
  communityStore.fetchPostDetail(postId.value)
}

// 加载评论
const loadComments = () => {
  communityStore.fetchComments(postId.value, commentPage.value - 1, commentPageSize.value)
}

// 点赞
const handleLike = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  await communityStore.toggleLike(postId.value)
}

// 发表评论
const submitComment = async () => {
  if (!newComment.value.trim()) return
  await communityStore.addComment(postId.value, { content: newComment.value })
  newComment.value = ''
  commentPage.value = 1
  loadComments()
}

// 刷新评论（回复后调用）
const refreshComments = () => {
  commentPage.value = 1
  loadComments()
}

// 举报
const handleReport = () => {
  ElMessageBox.prompt('请填写举报原因', '举报', {
    confirmButtonText: '提交',
    cancelButtonText: '取消',
    inputPattern: /\S/,
    inputErrorMessage: '原因不能为空'
  }).then(({ value }) => {
    communityStore.submitReport({
      targetType: 'POST',
      targetId: postId.value,
      reason: value
    })
  }).catch(() => {})
}

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  postId.value = newId
  loadPost()
  commentPage.value = 1
  loadComments()
})

onMounted(() => {
  loadPost()
  loadComments()
})
</script>

<style scoped>
.post-detail-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}
.post-card {
  margin-bottom: 20px;
}
.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.author-meta {
  display: flex;
  flex-direction: column;
}
.author-name {
  font-weight: bold;
}
.anonymous-badge {
  background-color: #f0f9eb;
  color: #67c23a;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
  margin-left: 5px;
}
.post-time {
  font-size: 12px;
  color: #999;
}
.post-type {
  display: flex;
  gap: 5px;
}
h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 24px;
}
.post-content {
  line-height: 1.8;
  font-size: 16px;
  margin-bottom: 20px;
}
.post-tags {
  margin-bottom: 15px;
}
.post-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
  color: #666;
}
.post-stats span {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.post-stats span.liked {
  color: #409eff;
  font-weight: bold;
}
.post-actions {
  text-align: right;
}
.comment-section {
  margin-top: 20px;
}
.write-comment {
  margin-bottom: 20px;
}
.login-tip {
  margin-bottom: 20px;
}
.comments-list {
  margin-top: 20px;
}
.pagination {
  margin-top: 20px;
  text-align: center;
}
</style>