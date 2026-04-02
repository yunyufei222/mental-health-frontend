export const MENU_ITEMS = [
    {
        name: '知识库',
        path: '/articles',
        roles: ['USER', 'COUNSELOR', 'ADMIN']  // 所有人可见
    },
    {
        name: '学习记录',
        path: '/user/reads',
        roles: ['USER']
    },
    {
        name: '感恩日记',
        path: '/tools/gratitude',
        roles: ['USER']
    },
    {
        name: '日记历史',
        path: '/tools/gratitude/history',
        roles: ['USER']
    },
    {
        name: '测评中心',
        path: '/assessment',
        roles: ['USER', 'COUNSELOR', 'ADMIN']
    },
    {
        name: '量表管理',
        path: '/admin/scales',
        roles: ['ADMIN']
    },
    {
        name: '社区',
        path: '/community',
        roles: ['USER', 'COUNSELOR', 'ADMIN']
    },
    {
        name: '咨询预约',
        path: '/appointment/counselors',
        roles: ['USER']
    },
    {
        name: '我的预约',
        path: '/appointment/my',
        roles: ['USER']
    },
    {
        name: '预约管理',
        path: '/admin/appointments',
        roles: ['ADMIN']   // 管理员和咨询师均可见
    },
    {
        name: '测评历史',
        path: '/assessment/history',
        roles: ['USER']
    },
    {
        name: '我的预约',
        path: '/counselor/appointments',
        roles: ['COUNSELOR']   // 咨询师可见
    },
    {
        name: '排班管理',
        path: '/counselor/schedules',
        roles: ['COUNSELOR']   // 咨询师可见
    }
]