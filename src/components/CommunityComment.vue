<template>
  <div class="comment-item">
    <!-- 主评论 -->
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
          </span>
          <span class="action" @click="showReply = !showReply">回复</span>
          <span v-if="isOwner" class="action delete" @click="handleDelete">删除</span>
          <span class="action report" @click="handleReport">举报</span>
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

    <!-- 子评论列表 -->
    <div v-if="comment.replies && comment.replies.length" class="replies">
      <CommunityComment
          v-for="reply in comment.replies"
          :key="reply.id"
          :comment="reply"
          :post-id="postId"
          @reply-submitted="$emit('reply-submitted')"
          @comment-deleted="$emit('comment-deleted')"
          @report="$emit('report', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useCommunityStore } from '@/stores/community'
import { ElMessage } from 'element-plus'
import { Star } from '@element-plus/icons-vue'
import { formatTime } from '@/utils/date'

const props = defineProps({
  comment: { type: Object, required: true },
  postId: { type: [Number, String], required: true }
})

const emit = defineEmits(['reply-submitted', 'comment-deleted', 'report'])

const userStore = useUserStore()
const communityStore = useCommunityStore()

const showReply = ref(false)
const replyContent = ref('')

const isOwner = computed(() => {
  return userStore.isLoggedIn && userStore.userInfo?.id === props.comment.userId
})

// 点赞评论（暂未实现，可后续添加）
const handleLike = () => {
  ElMessage.info('评论点赞功能开发中')
}

// 提交回复
const submitReply = async () => {
  if (!replyContent.value.trim()) return
  try {
    await communityStore.addComment(props.postId, {
      content: replyContent.value,
      parentId: props.comment.id
    })
    replyContent.value = ''
    showReply.value = false
    emit('reply-submitted')
  } catch (error) {}
}

// 删除评论
const handleDelete = async () => {
  try {
    await communityStore.removeComment(props.postId, props.comment.id)
    emit('comment-deleted')
  } catch (error) {}
}

// 举报评论
const handleReport = () => {
  emit('report', {
    targetType: 'COMMENT',
    targetId: props.comment.id,
    content: props.comment.content
  })
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
.action.report:hover {
  color: #e6a23c;
}
.reply-input {
  margin-top: 10px;
}
.replies {
  margin-left: 52px;
  margin-top: 10px;
}
</style>