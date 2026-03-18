import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    getArticles, getArticleDetail, likeArticle, favoriteArticle,
    getComments, createComment, deleteComment, likeComment,
    getReadHistory
} from '@/api/article'
import { ElMessage } from 'element-plus'

export const useArticleStore = defineStore('article', () => {
    // 文章列表
    const articles = ref([])
    const total = ref(0)
    const loading = ref(false)

    // 当前文章详情
    const currentArticle = ref(null)
    const articleLoading = ref(false)

    // 评论
    const comments = ref([])
    const commentsLoading = ref(false)
    const commentTotal = ref(0)

    // 学习记录
    const readHistory = ref([])
    const readHistoryTotal = ref(0)
    const readHistoryLoading = ref(false)

    // ---------- 文章操作 ----------
    async function fetchArticles(params) {
        loading.value = true
        try {
            const res = await getArticles(params)
            articles.value = res.data.content
            total.value = res.data.totalElements
        } catch (error) {
            console.error('获取文章列表失败', error)
        } finally {
            loading.value = false
        }
    }

    async function fetchArticleDetail(id) {
        articleLoading.value = true
        try {
            const res = await getArticleDetail(id)
            currentArticle.value = res.data
        } catch (error) {
            console.error('获取文章详情失败', error)
            throw error
        } finally {
            articleLoading.value = false
        }
    }

    async function toggleLikeArticle(id) {
        try {
            const res = await likeArticle(id)
            if (currentArticle.value && currentArticle.value.id === id) {
                currentArticle.value.likedByCurrentUser = res.data.liked
                if (res.data.liked) {
                    currentArticle.value.likeCount++
                } else {
                    currentArticle.value.likeCount--
                }
            }
            const articleInList = articles.value.find(a => a.id === id)
            if (articleInList) {
                articleInList.likedByCurrentUser = res.data.liked
                if (res.data.liked) {
                    articleInList.likeCount++
                } else {
                    articleInList.likeCount--
                }
            }
            return res.data
        } catch (error) {
            console.error('操作失败', error)
            throw error
        }
    }

    async function toggleFavoriteArticle(id) {
        try {
            const res = await favoriteArticle(id)
            if (currentArticle.value && currentArticle.value.id === id) {
                currentArticle.value.favoritedByCurrentUser = res.data.favorited
                if (res.data.favorited) {
                    currentArticle.value.favoriteCount++
                } else {
                    currentArticle.value.favoriteCount--
                }
            }
            return res.data
        } catch (error) {
            console.error('操作失败', error)
            throw error
        }
    }

    // ---------- 评论操作 ----------
    async function fetchComments(articleId, page = 0, size = 10) {
        commentsLoading.value = true
        try {
            const res = await getComments(articleId, { page, size })
            comments.value = res.data.content
            commentTotal.value = res.data.totalElements
        } catch (error) {
            console.error('获取评论失败', error)
        } finally {
            commentsLoading.value = false
        }
    }

    async function postComment(articleId, data) {
        try {
            const res = await createComment(articleId, data)
            await fetchComments(articleId, 0)
            ElMessage.success('评论发表成功')
            return res.data
        } catch (error) {
            console.error('发表评论失败', error)
            throw error
        }
    }

    async function removeComment(articleId, commentId) {
        try {
            await deleteComment(articleId, commentId)
            await fetchComments(articleId, 0)
            ElMessage.success('评论删除成功')
        } catch (error) {
            console.error('删除评论失败', error)
            throw error
        }
    }

    async function toggleLikeComment(articleId, commentId) {
        try {
            const res = await likeComment(articleId, commentId)
            const updateCommentLike = (commentsList) => {
                for (let c of commentsList) {
                    if (c.id === commentId) {
                        c.likedByCurrentUser = res.data.liked
                        if (res.data.liked) {
                            c.likeCount++
                        } else {
                            c.likeCount--
                        }
                        return true
                    }
                    if (c.replies && c.replies.length > 0) {
                        if (updateCommentLike(c.replies)) return true
                    }
                }
                return false
            }
            updateCommentLike(comments.value)
            return res.data
        } catch (error) {
            console.error('点赞评论失败', error)
            throw error
        }
    }

    // ---------- 学习记录 ----------
    async function fetchReadHistory(page = 0, size = 10) {
        readHistoryLoading.value = true
        try {
            const res = await getReadHistory({ page, size })
            readHistory.value = res.data.content
            readHistoryTotal.value = res.data.totalElements
        } catch (error) {
            console.error('获取学习记录失败', error)
        } finally {
            readHistoryLoading.value = false
        }
    }

    return {
        articles,
        total,
        loading,
        currentArticle,
        articleLoading,
        comments,
        commentsLoading,
        commentTotal,
        readHistory,
        readHistoryTotal,
        readHistoryLoading,
        fetchArticles,
        fetchArticleDetail,
        toggleLikeArticle,
        toggleFavoriteArticle,
        fetchComments,
        postComment,
        removeComment,
        toggleLikeComment,
        fetchReadHistory,
    }
})