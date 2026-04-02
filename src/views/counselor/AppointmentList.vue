<template>
  <div class="counselor-appointment-container">
    <h2>我的预约</h2>
    <p>查看用户提交的预约申请</p>

    <el-table :data="store.counselorAppointments" v-loading="store.counselorAppointmentsLoading" style="width: 100%">
      <el-table-column prop="id" label="预约ID" width="80" />
      <el-table-column label="预约用户" min-width="120">
        <template #default="{ row }">
          {{ row.userName || '用户' }}
        </template>
      </el-table-column>
      <el-table-column label="预约时间" width="180">
        <template #default="{ row }">
          {{ row.appointmentDate }} {{ row.startTime }}-{{ row.endTime }}
        </template>
      </el-table-column>
      <el-table-column prop="problemDesc" label="问题描述" show-overflow-tooltip />
      <el-table-column prop="consultationType" label="咨询方式" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button
              v-if="row.status === 'PENDING'"
              type="primary"
              size="small"
              @click="handleConfirm(row.id)"
          >
            确认
          </el-button>
          <el-button
              v-if="row.status === 'CONFIRMED'"
              type="success"
              size="small"
              @click="handleComplete(row.id)"
          >
            完成
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="store.counselorAppointmentsTotal"
        @current-change="loadAppointments"
        layout="prev, pager, next"
        class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAppointmentStore } from '@/stores/appointment'
import { ElMessage, ElMessageBox } from 'element-plus'

const store = useAppointmentStore()
const page = ref(1)
const pageSize = ref(10)

// 状态显示
const getStatusType = (status) => {
  const map = {
    PENDING: 'warning',
    CONFIRMED: 'success',
    COMPLETED: 'info',
    CANCELLED: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    PENDING: '待确认',
    CONFIRMED: '已确认',
    COMPLETED: '已完成',
    CANCELLED: '已取消'
  }
  return map[status] || status
}

const loadAppointments = () => {
  store.fetchCounselorAppointments(page.value - 1, pageSize.value)
}

// 确认预约（调用管理员接口，此处简化，实际可能需要单独接口）
const handleConfirm = (id) => {
  ElMessageBox.confirm('确认接受该预约吗？', '提示', { type: 'warning' })
      .then(() => {
        // 这里需要调用后端接口确认预约，因后端已实现 `/api/admin/appointments/{id}/confirm`，但咨询师可能无权限。
        // 根据实际权限，可能需要咨询师专用的确认接口。此处暂做演示，实际需补充。
        ElMessage.success('功能开发中')
      })
      .catch(() => {})
}

// 完成咨询
const handleComplete = (id) => {
  ElMessageBox.prompt('请输入咨询反馈（可选）', '完成咨询', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(({ value }) => {
    // 调用完成咨询接口（需后端支持）
    ElMessage.success('功能开发中')
  }).catch(() => {})
}

onMounted(loadAppointments)
</script>

<style scoped>
.counselor-appointment-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
.pagination {
  margin-top: 30px;
  text-align: center;
}
</style>