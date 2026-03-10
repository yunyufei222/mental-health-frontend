<template>
  <div class="article-list-container">
    <!-- 分类筛选 -->
    <div class="filter-bar">
      <el-select v-model="categoryId" placeholder="全部分类" clearable @change="handleSearch">
        <el-option
            v-for="cat in categories"
            :key="cat.id"
            :label="cat.name"
            :value="cat.id"
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
            <p class="summary">{{ article.summary }}</p>
            <div class="meta">
              <span><el-icon><View /></el-icon> {{ article.viewCount }}</span>
              <span><el-icon><Star /></el-icon> {{ article.likeCount }}</span>
              <span><el-icon><Collection /></el-icon> {{ article.favoriteCount }}</span>
              <span class="date">{{ formatDate(article.publishedAt) }}</span>
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article.js'
import { getCategories } from '@/api/article.js'
import { Search, View, Star, Collection } from '@element-plus/icons-vue'
import { formatDate } from '@/utils/date.js' // 可自行实现

const router = useRouter()
const articleStore = useArticleStore()

const categories = ref([])
const categoryId = ref('')
const keyword = ref('')
const page = ref(1)
const pageSize = ref(12)

// 获取分类列表
const fetchCategories = async () => {
  try {
    const res = await getCategories()
    categories.value = res.data.content // 假设返回分页对象，取content
  } catch (error) {
    console.error('获取分类失败', error)
  }
}

// 加载文章列表
const loadArticles = () => {
  articleStore.fetchArticles({
    categoryId: categoryId.value || undefined,
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

onMounted(() => {
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
.pagination {
  text-align: center;
  margin-top: 30px;
}
</style>