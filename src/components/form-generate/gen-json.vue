
<!-- 第一种 -->
<template>
  <div class="json-viewer">
    <json-viewer 
      :value="store.config"
      copyable
      boxed
      expanded
      preview-mode
      sort
      >
    </json-viewer>
  </div>
</template>

<script setup lang="ts">
import JsonViewer from 'vue-json-viewer'
import { useFormStore } from '@/stores/form'

const store = useFormStore()
</script>

<style lang="less" scoped>
.json-viewer {
  height: 600px;
  overflow-y: scroll;
}
</style> 
