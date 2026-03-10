// src/utils/date.js

/**
 * 格式化日期为 YYYY-MM-DD
 * @param {string|Date} dateStr - 日期字符串或 Date 对象
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    // 如果日期无效，返回空字符串
    if (isNaN(date.getTime())) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function formatTime(dateStr) {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hour = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day} ${hour}:${minute}`
}