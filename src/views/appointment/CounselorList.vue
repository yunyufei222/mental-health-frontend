<template>
  <div class="counselor-list-container">
    <h2>专业咨询师</h2>
    <p>选择一位适合您的咨询师，开始您的心理成长之旅</p>

    <el-row :gutter="20" v-loading="store.loading">
      <el-col :xs="24" :sm="12" :md="8" v-for="counselor in store.counselors" :key="counselor.id">
        <el-card class="counselor-card" @click="goToDetail(counselor.id)">
          <div class="counselor-header">
            <el-avatar :size="60" :src="counselor.avatar" />
            <div class="counselor-info">
              <h3>{{ counselor.nickname || counselor.username }}</h3>
              <div class="rating">
                <el-rate v-model="counselor.rating" disabled show-score text-color="#ff9900" score-template="{value}" />
                <span class="review-count">({{ counselor.reviewCount }}人评价)</span>
              </div>
            </div>
          </div>
          <div class="counselor-detail">
            <p class="expertise"><strong>擅长领域：</strong>{{ counselor.expertise || '未填写' }}</p>
            <p class="price"><strong>咨询费用：</strong>¥{{ counselor.price }}/小时</p>
            <p class="intro">{{ counselor.introduction?.substring(0, 80) }}...</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="store.total"
        @current-change="loadCounselors"
        layout="prev, pager, next"
        class="pagination"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppointmentStore } from '@/stores/appointment'

const router = useRouter()
const store = useAppointmentStore()
const page = ref(1)
const pageSize = ref(12)

const loadCounselors = () => {
  store.fetchCounselors(page.value - 1, pageSize.value)
}

const goToDetail = (id) => {
  router.push(`/appointment/counselor/${id}`)
}

onMounted(loadCounselors)
</script>

<style scoped>
.counselor-list-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.counselor-list-container h2 {
  margin-bottom: 8px;
  color: #333;
}
.counselor-list-container > p {
  color: #666;
  margin-bottom: 30px;
}
.counselor-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}
.counselor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
.counselor-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}
.counselor-info h3 {
  margin: 0 0 5px;
  font-size: 18px;
}
.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}
.review-count {
  font-size: 12px;
  color: #999;
}
.counselor-detail p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}
.price {
  color: #e6a23c !important;
}
.intro {
  line-height: 1.5;
  color: #999;
}
.pagination {
  margin-top: 30px;
  text-align: center;
}
</style>