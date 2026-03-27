<template>
  <div class="history-container">
    <h2>我的测评历史</h2>
    <p>记录您的每一次心理成长之旅</p>

    <el-table :data="assessmentStore.history" v-loading="assessmentStore.historyLoading" style="width: 100%">
      <el-table-column prop="createdAt" label="测评时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column prop="scaleName" label="量表" min-width="150" />
      <el-table-column prop="totalScore" label="总分" width="80" align="center">
        <template #default="{ row }">
          <el-tag :type="getScoreType(row.totalScore)">{{ row.totalScore }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="维度得分" min-width="200">
        <template #default="{ row }">
          <div v-if="row.dimensionScores && Object.keys(row.dimensionScores).length">
            <el-tag
                v-for="(score, dim) in row.dimensionScores"
                :key="dim"
                size="small"
                style="margin: 2px 4px;"
            >
              {{ dim }}: {{ score }}
            </el-tag>
          </div>
          <span v-else class="text-muted">—</span>
        </template>
      </el-table-column>
      <el-table-column label="解读" min-width="200" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.interpretation?.substring(0, 80) }}{{ row.interpretation?.length > 80 ? '...' : '' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="viewDetail(row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-if="!assessmentStore.history.length && !assessmentStore.historyLoading" description="暂无测评记录" />

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
import { formatDateTime } from '@/utils/date'

const router = useRouter()
const assessmentStore = useAssessmentStore()
const page = ref(1)
const pageSize = ref(10)

const loadHistory = () => {
  assessmentStore.fetchHistory(page.value - 1, pageSize.value)
}

const viewDetail = (id) => {
  router.push(`/assessment/result/${id}`)
}

// 根据分数返回标签类型（可选）
const getScoreType = (score) => {
  if (score <= 30) return 'warning'
  if (score <= 60) return 'info'
  return 'success'
}

onMounted(loadHistory)
</script>

<style scoped>
.history-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
.history-container h2 {
  margin-bottom: 8px;
  color: #333;
}
.history-container > p {
  color: #666;
  margin-bottom: 20px;
}
.text-muted {
  color: #999;
}
.pagination {
  margin-top: 30px;
  text-align: center;
}
</style>