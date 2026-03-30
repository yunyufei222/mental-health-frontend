import request from '@/utils/request'

// 获取所有标签（管理员）
export function getTags() {
    return request.get('/public/tags')
}

// 创建标签
export function createTag(data) {
    return request.post('/admin/tags', data)
}

// 删除标签
export function deleteTag(id) {
    return request.delete(`/admin/tags/${id}`)
}