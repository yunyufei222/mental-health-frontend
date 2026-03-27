<template>
  <div class="my-appointments-container">
    <h2>我的预约</h2>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="进行中" name="active">
        <el-table :data="activeAppointments" v-loading="store.myAppointmentsLoading" style="width: 100%">
          <el-table-column prop="counselorName" label="咨询师" />
          <el-table-column label="咨询时间" width="180">
            <template #default="{ row }">
              {{ row.appointmentDate }} {{ row.startTime }}-{{ row.endTime }}
            </template>
          </el-table-column>
          <el-table-column prop="consultationType" label="咨询方式" width="100" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button
                  v-if="row.status === 'PENDING'"
                  type="danger"
                  size="small"
                  @click="handleCancel(row.id)"
              >
                取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="历史记录" name="history">
        <el-table :data="historyAppointments" v-loading="store.myAppointmentsLoading" style="width: 100%">
          <el-table-column prop="counselorName" label="咨询师" />
          <el-table-column label="咨询时间" width="180">
            <template #default="{ row }">
              {{ row.appointmentDate }} {{ row.startTime }}-{{ row.endTime }}
            </template>
          </el-table-column>
          <el-table-column prop="consultationType" label="咨询方式" width="100" />
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="feedback" label="咨询反馈" />
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="store.myAppointmentsTotal"
        @current-change="loadAppointments"
        layout="prev, pager, next"
        class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppointmentStore } from '@/stores/appointment'
import { ElMessageBox } from 'element-plus'

const store = useAppointmentStore()
const activeTab = ref('active')
const page = ref(1)
const pageSize = ref(10)

// 区分进行中和历史
const activeAppointments = computed(() => {
  return store.myAppointments.filter(a => a.status === 'PENDING' || a.status === 'CONFIRMED')
})

const historyAppointments = computed(() => {
  return store.myAppointments.filter(a => a.status === 'COMPLETED' || a.status === 'CANCELLED')
})

const loadAppointments = () => {
  store.fetchMyAppointments(page.value - 1, pageSize.value)
}

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

const handleCancel = (id) => {
  ElMessageBox.confirm('确认取消该预约吗？', '提示', { type: 'warning' })
      .then(async () => {
        await store.cancelAppointmentRequest(id)
        loadAppointments()
      })
      .catch(() => {})
}

onMounted(loadAppointments)
</script>

<style scoped>
.my-appointments-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}
.pagination {
  margin-top: 30px;
  text-align: center;
}
</style>