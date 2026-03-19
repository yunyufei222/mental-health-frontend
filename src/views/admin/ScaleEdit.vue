<template>
  <div class="scale-edit-container">
    <el-card>
      <template #header>
        <h2>{{ isEdit ? '编辑量表' : '新建量表' }}</h2>
      </template>
      <el-form :model="form" label-width="100px" ref="formRef" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="例如：繁荣量表" />
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="例如：FLOURISHING" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="指导语" prop="instruction">
          <el-input v-model="form.instruction" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="维度数量" prop="dimensionCount">
          <el-input-number v-model="form.dimensionCount" :min="0" />
        </el-form-item>
        <el-form-item label="状态" prop="isActive">
          <el-radio-group v-model="form.isActive">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">保存</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useScaleStore } from '@/stores/scale'
import { getScaleDetail } from '@/api/scale'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const scaleStore = useScaleStore()
const id = route.params.id
const isEdit = computed(() => !!id)

const formRef = ref(null)
const form = ref({
  name: '',
  code: '',
  description: '',
  instruction: '',
  dimensionCount: 0,
  isActive: true,
})

const rules = {
  name: [{ required: true, message: '请输入量表名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入编码', trigger: 'blur' }],
}

// 加载数据（编辑模式）
const loadData = async () => {
  try {
    const res = await getScaleDetail(id)
    const scale = res.data
    form.value = {
      name: scale.name,
      code: scale.code,
      description: scale.description || '',
      instruction: scale.instruction || '',
      dimensionCount: scale.dimensionCount || 0,
      isActive: scale.isActive,
    }
  } catch (error) {
    ElMessage.error('加载失败')
    router.back()
  }
}

const submitForm = async () => {
  await formRef.value.validate()
  try {
    if (isEdit.value) {
      await scaleStore.updateExistingScale(id, form.value)
    } else {
      await scaleStore.createNewScale(form.value)
    }
    router.push('/admin/scales')
  } catch (error) {}
}

onMounted(() => {
  if (isEdit.value) loadData()
})
</script>

<style scoped>
.scale-edit-container {
  max-width: 600px;
  margin: 20px auto;
}
</style>