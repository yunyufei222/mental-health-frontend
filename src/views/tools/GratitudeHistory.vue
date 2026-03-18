<template>
  <div class="gratitude-history-container">
    <div class="header">
      <h2>我的感恩日记</h2>
      <el-button type="primary" @click="$router.push('/tools/gratitude')">写今日日记</el-button>
    </div>

    <el-timeline v-loading="store.loading">
      <el-timeline-item
          v-for="item in store.history"
          :key="item.id"
          :timestamp="formatDate(item.date)"
          placement="top"
      >
        <el-card>
          <p><strong>好事1：</strong>{{ item.item1 }}</p>
          <p><strong>好事2：</strong>{{ item.item2 }}</p>
          <p><strong>好事3：</strong>{{ item.item3 }}</p>
          <p v-if="item.reflection"><strong>感想：</strong>{{ item.reflection }}</p>
          <div class="meta">记录于 {{ formatTime(item.createdAt) }}</div>
        </el-card>
      </el-timeline-item>
    </el-timeline>

    <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="store.historyTotal"
        @current-change="loadHistory"
        layout="prev, pager, next"
        class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useGratitudeStore } from '@/stores/gratitude'
import { formatDate, formatTime } from '@/utils/date'

const store = useGratitudeStore()
const page = ref(1)
const pageSize = ref(10)

const loadHistory = () => {
  store.fetchHistory(page.value - 1, pageSize.value)
}

onMounted(loadHistory)
</script>

<style scoped>
.gratitude-history-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.pagination {
  margin-top: 30px;
  text-align: center;
}
.meta {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}
</style>