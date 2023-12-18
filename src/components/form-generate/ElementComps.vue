<template>
  <!-- 按钮 -->
  <div v-if="element.type === 'button'" class="item-flex">
    <el-button>
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </el-button>
  </div>

  <!-- 单行文本 -->
  <div v-if="['single-input', 'amount'].includes(element.type)" class="item-flex">
    <el-input
      class="sky-item"
      :placeholder="element.placeholder"
      :model-value="formData"
      @blur="emits('inputBlur')"
      @update:modelValue="handleChange($event, element.field)"
    >
      <template v-if="element.appendSlot" #append>{{ element.appendSlotContent }}</template>
    </el-input>
  </div>

  <!-- 多行文本 -->
  <div v-if="element.type === 'textarea'" class="item-flex">
    <el-input
      class="sky-item"
      type="textarea"
      :placeholder="element.placeholder"
      :model-value="formData"
      @update:modelValue="handleChange($event, element.field)"
    />
  </div>

  <!-- 数字 -->
  <div v-if="element.type === 'number'" class="item-flex">
    <el-input
      class="sky-item"
      :placeholder="element.placeholder"
      :model-value="formData"
      @update:modelValue="handleChange($event, element.field)"
      @blur="emits('inputBlur')"
    >
      <template v-if="element.appendSlot" #append>{{ element.appendSlotContent }}</template>
    </el-input>
  </div>

  <!-- 描述说明 -->
  <div v-if="element.type === 'explain'" class="explain">
    {{ element.defaultValue }}
  </div>

  <!-- 描述文本 -->
  <div v-if="element.type === 'desc'" class="desc">
    <span
      :style="{ fontSize: `${element.defaultValue}px`, fontWeight: element.isBold ? 600 : 400 }"
      >{{ element.label }}</span
    >
  </div>

  <!-- 分割线 -->
  <div v-if="element.type === 'divider'" class="divider-wrap">
    <el-divider style="margin: 10px 0">
      {{ element.label }}
    </el-divider>
  </div>

  <!-- 部门 -->
  <div v-if="element.type === 'section'" class="item-flex">
    <div class="section" @click="addModelVisible = true">
      <el-icon><IEpPlus /></el-icon>
    </div>
    <div class="section-list">
      <transition-group name="list-transition">
        <div class="section-item" v-for="item in sections" :key="item">
          <el-avatar :size="25" class="section-avatar">
            {{ item.name.substr(0, 1) }}
          </el-avatar>
          <span class="section-name">{{ item.name }}</span>
          <el-popconfirm
            width="200px"
            :title="`确定要删除${item.name}`"
            @confirm="delSection(item)"
          >
            <template #reference>
              <el-icon color="#8f959e" class="section-icon"><IEpClose /></el-icon>
            </template>
          </el-popconfirm>
        </div>
      </transition-group>
    </div>
  </div>
  <!-- 添加部门模态框  -->
  <AddSection
    :visible="addModelVisible"
    @comfirm="selectSection"
    @cancel="addModelVisible = false"
    :multiple="element.radioValue === 1"
    :sections="sections"
  />

  <!-- 单选框组 -->
  <div v-if="element.type === 'radio'" class="item-flex">
    <el-radio-group
      :class="element.layout === '垂直布局' ? 'radio-verticel' : 'radio-horizontal'"
      :model-value="formData"
    >
      <template v-for="item in element.child" :key="item.label">
        <el-radio :label="item.label">{{ item.content }}</el-radio>
      </template>
    </el-radio-group>
  </div>

  <!-- 多选框组 -->
  <div v-if="element.type === 'checkbox'" class="item-flex">
    <el-checkbox-group
      :class="element.layout === '垂直布局' ? 'radio-verticel' : 'radio-horizontal'"
      :model-value="formData"
    >
      <template v-for="item in element.child" :key="item.label">
        <el-checkbox :label="item.label">{{ item.content }}</el-checkbox>
      </template>
    </el-checkbox-group>
  </div>

  <!-- 下拉框组 -->
  <div v-if="['single-select', 'multiple-select'].includes(element.type)" class="item-flex">
    <el-select
      :placeholder="element.placeholder"
      size="large"
      :model-value="formData"
      :multiple="element.multiple"
      @update:modelValue="handleChange($event, element.field)"
    >
      <el-option
        v-for="item in element.selectOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>

  <!-- 日期选择器 -->
  <div v-if="element.type === 'date'" class="item-flex">
    <div class="flex-row">
      <el-date-picker
        style="flex: 1"
        type="date"
        :placeholder="element.placeholder"
        value-format="YYYY-MM-DD"
        :model-value="formData"
        @update:modelValue="handleChange($event, element.field)"
      />
      <slot></slot>
    </div>
  </div>

  <!-- 时间日期选择器 -->
  <div v-if="element.type === 'datetime'" class="item-flex">
    <el-date-picker
      type="datetime"
      :placeholder="element.placeholder"
      :value-format="element.dateFormat"
      :model-value="formData"
      @update:modelValue="handleChange($event, element.field)"
    />
  </div>

  <!-- 日期区间 -->
  <div v-if="element.type === 'date-range'" class="item-flex">
    <div class="flex-row">
      <el-date-picker
        style="flex: 1"
        type="date"
        :placeholder="element.placeholder"
        value-format="YYYY-MM-DD"
        :disabled-date="disabledDate"
        :model-value="formData"
        @update:modelValue="handleChange($event, element.field)"
      />
      <slot></slot>
    </div>
  </div>

  <!-- 图片 -->
  <div v-if="element.type === 'upload-picture'" class="item-flex">
    <!-- 使用el-upload时会跟mockjs冲突，有类型错误，发布时要注释掉mockjs -->
    <el-upload
      class="upload-picture"
      v-model:file-list="imagesList"
      :auto-upload="false"
      action="#"
      multiple
      accept=".jpg,.png,.gif,.svg,.jpeg,.heic"
      list-type="picture-card"
      :on-change="handlePictureChange"
      :on-preview="handlePictureCardPreview"
      :on-remove="handlePictureRemove"
    >
      <el-icon><IEpPlus /></el-icon>
    </el-upload>
    <el-dialog v-model="previewFile">
      <img w-full :src="previewFileUrl" alt="Preview Image" />
    </el-dialog>
  </div>

  <!-- 文件 -->
  <div v-if="element.type === 'upload-file'" class="item-flex">
    <!-- 使用el-upload时会跟mockjs冲突，有类型错误，发布时要注释掉mockjs -->
    <el-upload
      class="upload-file"
      v-model:file-list="fileList"
      :auto-upload="false"
      action="#"
      multiple
      :on-change="handleFileChange"
      :on-remove="handleFileRemove"
      :on-exceed="handleExceed"
    >
      <el-button style="width: 100%">
        <el-icon><IEpUpload /></el-icon>
        上传文件
      </el-button>
    </el-upload>
  </div>

  <!-- 自定义组件 -->
  <div v-if="element.type === 'customComponents'" class="item-flex">
    <slot :name="element.slotName">
      <div>{{ element.slotName }}</div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { UploadProps } from 'element-plus'
import AddSection from '../form-design/modals/add-section.vue'
import dayjs from 'dayjs'

/* 定义数据区域 */
const props = defineProps<{
  element: any
  formData: any
  label?: string
  disabledDate?: boolean // 禁用的时间
  minParentDate?: string // 起始父时间
}>()
const emits = defineEmits(['update:formData', 'inputBlur'])

const fileList = ref<UploadUserFile[]>() // 上传的文件
const imagesList = ref<UploadUserFile[]>() // 上传的图片
const previewFile = ref(false)
const previewFileUrl = ref('')
// 部门相关
const addModelVisible = ref(false)
const sections = ref<any[]>([])

/* 事件处理区域 */
const handleChange = (value: any, field: string) => {
  emits('update:formData', value)
}

// 选择上传图片
const handlePictureChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  emits('update:formData', { pictures: uploadFiles })
}

// 移除上传图片
const handlePictureRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  emits('update:formData', { pictures: uploadFiles })
}

// 选择上传文件
const handleFileChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  emits('update:formData', { files: uploadFiles })
}

// 移除上传文件
const handleFileRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  emits('update:formData', { files: uploadFiles })
}

// 上传图片预览
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  previewFileUrl.value = uploadFile.url!
  previewFile.value = true
}

// 添加部门人员
const selectSection = (arr: Object[]) => {
  sections.value = arr
  addModelVisible.value = false
  emits('update:formData', sections.value)
}

// 删除部门人员
const delSection = (section: any) => {
  const index = sections.value.findIndex((item) => item.id === section.id)
  sections.value.splice(index, 1)
  emits('update:formData', sections.value)
}

// 日期区间禁用掉的时间（用于禁掉起始时间的判断）
const disabledDate = (time: Date) => {
  if (props.disabledDate && props.minParentDate) {
    return time.getTime() < dayjs(props.minParentDate).valueOf()
  }
}
</script>

<style lang="less" scoped>
.mr-0 {
  margin-right: 0;
}

.w100 {
  width: 100%;
}

.item-flex {
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #1d2129;
  .title {
    display: inline-block;
    margin-bottom: 8px;
    .require-icon {
      position: relative;
      &::after {
        content: '*';
        position: absolute;
        left: 100%;
        top: -2px;
        line-height: 20px;
        padding-left: 2px;
        color: #f54a45;
      }
    }
  }
  .sky-item {
    flex: 1;
  }

  .section {
    width: 44px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 13px;
    border: 1px solid #82a7fc;
    box-sizing: border-box;
    position: relative;
    cursor: pointer;
  }
  .section-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-top: 10px;
    .section-item {
      display: flex;
      align-items: center;
      background-color: #e8e9e9;
      padding: 2px 10px 2px 8px;
      border-radius: 25px;
      .section-name {
        margin: 0 5px;
      }

      .section-icon {
        font-size: 20px;
        cursor: pointer;
      }
      .section-avatar {
        background-color: #3370ff;
      }
    }
  }
}

.flex-row {
  display: flex;
  align-items: center;
}

.explain {
  width: 100%;
  font-size: 14px;
  line-height: 22px;
  color: #646a73;
  padding: 3px 12px;
  word-break: break-word;
  background-color: rgba(31, 35, 41, 0.05);
}

.desc {
  width: 100%;
  font-size: 14px;
  line-height: 22px;
  color: #646a73;
  word-break: break-word;
}

.divider-wrap {
  width: 100%;
  display: flex;
  align-items: center;
}

// 单选框
.radio-verticel {
  display: flex;
  flex-direction: column;
  align-items: initial;
  position: relative;
  // top: -5px;
}
.radio-horizontal {
  position: relative;
  // top: -5px;
}

// 下拉选择框
.dropdown-link {
  cursor: pointer;
  color: #606266;
  display: flex;
  align-items: center;
}

.dropdown-input {
  :deep(.el-input__inner) {
    cursor: pointer;
  }
}

// 上传图片
.upload-picture {
  :deep(.el-upload--picture-card),
  :deep(.el-upload-list__item) {
    width: 100px;
    height: 100px;
  }
}

// 上传文件
.upload-file {
  :deep(.el-upload--text) {
    width: 100%;
  }
}

// 动画
.list-transition-enter-from,
.list-transition-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-transition-enter-active,
.list-transition-leave-active {
  opacity: 1;
  transition: all 300ms ease;
}

.list-transition-leave-active {
  position: absolute;
  opacity: 0;
}

.list-transition-move {
  transition: transform 300ms ease;
}
</style>
<style lang="less">
.el-popper.el-dropdown__popper {
  min-width: 190px;
  transform-origin: center top;
  z-index: 2011;
  position: absolute;
  left: 375px;
  top: 126px;
  margin: 0px;
}
</style>
