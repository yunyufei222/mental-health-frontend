import request from '@/utils/request'

// ---------- 公开接口 ----------
// 获取所有活跃量表（分页）
export function getScales(params) {
    return request.get('/scales', { params })
}

// 获取量表详情（包含题目和选项）
export function getScaleDetail(id) {
    return request.get(`/scales/${id}`)
}

// ---------- 管理员接口 ----------
// 获取所有量表（包括未激活）
export function getAllScales(params) {
    return request.get('/admin/scales', { params })
}

// 创建量表
export function createScale(data) {
    return request.post('/admin/scales', data)
}

// 更新量表基本信息
export function updateScale(id, data) {
    return request.put(`/admin/scales/${id}`, data)
}

// 删除量表（逻辑删除）
export function deleteScale(id) {
    return request.delete(`/admin/scales/${id}`)
}

// 添加题目
export function addQuestion(scaleId, data) {
    return request.post(`/admin/scales/${scaleId}/questions`, data)
}

// 更新题目
export function updateQuestion(questionId, data) {
    return request.put(`/admin/scales/questions/${questionId}`, data)
}

// 删除题目
export function deleteQuestion(questionId) {
    return request.delete(`/admin/scales/questions/${questionId}`)
}

// 添加选项
export function addOption(questionId, data) {
    return request.post(`/admin/scales/questions/${questionId}/options`, data)
}

// 更新选项
export function updateOption(optionId, data) {
    return request.put(`/admin/scales/options/${optionId}`, data)
}

// 删除选项
export function deleteOption(optionId) {
    return request.delete(`/admin/scales/options/${optionId}`)
}