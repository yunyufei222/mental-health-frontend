<template>
  <div class="question-manage-container">
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between;">
          <h2>题目管理 - {{ scaleName }}</h2>
          <el-button type="primary" @click="handleAddQuestion">新增题目</el-button>
        </div>
      </template>

      <div v-if="loading">加载中...</div>
      <div v-else>
        <div v-for="(q, idx) in questions" :key="q.id" class="question-item">
          <div class="question-header">
            <h4>{{ idx + 1 }}. {{ q.questionText }}</h4>
            <div>
              <el-button size="small" @click="editQuestion(q)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDeleteQuestion(q.id)">删除</el-button>
            </div>
          </div>
          <div class="options">
            <el-table :data="q.options" size="small" style="width: 100%">
              <el-table-column prop="optionText" label="选项文本" />
              <el-table-column prop="score" label="分值" width="80" />
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button size="small" @click="editOption(row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="handleDeleteOption(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <el-empty v-if="questions.length === 0" description="暂无题目" />
      </div>
    </el-card>

    <!-- 题目编辑对话框 -->
    <el-dialog v-model="questionDialog.visible" :title="questionDialog.isEdit ? '编辑题目' : '新增题目'" width="600px">
      <el-form :model="questionForm" label-width="80px">
        <el-form-item label="题目内容">
          <el-input v-model="questionForm.questionText" type="textarea" rows="2" />
        </el-form-item>
        <el-form-item label="所属维度">
          <el-input v-model="questionForm.dimension" placeholder="例如：P" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="questionForm.sortOrder" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="questionDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="saveQuestion">保存</el-button>
      </template>
    </el-dialog>

    <!-- 选项编辑对话框 -->
    <el-dialog v-model="optionDialog.visible" :title="optionDialog.isEdit ? '编辑选项' : '新增选项'" width="500px">
      <el-form :model="optionForm" label-width="80px">
        <el-form-item label="选项文本">
          <el-input v-model="optionForm.optionText" />
        </el-form-item>
        <el-form-item label="分值">
          <el-input-number v-model="optionForm.score" />
        </el-form-item>
        <el-form-item label="排序号">
          <el-input-number v-model="optionForm.sortOrder" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="optionDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="saveOption">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getScaleDetail } from '@/api/scale'
import { addQuestion, updateQuestion, deleteQuestion, addOption, updateOption, deleteOption } from '@/api/scale'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const scaleId = route.params.id
const scaleName = ref('')
const questions = ref([])
const loading = ref(false)

// 题目对话框
const questionDialog = reactive({
  visible: false,
  isEdit: false,
  questionId: null,
})
const questionForm = reactive({
  questionText: '',
  dimension: '',
  sortOrder: 1,
})

// 选项对话框
const optionDialog = reactive({
  visible: false,
  isEdit: false,
  optionId: null,
  questionId: null,
})
const optionForm = reactive({
  optionText: '',
  score: 0,
  sortOrder: 1,
})

// 加载量表详情
const loadScale = async () => {
  loading.value = true
  try {
    const res = await getScaleDetail(scaleId)
    scaleName.value = res.data.name
    questions.value = res.data.questions || []
  } catch (error) {
    ElMessage.error('加载失败')
    router.back()
  } finally {
    loading.value = false
  }
}

// 题目操作（重命名避免与导入冲突）
const handleAddQuestion = () => {
  questionDialog.isEdit = false
  questionDialog.questionId = null
  questionForm.questionText = ''
  questionForm.dimension = ''
  questionForm.sortOrder = questions.value.length + 1
  questionDialog.visible = true
}

const editQuestion = (question) => {
  questionDialog.isEdit = true
  questionDialog.questionId = question.id
  questionForm.questionText = question.questionText
  questionForm.dimension = question.dimension || ''
  questionForm.sortOrder = question.sortOrder
  questionDialog.visible = true
}

const saveQuestion = async () => {
  try {
    if (questionDialog.isEdit) {
      await updateQuestion(questionDialog.questionId, questionForm)
      ElMessage.success('更新成功')
    } else {
      await addQuestion(scaleId, questionForm)
      ElMessage.success('新增成功')
    }
    questionDialog.visible = false
    loadScale()
  } catch (error) {}
}

const handleDeleteQuestion = (id) => {
  ElMessageBox.confirm('确认删除该题目吗？', '提示', { type: 'warning' })
      .then(async () => {
        await deleteQuestion(id)
        ElMessage.success('删除成功')
        loadScale()
      })
      .catch(() => {})
}

// 选项操作
const editOption = (option) => {
  optionDialog.isEdit = true
  optionDialog.optionId = option.id
  optionDialog.questionId = option.questionId
  optionForm.optionText = option.optionText
  optionForm.score = option.score
  optionForm.sortOrder = option.sortOrder
  optionDialog.visible = true
}

const handleAddOption = (questionId) => {
  optionDialog.isEdit = false
  optionDialog.questionId = questionId
  optionForm.optionText = ''
  optionForm.score = 0
  optionForm.sortOrder = 1
  optionDialog.visible = true
}

const saveOption = async () => {
  try {
    if (optionDialog.isEdit) {
      await updateOption(optionDialog.optionId, optionForm)
      ElMessage.success('更新成功')
    } else {
      await addOption(optionDialog.questionId, optionForm)
      ElMessage.success('新增成功')
    }
    optionDialog.visible = false
    loadScale()
  } catch (error) {}
}

const handleDeleteOption = (id) => {
  ElMessageBox.confirm('确认删除该选项吗？', '提示', { type: 'warning' })
      .then(async () => {
        await deleteOption(id)
        ElMessage.success('删除成功')
        loadScale()
      })
      .catch(() => {})
}

onMounted(loadScale)
</script>

<style scoped>
.question-manage-container {
  padding: 20px;
}
.question-item {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
}
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.options {
  margin-top: 10px;
}
</style>