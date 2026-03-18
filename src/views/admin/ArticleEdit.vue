<template>
  <div class="article-edit-container">
    <el-card>
      <template #header>
        <h2>{{ isEdit ? '编辑文章' : '新建文章' }}</h2>
      </template>
      <el-form :model="form" label-width="100px" ref="formRef">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.categoryId" placeholder="请选择" clearable>
            <el-option
                v-for="cat in categories"
                :key="cat.id"
                :label="cat.name"
                :value="cat.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
              v-model="form.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择或输入标签，回车创建"
          >
            <el-option
                v-for="tag in tagStore.tags"
                :key="tag.id"
                :label="tag.name"
                :value="tag.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要">
          <el-input v-model="form.summary" type="textarea" :rows="2" placeholder="可选" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input v-model="form.content" type="textarea" :rows="10" placeholder="支持 HTML" />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="form.coverImage" placeholder="图片URL（可选）" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.author" placeholder="作者名（可选）" />
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch v-model="form.isTop" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">发布</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTagStore } from '@/stores/tag'
import { getCategories, getArticleDetail, createArticle, updateArticle } from '@/api/article'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const tagStore = useTagStore()
const id = route.params.id
const isEdit = computed(() => !!id)

const categories = ref([])
const formRef = ref(null)
const form = ref({
  title: '',
  categoryId: null,
  tags: [],
  summary: '',
  content: '',
  coverImage: '',
  author: '',
  isTop: false,
  status: 1
})

// 加载分类列表
const loadCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = res.data.content || res.data
  } catch (error) {
    console.error('获取分类失败', error)
  }
}

// 如果是编辑模式，加载文章详情
const loadArticle = async () => {
  try {
    const res = await getArticleDetail(id)
    const article = res.data
    form.value = {
      title: article.title,
      categoryId: article.categoryId,
      tags: article.tags ? [...article.tags] : [],
      summary: article.summary,
      content: article.content,
      coverImage: article.coverImage,
      author: article.author,
      isTop: article.isTop,
      status: article.status
    }
  } catch (error) {
    ElMessage.error('加载文章失败')
  }
}

const submitForm = async () => {
  try {
    if (isEdit.value) {
      await updateArticle(id, form.value)
      ElMessage.success('更新成功')
    } else {
      await createArticle(form.value)
      ElMessage.success('创建成功')
    }
    router.push('/articles')
  } catch (error) {
    ElMessage.error('操作失败')
    console.error(error)
  }
}

onMounted(() => {
  tagStore.fetchTags()
  loadCategories()
  if (isEdit.value) loadArticle()
})
</script>

<style scoped>
.article-edit-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}
</style>