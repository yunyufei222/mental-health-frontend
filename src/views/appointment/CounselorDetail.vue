<template>
  <div class="counselor-detail-container" v-loading="store.detailLoading">
    <el-card v-if="store.currentCounselor">
      <div class="detail-header">
        <el-avatar :size="80" :src="store.currentCounselor.avatar" />
        <div class="detail-info">
          <h2>{{ store.currentCounselor.nickname || store.currentCounselor.username }}</h2>
          <div class="rating">
            <el-rate v-model="store.currentCounselor.rating" disabled show-score text-color="#ff9900" />
            <span class="review-count">({{ store.currentCounselor.reviewCount }}人评价)</span>
          </div>
        </div>
      </div>

      <el-divider />

      <div class="detail-content">
        <div class="info-row">
          <strong>擅长领域：</strong>
          <span>{{ store.currentCounselor.expertise || '未填写' }}</span>
        </div>
        <div class="info-row">
          <strong>咨询费用：</strong>
          <span class="price">¥{{ store.currentCounselor.price }}/小时</span>
        </div>
        <div class="info-row">
          <strong>资质证书：</strong>
          <span>{{ store.currentCounselor.qualification || '未填写' }}</span>
        </div>
        <div class="info-row">
          <strong>个人简介：</strong>
          <p>{{ store.currentCounselor.introduction || '暂无简介' }}</p>
        </div>
      </div>

      <el-divider />

      <div class="booking-section">
        <h3>预约咨询</h3>
        <el-date-picker
            v-model="selectedDate"
            type="date"
            placeholder="选择日期"
            :disabled-date="disabledDate"
            @change="loadSchedules"
        />
        <div v-if="schedulesLoading" class="schedules-loading">
          <el-skeleton :rows="3" animated />
        </div>
        <div v-else-if="availableSchedules.length === 0 && selectedDate" class="no-schedules">
          暂无可用时段
        </div>
        <div v-else-if="selectedDate" class="schedules-list">
          <el-radio-group v-model="selectedSchedule">
            <el-radio
                v-for="schedule in availableSchedules"
                :key="schedule.id"
                :value="schedule.id"
                class="schedule-radio"
            >
              {{ schedule.startTime }} - {{ schedule.endTime }}
            </el-radio>
          </el-radio-group>
        </div>
        <el-button
            type="primary"
            :disabled="!selectedSchedule"
            @click="showBookingForm = true"
            style="margin-top: 20px;"
        >
          立即预约
        </el-button>
      </div>
    </el-card>

    <!-- 预约表单对话框 -->
    <el-dialog
        v-model="showBookingForm"
        title="填写预约信息"
        width="500px"
        @close="resetForm"
    >
      <el-form :model="bookingForm" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="问题描述" prop="problemDesc">
          <el-input
              v-model="bookingForm.problemDesc"
              type="textarea"
              :rows="4"
              placeholder="请简要描述您想要咨询的问题或困惑"
              maxlength="500"
              show-word-limit
          />
        </el-form-item>
        <el-form-item label="咨询方式" prop="consultationType">
          <el-radio-group v-model="bookingForm.consultationType">
            <el-radio value="ONLINE">线上咨询</el-radio>
            <el-radio value="OFFLINE">线下咨询</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBookingForm = false">取消</el-button>
        <el-button type="primary" @click="submitBooking" :loading="submitting">提交预约</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppointmentStore } from '@/stores/appointment'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useAppointmentStore()

const counselorId = ref(route.params.id)
const selectedDate = ref(null)
const selectedSchedule = ref(null)
const showBookingForm = ref(false)
const submitting = ref(false)
const formRef = ref(null)

const bookingForm = ref({
  problemDesc: '',
  consultationType: 'ONLINE'
})

const rules = {
  problemDesc: [{ required: true, message: '请填写问题描述', trigger: 'blur' }]
}

// 计算可预约时段
const availableSchedules = computed(() => {
  return store.schedules.filter(s => !s.isBooked)
})

const schedulesLoading = computed(() => store.schedulesLoading)

// 禁用过去日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
}

// 加载咨询师详情
const loadCounselor = () => {
  store.fetchCounselorDetail(counselorId.value)
}

// 加载可预约时段
const formatDateToYMD = (date) => {
  if (!date) return null
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
const loadSchedules = () => {
  if (!selectedDate.value) return
  store.fetchSchedules(counselorId.value, selectedDate.value)
}

// 提交预约
const submitBooking = async () => {
  await formRef.value.validate()
  submitting.value = true
  try {
    await store.createAppointmentRequest({
      scheduleId: selectedSchedule.value,
      problemDesc: bookingForm.value.problemDesc,
      consultationType: bookingForm.value.consultationType
    })
    showBookingForm.value = false
    // 刷新时段
    await loadSchedules()
    selectedSchedule.value = null
    ElMessage.success('预约成功，请等待咨询师确认')
  } catch (error) {
    // 错误已在 store 中处理
  } finally {
    submitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  bookingForm.value = {
    problemDesc: '',
    consultationType: 'ONLINE'
  }
  if (formRef.value) formRef.value.resetFields()
}

onMounted(() => {
  loadCounselor()
})
</script>

<style scoped>
.counselor-detail-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}
.detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.detail-info h2 {
  margin: 0 0 5px;
}
.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}
.detail-content {
  margin-bottom: 20px;
}
.info-row {
  margin-bottom: 15px;
}
.info-row strong {
  width: 100px;
  display: inline-block;
  color: #333;
}
.price {
  color: #e6a23c;
  font-weight: bold;
}
.booking-section {
  margin-top: 20px;
}
.schedules-list {
  margin-top: 15px;
}
.schedule-radio {
  display: block;
  margin: 10px 0;
}
.no-schedules {
  margin-top: 15px;
  color: #999;
  text-align: center;
}
.schedules-loading {
  margin-top: 15px;
}
</style>