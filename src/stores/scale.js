import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getScales, getScaleDetail, getAllScales, createScale, updateScale, deleteScale } from '@/api/scale'
import { ElMessage } from 'element-plus'

export const useScaleStore = defineStore('scale', () => {
    // 用户端
    const scales = ref([])
    const total = ref(0)
    const loading = ref(false)

    const currentScale = ref(null)
    const detailLoading = ref(false)

    // 管理员端
    const adminScales = ref([])
    const adminTotal = ref(0)
    const adminLoading = ref(false)

    // 用户端方法
    async function fetchScales(page = 0, size = 10) {
        loading.value = true
        try {
            const res = await getScales({ page, size })
            scales.value = res.data.content
            total.value = res.data.totalElements
        } catch (error) {
            console.error('获取量表列表失败', error)
        } finally {
            loading.value = false
        }
    }

    async function fetchScaleDetail(id) {
        detailLoading.value = true
        try {
            const res = await getScaleDetail(id)
            currentScale.value = res.data
            return res.data
        } catch (error) {
            console.error('获取量表详情失败', error)
            ElMessage.error('加载量表失败')
            throw error
        } finally {
            detailLoading.value = false
        }
    }

    // 管理员端方法
    async function fetchAdminScales(page = 0, size = 20) {
        adminLoading.value = true
        try {
            const res = await getAllScales({ page, size })
            adminScales.value = res.data.content
            adminTotal.value = res.data.totalElements
        } catch (error) {
            console.error('获取所有量表失败', error)
        } finally {
            adminLoading.value = false
        }
    }

    async function createNewScale(data) {
        try {
            const res = await createScale(data)
            ElMessage.success('创建成功')
            return res.data
        } catch (error) {
            ElMessage.error('创建失败')
            throw error
        }
    }

    async function updateExistingScale(id, data) {
        try {
            const res = await updateScale(id, data)
            ElMessage.success('更新成功')
            return res.data
        } catch (error) {
            ElMessage.error('更新失败')
            throw error
        }
    }

    async function removeScale(id) {
        try {
            await deleteScale(id)
            ElMessage.success('删除成功')
        } catch (error) {
            ElMessage.error('删除失败')
            throw error
        }
    }

    return {
        // 用户端
        scales,
        total,
        loading,
        currentScale,
        detailLoading,
        fetchScales,
        fetchScaleDetail,
        // 管理员端
        adminScales,
        adminTotal,
        adminLoading,
        fetchAdminScales,
        createNewScale,
        updateExistingScale,
        removeScale,
    }
})