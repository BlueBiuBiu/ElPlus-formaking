<template>
  <!-- 按钮 -->
  <div
    v-if="element.type === 'button'"
    class="item item-flex"
    :style="{
      flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
    }"
  >
    <div
      class="title"
      :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
    ></div>
    <el-button disabled>
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </el-button>
  </div>
  <!-- 单行文本 -->

  <div
    v-if="['single-input', 'number', 'amount'].includes(element.type)"
    class="item item-flex"
    :style="{
      flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
    }"
  >
    <div
      class="title"
      :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
    >
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </div>
    <el-input
      class="sky-item"
      :placeholder="element.placeholder"
      :model-value="element.defaultValue"
      disabled
    >
      <template v-if="element.appendSlot" #append>{{ element.appendSlotContent }}</template>
    </el-input>
  </div>
  <!-- 多行文本 -->
  <div
    v-if="element.type === 'textarea'"
    class="item item-flex"
    :style="{
      flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
    }"
  >
    <div
      class="title"
      :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
    >
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </div>
    <el-input
      class="sky-item"
      type="textarea"
      :placeholder="element.placeholder"
      :model-value="element.defaultValue"
      disabled
    />
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
    <el-divider>
      {{ element.label }}
    </el-divider>
  </div>
  <!-- 部门 -->
  <div
    v-if="element.type === 'section'"
    class="item item-flex"
    :style="{
      flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
    }"
  >
    <div
      class="title"
      :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
    >
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </div>
    <div class="section">
      <el-icon><IEpPlus /></el-icon>
    </div>
  </div>
  <!-- 单选框组 -->
  <div
    v-if="element.type === 'radio'"
    class="item item-flex"
    :style="{
      flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
    }"
  >
    <div
      class="title"
      :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
    >
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </div>
    <el-radio-group
      :class="element.layout === '垂直布局' ? 'radio-verticel' : 'radio-horizontal'"
      :model-value="element.defaultValue"
      disabled
    >
      <template v-for="item in element.child" :key="item.label">
        <el-radio :label="item.label">{{ item.content }}</el-radio>
      </template>
    </el-radio-group>
  </div>
  <!-- 多选框组 -->
  <div
    v-if="element.type === 'checkbox'"
    class="item item-flex"
    :style="{
      flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
    }"
  >
    <div
      class="title"
      :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
    >
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </div>
    <el-checkbox-group
      :class="element.layout === '垂直布局' ? 'radio-verticel' : 'radio-horizontal'"
      :model-value="element.defaultValue"
      disabled
    >
      <template v-for="item in element.child" :key="item.label">
        <el-checkbox :label="item.label">{{ item.content }}</el-checkbox>
      </template>
    </el-checkbox-group>
  </div>
  <!-- 下拉框组 -->
  <div
    v-if="['single-select', 'multiple-select'].includes(element.type)"
    class="item item-flex"
    :style="{
      flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
    }"
  >
    <div
      class="title"
      :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
    >
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </div>
    <el-select
      :placeholder="element.placeholder"
      size="large"
      :model-value="element.defaultValue"
      disabled
    >
      <el-option
        v-for="item in element.child"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
  <!-- 日期选择器 -->
  <div
    v-if="element.type === 'date'"
    class="item item-flex"
    :style="{
      flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
    }"
  >
    <div
      class="title"
      :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
    >
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </div>
    <div class="flex-row">
      <el-date-picker
        style="flex: 1; margin-right: 5px"
        type="date"
        :placeholder="element.placeholder"
        value-format="YYYY-MM-DD"
        disabled
      />
      <el-select style="width: 100px" disabled v-if="element.dateFormat === 'YYYY-MM-DD A'">
        <el-option label="上午" value="am" />
        <el-option label="下午" value="pm" />
      </el-select>
    </div>
  </div>
  <!-- 时间日期选择器 -->
  <div
    v-if="element.type === 'datetime'"
    class="item item-flex"
    :style="{
      flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
    }"
  >
    <div
      class="title"
      :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
    >
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </div>
    <el-date-picker
      type="datetime"
      :placeholder="element.placeholder"
      :value-format="element.dateFormat"
      disabled
    />
  </div>
  <!-- 日期区间 -->
  <div v-if="element.type === 'date-range'" class="item">
    <div
      class="item-flex"
      :style="{
        flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
      }"
      v-for="i in 2"
      :key="i"
    >
      <div
        class="title"
        :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
      >
        <span class="require-icon" v-if="element.options.isRequired">
          {{ element[`label${i}`] }}
        </span>
        <span v-else>{{ element[`label${i}`] }}</span>
      </div>
      <div
        class="item-flex"
        :style="{
          flexDirection: 'row'
        }"
      >
        <el-date-picker
          style="width: 100%; margin-bottom: 5px; margin-right: 5px"
          type="date"
          :placeholder="element.placeholder"
          :value-format="element.dateFormat"
          disabled
        />
        <el-select disabled :placeholder="element.placeholder">
          <el-option />
        </el-select>
      </div>
    </div>
    <div
      class="item-flex"
      :style="{
        flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
      }"
    >
      <div
        class="title"
        :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
      >
        <span class="require-icon" v-if="element.options.isRequired">
          {{ element.label3 }}
        </span>
        <span v-else>
          {{ element.label3 }}
        </span>
      </div>
      <el-input class="sky-item" :placeholder="element.label3Placeholder" disabled>
        <template v-if="element.appendSlot" #append>{{ element.appendSlotContent }}</template>
      </el-input>
    </div>
  </div>
  <!-- 图片 -->
  <div
    v-if="element.type === 'upload-picture'"
    class="item item-flex"
    :style="{
      flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
    }"
  >
    <div
      class="title"
      :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
    >
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </div>
    <el-upload style="width: 50px; height: 50px" list-type="picture-card" disabled>
      <el-icon><IEpPlus /></el-icon>
    </el-upload>
  </div>
  <!-- 文件 -->
  <div
    v-if="element.type === 'upload-file'"
    class="item item-flex"
    :style="{
      flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
    }"
  >
    <div
      class="title"
      :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
    >
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </div>
    <el-upload class="upload-file" disabled>
      <el-button style="width: 100%" disabled>
        <el-icon><IEpUpload /></el-icon>
        上传文件
      </el-button>
    </el-upload>
  </div>
  <!-- 自定义组件 -->
  <div
    v-if="element.type === 'customComponents'"
    class="item item-flex"
    :style="{
      flexDirection: formPropertyConfig.labelPosition === 'top' ? 'column' : 'row'
    }"
  >
    <div
      class="title"
      :style="{ marginRight: formPropertyConfig.labelPosition === 'top' ? 0 : '5px' }"
    >
      <span class="require-icon" v-if="element.options.isRequired">{{ element.label }}</span>
      <span v-else>{{ element.label }}</span>
    </div>
    <slot :name="element.slotName">
      <div>{{ element.slotName }}</div>
    </slot>
  </div>
</template>
<script setup lang="ts">
import { formPropertyConfig } from "./config/element"

defineProps<{ element: any }>()
</script>

<style lang="less" scoped>
.mr-0 {
  margin-right: 0;
}

.item-flex {
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
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
  }
}
.item {
  padding: 5px;
  margin-bottom: 18px;
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
  padding: 3px 12px;
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
// 上传文件
.upload-file {
  :deep(.el-upload--text) {
    width: 100%;
  }
}

:deep(.el-upload--picture-card) {
  width: 60px;
  height: 60px;
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
