<template>
  <div class="post-edit-container">
    <el-card>
      <template #header>
        <h2>{{ isEdit ? '编辑帖子' : '发布新帖' }}</h2>
      </template>
      <el-form :model="form" label-width="80px" ref="formRef" :rules="rules">
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择帖子类型">
            <el-option
                v-for="item in POST_TYPES"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
              v-model="form.content"
              type="textarea"
              :rows="10"
              placeholder="写下你的想法..."
              maxlength="5000"
              show-word-limit
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tags" placeholder="多个标签用逗号分隔（可选）" />
        </el-form-item>
        <el-form-item label="匿名">
          <el-switch v-model="form.isAnonymous" />
          <span class="tip" v-if="form.isAnonymous">你的身份将隐藏为随机匿名ID</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">发布</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCommunityStore } from '@/stores/community'
import { POST_TYPES } from '@/constants/community'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const communityStore = useCommunityStore()
const id = route.params.id
const isEdit = computed(() => !!id)

const formRef = ref(null)
const submitting = ref(false)

const form = ref({
  type: '',
  title: '',
  content: '',
  tags: '',
  isAnonymous: false
})

const rules = {
  type: [{ required: true, message: '请选择帖子类型', trigger: 'change' }],
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
}

// 加载帖子数据（编辑模式）
const loadPost = async () => {
  await communityStore.fetchPostDetail(id)
  const post = communityStore.currentPost
  if (post) {
    form.value = {
      type: post.type,
      title: post.title,
      content: post.content,
      tags: post.tags || '',
      isAnonymous: post.isAnonymous
    }
  }
}

const submitForm = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    if (isEdit.value) {
      await communityStore.editPost(id, form.value)
      ElMessage.success('修改成功')
      router.push(`/community/post/${id}`)
    } else {
      const newPost = await communityStore.addPost(form.value)
      router.push(`/community/post/${newPost.id}`)
    }
  } catch (error) {
    // 错误已在 store 中处理
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  if (isEdit.value) loadPost()
})
</script>

<style scoped>
.post-edit-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}
.tip {
  margin-left: 10px;
  color: #999;
  font-size: 12px;
}
</style>