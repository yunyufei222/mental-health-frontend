import request from '@/utils/request'

// 获取分类列表
export function getCategories() {
    return request.get('/admin/articles/categories')  // 注意：这是管理员接口，如果需要公开，可单独创建公开分类接口
}

// 获取文章列表（支持分类、关键词分页）
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

// 获取文章的评论（分页，包含回复）
export function getComments(articleId, params) {
    return request.get(`/articles/${articleId}/comments`, { params })
}

// 发表评论（可带 parentId）
export function createComment(articleId, data) {
    return request.post(`/articles/${articleId}/comments`, data)
}

// 删除评论
export function deleteComment(articleId, commentId) {
    return request.delete(`/articles/${articleId}/comments/${commentId}`)
}

// 点赞评论
export function likeComment(articleId, commentId) {
    return request.post(`/articles/${articleId}/comments/${commentId}/like`)
}