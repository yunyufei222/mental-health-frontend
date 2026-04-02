import { defineStore } from 'pinia'
import { ref } from 'vue'
import { addSchedule } from '@/api/counselor'
import { ElMessage } from 'element-plus'

export const useCounselorStore = defineStore('counselor', () => {
    const schedules = ref([])
    const loading = ref(false)

    async function addScheduleRequest(data) {
        loading.value = true
        try {
            const res = await addSchedule(data)
            ElMessage.success('排班添加成功')
            return res.data
        } catch (error) {
            ElMessage.error(error.response?.data?.message || '添加失败')
            throw error
        } finally {
            loading.value = false
        }
    }

    return {
        schedules,
        loading,
        addScheduleRequest
    }
})