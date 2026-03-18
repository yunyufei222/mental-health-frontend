<template>
  <div class="gratitude-edit-container">
    <el-card>
      <template #header>
        <h2>感恩日记 · {{ today }}</h2>
        <p>记录今天发生的三件好事，培养积极心态。</p>
      </template>
      <el-form :model="form" label-width="80px" ref="formRef" :rules="rules">
        <el-form-item label="好事1" prop="item1">
          <el-input v-model="form.item1" placeholder="例如：今天阳光很好" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="好事2" prop="item2">
          <el-input v-model="form.item2" placeholder="例如：朋友给我发来了问候" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="好事3" prop="item3">
          <el-input v-model="form.item3" placeholder="例如：完成了一项任务" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="感想">
          <el-input v-model="form.reflection" type="textarea" :rows="4" placeholder="写写你的感受（可选）" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">保存</el-button>
          <el-button @click="$router.push('/tools/gratitude/history')">查看历史</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGratitudeStore } from '@/stores/gratitude'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useGratitudeStore()
const formRef = ref(null)
const submitting = ref(false)

const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

const form = reactive({
  item1: '',
  item2: '',
  item3: '',
  reflection: '',
})

const rules = {
  item1: [{ required: true, message: '请输入第一件好事', trigger: 'blur' }],
  item2: [{ required: true, message: '请输入第二件好事', trigger: 'blur' }],
  item3: [{ required: true, message: '请输入第三件好事', trigger: 'blur' }],
}

// 加载今天的日记（如果有）
const loadToday = async () => {
  await store.fetchTodayJournal()
  if (store.todayJournal) {
    form.item1 = store.todayJournal.item1
    form.item2 = store.todayJournal.item2
    form.item3 = store.todayJournal.item3
    form.reflection = store.todayJournal.reflection || ''
  }
}

const submitForm = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    await store.saveToday(form)
    // 保存成功后，可以选择跳转到历史页或留在当前页
    router.push('/tools/gratitude/history')
  } catch (error) {
    // 错误已在 store 处理
  } finally {
    submitting.value = false
  }
}

onMounted(loadToday)
</script>

<style scoped>
.gratitude-edit-container {
  max-width: 700px;
  margin: 20px auto;
  padding: 0 20px;
}
</style>