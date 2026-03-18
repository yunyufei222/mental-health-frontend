import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getTags, createTag, deleteTag } from '@/api/tag'
import { ElMessage } from 'element-plus'

export const useTagStore = defineStore('tag', () => {
    const tags = ref([])
    const loading = ref(false)

    async function fetchTags() {
        loading.value = true
        try {
            const res = await getTags({ page: 0, size: 100 })
            tags.value = res.data.content
        } catch (error) {
            console.error('获取标签失败', error)
        } finally {
            loading.value = false
        }
    }

    async function addTag(name) {
        try {
            const res = await createTag({ name })
            tags.value.push(res.data)
            ElMessage.success('标签创建成功')
            return res.data
        } catch (error) {
            ElMessage.error('创建失败')
            throw error
        }
    }

    async function removeTag(id) {
        try {
            await deleteTag(id)
            tags.value = tags.value.filter(t => t.id !== id)
            ElMessage.success('删除成功')
        } catch (error) {
            ElMessage.error('删除失败')
            throw error
        }
    }

    return { tags, loading, fetchTags, addTag, removeTag }
})