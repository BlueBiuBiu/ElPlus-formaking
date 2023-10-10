<template>
  <div class="json-viewer">
    <el-input v-model="textarea" :rows="26" type="textarea" placeholder="粘贴复制的JSON" />
    <el-button class="operate" type="primary" @click="submit">确定</el-button>
  </div>
</template>

<script setup lang="ts">
import { useFormStore } from '@/stores/form'
import { ref } from 'vue';

const store = useFormStore()
const textarea: any = ref('')
const emits = defineEmits(['closeDialog'])

const submit = () => {
  store.config = JSON.parse(textarea.value)
  emits('closeDialog')
}
</script>

<style lang="less" scoped>
.json-viewer {
  height: 600px;
  text-align: center;
  .operate {
    margin-top: 20px;
  }
}
</style>
