<template>
  <div class="assessment-container" v-loading="scaleStore.detailLoading">
    <el-card v-if="scaleStore.currentScale">
      <template #header>
        <h2>{{ scaleStore.currentScale.name }}</h2>
        <p>{{ scaleStore.currentScale.instruction || '请根据您的真实感受选择最符合的选项。' }}</p>
      </template>

      <div v-if="!submitted">
        <div v-for="(question, idx) in scaleStore.currentScale.questions" :key="question.id" class="question-item">
          <h4>{{ idx + 1 }}. {{ question.questionText }}</h4>
          <el-radio-group v-model="answers[idx]" class="option-group">
            <el-radio
                v-for="opt in question.options"
                :key="opt.id"
                :label="opt.score"
                class="option-item"
            >
              {{ opt.optionText }}
            </el-radio>
          </el-radio-group>
        </div>

        <div class="actions">
          <el-button type="primary" @click="submitAssessment" :loading="submitting">提交测评</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScaleStore } from '@/stores/scale'
import { useAssessmentStore } from '@/stores/assessment'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const scaleStore = useScaleStore()
const assessmentStore = useAssessmentStore()

const scaleId = ref(route.params.id)
const answers = ref([])
const submitted = ref(false)
const submitting = ref(false)

// 加载量表详情
const loadScale = async () => {
  await scaleStore.fetchScaleDetail(scaleId.value)
  // 初始化答案数组
  if (scaleStore.currentScale) {
    answers.value = new Array(scaleStore.currentScale.questions.length).fill(null)
  }
}

// 提交测评
const submitAssessment = async () => {
  // 验证是否所有题目都已作答
  const missing = answers.value.findIndex(a => a === null)
  if (missing !== -1) {
    ElMessage.warning(`请先完成第 ${missing + 1} 题`)
    return
  }

  submitting.value = true
  try {
    const result = await assessmentStore.submit({
      scaleId: Number(scaleId.value),
      answers: answers.value
    })
    // 提交成功后跳转到结果页，可以携带结果ID
    router.push(`/assessment/result/${result.id}`)
  } catch (error) {
    // 错误已在store中处理
  } finally {
    submitting.value = false
  }
}

onMounted(loadScale)
</script>

<style scoped>
.assessment-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}
.question-item {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}
.question-item h4 {
  margin-bottom: 15px;
  color: #333;
}
.option-group {
  display: flex;
  flex-direction: column;
}
.option-item {
  margin: 8px 0;
  padding: 10px;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.option-item:hover {
  background-color: #f5f7fa;
}
.actions {
  text-align: center;
  margin-top: 30px;
}
</style>