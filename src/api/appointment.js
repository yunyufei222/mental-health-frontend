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
    // 如果 date 是 Date 对象，格式化为 yyyy-MM-dd
    const formattedDate = date instanceof Date ? date.toISOString().split('T')[0] : date;
    return request.get(`/counselors/${counselorId}/schedules`, { params: { date: formattedDate } })
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

// 获取咨询师自己的预约列表
export function getCounselorAppointments(params) {
    return request.get('/appointments/counselor/my', { params })
}