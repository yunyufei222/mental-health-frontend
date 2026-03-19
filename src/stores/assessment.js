import { defineStore } from 'pinia'
import { ref } from 'vue'
import { submitAssessment, getAssessmentHistory, getAssessmentResult } from '@/api/assessment'
import { ElMessage } from 'element-plus'

// 解读规则示例（可以根据量表ID和总分生成建议）
const interpretationRules = {
    // 繁荣量表 (id=1) 总分范围 8-56，分数越高越繁荣
    flourishing: (score) => {
        if (score <= 24) return '您的繁荣感较低，可能需要关注心理状态，尝试积极活动。'
        if (score <= 40) return '您的繁荣感中等，可以继续保持，多参与有意义的事情。'
        return '您的繁荣感很高，生活充实，请保持！'
    },
    // 更多规则...
}

export const useAssessmentStore = defineStore('assessment', () => {
    const result = ref(null)
    const history = ref([])
    const historyTotal = ref(0)
    const loading = ref(false)

    async function submit(data) {
        try {
            const res = await submitAssessment(data)
            result.value = res.data
            // 可以在前端补充更详细的解读
            if (result.value.scaleId === 1) { // 假设繁荣量表ID为1
                result.value.detailedInterpretation = interpretationRules.flourishing(result.value.totalScore)
            } else {
                result.value.detailedInterpretation = result.value.interpretation
            }
            ElMessage.success('测评提交成功')
            return res.data
        } catch (error) {
            ElMessage.error('提交失败')
            throw error
        }
    }

    async function fetchHistory(page = 0, size = 10) {
        loading.value = true
        try {
            const res = await getAssessmentHistory({ page, size })
            history.value = res.data.content
            historyTotal.value = res.data.totalElements
        } catch (error) {
            console.error('获取测评历史失败', error)
        } finally {
            loading.value = false
        }
    }

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
        result,
        history,
        historyTotal,
        loading,
        submit,
        fetchHistory,
        fetchResultById,
    }
})