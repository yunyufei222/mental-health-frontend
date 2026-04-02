<template>
  <div class="comment-item">
    <div class="comment-main">
      <el-avatar :size="32" :src="comment.avatar" />
      <div class="comment-content">
        <div class="comment-header">
          <span class="nickname">{{ comment.nickname || comment.username }}</span>
          <span class="time">{{ formatDateTime(comment.createdAt) }}</span>
        </div>
        <div class="comment-body">{{ comment.content }}</div>
        <div class="comment-actions">
          <span class="action" @click="handleLike">
            <el-icon><Star /></el-icon> {{ comment.likeCount }}
          </span>
          <span class="action" @click="showReply = !showReply">回复</span>
          <span v-if="isOwner" class="action delete" @click="handleDelete">删除</span>
        </div>
        <!-- 回复输入框 -->
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
import { formatDateTime } from '@/utils/date'

const props = defineProps({
  comment: { type: Object, required: true },
  articleId: { type: [String, Number], required: true }
})

const emit = defineEmits(['reply-submitted', 'comment-deleted'])

const userStore = useUserStore()
const articleStore = useArticleStore()

const showReply = ref(false)
const replyContent = ref('')

const isOwner = computed(() => {
  return userStore.isLoggedIn && userStore.userInfo?.id === props.comment.userId
})

const handleLike = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    return
  }
  // 调用文章评论点赞接口
  await articleStore.toggleLikeComment(props.articleId, props.comment.id)
}

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
  } catch (error) {}
}

const handleDelete = async () => {
  try {
    await articleStore.removeComment(props.articleId, props.comment.id)
    emit('comment-deleted')
  } catch (error) {}
}
</script>

<style scoped>
/* 样式与之前一致 */
</style>