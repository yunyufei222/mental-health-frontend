<template>
  <div class="schedule-list-container">
    <div class="header">
      <h2>我的排班</h2>
      <el-button type="primary" @click="$router.push('/counselor/schedules/add')">添加时段</el-button>
    </div>

    <el-table :data="schedules" v-loading="loading" style="width: 100%">
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="startTime" label="开始时间" width="100" />
      <el-table-column prop="endTime" label="结束时间" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.booked ? 'danger' : 'success'">
            {{ row.booked ? '已预约' : '空闲' }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMySchedules } from '@/api/counselor'
import { ElMessage } from 'element-plus'

const schedules = ref([])
const loading = ref(false)

const loadSchedules = async () => {
  loading.value = true
  try {
    const res = await getMySchedules()
    schedules.value = res.data
  } catch (error) {
    ElMessage.error('获取排班失败')
  } finally {
    loading.value = false
  }
}

onMounted(loadSchedules)
</script>

<style scoped>
.schedule-list-container {
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
</style>