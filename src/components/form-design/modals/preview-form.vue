<template>
  <el-dialog :model-value="visible" title="预览" fullscreen @close="handleCancel" center>
    <GenForm v-if="visible" />
    <template #footer> </template>
  </el-dialog>
</template>

<script setup lang="ts">
import GenForm from "../../form-generate/gen-form.vue"

/* ts类型定义区域 */

/* 定义数据区域 */
defineProps<{
  visible: boolean
}>()
const emits = defineEmits(["cancel"])

/* 事件处理区域 */
const handleCancel = () => {
  emits("cancel")
}

/* 监听 */

/* 生命周期 */
</script>
