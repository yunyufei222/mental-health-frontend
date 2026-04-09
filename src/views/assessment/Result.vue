<template>
  <div class="result-container" v-loading="resultLoading">
    <el-card v-if="assessmentStore.result">
      <template #header>
        <h2>{{ assessmentStore.result.scaleName }} 测评结果</h2>
        <p>测评时间：{{ formatDateTime(assessmentStore.result.createdAt) }}</p>
      </template>

      <!-- 总分 -->
      <div class="score-section">
        <h3>总分：{{ assessmentStore.result.totalScore }}</h3>
      </div>

      <!-- 维度得分图表 -->
      <div v-if="hasDimensionScores" class="chart-section">
        <h4>维度得分</h4>
        <div ref="chartRef" style="width: 100%; height: 300px;"></div>
      </div>

<!--      &lt;!&ndash; 详细解读 &ndash;&gt;-->
<!--      <div class="interpretation">-->
<!--        <h4>结果解读</h4>-->
<!--        <p>{{ assessmentStore.result.detailedInterpretation || assessmentStore.result.interpretation }}</p>-->
<!--      </div>-->

      <div class="actions">
        <el-button @click="router.push('/assessment')">返回量表列表</el-button>
        <el-button type="primary" @click="router.push('/assessment/history')">查看历史记录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessment'
import { formatDateTime } from '@/utils/date'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()
const assessmentStore = useAssessmentStore()
const chartRef = ref(null)
const resultLoading = ref(true)

const hasDimensionScores = computed(() => {
  return assessmentStore.result?.dimensionScores && Object.keys(assessmentStore.result.dimensionScores).length > 0
})

const initChart = () => {
  if (!hasDimensionScores.value) return
  nextTick(() => {
    const chart = echarts.init(chartRef.value)
    const dims = assessmentStore.result.dimensionScores
    const categories = Object.keys(dims)
    const values = Object.values(dims)
    chart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: { rotate: 30, interval: 0 }
      },
      yAxis: {
        type: 'value',
        name: '得分'
      },
      series: [
        {
          name: '得分',
          type: 'bar',
          data: values,
          itemStyle: {
            color: '#409EFF',
            borderRadius: [4, 4, 0, 0]
          },
          label: {
            show: true,
            position: 'top'
          }
        }
      ]
    })
  })
}

onMounted(async () => {
  const id = route.params.id
  if (id) {
    await assessmentStore.fetchResultById(id)
  }
  resultLoading.value = false
  initChart()
})
</script>

<style scoped>
.result-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}
.score-section {
  text-align: center;
  margin-bottom: 30px;
}
.score-section h3 {
  font-size: 28px;
  color: #409EFF;
}
.chart-section {
  margin-bottom: 30px;
}
.interpretation {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  line-height: 1.6;
}
.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}
</style>