import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
    getPosts, getPostDetail, createPost, updatePost, deletePost,
    likePost, strengthPost, getComments, createComment, deleteComment, report
} from '@/api/community'
import { ElMessage } from 'element-plus'

export const useCommunityStore = defineStore('community', () => {
    // 帖子列表
    const posts = ref([])
    const total = ref(0)
    const loading = ref(false)

    // 当前帖子详情
    const currentPost = ref(null)
    const postLoading = ref(false)

    // 评论列表（树形）
    const comments = ref([])
    const commentsLoading = ref(false)
    const commentTotal = ref(0)

    // ---------- 帖子操作 ----------
    async function fetchPosts(params) {
        loading.value = true
        try {
            const res = await getPosts(params)
            posts.value = res.data.content
            total.value = res.data.totalElements
        } catch (error) {
            console.error('获取帖子列表失败', error)
        } finally {
            loading.value = false
        }
    }

    async function fetchPostDetail(id) {
        postLoading.value = true
        try {
            const res = await getPostDetail(id)
            currentPost.value = res.data
        } catch (error) {
            console.error('获取帖子详情失败', error)
            ElMessage.error('加载帖子失败')
            throw error
        } finally {
            postLoading.value = false
        }
    }

    async function addPost(data) {
        try {
            const res = await createPost(data)
            ElMessage.success('发布成功')
            return res.data
        } catch (error) {
            ElMessage.error('发布失败')
            throw error
        }
    }

    async function editPost(id, data) {
        try {
            const res = await updatePost(id, data)
            ElMessage.success('修改成功')
            return res.data
        } catch (error) {
            ElMessage.error('修改失败')
            throw error
        }
    }

    async function removePost(id) {
        try {
            await deletePost(id)
            ElMessage.success('删除成功')
        } catch (error) {
            ElMessage.error('删除失败')
            throw error
        }
    }

    async function toggleLike(id) {
        try {
            const res = await likePost(id)
            // 更新当前帖子的点赞状态
            if (currentPost.value && currentPost.value.id === id) {
                currentPost.value.likedByCurrentUser = res.data.liked
                if (res.data.liked) {
                    currentPost.value.likeCount++
                } else {
                    currentPost.value.likeCount--
                }
            }
            // 同时更新列表中的对应项
            const postInList = posts.value.find(p => p.id === id)
            if (postInList) {
                postInList.likedByCurrentUser = res.data.liked
                if (res.data.liked) {
                    postInList.likeCount++
                } else {
                    postInList.likeCount--
                }
            }
            return res.data
        } catch (error) {
            console.error('点赞失败', error)
            throw error
        }
    }

    async function toggleStrength(id, strength) {
        try {
            const res = await strengthPost(id, strength)
            // 可以根据需要更新界面，暂时只提示成功
            ElMessage.success(res.data.liked ? '点赞成功' : '取消点赞')
            return res.data
        } catch (error) {
            ElMessage.error('操作失败')
            throw error
        }
    }

    // ---------- 评论操作 ----------
    async function fetchComments(postId, page = 0, size = 10) {
        commentsLoading.value = true
        try {
            const res = await getComments(postId, { page, size })
            comments.value = res.data.content
            commentTotal.value = res.data.totalElements
        } catch (error) {
            console.error('获取评论失败', error)
        } finally {
            commentsLoading.value = false
        }
    }

    async function addComment(postId, data) {
        try {
            const res = await createComment(postId, data)
            ElMessage.success('评论发表成功')
            // 刷新评论列表
            await fetchComments(postId, 0)
            return res.data
        } catch (error) {
            ElMessage.error('评论失败')
            throw error
        }
    }

    async function removeComment(postId, commentId) {
        try {
            await deleteComment(postId, commentId)
            ElMessage.success('删除成功')
            await fetchComments(postId, 0)
        } catch (error) {
            ElMessage.error('删除失败')
            throw error
        }
    }

    // ---------- 举报 ----------
    async function submitReport(data) {
        try {
            await report(data)
            ElMessage.success('举报成功，我们会尽快处理')
        } catch (error) {
            ElMessage.error('举报失败')
            throw error
        }
    }

    return {
        posts,
        total,
        loading,
        currentPost,
        postLoading,
        comments,
        commentsLoading,
        commentTotal,
        fetchPosts,
        fetchPostDetail,
        addPost,
        editPost,
        removePost,
        toggleLike,
        toggleStrength,
        fetchComments,
        addComment,
        removeComment,
        submitReport,
    }
})