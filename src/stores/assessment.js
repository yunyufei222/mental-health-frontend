import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    getScales,
    getScaleDetail,
    submitAssessment,
    getAssessmentHistory,
    getAssessmentResult
} from '@/api/assessment'
import { ElMessage } from 'element-plus'

export const useAssessmentStore = defineStore('assessment', () => {
    // 量表列表
    const scales = ref([])
    const total = ref(0)
    const loading = ref(false)

    // 当前量表详情
    const currentScale = ref(null)
    const detailLoading = ref(false)

    // 测评结果
    const result = ref(null)

    // 测评历史
    const history = ref([])
    const historyTotal = ref(0)
    const historyLoading = ref(false)

    // 获取量表列表
    async function fetchScales(page = 0, size = 10) {
        loading.value = true
        try {
            const res = await getScales({ page, size })
            scales.value = res.data.content
            total.value = res.data.totalElements
        } catch (error) {
            console.error('获取量表列表失败', error)
        } finally {
            loading.value = false
        }
    }

    // 获取量表详情
    async function fetchScaleDetail(id) {
        detailLoading.value = true
        try {
            const res = await getScaleDetail(id)
            currentScale.value = res.data
            return res.data
        } catch (error) {
            console.error('获取量表详情失败', error)
            ElMessage.error('加载量表失败')
            throw error
        } finally {
            detailLoading.value = false
        }
    }

    // 提交测评
    async function submit(data) {
        try {
            const res = await submitAssessment(data)
            result.value = res.data
            ElMessage.success('测评提交成功')
            return res.data
        } catch (error) {
            ElMessage.error('提交失败')
            throw error
        }
    }

    // 获取测评历史
    async function fetchHistory(page = 0, size = 10) {
        historyLoading.value = true
        try {
            const res = await getAssessmentHistory({ page, size })
            history.value = res.data.content
            historyTotal.value = res.data.totalElements
        } catch (error) {
            console.error('获取测评历史失败', error)
        } finally {
            historyLoading.value = false
        }
    }

    // 根据ID获取测评结果
    async function fetchResultById(id) {
        try {
            const res = await getAssessmentResult(id)
            result.value = res.data
            return res.data
        } catch (error) {
            ElMessage.error('获取结果失败')
            throw error
        }
    }

    return {
        scales,
        total,
        loading,
        currentScale,
        detailLoading,
        result,
        history,
        historyTotal,
        historyLoading,
        fetchScales,
        fetchScaleDetail,
        submit,
        fetchHistory,
        fetchResultById
    }
})