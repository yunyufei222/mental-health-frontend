<template>
  <div class="article-detail-container" v-loading="articleStore.articleLoading">
    <!-- 文章内容（原有部分） -->
    <el-card v-if="articleStore.currentArticle">
      <template #header>
        <div class="article-header">
          <h1>{{ articleStore.currentArticle.title }}</h1>
          <div class="meta">
            <span>作者：{{ articleStore.currentArticle.author || '未知' }}</span>
            <span>分类：{{ articleStore.currentArticle.categoryName || '未分类' }}</span>
            <span>发布时间：{{ formatDate(articleStore.currentArticle.publishedAt) }}</span>
          </div>
          <div class="stats">
            <el-button
                :type="articleStore.currentArticle.likedByCurrentUser ? 'primary' : 'default'"
                :icon="Star"
                @click="handleLikeArticle"
            >
              {{ articleStore.currentArticle.likeCount }}
            </el-button>
            <el-button
                :type="articleStore.currentArticle.favoritedByCurrentUser ? 'warning' : 'default'"
                :icon="StarFilled"
                @click="handleFavoriteArticle"
            >
              {{ articleStore.currentArticle.favoriteCount }}
            </el-button>
            <el-button :icon="View" disabled>
              {{ articleStore.currentArticle.viewCount }}
            </el-button>
          </div>
        </div>
      </template>
      <div class="article-content" v-html="articleStore.currentArticle.content"></div>
    </el-card>

    <!-- 评论区（新增） -->
    <el-card class="comment-section">
      <template #header>
        <span>评论 ({{ articleStore.commentTotal }})</span>
      </template>

      <!-- 发表评论 -->
      <div class="write-comment" v-if="userStore.isLoggedIn">
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
      <div v-loading="articleStore.commentsLoading" class="comments-list">
        <CommentItem
            v-for="comment in articleStore.comments"
            :key="comment.id"
            :comment="comment"
            :article-id="articleId"
            @reply-submitted="refreshComments"
            @comment-deleted="refreshComments"
        />
        <el-empty v-if="!articleStore.comments.length && !articleStore.commentsLoading" description="暂无评论" />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useArticleStore } from '@/stores/article'
import CommentItem from '@/components/CommentItem.vue'
import { ElMessage } from 'element-plus'
import { Star, StarFilled, View } from '@element-plus/icons-vue'
import { formatDate, formatTime } from '@/utils/date'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const articleStore = useArticleStore()

const articleId = ref(route.params.id)
const newComment = ref('')

// 加载文章详情和评论
const loadData = () => {
  articleStore.fetchArticleDetail(articleId.value)
  articleStore.fetchComments(articleId.value)
}

// 点赞文章
const handleLikeArticle = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  await articleStore.toggleLikeArticle(articleId.value)
}

// 收藏文章
const handleFavoriteArticle = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  await articleStore.toggleFavoriteArticle(articleId.value)
}

// 发表评论
const submitComment = async () => {
  if (!newComment.value.trim()) return
  await articleStore.postComment(articleId.value, { content: newComment.value })
  newComment.value = ''
}

// 刷新评论
const refreshComments = () => {
  articleStore.fetchComments(articleId.value)
}

onMounted(loadData)

// 监听路由参数变化
watch(() => route.params.id, (newId) => {
  articleId.value = newId
  loadData()
})
</script>

<style scoped>
.article-detail-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}
.article-header h1 { margin-top: 0; margin-bottom: 10px; }
.meta { color: #666; font-size: 14px; margin-bottom: 15px; }
.meta span { margin-right: 20px; }
.stats { display: flex; gap: 10px; }
.article-content { line-height: 1.8; font-size: 16px; }
.comment-section { margin-top: 30px; }
.write-comment { margin-bottom: 20px; }
.login-tip { margin-bottom: 20px; }
.comments-list { margin-top: 20px; }
</style>