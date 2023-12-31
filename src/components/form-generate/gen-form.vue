<template>
  <el-form
    ref="ruleFormRef"
    :model="formData"
    :rules="rules"
    :label-position="formPropertyConfig.labelPosition"
  >
    <div v-for="(element, index) in formConfig" :key="index">
      <!-- 日期相关 -->
      <div v-if="element.type === 'date' && formData[element.field]">
        <!-- 年-月-日 -->
        <el-form-item :label="element.title" prop="parentDateValue">
          <ElementComps
            :formData="formData['parentDateValue']"
            @update:form-data="
              (value: string) => {
                formData['parentDateValue'] = value
                formData[element.field].parentDateValue = value
              }
            "
            :element="element"
          >
            <!-- 上午/下午 -->
            <el-form-item
              style="margin-left: 12px"
              v-if="element.dateFormat === 'YYYY-MM-DD A'"
              prop="childDateValue"
            >
              <el-select
                :placeholder="element.placeholder"
                v-model="formData[element.field]!.childDateValue"
              >
                <el-option
                  v-for="item in element.selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!--  时:分 -->
            <el-form-item
              style="margin-left: 12px"
              v-if="element.dateFormat === 'YYYY-MM-DD hh:mm'"
              prop="childDateValue"
            >
              <el-time-picker
                v-if="element.dateFormat === 'YYYY-MM-DD hh:mm'"
                value-format="hh:mm"
                format="hh:mm"
                v-model="formData[element.field]!.childDateValue"
              />
            </el-form-item>
          </ElementComps>
        </el-form-item>
      </div>

      <!-- 日期区间相关 -->
      <div v-else-if="element.type === 'date-range' && formData[element.field]">
        <!-- 年-月-日 -->
        <el-form-item
          v-for="(item, index) in ['begin', 'end']"
          :key="item"
          :label="element.title"
          :prop="`${item}ParentDateValue`"
        >
          <ElementComps
            :formData="formData[`${item}ParentDateValue`]"
            :label="element[`label${index + 1}`]"
            :disabledDate="item === 'end'"
            :min-parent-date="formData.beginParentDateValue"
            @update:form-data="
              (value: string) => {
                formData[`${item}ParentDateValue`] = value
                formData[element.field][`${item}ParentDateValue`] = value
                computedDateRange(element)
              }
            "
            :element="element"
          >
            <!-- 上午/下午 -->
            <el-form-item
              style="margin-left: 12px"
              v-if="element.dateFormat === 'YYYY-MM-DD A'"
              :prop="`${item}ChildDateValue`"
            >
              <el-select
                :placeholder="element.placeholder"
                v-model="formData[element.field][`${item}ChildDateValue`]"
              >
                <el-option
                  v-for="item in element.selectOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <!--  时:分 -->
            <el-form-item
              style="margin-left: 12px"
              v-if="element.dateFormat === 'YYYY-MM-DD hh:mm'"
              :prop="`${item}ChildDateValue`"
            >
              <el-time-picker
                v-if="element.dateFormat === 'YYYY-MM-DD hh:mm'"
                value-format="hh:mm"
                format="hh:mm"
                :disabled-hours="item === 'end' ? disabledHours : undefined"
                :disabled-minutes="item === 'end' ? disabledMinutes : undefined"
                :model-Value="formData[element.field][`${item}ChildDateValue`]"
                @update:modelValue="
                  (value: string) => {
                    formData[`${item}ChildDateValue`] = value
                    formData[element.field][`${item}ChildDateValue`] = value
                    computedDateRange(element)
                  }
                "
              />
            </el-form-item>
          </ElementComps>
        </el-form-item>
        <!-- 区间时长 -->
        <el-form-item :label="element.label3" prop="dateRange">
          <el-input
            :placeholder="element.label3Placeholder"
            :model-value="formData[element.field].dateRange"
            @update:modelValue="
              (value: string) => {
                if (isNaN(+value)) {
                  return
                }
                formData[element.field].dateRange = value
              }
            "
            :disabled="!element.label3CanEidt"
          />
        </el-form-item>
      </div>

      <!-- 图片/文件相关 -->
      <div v-else-if="['upload-picture', 'upload-file', 'section'].includes(element.type)">
        <el-form-item :label="element.title" :prop="element.field">
          <ElementComps
            :formData="formData[element.field]"
            @update:form-data="
              (value: any) => {
                formData[element.field] = value
                ruleFormRef?.validateField(element.field) // 触发校验
              }
            "
            :element="element"
          />
        </el-form-item>
      </div>

      <!-- 数字/金额相关 -->
      <div v-else-if="['number', 'amount'].includes(element.type)">
        <el-form-item :label="element.title" :prop="element.field">
          <ElementComps
            :formData="formData[element.field]"
            @update:form-data="
              (value: any) => {
                formData[element.field] = value
              }
            "
            @inputBlur="handleCountChange(formData, element)"
            :element="element"
          />
        </el-form-item>
      </div>

      <!-- 栅栏布局 -->
      <el-row v-else-if="element.type === 'fence'" :gutter="element.gutter ?? 12">
        <el-col v-for="fence in element.fenceCount" :span="24 / element.fenceCount" :key="fence">
          <div v-for="item in element.fenceChildren[`child${fence}`]" :key="item">
            <el-form-item :label="item.title" :prop="item.field">
              <ElementComps
                :formData="formData[element.field][`child${fence}`][item.field]"
                @update:form-data="
                  (value: any) => {
                    formData[element.field][`child${fence}`][item.field] = value
                    formData[item.field] = value
                    fenceField?.push(item.field)
                  }
                "
                :element="item"
              />
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <!-- 通用 -->
      <div v-else>
        <el-form-item :label="element.title" :prop="element.field">
          <ElementComps v-model:formData="formData[element.field]" :element="element" />
        </el-form-item>
      </div>
    </div>
  </el-form>
  <el-button @click="getData">获取数据</el-button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FormInstance } from 'element-plus'
import { useFormStore } from '@/stores/form'
import { formPropertyConfig } from '../form-design/config/element'
import ElementComps from './ElementComps.vue'
import { makeRange, computedDateRangeM } from '@/utils'
import { ElMessage } from 'element-plus'
/* ts类型定义区域 */

/* 定义数据区域 */
// 有数据时为预览表单
const props = defineProps<{
  currentItem?: {
    formDesignConfig: any
    labelPosition: any
  }
}>()

const formData = ref<any>({})
const rules = ref<any>({})
const ruleFormRef = ref<FormInstance>()
const backupConfig = ref<any[]>([])
const formStore = useFormStore()
const formConfig = ref<any[]>([])
const fenceField = ref<string[]>([]) // 记录栅栏里面所有的元素字段

/* 事件处理区域 */
// 数值/金额边界判断处理
const handleCountChange = (formData: any, element: any) => {
  const number = +formData[element.field]

  if (isNaN(number)) {
    ElMessage.error(`请输入数字`)
    formData[element.field] = null
    return
  }

  if (
    (number && element.maxValue && number > element.maxValue) ||
    (element.minValue && number < element.minValue)
  ) {
    ElMessage.error(`请输入${element.placeholder}的值`)
    formData[element.field] = null
  }
}

// 初始化表单数据
const initFormData = () => {
  // 备份配置（防止直接修改源对象数据，视情况要求而定）
  backupConfig.value = JSON.parse(JSON.stringify(formConfig.value))

  backupConfig.value.forEach((item) => {
    if (item.label === '日期') {
      formData.value[item.field] = item.dateValue
      formData.value['parentDateValue'] = item.dateValue.parentDateValue
      rules.value['parentDateValue'] = item?.rulesConfig?.rules
    } else if (item.label === '日期区间') {
      formData.value[item.field] = item.dateValue
      formData.value['beginParentDateValue'] = item.dateValue.beginParentDateValue
      formData.value['beginChildDateValue'] = item.dateValue.beginChildDateValue
      formData.value['endParentDateValue'] = item.dateValue.endParentDateValue
      formData.value['endChildDateValue'] = item.dateValue.endChildDateValue
      formData.value['dateRange'] = item.dateValue.dateRange
      rules.value['beginParentDateValue'] = item?.rulesConfig?.rules
      rules.value['endParentDateValue'] = item?.rulesConfig?.rules
      // rules.value["dateRange"] = item?.rulesConfig?.rules
    } else if (item.label === '栅栏布局') {
      console.log('item', item)
      formData.value[item.field] = {
        child1: {},
        child2: {},
        child3: {},
        child4: {},
        child5: {},
        child6: {}
      }

      for (let [key, value] of Object.entries(item.fenceChildren)) {
        ;(value as any[]).forEach((sun: any) => {
          rules.value[sun.field] = sun.rulesConfig?.rules
        })
      }
    } else {
      formData.value[item.field] = item.defaultValue
      rules.value[item.field] = item?.rulesConfig?.rules
    }
  })
}

// 获取表单数据
const getData = () => {
  // console.log(formConfig.value, formData.value)
  // 过滤掉栅栏中元素只用于验证的字段数据,其数据已在栅栏一个字段里面包裹着
  const filterFormData: any = { ...formData.value }
  for (const item of fenceField.value) {
    console.log(item)

    if (filterFormData[item]) {
      delete filterFormData[item]
    }
  }

  return new Promise((resolve, reject) => {
    ruleFormRef.value?.validate((valid) => {
      if (valid) {
        console.log('submit!', filterFormData)
        resolve(filterFormData)
      } else {
        console.log('error submit!')
        reject(false)
      }
    })
  })
}

defineExpose({ getData })

/**
 * 日期区间相关
 */
// 计算开始时间到结束时间的时长
const computedDateRange = (element: any) => {
  computedDateRangeM(element, formData)
}

// 日期区间时间选择器禁用掉的时间（用于禁掉起始时间的判断）
const disabledHours = () => {
  // 父时间相等时才能进行子时间的判断
  if (
    !!formData.value.beginParentDateValue &&
    formData.value.beginParentDateValue === formData.value.endParentDateValue
  ) {
    const H = formData.value.beginChildDateValue.split(':')[0]
    return makeRange(0, H - 1)
  }
}

const disabledMinutes = (hour: number) => {
  const H = formData.value.beginChildDateValue.split(':')[0]
  const m = formData.value.beginChildDateValue.split(':')[1]

  // 父时间相等时才能进行子时间的判断
  if (
    !!formData.value.beginParentDateValue &&
    formData.value.beginParentDateValue === formData.value.endParentDateValue
  ) {
    if (hour === +H) {
      return makeRange(0, +m)
    }
  }
}

/* 监听 */

/* 生命周期 */
onMounted(() => {
  console.log('props.currentItem', props.currentItem)

  if (props.currentItem?.formDesignConfig) {
    formConfig.value = props.currentItem.formDesignConfig
    formPropertyConfig.value.labelPosition = props.currentItem.labelPosition
  } else {
    formConfig.value = formStore.$state.config
  }
  initFormData()
})
</script>

<style lang="less" scoped>
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
</style>
