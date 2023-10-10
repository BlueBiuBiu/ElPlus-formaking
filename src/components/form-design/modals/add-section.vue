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
        <el-input class="search" v-model="searchKey" placeholder="请输入" :suffix-icon="Search" />
        <el-tree
          ref="treeRef"
          :data="treeData"
          data-key="id"
          :show-checkbox="multiple"
          v-model:default-checked-keys="selectedKeys"
          default-expand-all
          @check-change="handleCheckedChange"
          @node-click="handleNodeclick"
        >
          <template #default="{ data }">
            <template v-if="getMatchIndex(data?.label) < 0">{{ data?.label }}</template>
            <span v-else>
              {{ data?.label?.substr(0, getMatchIndex(data?.label))
              }}<span class="text-[#f16464]">{{
                data?.label?.substr(getMatchIndex(data?.label), searchKey.length)
              }}</span
              >{{ data?.label?.substr(getMatchIndex(data?.label) + searchKey.length) }}
            </span>
          </template>
        </el-tree>
      </div>
      <div class="right">
        <div class="selected-title">已选: {{ getCheckLeaf().length }}个</div>
        <div class="item" v-for="item in getCheckLeaf()" :key="item.id">
          <span>{{ item.label }}</span>
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
import { Search } from '@element-plus/icons-vue'

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
const treeRef = ref()

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
      if (item.label.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
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

const getMatchIndex = (label: string) => {
  if (!searchKey.value) return -1
  return label.toLowerCase().indexOf(searchKey.value.toLowerCase())
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
      id: 1,
      label: 'xxx公司',
      children: [
        {
          id: 2,
          label: '表单设计部'
        },
        {
          id: 3,
          label: '表单生成部'
        }
      ]
    }
  ]
}

// 节点被点击
const handleNodeclick = (node: any) => {
  if(!props.multiple) {
    selectedKeys.value = [node.id]
  }
}

// 限制是否允许添加多个
const handleCheckedChange = (node: any, checked: boolean) => {
  const index = selectedKeys.value.indexOf(node.id)
  if (checked) {
    selectedKeys.value.push(node.id)
  } else {
    selectedKeys.value.splice(index, 1)
  }
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

      .search {
        margin-bottom: 10px;
      }
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
