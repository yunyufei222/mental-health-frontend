<template>
  <div class="article-list-container">
    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-select v-model="categoryId" placeholder="全部分类" clearable @change="handleSearch">
        <el-option
            v-for="cat in categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
        />
      </el-select>
      <el-select
          v-model="tagId"
          placeholder="全部标签"
          clearable
          @change="handleSearch"
          style="width: 180px; margin-left: 15px;"
      >
        <el-option
            v-for="tag in tagStore.tags"
            :key="tag.id"
            :label="tag.name"
            :value="tag.id"
        />
      </el-select>
      <el-input
          v-model="keyword"
          placeholder="搜索文章标题或摘要"
          clearable
          @keyup.enter="handleSearch"
          style="width: 300px; margin-left: 15px;"
      >
        <template #append>
          <el-button @click="handleSearch">
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
      </el-input>
      <el-button
          v-if="userStore.isAdmin"
          type="primary"
          @click="$router.push('/admin/articles/create')"
          style="margin-left: auto;"
      >
        新建文章
      </el-button>
    </div>

    <!-- 文章列表 -->
    <el-row :gutter="20" v-loading="articleStore.loading">
      <el-col :xs="24" :sm="12" :md="8" v-for="article in articleStore.articles" :key="article.id">
        <el-card class="article-card" @click="goToDetail(article.id)">
          <div class="article-cover" v-if="article.coverImage">
            <el-image :src="article.coverImage" fit="cover"></el-image>
          </div>
          <div class="article-info">
            <h3>{{ article.title }}</h3>
            <div class="tags" v-if="article.tags && article.tags.length">
              <el-tag
                  v-for="tag in article.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                  style="margin-right: 5px;"
              >
                {{ tag }}
              </el-tag>
            </div>
            <p class="summary">{{ article.summary }}</p>
            <div class="meta">
              <span><el-icon><View /></el-icon> {{ article.viewCount }}</span>
              <span><el-icon><Star /></el-icon> {{ article.likeCount }}</span>
              <span><el-icon><Collection /></el-icon> {{ article.favoriteCount }}</span>
              <span class="date">{{ formatDate(article.publishedAt) }}</span>
            </div>
            <!-- 管理员操作按钮 -->
            <div v-if="userStore.isAdmin" class="admin-actions" @click.stop>
              <el-button size="small" @click="editArticle(article.id)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteArticle(article.id)">删除</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="articleStore.total"
        @current-change="handlePageChange"
        layout="prev, pager, next"
        class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useArticleStore } from '@/stores/article'
import { useTagStore } from '@/stores/tag'
import { getCategories, deleteArticle } from '@/api/article'
import { Search, View, Star, Collection } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/date'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const articleStore = useArticleStore()
const tagStore = useTagStore()

const categories = ref([])
const categoryId = ref('')
const tagId = ref('')
const keyword = ref('')
const page = ref(1)
const pageSize = ref(12)

// 获取分类列表
const fetchCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = res.data.content
  } catch (error) {
    console.error('获取分类失败', error)
  }
}

// 加载文章列表
const loadArticles = () => {
  articleStore.fetchArticles({
    categoryId: categoryId.value || undefined,
    tagId: tagId.value || undefined,
    keyword: keyword.value || undefined,
    page: page.value - 1,
    size: pageSize.value
  })
}

const handleSearch = () => {
  page.value = 1
  loadArticles()
}

const handlePageChange = () => {
  loadArticles()
}

const goToDetail = (id) => {
  router.push(`/articles/${id}`)
}

const editArticle = (id) => {
  router.push(`/admin/articles/edit/${id}`)
}

const deleteArticleHandler = async (id) => {
  try {
    await ElMessageBox.confirm('确认删除该文章吗？', '提示', { type: 'warning' })
    await deleteArticle(id)
    ElMessage.success('删除成功')
    loadArticles()
  } catch (error) {
    if (error !== 'cancel') ElMessage.error('删除失败')
  }
}

onMounted(() => {
  tagStore.fetchTags()
  fetchCategories()
  loadArticles()
})
</script>

<style scoped>
.article-list-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 60px);
}
.filter-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.article-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}
.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.article-cover {
  height: 150px;
  overflow: hidden;
  margin-bottom: 10px;
}
.article-cover .el-image {
  width: 100%;
  height: 100%;
}
.article-info h3 {
  font-size: 18px;
  margin: 0 0 10px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tags {
  margin-bottom: 8px;
}
.summary {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  height: 42px;
  overflow: hidden;
  margin-bottom: 10px;
}
.meta {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #999;
  margin-bottom: 10px;
}
.meta span {
  margin-right: 15px;
  display: inline-flex;
  align-items: center;
}
.meta .el-icon {
  margin-right: 3px;
}
.date {
  margin-left: auto;
}
.admin-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.pagination {
  text-align: center;
  margin-top: 30px;
}
</style>