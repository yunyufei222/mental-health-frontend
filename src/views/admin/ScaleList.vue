<template>
  <div class="scale-list-container">
    <div class="header">
      <h2>量表管理</h2>
      <el-button type="primary" @click="createScale">新建量表</el-button>
    </div>

    <el-table :data="scaleStore.adminScales" v-loading="scaleStore.adminLoading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="code" label="编码" width="120" />
      <el-table-column prop="questionCount" label="题目数" width="80" align="center" />
      <el-table-column prop="isActive" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'info'">
            {{ row.isActive ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button size="small" @click="editScale(row.id)">编辑</el-button>
          <el-button size="small" @click="manageQuestions(row.id)">题目管理</el-button>
          <el-button size="small" type="danger" @click="confirmDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="scaleStore.adminTotal"
        @current-change="loadScales"
        layout="prev, pager, next"
        class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScaleStore } from '@/stores/scale'
import { ElMessageBox } from 'element-plus'

const router = useRouter()
const scaleStore = useScaleStore()
const page = ref(1)
const pageSize = ref(20)

const loadScales = () => {
  scaleStore.fetchAdminScales(page.value - 1, pageSize.value)
}

const createScale = () => {
  router.push('/admin/scales/create')
}

const editScale = (id) => {
  router.push(`/admin/scales/edit/${id}`)
}

const manageQuestions = (id) => {
  router.push(`/admin/scales/${id}/questions`)
}

const confirmDelete = (id) => {
  ElMessageBox.confirm('确认删除该量表吗？', '提示', { type: 'warning' })
      .then(async () => {
        await scaleStore.removeScale(id)
        loadScales()
      })
      .catch(() => {})
}

onMounted(loadScales)
</script>

<style scoped>
.scale-list-container {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.pagination {
  margin-top: 30px;
  text-align: center;
}
</style>