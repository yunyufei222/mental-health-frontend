import request from '@/utils/request'

// ---------- 管理员预约管理 ----------
// 获取所有预约（可分页、按咨询师筛选）
export function getAllAppointments(params) {
    return request.get('/admin/appointments', { params })
}

// 获取指定咨询师的预约列表
export function getCounselorAppointments(counselorId, params) {
    return request.get(`/admin/appointments/counselor/${counselorId}`, { params })
}

// 确认预约
export function confirmAppointment(id) {
    return request.put(`/admin/appointments/${id}/confirm`)
}

// 完成咨询（可带反馈）
export function completeAppointment(id, feedback) {
    return request.put(`/admin/appointments/${id}/complete`, { feedback })
}

// 取消预约（管理员）
export function cancelAppointmentByAdmin(id) {
    return request.put(`/admin/appointments/${id}/cancel`)
}

// 通用状态更新（备用）
export function updateAppointmentStatus(id, status) {
    return request.put(`/admin/appointments/${id}/status`, { status })
}