import request from '@/utils/request'

// 获取所有活跃量表（分页）
export function getScales(params) {
    return request.get('/scales', { params })
}

// 获取量表详情（包含题目和选项）
export function getScaleDetail(id) {
    return request.get(`/scales/${id}`)
}

// 提交测评答案
export function submitAssessment(data) {
    return request.post('/assessments/submit', data)
}

// 获取当前用户测评历史（分页）
export function getAssessmentHistory(params) {
    return request.get('/assessments/history', { params })
}

// 根据ID获取测评结果详情
export function getAssessmentResult(id) {
    return request.get(`/assessments/${id}`)
}