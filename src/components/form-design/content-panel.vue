<template>
  <div class="content-panel">
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
          @click="handleClick(element, index)"
          :class="[
            'el',
            { active: currentIndex === index && showOperate },
            { error: element?.hasError === true }
          ]"
        >
          <element-comps :element="element" />
          <div
            v-show="showOperate"
            :class="['operate', { 'show-operate': currentIndex === index }]"
          >
            <DeleteIcon class="icon" @click.stop="removeAt(index)" />
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
  }
})

const newList = ref<any[]>([])
const currentIndex = ref(0)
const showOperate = ref(false)
const emits = defineEmits(['currentItemClick'])
const formStore = useFormStore()

/* 事件处理区域 */

// 当前点击的组件
const handleClick = (element: any, index: number) => {
  currentIndex.value = index
  showOperate.value = true
  emits('currentItemClick', element)
}

// 监听组件的移动/添加
const handleDragChange = (e: any) => {
  console.log('e', e)

  if (e.added) {
    // 组件添加
    const element = e.added.element
    const index = e.added.newIndex
    element.field = nanoid() // 使每个组件的字段名都不一样，避免同个组件字段名一样
    handleClick(element, index)
    return
  }

  if (e.moved) {
    // 组件移动
    const element = e.moved.element
    const index = e.moved.newIndex
    handleClick(element, index)
    return
  }
}

// 移出组件
const removeAt = (index: number) => {
  newList.value.splice(index, 1)
  emits('currentItemClick', {})
  formStore.updateConfig(newList.value)
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
