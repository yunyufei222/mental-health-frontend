import request from '@/utils/request'

// ---------- 帖子接口 ----------
// 获取帖子列表（支持类型筛选）
export function getPosts(params) {
    return request.get('/community/posts', { params })
}

// 获取帖子详情
export function getPostDetail(id) {
    return request.get(`/community/posts/${id}`)
}

// 发布帖子
export function createPost(data) {
    return request.post('/community/posts', data)
}

// 更新帖子
export function updatePost(id, data) {
    return request.put(`/community/posts/${id}`, data)
}

// 删除帖子（逻辑删除）
export function deletePost(id) {
    return request.delete(`/community/posts/${id}`)
}

// 点赞/取消点赞帖子
export function likePost(id) {
    return request.post(`/community/posts/${id}/like`)
}

// 优势标签点赞
export function strengthPost(id, strength) {
    return request.post(`/community/posts/${id}/strength`, { strength })
}

// ---------- 评论接口 ----------
// 获取帖子评论（分页，顶级评论）
export function getComments(postId, params) {
    return request.get(`/community/posts/${postId}/comments`, { params })
}

// 发表评论
export function createComment(postId, data) {
    return request.post(`/community/posts/${postId}/comments`, data)
}

// 删除评论
export function deleteComment(postId, commentId) {
    return request.delete(`/community/posts/${postId}/comments/${commentId}`)
}

// ---------- 举报接口 ----------
export function report(data) {
    return request.post('/community/reports', data)
}