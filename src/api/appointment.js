import request from '@/utils/request'

// 获取咨询师列表
export function getCounselors(params) {
    return request.get('/counselors', { params })
}

// 获取咨询师详情
export function getCounselorDetail(id) {
    return request.get(`/counselors/${id}`)
}

// 获取咨询师可预约时段
export function getAvailableSchedules(counselorId, date) {
    return request.get(`/counselors/${counselorId}/schedules`, { params: { date } })
}

// 创建预约
export function createAppointment(data) {
    return request.post('/appointments', data)
}

// 获取我的预约列表
export function getMyAppointments(params) {
    return request.get('/appointments/my', { params })
}

// 取消预约
export function cancelAppointment(id) {
    return request.delete(`/appointments/${id}`)
}
