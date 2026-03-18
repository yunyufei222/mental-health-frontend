import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTodayJournal, saveTodayJournal, getJournalHistory } from '@/api/gratitude'
import { ElMessage } from 'element-plus'

export const useGratitudeStore = defineStore('gratitude', () => {
    const todayJournal = ref(null)
    const history = ref([])
    const historyTotal = ref(0)
    const loading = ref(false)

    // 加载今天的日记
    async function fetchTodayJournal() {
        try {
            const res = await getTodayJournal()
            todayJournal.value = res.data
        } catch (error) {
            console.error('获取今日日记失败', error)
        }
    }

    // 保存今天的日记
    async function saveToday(data) {
        try {
            const res = await saveTodayJournal(data)
            todayJournal.value = res.data
            ElMessage.success('日记保存成功')
            return res.data
        } catch (error) {
            ElMessage.error('保存失败')
            throw error
        }
    }

    // 获取历史日记（分页）
    async function fetchHistory(page = 0, size = 10) {
        loading.value = true
        try {
            const res = await getJournalHistory({ page, size })
            history.value = res.data.content
            historyTotal.value = res.data.totalElements
        } catch (error) {
            console.error('获取历史日记失败', error)
        } finally {
            loading.value = false
        }
    }

    return {
        todayJournal,
        history,
        historyTotal,
        loading,
        fetchTodayJournal,
        saveToday,
        fetchHistory,
    }
})