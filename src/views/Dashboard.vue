<template>
  <div class="home-container">
    <!-- 动态背景光晕 -->
    <div class="ambient-glow"></div>

    <!-- 顶部导航栏（保留登出） -->
    <header class="home-header">
      <div class="logo-area">
        <span class="logo-icon">🌿</span>
        <span class="logo-text">心灵驿站</span>
      </div>
      <div class="user-area">
        <span class="greeting">✨ 你好，{{ displayName }}</span>
        <el-button class="logout-btn" text @click="logout">
          <el-icon><SwitchButton /></el-icon>
          离开
        </el-button>
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="home-main">
      <!-- 漂浮的小元素（动态装饰） -->
      <div class="floating-element leaf-1">🍃</div>
      <div class="floating-element leaf-2">🍂</div>
      <div class="floating-element cloud-1">☁️</div>
      <div class="floating-element cloud-2">☁️</div>
      <div class="floating-element star-1">⭐</div>

      <!-- 欢迎卡片 + 动态暖心语录 -->
      <div class="welcome-card">
        <div class="welcome-text">
          <h1>欢迎回来</h1>
          <div class="dynamic-quote">
            <span class="quote-icon">🌸</span>
            <p class="quote-text">{{ currentQuote }}</p>
          </div>
        </div>
        <div class="welcome-illustration">
          <div class="bouncing-heart">❤️</div>
        </div>
      </div>

      <!-- 今日心情小站（动态表情 + 鼓励语） -->
      <div class="mood-station">
        <div class="mood-avatar">
          <span class="mood-emoji">{{ currentMoodEmoji }}</span>
        </div>
        <div class="mood-message">
          <h3>{{ currentMoodTitle }}</h3>
          <p>{{ currentMoodDesc }}</p>
        </div>
      </div>

      <!-- 温暖小卡片（纯展示，无跳转） -->
      <div class="warm-cards">
        <div class="warm-card">
          <div class="warm-icon">🌱</div>
          <h4>每日一善</h4>
          <p>对自己温柔一点，你已经做得很好了。</p>
          <div class="card-animation"></div>
        </div>
        <div class="warm-card">
          <div class="warm-icon">🧸</div>
          <h4>拥抱情绪</h4>
          <p>允许自己不快乐，也允许自己慢慢快乐起来。</p>
        </div>
        <div class="warm-card">
          <div class="warm-icon">☕</div>
          <h4>暂停一下</h4>
          <p>深呼吸，感受此刻的宁静，你值得休息。</p>
        </div>
      </div>

      <!-- 治愈系小动画区域：会呼吸的花朵 -->
      <div class="healing-garden">
        <div class="flower">
          <div class="petal p1"></div>
          <div class="petal p2"></div>
          <div class="petal p3"></div>
          <div class="petal p4"></div>
          <div class="center"></div>
        </div>
        <p class="garden-text">☀️ 像花一样，安静地生长</p>
      </div>

      <!-- 随机温暖句子轮播（手动切换按钮有趣） -->
      <div class="kind-words">
        <el-button circle class="refresh-btn" @click="refreshQuote">
          <el-icon><Refresh /></el-icon>
        </el-button>
        <p class="kind-text">{{ randomKindWord }}</p>
      </div>
    </main>

    <footer class="home-footer">
      <p>愿你的每一天都充满阳光 🌼</p>
      <div class="footer-wave">🐾</div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { SwitchButton, Refresh } from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

const displayName = computed(() => {
  return userStore.userInfo?.nickname || userStore.userInfo?.username || '朋友'
})

// 登出功能（唯一保留的交互）
const logout = () => {
  userStore.logout()
  router.push('/login')
}

// ---------- 动态内容（纯展示，无路由跳转） ----------
// 暖心语录库
const quotes = [
  "你本身就是温柔的存在，今天也请好好爱自己。",
  "痛苦不是永恒，像云一样会飘过。",
  "允许自己慢慢来，你已经在路上了。",
  "每一次呼吸都是新的开始。",
  "你值得被倾听，也值得被理解。",
  "小小的进步，也值得鼓掌。",
  "今天有没有哪个瞬间让你感到温暖？",
  "你的感受很重要，请好好照顾它。"
]
const currentQuote = ref(quotes[0])

// 随机刷新语录（有趣的交互，但不跳转）
const randomKindWord = ref("🌸 你并不孤单，总有人在意你。")
const kindWordsList = [
  "🌟 你的存在本身就是一份礼物。",
  "🍃 慢慢来，一切都会好起来的。",
  "💖 今天的你，已经足够好了。",
  "🌙 夜晚再黑，也有星星陪伴。",
  "☁️ 放松一下，天空不会塌下来。",
  "🧸 抱抱自己，你很勇敢。"
]

const refreshQuote = () => {
  const randomIndex = Math.floor(Math.random() * kindWordsList.length)
  randomKindWord.value = kindWordsList[randomIndex]
  // 同时改变主语录
  const newIndex = (quotes.indexOf(currentQuote.value) + 1) % quotes.length
  currentQuote.value = quotes[newIndex]
}

// 动态心情小站（根据系统时间改变）
const getMoodByTime = () => {
  const hour = new Date().getHours()
  if (hour < 6) return { emoji: "🌙", title: "深夜温柔", desc: "愿星辰伴你安睡，明天会有光。" }
  if (hour < 12) return { emoji: "☀️", title: "早安能量", desc: "新的一天，新的可能性在等你。" }
  if (hour < 18) return { emoji: "🌻", title: "午后小憩", desc: "累了就歇一歇，你不需要一直奔跑。" }
  return { emoji: "🌆", title: "黄昏宁静", desc: "让晚风带走一天的疲惫。" }
}

const currentMoodEmoji = ref(getMoodByTime().emoji)
const currentMoodTitle = ref(getMoodByTime().title)
const currentMoodDesc = ref(getMoodByTime().desc)

// 每分钟更新一次心情（动态效果）
let moodInterval = null
onMounted(() => {
  moodInterval = setInterval(() => {
    const newMood = getMoodByTime()
    currentMoodEmoji.value = newMood.emoji
    currentMoodTitle.value = newMood.title
    currentMoodDesc.value = newMood.desc
  }, 60000) // 每分钟检查一次
})

onUnmounted(() => {
  if (moodInterval) clearInterval(moodInterval)
})

// 初始化随机温暖词
randomKindWord.value = kindWordsList[Math.floor(Math.random() * kindWordsList.length)]
</script>

<style scoped>
/* ===== 整体氛围 ===== */
.home-container {
  min-height: 100vh;
  background: linear-gradient(145deg, #FEF9F0 0%, #F4F0E7 100%);
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* 动态环境光晕 */
.ambient-glow {
  position: fixed;
  top: -30%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(circle at 30% 40%, rgba(252, 224, 186, 0.3), rgba(255, 245, 220, 0) 70%);
  pointer-events: none;
  animation: slowDrift 20s infinite alternate;
  z-index: 0;
}

@keyframes slowDrift {
  0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
  100% { transform: translate(5%, 3%) scale(1.1); opacity: 0.7; }
}

/* 漂浮装饰物 */
.floating-element {
  position: absolute;
  pointer-events: none;
  font-size: 2rem;
  opacity: 0.4;
  animation: floatAround 18s infinite ease-in-out;
  z-index: 1;
}
.leaf-1 { top: 15%; left: 5%; animation-duration: 20s; }
.leaf-2 { bottom: 20%; right: 3%; animation-duration: 25s; font-size: 1.8rem; }
.cloud-1 { top: 20%; right: 10%; animation-duration: 35s; opacity: 0.3; font-size: 3rem; }
.cloud-2 { bottom: 15%; left: 8%; animation-duration: 30s; opacity: 0.25; font-size: 2.5rem; }
.star-1 { top: 30%; left: 20%; animation-duration: 12s; font-size: 1.2rem; opacity: 0.6; }

@keyframes floatAround {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

/* 头部导航 */
.home-header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: rgba(255, 250, 240, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(200, 180, 140, 0.2);
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.3rem;
  font-weight: 400;
  color: #B48C5C;
}
.logo-icon { font-size: 1.8rem; }
.logo-text { letter-spacing: 1px; }

.user-area {
  display: flex;
  align-items: center;
  gap: 20px;
}
.greeting { color: #A68A64; font-size: 0.95rem; background: rgba(255,255,200,0.3); padding: 6px 14px; border-radius: 40px; }
.logout-btn { color: #C7A47B !important; transition: all 0.2s; }
.logout-btn:hover { background: rgba(199, 164, 123, 0.1); transform: scale(0.98); }

/* 主内容 */
.home-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 40px 60px;
  position: relative;
  z-index: 5;
}

/* 欢迎卡片 */
.welcome-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 252, 245, 0.85);
  backdrop-filter: blur(4px);
  border-radius: 48px;
  padding: 32px 40px;
  margin-bottom: 48px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(220, 195, 150, 0.4);
  transition: all 0.3s;
}
.welcome-text h1 {
  font-size: 2rem;
  font-weight: 450;
  color: #A2713C;
  margin-bottom: 16px;
}
.dynamic-quote {
  display: flex;
  align-items: baseline;
  gap: 12px;
  background: rgba(245, 225, 190, 0.3);
  padding: 12px 20px;
  border-radius: 60px;
  animation: gentlePulse 3s infinite;
}
.quote-icon { font-size: 1.8rem; }
.quote-text { font-size: 1.1rem; color: #7D6342; margin: 0; font-style: italic; }
@keyframes gentlePulse {
  0% { background-color: rgba(245, 225, 190, 0.2); transform: scale(1);}
  50% { background-color: rgba(245, 225, 190, 0.5); transform: scale(1.01);}
  100% { background-color: rgba(245, 225, 190, 0.2); transform: scale(1);}
}
.bouncing-heart {
  font-size: 4rem;
  animation: bounceHeart 1.6s infinite;
  filter: drop-shadow(0 8px 12px rgba(0,0,0,0.1));
}
@keyframes bounceHeart {
  0%,100%{ transform: translateY(0) scale(1);}
  50%{ transform: translateY(-12px) scale(1.1);}
}

/* 心情小站 */
.mood-station {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #FFFFFFCC;
  backdrop-filter: blur(8px);
  border-radius: 56px;
  padding: 20px 32px;
  margin-bottom: 48px;
  border: 1px solid #F5E6D3;
  transition: all 0.2s;
}
.mood-emoji { font-size: 4rem; animation: wiggle 6s infinite; }
@keyframes wiggle {
  0%,100%{ transform: rotate(0deg);}
  25%{ transform: rotate(8deg);}
  75%{ transform: rotate(-6deg);}
}
.mood-message h3 { margin: 0 0 6px; color: #AA7A4A; font-weight: 500; }
.mood-message p { margin: 0; color: #8F765A; }

/* 温暖卡片网格 */
.warm-cards {
  display: flex;
  gap: 28px;
  margin-bottom: 60px;
  flex-wrap: wrap;
}
.warm-card {
  flex: 1;
  background: #FFFEF9;
  border-radius: 36px;
  padding: 28px 20px;
  text-align: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.02);
  border: 1px solid #F0E2D0;
  transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
  position: relative;
  overflow: hidden;
}
.warm-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 28px 32px -16px rgba(100, 70, 40, 0.12);
  border-color: #E2CEB0;
}
.warm-icon { font-size: 2.8rem; margin-bottom: 16px; }
.warm-card h4 { font-size: 1.2rem; color: #B18B5C; margin: 10px 0 8px; }
.warm-card p { color: #8E765B; font-size: 0.9rem; line-height: 1.4; }

/* 治愈系花园（呼吸的花朵） */
.healing-garden {
  text-align: center;
  margin: 40px 0 50px;
  background: rgba(235, 220, 195, 0.3);
  border-radius: 80px;
  padding: 30px 20px;
}
.flower {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  animation: breathe 3s infinite ease-in-out;
}
.petal {
  position: absolute;
  width: 40px;
  height: 40px;
  background: #FFD1A4;
  border-radius: 70% 30% 70% 30%;
  transform-origin: center;
}
.p1 { top: 0; left: 20px; transform: rotate(0deg); }
.p2 { top: 20px; right: 0; transform: rotate(90deg); }
.p3 { bottom: 0; left: 20px; transform: rotate(180deg); }
.p4 { top: 20px; left: 0; transform: rotate(270deg); }
.center {
  position: absolute;
  width: 28px;
  height: 28px;
  background: #F4B942;
  border-radius: 50%;
  top: 26px;
  left: 26px;
  box-shadow: 0 0 0 3px #FFF0C8;
}
@keyframes breathe {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}
.garden-text { color: #B1936E; font-size: 0.95rem; letter-spacing: 1px; }

/* 随机温暖句子区域 */
.kind-words {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: #F9F2E6;
  border-radius: 60px;
  padding: 16px 24px;
  margin-top: 30px;
  margin-bottom: 20px;
}
.refresh-btn {
  background: #EADDCB !important;
  border: none;
  color: #AD8862;
  transition: all 0.2s;
}
.refresh-btn:hover {
  transform: rotate(180deg);
  background: #DFCBB2 !important;
}
.kind-text {
  font-size: 1.1rem;
  color: #836E51;
  margin: 0;
  font-weight: 450;
}

/* 底部 */
.home-footer {
  text-align: center;
  padding: 24px 0 32px;
  color: #CBB894;
  font-size: 0.85rem;
  border-top: 1px solid #EFE2D2;
}
.footer-wave {
  font-size: 1.2rem;
  margin-top: 8px;
  animation: walk 4s infinite;
}
@keyframes walk {
  0% { transform: translateX(-8px); }
  50% { transform: translateX(8px); }
  100% { transform: translateX(-8px); }
}

/* 响应式 */
@media (max-width: 768px) {
  .home-header { padding: 16px 20px; }
  .home-main { padding: 20px; }
  .welcome-card { flex-direction: column; text-align: center; gap: 20px; }
  .warm-cards { flex-direction: column; }
  .mood-station { flex-direction: column; text-align: center; }
}
</style>