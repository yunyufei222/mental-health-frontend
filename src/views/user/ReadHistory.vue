<template>
  <div class="read-history-container">
    <h2>我的学习记录</h2>
    <el-timeline v-loading="articleStore.readHistoryLoading">
      <el-timeline-item
          v-for="record in articleStore.readHistory"
          :key="record.id"
          :timestamp="formatDate(record.readAt)"
          placement="top"
      >
        <el-card @click="goToArticle(record.articleId)" style="cursor: pointer;">
          <div style="display: flex; gap: 15px;">
            <el-image
                v-if="record.articleCover"
                :src="record.articleCover"
                style="width: 80px; height: 60px; object-fit: cover;"
            />
            <div>
              <h4>{{ record.articleTitle }}</h4>
              <p>{{ record.articleSummary }}</p>
            </div>
          </div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="articleStore.readHistoryTotal"
        @current-change="loadRecords"
        layout="prev, pager, next"
        class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '@/stores/article'
import { formatDate } from '@/utils/date'

const router = useRouter()
const articleStore = useArticleStore()
const page = ref(1)
const pageSize = ref(10)

const loadRecords = () => {
  articleStore.fetchReadHistory(page.value - 1, pageSize.value)
}

const goToArticle = (id) => {
  router.push(`/articles/${id}`)
}

onMounted(async () => {
  await loadRecords()
  console.log('readHistory data:', articleStore.readHistory)
  console.log('readHistoryTotal:', articleStore.readHistoryTotal)
})
</script>

<style scoped>
.read-history-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}
.pagination {
  margin-top: 30px;
  text-align: center;
}
</style>