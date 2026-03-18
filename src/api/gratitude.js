import request from '@/utils/request'

// 获取今天的日记
export function getTodayJournal() {
    return request.get('/tools/gratitude/today')
}

// 保存今天的日记
export function saveTodayJournal(data) {
    return request.post('/tools/gratitude/today', data)
}

// 获取历史日记列表
export function getJournalHistory(params) {
    return request.get('/tools/gratitude/history', { params })
}