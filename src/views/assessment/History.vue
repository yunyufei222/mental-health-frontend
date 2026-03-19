<template>
  <div class="history-container">
    <h2>我的测评历史</h2>

    <el-table :data="assessmentStore.history" v-loading="assessmentStore.loading" style="width: 100%">
      <el-table-column prop="createdAt" label="测评时间" width="180">
        <template #default="{ row }">
          {{ formatDate(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="scaleName" label="量表" />
      <el-table-column prop="totalScore" label="总分" width="100" align="center" />
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="viewDetail(row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="assessmentStore.historyTotal"
        @current-change="loadHistory"
        layout="prev, pager, next"
        class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessment'
import { formatDate } from '@/utils/date'

const router = useRouter()
const assessmentStore = useAssessmentStore()
const page = ref(1)
const pageSize = ref(10)

const loadHistory = () => {
  assessmentStore.fetchHistory(page.value - 1, pageSize.value)
}

const viewDetail = (id) => {
  // 如果需要查看详情，可以跳转到结果页并携带ID，但需要后端支持根据ID获取结果
  // 目前简单跳转到结果页（但结果页需要从store获取，如果刷新会丢失，因此可能需要改进）
  // 这里先跳转到结果页，并传递ID，但Result.vue需要根据ID从后端获取
  router.push(`/assessment/result/${id}`)
}

onMounted(loadHistory)
</script>

<style scoped>
.history-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}
.pagination {
  margin-top: 30px;
  text-align: center;
}
</style>