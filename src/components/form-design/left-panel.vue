<template>
  <div class="left-panel">
    <div class="container" v-for="item in config" :key="item.title">
      <div class="box">
        <div class="title">{{ item.title }}</div>
        <draggable
          class="list"
          :list="item.config"
          :group="{ name: 'formmaking', pull: 'clone', put: false }"
          :clone="defaultClone"
          @start="onStart"
          itemKey="type"
        >
          <template #item="{ element }">
            <div class="item" @click="add(element)">
              <span>{{ element.label }}</span>
              <i class="iconfont icon" :class="element.tagIcon"></i>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from "vuedraggable"
import config from "./config/element"

/* ts类型定义区域 */

/* 定义数据区域 */
const defaultClone = (item: any) => {
  return JSON.parse(JSON.stringify(item))
}

const emits = defineEmits(["clickAdd", "clickAddType"])

/* 事件处理区域 */
// 点击自动添加到列表
const add = (element: any) => {
  emits("clickAdd", JSON.parse(JSON.stringify(element)))
}

// 点击拖拽的组件类型
const onStart = (element: any) => {
  emits("clickAddType", element.clone.innerText)
}

/* 监听 */

/* 生命周期 */
</script>

<style lang="less" scoped>
.left-panel {
  width: 260px;
  height: 100%;
  background-color: #fff;
  padding: 24px;
  .container {
    .box {
      margin-bottom: 16px;
    }
    .title {
      font-size: 16px;
      line-height: 32px;
    }
    .list {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      gap: 16px;
      .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: calc((100% - 16px) / 2);
        font-size: 12px;
        padding: 6px 8px;
        cursor: grab;
        border: 1px solid #e4e5e7;
        border-radius: 5px;

        &:hover {
          border-color: #3370ff;
        }
        .icon {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
</style>
