<template>
  <div class="scale-list-container">
    <h2>心理测评中心</h2>
    <p>选择一份量表，开始了解你的心理状态。</p>

    <el-row :gutter="20" v-loading="scaleStore.loading">
      <el-col :xs="24" :sm="12" :md="8" v-for="scale in scaleStore.scales" :key="scale.id">
        <el-card class="scale-card" @click="goToAssessment(scale.id)">
          <h3>{{ scale.name }}</h3>
          <p class="description">{{ scale.description }}</p>
          <div class="meta">
            <span>{{ scale.questionCount }} 题</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="scaleStore.total"
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

const router = useRouter()
const scaleStore = useScaleStore()
const page = ref(1)
const pageSize = ref(9)

const loadScales = () => {
  scaleStore.fetchScales(page.value - 1, pageSize.value)
}

const goToAssessment = (id) => {
  router.push(`/assessment/${id}`)
}

onMounted(loadScales)
</script>

<style scoped>
.scale-list-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
.scale-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}
.scale-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.scale-card h3 {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
}
.description {
  color: #666;
  font-size: 14px;
  height: 60px;
  overflow: hidden;
  margin-bottom: 10px;
}
.meta {
  color: #999;
  font-size: 13px;
}
.pagination {
  text-align: center;
  margin-top: 30px;
}
</style>