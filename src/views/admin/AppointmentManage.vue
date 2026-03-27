<template>
  <div class="appointment-manage-container">
    <h2>预约管理</h2>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <el-select
          v-model="counselorId"
          placeholder="全部咨询师"
          clearable
          filterable
          @change="handleFilter"
          style="width: 200px;"
      >
        <el-option
            v-for="counselor in counselors"
            :key="counselor.id"
            :label="counselor.nickname || counselor.username"
            :value="counselor.id"
        />
      </el-select>
      <el-select v-model="statusFilter" placeholder="全部状态" clearable @change="handleFilter" style="width: 150px;">
        <el-option label="待确认" value="PENDING" />
        <el-option label="已确认" value="CONFIRMED" />
        <el-option label="已完成" value="COMPLETED" />
        <el-option label="已取消" value="CANCELLED" />
      </el-select>
      <el-button type="primary" @click="loadAppointments">查询</el-button>
    </div>

    <!-- 预约列表 -->
    <el-table :data="filteredAppointments" v-loading="store.loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="counselorName" label="咨询师" />
      <el-table-column label="预约用户" width="120">
        <template #default="{ row }">
          {{ row.userName || row.userId }}
        </template>
      </el-table-column>
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
      <el-table-column prop="problemDesc" label="问题描述" show-overflow-tooltip />
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button
              v-if="row.status === 'PENDING'"
              type="primary"
              size="small"
              @click="handleConfirm(row)"
          >
            确认
          </el-button>
          <el-button
              v-if="row.status === 'CONFIRMED'"
              type="success"
              size="small"
              @click="handleComplete(row)"
          >
            完成
          </el-button>
          <el-button
              v-if="row.status === 'PENDING' || row.status === 'CONFIRMED'"
              type="danger"
              size="small"
              @click="handleCancel(row)"
          >
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="store.total"
        @current-change="loadAppointments"
        layout="prev, pager, next"
        class="pagination"
    />

    <!-- 完成咨询反馈对话框 -->
    <el-dialog v-model="feedbackDialog.visible" title="咨询反馈" width="500px">
      <el-input
          v-model="feedbackDialog.feedback"
          type="textarea"
          :rows="4"
          placeholder="请输入咨询反馈（可选）"
      />
      <template #footer>
        <el-button @click="feedbackDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="submitComplete">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAdminAppointmentStore } from '@/stores/adminAppointment'
import { useUserStore } from '@/stores/user'
import { getCounselors } from '@/api/appointment'
import { ElMessageBox } from 'element-plus'

const store = useAdminAppointmentStore()
const userStore = useUserStore()

// 咨询师列表（用于筛选）
const counselors = ref([])
const counselorId = ref('')
const statusFilter = ref('')
const page = ref(1)
const pageSize = ref(10)

// 反馈对话框
const feedbackDialog = ref({
  visible: false,
  appointmentId: null,
  feedback: ''
})

// 筛选后的预约列表
const filteredAppointments = computed(() => {
  let list = store.appointments
  if (statusFilter.value) {
    list = list.filter(a => a.status === statusFilter.value)
  }
  return list
})

// 加载咨询师列表（用于筛选下拉）
const loadCounselors = async () => {
  try {
    const res = await getCounselors({ page: 0, size: 100 })
    counselors.value = res.data.content
  } catch (error) {
    console.error('获取咨询师列表失败', error)
  }
}

// 加载预约列表
const loadAppointments = () => {
  store.fetchAllAppointments(page.value - 1, pageSize.value, counselorId.value || null)
}

const handleFilter = () => {
  page.value = 1
  loadAppointments()
}

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

// 确认预约
const handleConfirm = (appointment) => {
  ElMessageBox.confirm(`确认预约 #${appointment.id} 吗？`, '提示', { type: 'warning' })
      .then(async () => {
        await store.confirm(appointment.id)
      })
      .catch(() => {})
}

// 完成咨询
const handleComplete = (appointment) => {
  feedbackDialog.value = {
    visible: true,
    appointmentId: appointment.id,
    feedback: ''
  }
}

const submitComplete = async () => {
  await store.complete(feedbackDialog.value.appointmentId, feedbackDialog.value.feedback)
  feedbackDialog.value.visible = false
  feedbackDialog.value.feedback = ''
}

// 取消预约
const handleCancel = (appointment) => {
  ElMessageBox.confirm(`取消预约 #${appointment.id} 吗？`, '提示', { type: 'warning' })
      .then(async () => {
        await store.cancel(appointment.id)
      })
      .catch(() => {})
}

onMounted(() => {
  if (userStore.isAdmin) {
    loadCounselors()
    loadAppointments()
  }
})
</script>

<style scoped>
.appointment-manage-container {
  padding: 20px;
}
.filter-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
}
.pagination {
  margin-top: 30px;
  text-align: center;
}
</style>