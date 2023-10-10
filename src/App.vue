<template>
  <div class="formmaking">
    <header>
      <el-button
        v-for="(item, index) in operations"
        :key="item.title"
        type="primary"
        text
        @click="itemClick(index)"
      >
        <img v-if="item.href" class="icon" :src="item.href" alt="" />
        <span>{{ item.title }}</span>
      </el-button>
    </header>
    <section>
      <LeftPanel @click-add="add" />
      <ContentPanel
        :list="list"
        @current-item-click="currentItemClick"
        :add-current-index="currentIndex"
      />
      <RightPanel :current-item="currentItem" />
    </section>

    <!-- 预览表单设计 -->
    <PreviewForm :visible="previewVisible" @cancel="previewVisible = false" />

    <!-- 生成JSON -->
    <el-dialog v-model="dialogVisible" :title="currentTitle" width="70%">
      <component
        v-if="dialogVisible && currentIndex !== 1"
        :is="currentComponents"
        @closeDialog="closeDialog"
      ></component>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, markRaw, ref, watch } from 'vue'
import { nanoid } from 'nanoid'
import LeftPanel from '@/components/form-design/left-panel.vue'
import ContentPanel from '@/components/form-design/content-panel.vue'
import RightPanel from '@/components/form-design/right-panel.vue'
import PreviewForm from '@/components/form-design/modals/preview-form.vue'
import GenJson from '@/components/form-generate/gen-json.vue'
import ImportJson from '@/components/form-generate/import-json.vue'
import { useFormStore } from '@/stores/form'
import { useGetImageUrl } from './utils'

/* ts类型定义区域 */

/* 定义数据区域 */
const formStore = useFormStore()
const list = ref<any[]>([])
const currentItem = ref({})
let currentIndex = ref(-1)
const previewVisible = ref(false)
const dialogVisible = ref(false)
const currentTitle = ref('')
const operations = ref([
  {
    title: '预览',
    href: useGetImageUrl('preview.svg'),
  },
  {
    title: '清空',
    href: useGetImageUrl('clean.svg'),
  },
  {
    title: '导入JSON',
    href: useGetImageUrl('import.svg'),
  },
  {
    title: '生成JSON',
    href: useGetImageUrl('json.svg'),
  }
])
const components = ['', '', markRaw(ImportJson), markRaw(GenJson)]
let currentComponents = computed(() => components[currentIndex.value])

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

// 点击功能
const itemClick = (index: number) => {
  if (index === 0) {
    // 预览操作
    previewVisible.value = true
    return
  }
  if (index === 1) {
    currentItem.value = {}
    // 清空操作
    formStore.$reset()
    return
  } else {
    currentIndex.value = index
    dialogVisible.value = true
  }
}

// 子组件发送的事件
const closeDialog = () => {
  dialogVisible.value = false
}

/* 监听 */
formStore.$subscribe((mutation, state) => {
  list.value = state.config
})

watch(currentIndex, (newVal) => {
  switch (newVal) {
    case 0:
      currentTitle.value = '导入JSON'
      return
    case 2:
      currentTitle.value = '预览'
      return
    case 3:
      currentTitle.value = '生成JSON'
      return
  }
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
    justify-content: flex-end;
    padding: 20px;
    width: 100%;
    height: 64px;
    border: 2px solid #f5f5f5;
    background: #fff;

    .icon {
      width: 18px;
      height: 18px;
      margin-right: 5px;
    }
  }

  section {
    display: flex;
    flex: 1;
    width: 100%;
    height: 100%;
  }
}
</style>
