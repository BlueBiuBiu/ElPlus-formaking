<template>
  <div class="formmaking">
    <header>
      <el-button @click="previewForm"> 预览 </el-button>
    </header>
    <content>
      <LeftPanel @click-add="add" />
      <ContentPanel
        :list="list"
        @current-item-click="currentItemClick"
        :add-current-index="currentIndex"
      />
      <RightPanel :current-item="currentItem" />
    </content>

    <!-- 预览表单设计 -->
    <PreviewForm :visible="previewVisible" @cancel="previewVisible = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { nanoid } from 'nanoid'
import LeftPanel from '@/components/form-design/left-panel.vue'
import ContentPanel from '@/components/form-design/content-panel.vue'
import RightPanel from '@/components/form-design/right-panel.vue'
import { useFormStore } from '@/stores/form'

/* ts类型定义区域 */

/* 定义数据区域 */
const formStore = useFormStore()
const list = ref<any[]>([])
const currentItem = ref({})
let currentIndex = ref(-1)
const previewVisible = ref(false)

/* 事件处理区域 */
const currentItemClick = (item: any) => {
  currentItem.value = item
}

const add = (element: any) => {
  element.field = nanoid()
  list.value.push(element)
  formStore.config = list.value
  formStore.computeErrorContent()
  formStore.currentIndex = list.value.length - 1
}

// 表单设计预览
const previewForm = () => {
  previewVisible.value = true
}

/* 监听 */
formStore.$subscribe((mutation, state) => {
  list.value = state.config
})

/* 生命周期 */
</script>

<style lang="less" scoped>
.formmaking {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;

  header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    width: 100%;
    height: 64px;
    border: 2px solid #f5f5f5;
    background: #fff;
  }

  content {
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
  }
}
</style>
