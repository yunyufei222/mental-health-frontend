import request from '@/utils/request'

// ---------- 公开接口 ----------
// 获取分类列表（管理员接口，实际可能需要公开）
export function getCategories() {
    return request.get('/admin/articles/categories')
}

// 获取文章列表（支持分类、标签、关键词分页）
export function getArticles(params) {
    return request.get('/articles', { params })
}

// 获取文章详情
export function getArticleDetail(id) {
    return request.get(`/articles/${id}`)
}

// 点赞文章
export function likeArticle(id) {
    return request.post(`/articles/${id}/like`)
}

// 收藏文章
export function favoriteArticle(id) {
    return request.post(`/articles/${id}/favorite`)
}

// ---------- 评论接口 ----------
export function getComments(articleId, params) {
    return request.get(`/articles/${articleId}/comments`, { params })
}

export function createComment(articleId, data) {
    return request.post(`/articles/${articleId}/comments`, data)
}

export function deleteComment(articleId, commentId) {
    return request.delete(`/articles/${articleId}/comments/${commentId}`)
}

export function likeComment(articleId, commentId) {
    return request.post(`/articles/${articleId}/comments/${commentId}/like`)
}

// ---------- 管理员接口 ----------
export function createArticle(data) {
    return request.post('/admin/articles', data)
}

export function updateArticle(id, data) {
    return request.put(`/admin/articles/${id}`, data)
}

export function deleteArticle(id) {
    return request.delete(`/admin/articles/${id}`)
}

// ---------- 学习记录 ----------
export function getReadHistory(params) {
    return request.get('/user/reads', { params })
}