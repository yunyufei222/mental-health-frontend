import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    getAllAppointments,
    getCounselorAppointments,
    confirmAppointment,
    completeAppointment,
    cancelAppointmentByAdmin,
    updateAppointmentStatus
} from '@/api/admin'
import { ElMessage } from 'element-plus'

export const useAdminAppointmentStore = defineStore('adminAppointment', () => {
    const appointments = ref([])
    const total = ref(0)
    const loading = ref(false)

    // 获取所有预约
    async function fetchAllAppointments(page = 0, size = 10, counselorId = null) {
        loading.value = true
        try {
            const params = { page, size }
            if (counselorId) params.counselorId = counselorId
            const res = await getAllAppointments(params)
            appointments.value = res.data.content
            total.value = res.data.totalElements
        } catch (error) {
            console.error('获取预约列表失败', error)
            ElMessage.error('获取预约列表失败')
        } finally {
            loading.value = false
        }
    }

    // 获取咨询师预约（备用）
    async function fetchCounselorAppointments(counselorId, page = 0, size = 10) {
        loading.value = true
        try {
            const res = await getCounselorAppointments(counselorId, { page, size })
            appointments.value = res.data.content
            total.value = res.data.totalElements
        } catch (error) {
            console.error('获取咨询师预约失败', error)
            ElMessage.error('获取预约列表失败')
        } finally {
            loading.value = false
        }
    }

    // 确认预约
    async function confirm(id) {
        try {
            await confirmAppointment(id)
            ElMessage.success('预约已确认')
            // 刷新列表
            await fetchAllAppointments()
            return true
        } catch (error) {
            ElMessage.error(error.response?.data?.message || '确认失败')
            return false
        }
    }

    // 完成咨询
    async function complete(id, feedback = '') {
        try {
            await completeAppointment(id, feedback)
            ElMessage.success('咨询已完成')
            await fetchAllAppointments()
            return true
        } catch (error) {
            ElMessage.error(error.response?.data?.message || '操作失败')
            return false
        }
    }

    // 取消预约
    async function cancel(id) {
        try {
            await cancelAppointmentByAdmin(id)
            ElMessage.success('预约已取消')
            await fetchAllAppointments()
            return true
        } catch (error) {
            ElMessage.error(error.response?.data?.message || '取消失败')
            return false
        }
    }

    // 通用状态更新
    async function updateStatus(id, status) {
        try {
            await updateAppointmentStatus(id, status)
            ElMessage.success('状态已更新')
            await fetchAllAppointments()
            return true
        } catch (error) {
            ElMessage.error(error.response?.data?.message || '更新失败')
            return false
        }
    }

    return {
        appointments,
        total,
        loading,
        fetchAllAppointments,
        fetchCounselorAppointments,
        confirm,
        complete,
        cancel,
        updateStatus
    }
})