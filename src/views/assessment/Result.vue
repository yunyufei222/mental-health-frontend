<template>
  <div class="result-container" v-if="assessmentStore.result">
    <el-card>
      <template #header>
        <h2>{{ assessmentStore.result.scaleName }} 测评结果</h2>
        <p>感谢您的参与，以下是您的测评报告。</p>
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

      <!-- 详细解读 -->
      <div class="interpretation">
        <h4>结果解读</h4>
        <p>{{ assessmentStore.result.detailedInterpretation || assessmentStore.result.interpretation }}</p>
      </div>

      <div class="actions">
        <el-button @click="router.push('/assessment')">返回量表列表</el-button>
        <el-button type="primary" @click="router.push('/assessment/history')">查看历史记录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAssessmentStore } from '@/stores/assessment'
import * as echarts from 'echarts'

const router = useRouter()
const assessmentStore = useAssessmentStore()
const chartRef = ref(null)

const hasDimensionScores = computed(() => {
  return assessmentStore.result.dimensionScores && Object.keys(assessmentStore.result.dimensionScores).length > 0
})

const initChart = () => {
  if (!hasDimensionScores.value) return
  nextTick(() => {
    const chart = echarts.init(chartRef.value)
    const dims = assessmentStore.result.dimensionScores
    const categories = Object.keys(dims)
    const values = Object.values(dims)
    chart.setOption({
      tooltip: {},
      xAxis: {
        type: 'category',
        data: categories,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: '得分',
          type: 'bar',
          data: values,
          itemStyle: {
            color: '#409EFF',
          },
        },
      ],
    })
  })
}

onMounted(() => {
  if (!assessmentStore.result) {
    router.push('/assessment')
  } else {
    initChart()
  }
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