<template>
  <div class="content-panel">
    <div class="title" contenteditable @input="updateFormTitle">{{ formTitle }}</div>
    <draggable
      class="container"
      :list="newList"
      group="formmaking"
      item-key="id"
      animation="300"
      @add="dragDown"
      @end="dragEnd"
      @change="handleDragChange"
    >
      <template #item="{ element, index }">
        <div
          @click.capture="handleClick(element, index)"
          :class="[
            'el',
            { active: currentIndex === index && showOperate },
            { error: element?.hasError === true }
          ]"
        >
          <!-- 栅栏布局 -->
          <template v-if="element.type === 'fence'">
            <template v-for="fence in element.fenceCount" :key="fence">
              <draggable
                :list="element.fenceChildren[`child${fence}`]"
                :group="{
                  name: 'formmaking',
                  pull: true,
                  put: handlePut
                }"
                itemKey="tid"
                @click="fenceClick(element, fence, index)"
                @add="dragDown"
                @change="handleDragChange($event, fence, index)"
                :class="[
                  'fence',
                  {
                    active: currentFenceIndex === fence && !showFenceItem && currentIndex === index
                  }
                ]"
              >
                <template #item="{ element: elementItem, index: indey }">
                  <div
                    @click.stop="elementClick(element, indey, fence, index)"
                    :class="[
                      'fence-item',
                      {
                        active:
                          currentIndex === index &&
                          currentFenceIndex === fence &&
                          currentFenceItemIndex === indey
                      }
                    ]"
                  >
                    <element-comps :element="elementItem" />
                    <div
                      :class="[
                        'operate',
                        {
                          'show-operate':
                            currentFenceIndex === fence && !showFenceItem && currentIndex === index
                        }
                      ]"
                      @click="removeFence(element, fence)"
                    >
                      <el-icon class="icon" :size="14" color="#ffffff"><IEpDelete /></el-icon>
                    </div>
                    <div
                      :class="[
                        'operate',
                        {
                          'show-operate':
                            currentFenceIndex === fence &&
                            currentFenceItemIndex === indey &&
                            showFenceItem &&
                            currentIndex === index
                        }
                      ]"
                      @click="removeFenceItem(element, indey, fence)"
                    >
                      <el-icon class="icon" :size="14" color="#ffffff"><IEpDelete /></el-icon>
                    </div>
                  </div>
                </template>
              </draggable>

              <!-- 栅栏没有元素时显示 -->
              <div
                class="empty-fence-item"
                v-if="
                  !element.fenceChildren[`child${fence}`].length &&
                  currentFenceIndex === fence &&
                  !showFenceItem &&
                  currentIndex === index
                "
              >
                <div :class="['operate', 'show-operate']" @click="removeFence(element, fence)">
                  <el-icon class="icon" :size="14" color="#ffffff"><IEpDelete /></el-icon>
                </div>
              </div>
            </template>
          </template>

          <element-comps v-else :element="element" />

          <div
            v-show="showOperate"
            :class="['operate', { 'show-operate': currentIndex === index }]"
          >
            <el-icon
              v-if="element.type === 'fence'"
              class="icon"
              :size="14"
              color="#ffffff"
              @click.stop="addFenceCount(element)"
              ><IEpPlus />
            </el-icon>
            <el-icon class="icon" :size="14" color="#ffffff" @click.stop="removeAt(index)">
              <IEpDelete />
            </el-icon>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="drag-tip">
          <MoveIcon class="tip-icon" />
          <span>点击或拖拽左侧控件至此处</span>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import ElementComps from './ElementComps.vue'
import { useFormStore } from '@/stores/form'
import { nanoid } from 'nanoid'
import MoveIcon from '../icons/move.vue'
import DeleteIcon from '../icons/delete.vue'

/* ts类型定义区域 */

/* 定义数据区域 */
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  currentElementType: {
    type: String,
    required: true
  }
})

const newList = ref<any[]>([])
const currentIndex = ref(0)
const currentFenceIndex = ref(-1)
const currentFenceItemIndex = ref(-1)
const showOperate = ref(false)
const showFenceItem = ref(false) // 点击栅栏中的子元素
const emits = defineEmits(['currentItemClick'])
const formStore = useFormStore()

/* 事件处理区域 */

// 当前点击的组件
const handleClick = (element: any, index: number) => {
  emits('currentItemClick', element)

  // 操作样式的显示/重置
  currentIndex.value = index
  showOperate.value = true
  showFenceItem.value = false
  currentFenceIndex.value = -1
  currentFenceItemIndex.value = -1
}

// 选择某个位置的栅栏
const fenceClick = (element: any, fence: number, index: number) => {
  console.log('fenceClick')

  // 操作样式的显示/重置
  currentFenceIndex.value = fence
  currentIndex.value = index
  currentFenceItemIndex.value = -1
  showOperate.value = false
  showFenceItem.value = false
}

// 选择栅栏中具体选择的元素
const elementClick = (element: any, indey: number, fence: number, index: number) => {
  emits('currentItemClick', element.fenceChildren[`child${fence}`][indey])

  // 操作样式的显示/重置
  currentFenceIndex.value = fence
  currentIndex.value = index
  currentFenceItemIndex.value = indey
  showOperate.value = false
  showFenceItem.value = true
}

// 监听组件的移动/添加
const handleDragChange = (e: any, fence?: number, fenceIndex?: number) => {
  console.log('e', e)

  if (e.added) {
    // 组件添加
    const element = e.added.element
    const index = e.added.newIndex
    element.field = nanoid() // 使每个组件的字段名都不一样，避免同个组件字段名一样

    handleClick(element, index)
    if (fence && fenceIndex !== undefined) {
      // 在栅栏布局中添加元素时
      currentFenceIndex.value = fence
      currentIndex.value = fenceIndex
      currentFenceItemIndex.value = index
      showOperate.value = false
      showFenceItem.value = true
    }
    return
  }

  if (e.moved) {
    // 组件移动
    const element = e.moved.element
    const index = e.moved.newIndex

    handleClick(element, index)
    if (fence && fenceIndex !== undefined) {
      // 在栅栏布局中移动元素时
      currentFenceIndex.value = fence
      currentIndex.value = fenceIndex
      currentFenceItemIndex.value = index
      showOperate.value = false
      showFenceItem.value = true
    }
    return
  }
}

// 移出组件
const removeAt = (index: number) => {
  newList.value.splice(index, 1)
  emits('currentItemClick', {})
  formStore.updateConfig(newList.value)
}

// 删除某个位置选择的栅栏
const removeFence = (element: any, fence: number) => {
  if (element.fenceCount - 1 < 1) {
    return
  }
  element.fenceCount--
  for (let i = fence; i <= Object.keys(element.fenceChildren).length; i++) {
    element.fenceChildren[`child${i}`] = element.fenceChildren[`child${i + 1}`]
  }
  element.fenceChildren['child6'] = []
  if (element.fenceCount < 1) element.fenceCount = 1
}

// 删除某个位置选择的栅栏的具体选择的元素
const removeFenceItem = (element: any, index: number, fence: number) => {
  element.fenceChildren[`child${fence}`].splice(index, 1)
}

// 增加栅栏数量
const addFenceCount = (element: any) => {
  if (element.fenceCount < Object.keys(element.fenceChildren).length) {
    element.fenceCount++
  }
}

// 限制拖放行为，不允许在栅栏布局中放置栅栏
const handlePut = () => {
  if (props.currentElementType === '栅栏布局') {
    return false
  }
}

// 拖拽放下触发
const dragDown = () => {
  formStore.updateConfig(newList.value)
}

// 拖拽结束
const dragEnd = () => {
  showOperate.value = true
}

/* 监听 */
watch(
  () => formStore.config,
  (newVal) => {
    newList.value = newVal
    formStore.updateConfig(newVal)
  }
)

watch(props.list, (newVal) => {
  formStore.updateConfig(newVal)
})

watch(
  () => formStore.tempConfig,
  (newVal) => {
    newVal.forEach((item) => {
      newList.value.forEach((iten) => {
        if (item.field === iten.field) {
          iten.hasError = item.hasError
        }
      })
    })

    // newList.value = newVal
  }
)

watch(
  () => formStore.currentIndex,
  (newVal) => {
    const element = formStore.config[newVal]
    handleClick(element, newVal)
  }
)
/* 生命周期 */
</script>

<style lang="less" scoped>
.content-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  height: calc(100% - 70px);
  box-sizing: border-box;
  margin: 20px 100px 50px;
  padding: 24px;
  background: #fff;
  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    outline: none;
  }
  .container {
    flex: 1;
    .el {
      display: flex;
      margin: 3px;
      position: relative;
      border: 1px dashed rgba(170, 170, 170, 0.5);
      background-color: rgba(236, 245, 255, 0.3);
      overflow: hidden;
      min-height: 50px;
      min-width: 50px;
      outline: 1px solid #fff;

      .item {
        margin-bottom: 18px;
      }

      .operate {
        position: absolute;
        right: 0;
        top: 0;
        display: flex;
        align-items: center;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        display: none;
        background: #076bb0;

        .icon {
          margin: 5px 5px 0 7px;
        }
      }
      .show-operate {
        display: block;
      }
      .fence {
        position: relative;
        width: 100%;
        margin: 5px;
        padding: 5px;
        border: 1px solid #e5e5e5;

        .fence-item {
          border: 1px solid rgba(170, 170, 170, 0.5);
          padding: 2px;

          &:not(:last-child) {
            margin-bottom: 5px;
          }
        }
      }

      .empty-fence-item {
        position: relative;
        .operate {
          top: 5px;
          right: 5px;
        }
      }

      .active {
        position: relative;
        outline: 2px solid #076bb0;
        border: 1px solid #076bb0;
      }
    }

    .drag-tip {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 5px;
      color: #8f959e;
      font-size: 16px;
      line-height: 20px;
      padding: 6px 12px;
      background: #f5f6f7;

      .tip-icon {
        width: 20px;
        position: relative;
        bottom: 1px;
        margin-right: 5px;
      }
    }
    .error {
      position: relative;
      border: 1px solid #f54a45;
    }
    .active {
      position: relative;
      outline: 2px solid #076bb0;
      border: 1px solid #076bb0;
    }
  }
}
</style>
