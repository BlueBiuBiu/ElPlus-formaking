<template>
  <el-dialog
    width="620px"
    class="add-modal"
    title="选择部门"
    :model-value="visible"
    @close="handleCancel"
  >
    <div class="container">
      <div class="left">
        <a-input-search v-model="searchKey" placeholder="请输入" />
        <a-tree
          :data="treeData"
          :field-names="{
            key: 'id',
            title: 'name',
            children: 'children'
          }"
          checked-strategy="child"
          :checked-keys="selectedKeys"
          @update:checked-keys="handleCheckedChange"
          blockNode
          checkable
        >
          <template #title="nodeData">
            <template v-if="getMatchIndex(nodeData?.name) < 0">{{ nodeData?.name }}</template>
            <span v-else>
              {{ nodeData?.name?.substr(0, getMatchIndex(nodeData?.name))
              }}<span class="text-[#f16464]">{{
                nodeData?.name?.substr(getMatchIndex(nodeData?.name), searchKey.length)
              }}</span
              >{{ nodeData?.name?.substr(getMatchIndex(nodeData?.name) + searchKey.length) }}
            </span>
          </template>
        </a-tree>
      </div>
      <div class="right">
        <div class="selected-title">已选: {{ getCheckLeaf().length }}个</div>
        <div class="item" v-for="item in getCheckLeaf()" :key="item.id">
          <span>{{ item.name }}</span>
          <icon-close class="cursor-pointer" @click="delSelect(item)" />
        </div>
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSaveAndSubmit"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

/* ts类型定义区域 */

/* 定义数据区域 */
const props = defineProps<{
  sections: any[]
  multiple: boolean
  visible: boolean
}>()

// 搜索树
const selectedKeys = ref<(string | number)[]>([])
const originTreeData = ref<any[]>([])
const searchKey = ref('')

const treeData = computed(() => {
  if (!searchKey.value) return originTreeData.value
  return searchData(searchKey.value)
})

const emits = defineEmits(['comfirm', 'cancel'])

/* 事件处理区域 */
const handleCancel = () => {
  emits('cancel')
}

// 保存并提交
const handleSaveAndSubmit = async () => {
  console.log('selectedKeys', selectedKeys.value)
  // console.log(getCheckLeaf())
  emits('comfirm', getCheckLeaf())
}

/**
 * 搜索树相关
 */
const searchData = (keyword: string) => {
  const loop = (data: any) => {
    const result: any = []
    data.forEach((item: any) => {
      if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
        result.push({ ...item })
      } else if (item.children) {
        const filterData = loop(item.children)
        if (filterData.length) {
          result.push({
            ...item,
            children: filterData
          })
        }
      }
    })
    return result
  }

  return loop(originTreeData.value)
}

const getMatchIndex = (name: string) => {
  if (!searchKey.value) return -1
  return name.toLowerCase().indexOf(searchKey.value.toLowerCase())
}

const getCheckLeaf = () => {
  const result: any = []

  const loop = (data: any) => {
    data.forEach((item: any) => {
      if (selectedKeys.value.includes(item.id as never)) {
        result.push(item)
      } else if (item.children) {
        loop(item.children)
      }
    })
  }

  loop(originTreeData.value)
  return result
}

const delSelect = (item: any) => {
  selectedKeys.value = selectedKeys.value.filter((iten) => item.id !== iten)
}

// 获取部门人员
const getOrganizationListM = async () => {
  originTreeData.value = [
    {
      name: 'xxx表单设计部',
      id: '123456',
      value: '123456',
      children: []
    }
  ]
}

// 限制是否允许添加多个
const handleCheckedChange = (value: (string | number)[]) => {
  if (!props.multiple && value.length > 1) {
    ElMessage({
      message: '只能选择一个部门',
      type: 'warning'
    })
    return
  }

  selectedKeys.value = value
}

/* 监听 */
watch(
  () => props.sections,
  (newVal) => {
    selectedKeys.value = newVal.map((item) => item.id)
  },
  { deep: true }
)

/* 生命周期 */
onMounted(() => {
  getOrganizationListM()
})
</script>

<style lang="less" scoped>
.add-modal {
  padding: 0 30px;
  .container {
    display: flex;
    height: 300px;
    border: 1px solid #f0f0f2;
    .left {
      flex: 1;
      padding: 20px;
      border-right: 1px solid #f0f0f2;
      overflow-y: auto;
    }
    .right {
      flex: 1;
      padding: 20px;
      overflow-y: auto;

      .selected-title {
        font-size: 14px;
        color: #1d2129;
        line-height: 32px;
      }
      .item {
        display: flex;
        line-height: 30px;
        justify-content: space-between;
        align-items: center;
        .close-icon {
          cursor: pointer;
        }
      }
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
