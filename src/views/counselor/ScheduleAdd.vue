<template>
  <div class="schedule-add-container">
    <el-card>
      <template #header>
        <h2>添加可预约时段</h2>
        <p>设置您可以提供咨询的时间段，用户将看到这些时段进行预约。</p>
      </template>

      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="日期" prop="date">
          <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="选择日期"
              :disabled-date="disabledDate"
              style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker
              v-model="form.startTime"
              placeholder="开始时间"
              format="HH:mm"
              value-format="HH:mm:ss"
              style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker
              v-model="form.endTime"
              placeholder="结束时间"
              format="HH:mm"
              value-format="HH:mm:ss"
              style="width: 100%"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm" :loading="submitting">添加时段</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCounselorStore } from '@/stores/counselor'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useCounselorStore()
const formRef = ref(null)
const submitting = ref(false)

const form = reactive({
  date: null,
  startTime: null,
  endTime: null
})

const rules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
}

// 禁用过去日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

const submitForm = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    await store.addScheduleRequest(form)
    ElMessage.success('时段添加成功')
    // ✅ 添加成功后跳转回列表页
    router.push('/counselor/schedules')
  } catch (error) {
    // 错误已在 store 中处理
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.schedule-add-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 0 20px;
}
</style>