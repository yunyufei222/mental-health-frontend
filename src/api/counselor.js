import request from '@/utils/request'

// 获取咨询师可预约时段（公开）
export function getAvailableSchedules(counselorId, date) {
    return request.get(`/counselors/${counselorId}/schedules`, { params: { date } })
}

// 咨询师添加排班
export function addSchedule(data) {
    return request.post('/counselors/schedules', data)
}

// 获取当前咨询师自己的排班列表
export function getMySchedules() {
    return request.get('/counselors/my/schedules')
}