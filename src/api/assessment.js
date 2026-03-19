import request from '@/utils/request'

// 提交测评答案
export function submitAssessment(data) {
    return request.post('/assessments/submit', data)
}

// 获取当前用户测评历史
export function getAssessmentHistory(params) {
    return request.get('/assessments/history', { params })
}

// 根据ID获取测评结果（可选，如果后端有该接口）
export function getAssessmentResult(id) {
    return request.get(`/assessments/${id}`)
}