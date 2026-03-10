<template>
  <div class="comment-item">
    <div class="comment-main">
      <el-avatar :size="40" :src="comment.avatar" />
      <div class="comment-content">
        <div class="comment-header">
          <span class="nickname">{{ comment.nickname || comment.username }}</span>
          <span class="time">{{ formatTime(comment.createdAt) }}</span>
        </div>
        <div class="comment-body">{{ comment.content }}</div>
        <div class="comment-actions">
          <span class="action" @click="handleLike">
            <el-icon><Star /></el-icon> {{ comment.likeCount }}
            <span v-if="comment.likedByCurrentUser" class="liked">已赞</span>
          </span>
          <span class="action" @click="showReply = !showReply">回复</span>
          <span v-if="isOwner" class="action delete" @click="handleDelete">删除</span>
        </div>
        <!-- 回复输入框（当点击回复时显示） -->
        <div v-if="showReply" class="reply-input">
          <el-input
              v-model="replyContent"
              placeholder="写下你的回复..."
              size="small"
              @keyup.enter="submitReply"
          >
            <template #append>
              <el-button @click="submitReply">发送</el-button>
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <!-- 子评论递归渲染 -->
    <div v-if="comment.replies && comment.replies.length" class="replies">
      <CommentItem
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          :article-id="articleId"
          @reply-submitted="$emit('reply-submitted')"
          @comment-deleted="$emit('comment-deleted')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useArticleStore } from '@/stores/article'
import { ElMessage } from 'element-plus'
import { Star } from '@element-plus/icons-vue'
import { formatTime } from '@/utils/date' // 时间格式化函数

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  articleId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['reply-submitted', 'comment-deleted'])

const userStore = useUserStore()
const articleStore = useArticleStore()

const showReply = ref(false)
const replyContent = ref('')

// 判断当前用户是否为评论作者
const isOwner = computed(() => {
  return userStore.userInfo && userStore.userInfo.id === props.comment.userId
})

// 点赞评论
const handleLike = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  await articleStore.toggleLikeComment(props.articleId, props.comment.id)
}

// 提交回复
const submitReply = async () => {
  if (!replyContent.value.trim()) return
  try {
    await articleStore.postComment(props.articleId, {
      content: replyContent.value,
      parentId: props.comment.id
    })
    replyContent.value = ''
    showReply.value = false
    emit('reply-submitted')
  } catch (error) {
    // 错误已在store中处理
  }
}

// 删除评论
const handleDelete = async () => {
  try {
    await articleStore.removeComment(props.articleId, props.comment.id)
    emit('comment-deleted')
  } catch (error) {}
}
</script>

<style scoped>
.comment-item {
  margin-bottom: 15px;
}
.comment-main {
  display: flex;
  gap: 12px;
}
.comment-content {
  flex: 1;
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 10px 15px;
}
.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.nickname {
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}
.time {
  font-size: 12px;
  color: #999;
}
.comment-body {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  margin-bottom: 8px;
}
.comment-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 13px;
  color: #666;
}
.action {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.action:hover {
  color: #409eff;
}
.action.delete:hover {
  color: #f56c6c;
}
.liked {
  color: #409eff;
  font-weight: 500;
}
.reply-input {
  margin-top: 10px;
}
.replies {
  margin-left: 52px;
  margin-top: 10px;
}
</style>