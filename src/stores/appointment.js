import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    getCounselors,
    getCounselorDetail,
    getAvailableSchedules,
    createAppointment,
    getMyAppointments,
    cancelAppointment,
    getCounselorAppointments
} from '@/api/appointment'
import { ElMessage } from 'element-plus'

export const useAppointmentStore = defineStore('appointment', () => {
    // 咨询师列表
    const counselors = ref([])
    const total = ref(0)
    const loading = ref(false)
    // 咨询师自己的预约
    const counselorAppointments = ref([])
    const counselorAppointmentsTotal = ref(0)
    const counselorAppointmentsLoading = ref(false)
    // 当前咨询师详情
    const currentCounselor = ref(null)
    const detailLoading = ref(false)

    // 可预约时段
    const schedules = ref([])
    const schedulesLoading = ref(false)

    // 我的预约列表
    const myAppointments = ref([])
    const myAppointmentsTotal = ref(0)
    const myAppointmentsLoading = ref(false)

    const adminAppointments = ref([])
    const adminTotal = ref(0)
    const adminLoading = ref(false)
    // 获取咨询师列表
    async function fetchCounselors(page = 0, size = 10) {
        loading.value = true
        try {
            const res = await getCounselors({ page, size })
            counselors.value = res.data.content
            total.value = res.data.totalElements
        } catch (error) {
            console.error('获取咨询师列表失败', error)
        } finally {
            loading.value = false
        }
    }

    // 获取咨询师详情
    async function fetchCounselorDetail(id) {
        detailLoading.value = true
        try {
            const res = await getCounselorDetail(id)
            currentCounselor.value = res.data
            return res.data
        } catch (error) {
            console.error('获取咨询师详情失败', error)
            ElMessage.error('加载咨询师信息失败')
            throw error
        } finally {
            detailLoading.value = false
        }
    }

    // 获取可预约时段
    async function fetchSchedules(counselorId, date) {
        schedulesLoading.value = true
        try {
            const res = await getAvailableSchedules(counselorId, date)
            schedules.value = res.data
            return res.data
        } catch (error) {
            console.error('获取可预约时段失败', error)
            ElMessage.error('加载时段失败')
            throw error
        } finally {
            schedulesLoading.value = false
        }
    }

    // 创建预约
    async function createAppointmentRequest(data) {
        try {
            const res = await createAppointment(data)
            ElMessage.success('预约提交成功，请等待咨询师确认')
            return res.data
        } catch (error) {
            ElMessage.error(error.response?.data?.message || '预约失败')
            throw error
        }
    }

    // 获取我的预约列表
    async function fetchMyAppointments(page = 0, size = 10) {
        myAppointmentsLoading.value = true
        try {
            const res = await getMyAppointments({ page, size })
            myAppointments.value = res.data.content
            myAppointmentsTotal.value = res.data.totalElements
        } catch (error) {
            console.error('获取我的预约列表失败', error)
        } finally {
            myAppointmentsLoading.value = false
        }
    }
    // 获取咨询师自己的预约列表
    async function fetchCounselorAppointments(page = 0, size = 10) {
        counselorAppointmentsLoading.value = true
        try {
            const res = await getCounselorAppointments({ page, size })
            counselorAppointments.value = res.data.content
            counselorAppointmentsTotal.value = res.data.totalElements
        } catch (error) {
            console.error('获取咨询师预约列表失败', error)
        } finally {
            counselorAppointmentsLoading.value = false
        }
    }
    // 取消预约
    async function cancelAppointmentRequest(id) {
        try {
            await cancelAppointment(id)
            ElMessage.success('取消成功')
            // 刷新列表
            await fetchMyAppointments()
            return true
        } catch (error) {
            ElMessage.error(error.response?.data?.message || '取消失败')
            throw error
        }
    }
    // 管理员获取所有预约
    async function fetchAllAppointments(page = 0, size = 10, counselorId = null) {
        adminLoading.value = true
        try {
            const params = { page, size }
            if (counselorId) {
                const res = await getCounselorAppointments(counselorId, params)
                adminAppointments.value = res.data.content
                adminTotal.value = res.data.totalElements
            } else {
                const res = await getAllAppointments(params)
                adminAppointments.value = res.data.content
                adminTotal.value = res.data.totalElements
            }
        } catch (error) {
            console.error('获取预约列表失败', error)
        } finally {
            adminLoading.value = false
        }
    }

// 管理员确认预约
    async function adminConfirmAppointment(id) {
        try {
            const res = await confirmAppointment(id)
            ElMessage.success('已确认预约')
            return res.data
        } catch (error) {
            ElMessage.error(error.response?.data?.message || '操作失败')
            throw error
        }
    }

// 管理员完成咨询
    async function adminCompleteAppointment(id, feedback) {
        try {
            const res = await completeAppointment(id, { feedback })
            ElMessage.success('已标记为完成')
            return res.data
        } catch (error) {
            ElMessage.error(error.response?.data?.message || '操作失败')
            throw error
        }
    }

// 管理员取消预约
    async function adminCancelAppointment(id) {
        try {
            const res = await cancelAppointmentByAdmin(id)
            ElMessage.success('已取消预约')
            return res.data
        } catch (error) {
            ElMessage.error(error.response?.data?.message || '操作失败')
            throw error
        }
    }

    return {
        counselors,
        total,
        loading,
        currentCounselor,
        detailLoading,
        schedules,
        schedulesLoading,
        myAppointments,
        myAppointmentsTotal,
        myAppointmentsLoading,
        fetchCounselors,
        fetchCounselorDetail,
        fetchSchedules,
        createAppointmentRequest,
        fetchMyAppointments,
        cancelAppointmentRequest,
        counselorAppointments,
        counselorAppointmentsTotal,
        counselorAppointmentsLoading,
        fetchCounselorAppointments
    }
})