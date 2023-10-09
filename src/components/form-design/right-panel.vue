<template>
  <div
    class="right-panel"
    :style="{ width: `${panelWidth}px`, padding: panelWidth > 0 ? '24px' : 0 }"
  >
    <div v-if="Object.keys(newCurrentItem).length">
      <div class="title">{{ newCurrentItem.title }}</div>
      <!-- 数字相关 -->
      <div class="box" v-if="newCurrentItem.tip">
        <div class="title2">
          <div>{{ newCurrentItem.tip }}</div>
        </div>
      </div>
      <!-- 字段名 -->
      <div class="box" v-if="newCurrentItem.field">
        <div class="title2">字段名</div>
        <el-input :model-value="newCurrentItem.field" @input="rightPanelChange($event, 'field')" />
      </div>
      <!-- 通用 -->
      <div v-if="!['date-range', 'explain'].includes(type)" class="box">
        <div class="title2">
          <span>标题</span>
        </div>
        <el-input :model-value="newCurrentItem.label" @input="rightPanelChange($event, 'label')" />
      </div>
      <!-- 日期区间相关 -->
      <div v-if="['date-range'].includes(type)">
        <div class="box" v-for="i in 3" :key="i">
          <div class="title2">
            <span>{{ `控件名称${i}` }}</span>
          </div>
          <el-input
            :model-value="newCurrentItem[`label${i}`]"
            @input="rightPanelChange($event, `label${i}`)"
          />
        </div>
      </div>
      <div class="box" v-if="newCurrentItem.placeholder && !['explain'].includes(type)">
        <div class="title2">默认提示</div>
        <el-input
          :model-value="newCurrentItem.placeholder"
          @input="rightPanelChange($event, 'placeholder')"
        />
      </div>
      <!-- 说明相关 -->
      <div class="box" v-if="['explain'].includes(type)">
        <div class="title2">默认提示</div>
        <el-input
          type="textarea"
          :model-value="newCurrentItem.defaultValue"
          @input="rightPanelChange($event, 'defaultValue')"
        />
      </div>
      <div class="box" v-if="type === 'amount'">
        <div class="title2">币种</div>
        <el-input
          :model-value="newCurrentItem.appendSlotContent"
          @input="rightPanelChange($event, 'appendSlotContent')"
        />
      </div>
      <!-- 日期区间相关 -->
      <div class="box" v-if="type === 'date-range'">
        <div class="title2">时长</div>
        <el-checkbox v-model="newCurrentItem.label3CanEidt" label="允许修改" />
        <el-popover
          placement="top"
          effect="dark"
          trigger="hover"
          content="人员发起申请时，可修改自动计算的时长"
        >
          <template #reference>
            <i
              style="margin-left: 5px; position: relative; bottom: 1px"
              class="iconfont icon-question-circle"
            ></i>
          </template>
        </el-popover>
      </div>
      <!-- 单选/多选 选项有关 -->
      <div class="box" v-if="['single-select', 'multiple-select'].includes(type)">
        <div class="title2">
          <span>选项</span>
        </div>
        <draggable tag="ul" :list="newCurrentItem.selectOptions" handle=".handle" item-key="name">
          <template #item="{ element, index }">
            <li class="flex-box drag-li">
              <i class="iconfont icon icon-yidongshu handle"></i>
              <el-input
                :class="{
                  'is-error': !element.label
                }"
                class="divider-input2"
                v-model="element.value"
                @input="
                  () => {
                    element.label = element.value
                    formStore.computeErrorContent()
                  }
                "
              />
              <el-icon style="cursor: pointer" :size="20" @click="closeSelectOption(index)">
                <IEpClose />
              </el-icon>
            </li>
          </template>
        </draggable>
        <div class="over-tip" v-show="judgeOptionFix">选项的值不能为空</div>
        <div class="operate" @click="newCurrentItem.selectOptions.push({ label: '', value: '' })">
          <el-icon>
            <IEpPlus />
          </el-icon>
          <span>添加选项</span>
        </div>
      </div>
      <!-- 日期相关 -->
      <div class="box" v-if="newCurrentItem.dateFormat">
        <div v-if="type === 'date'">
          <div class="title2">
            <span>日期类型</span>
          </div>
          <el-radio-group v-model="newCurrentItem.dateFormat">
            <el-radio label="YYYY-MM-DD">年-月-日</el-radio>
            <el-radio label="YYYY-MM-DD A">年-月-日 上午/下午</el-radio>
            <el-radio label="YYYY-MM-DD hh:mm">年-月-日 时:分</el-radio>
          </el-radio-group>
        </div>
        <div v-else>
          <div class="title2">
            <span>日期格式<span class="gray-color">（时长单位）</span></span>
          </div>
          <el-radio-group v-model="newCurrentItem.dateFormat">
            <el-radio label="YYYY-MM-DD" @click="newCurrentItem.label3 = '时长 (天)'">
              年-月-日 <span class="gray-color">(天)</span>
            </el-radio>
            <el-radio label="YYYY-MM-DD A" @click="newCurrentItem.label3 = '时长 (天)'">
              年-月-日 上午/下午 <span class="gray-color">(天)</span>
            </el-radio>
            <el-radio label="YYYY-MM-DD hh:mm" @click="newCurrentItem.label3 = '时长 (小时)'">
              年-月-日 时:分 <span class="gray-color">(小时)</span>
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 通用 -->
      <div
        class="box"
        v-if="['single-input', 'textarea', 'single-select', 'multiple-select'].includes(type)"
      >
        <div class="box2">
          <span class="title3">默认值设置</span>
          <el-switch
            size="small"
            v-model="newCurrentItem.defaultValueRequired"
            @change="showDefaultSwitch"
          />
        </div>
        <!-- 非选项默认值 -->
        <div
          class="default-input"
          v-if="newCurrentItem.defaultValueRequired && !newCurrentItem.selectOptions"
        >
          <el-input
            placeholder="请输入"
            :model-value="newCurrentItem.defaultValue"
            @input="rightPanelChange($event, 'defaultValue')"
          />
        </div>
        <!-- 单选/多选 选项默认值 -->
        <div
          class="default-input"
          v-if="newCurrentItem.defaultValueRequired && newCurrentItem.selectOptions"
        >
          <el-select
            style="width: 100%"
            v-model="newCurrentItem.defaultValue"
            placeholder="请选择"
            :multiple="newCurrentItem.multiple"
          >
            <el-option
              v-show="item.value"
              v-for="item in newCurrentItem.selectOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>
      <!-- 金额相关 -->
      <div class="box" v-if="newCurrentItem.amountFormat">
        <div class="title2">格式</div>
        <el-checkbox
          v-model="newCurrentItem.amountFormat.showCapital"
          label="显示大写数字"
          size="large"
        />
        <el-checkbox
          v-model="newCurrentItem.amountFormat.showThousand"
          label="显示千位分隔符"
          size="large"
        />
        <div class="flex-box">
          <el-checkbox
            v-model="newCurrentItem.amountFormat.showDecimals"
            label="显示"
            size="large"
          />
          <el-input-number
            class="divider-input"
            v-model="newCurrentItem.amountFormat.decimalsCount"
            :min="0"
            :max="6"
            size="small"
            controls-position="right"
          />
          <span>位小数位数</span>
        </div>
        <div class="over-tip" v-show="newCurrentItem.amountFormat.decimalsCount === 6">
          最多只支持设置 6 位小数位数
        </div>
        <div class="preview">
          <div class="example">预览：</div>
          <div>
            <span>{{
              formatAmount(
                123456,
                newCurrentItem.amountFormat.showThousand,
                newCurrentItem.amountFormat.showDecimals,
                newCurrentItem.amountFormat.decimalsCount
              )
            }}</span>
            <div class="example">{{ formatCurrency(123456) }}</div>
          </div>
        </div>
      </div>
      <div class="box" v-if="type === 'amount'">
        <div class="title2">设置金额范围</div>
        <div class="flex-box">
          <el-input
            :class="{
              'is-error': judgeIsFix
            }"
            :model-value="newCurrentItem.minValue"
            @input="numberMinChange"
            placeholder="最小数值"
          />
          <span class="divider">至</span>
          <el-input
            :class="{
              'is-error': judgeIsFix
            }"
            :model-value="newCurrentItem.maxValue"
            @input="numberMaxChange"
            placeholder="最大数值"
          />
        </div>
        <div class="tip" v-show="judgeIsFix">最小值不能大于最大值</div>
      </div>
      <!-- 数字相关 -->
      <div class="box" v-if="type === 'number'">
        <div class="title2">设置数值范围</div>
        <div class="flex-box">
          <el-input
            :class="{
              'is-error': judgeIsFix
            }"
            :model-value="newCurrentItem.minValue"
            @input="numberMinChange"
            placeholder="最小数值"
          />
          <span class="divider">至</span>
          <el-input
            :class="{
              'is-error': judgeIsFix
            }"
            :model-value="newCurrentItem.maxValue"
            @input="numberMaxChange"
            placeholder="最大数值"
          />
        </div>
        <div class="tip" v-show="judgeIsFix">最小值不能大于最大值</div>
      </div>
      <!-- 部门 -->
      <div class="box" v-if="type === 'section'">
        <div class="title2">可选数量</div>
        <div class="flex-box">
          <el-radio-group v-model="newCurrentItem.radioValue">
            <el-radio
              :label="item.value"
              v-for="item in newCurrentItem.radioOptions"
              :key="item.value"
            >
              {{ item.label }}
            </el-radio>
          </el-radio-group>
        </div>
      </div>
      <!-- 描述文本 -->
      <div class="box" v-if="type === 'desc'">
        <div class="title2">字体大小</div>
        <div class="flex-box">
          <el-slider
            class="slider"
            v-model="newCurrentItem.defaultValue"
            :min="newCurrentItem.minValue"
            :max="newCurrentItem.maxValue"
            size="small"
          />
        </div>
      </div>
      <div class="box" v-if="type === 'desc'">
        <div class="title2">字体粗细</div>
        <el-checkbox v-model="newCurrentItem.isBold" label="加粗" />
      </div>
      <!-- 通用 -->
      <div class="box" v-if="newCurrentItem.options">
        <div class="title2">其他可选</div>
        <el-checkbox
          v-model="newCurrentItem.options.isRequired"
          @change="requireRuleChange($event, newCurrentItem)"
          label="必填"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { formatAmount, formatCurrency, numberMinChangeM, numberMaxChangeM } from '@/utils'
import { ElMessage } from 'element-plus'
import { useJudgeNumberRange, useJudgeOptionFit } from './hooks/judge'
import { useFormStore } from '@/stores/form'

/* ts类型定义区域 */

/* 定义数据区域 */
const props = defineProps({
  currentItem: {
    type: Object,
    default: () => {}
  }
})

const newCurrentItem = ref<any>({})
const type = ref('')
const panelWidth = ref(0)
const judgeIsFix = useJudgeNumberRange(newCurrentItem) // 判断设置数值/金额时的提示警告显示/隐藏
const judgeOptionFix = useJudgeOptionFit(newCurrentItem) // 判断单选/多选时的提示警告显示/隐藏
const formStore = useFormStore()

/* 事件处理区域 */
// 删除下拉选项处理
const closeSelectOption = (index: number) => {
  if (newCurrentItem.value.selectOptions.length === 1) {
    ElMessage({
      message: '至少需要一项',
      type: 'warning'
    })
    return
  }
  const filter = newCurrentItem.value.selectOptions.splice(index, 1)

  if (filter[0].value === newCurrentItem.value.defaultValue) {
    newCurrentItem.value.defaultValue = null
  }
}

/** 校验效果 */
const requireRuleChange = (event: any, newCurrentItem: any) => {
  let tempRules: any[] = []

  if (event) {
    tempRules = [
      {
        required: true,
        message: newCurrentItem.rulesConfig.messageTip,
        trigger: newCurrentItem.rulesConfig.trigger
      }
    ]
  } else {
    tempRules = []
  }

  newCurrentItem.rulesConfig.rules = tempRules
}

// 默认值切换，重置填写/选择的默认值
const showDefaultSwitch = (value: boolean) => {
  if (!value) {
    newCurrentItem.value.defaultValue = ''
  }
}

/** 数字相关 */
const numberMinChange = (value: string) => {
  formStore.computeErrorContent()
  numberMinChangeM(value, newCurrentItem)
  requireRuleChange(newCurrentItem.value.options.isRequired, newCurrentItem.value)
}

const numberMaxChange = (value: string) => {
  formStore.computeErrorContent()
  numberMaxChangeM(value, newCurrentItem)
  requireRuleChange(newCurrentItem.value.options.isRequired, newCurrentItem.value)
}

const rightPanelChange = (e: any, field: string) => {
  newCurrentItem.value[field] = e
  formStore.computeErrorContent()
}

/* 监听 */
watch(
  () => props.currentItem,
  (newVal) => {
    if (newVal.label) {
      newCurrentItem.value = newVal
      type.value = newVal.type
      panelWidth.value = 300
    } else {
      newCurrentItem.value = newVal
      panelWidth.value = 0
    }
  }
)

/* 生命周期 */
</script>

<style lang="less" scoped>
.gray-color {
  color: #8f959e;
}
.right-panel {
  // width: 300px;
  height: 100%;
  // padding: 24px;
  background-color: #fff;
  transition: width 300ms;
  .title {
    font-size: 18px;
    line-height: 28px;
    color: #1f2329;
    font-weight: 500;
    margin-bottom: 16px;
  }
  .box {
    margin-bottom: 20px;
    position: relative;
    .title2 {
      color: #1f2329;
      font-size: 14px;
      line-height: 20px;
      margin-bottom: 8px;

      span {
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
    .title3 {
      margin-right: 5px;
    }
    .default-input {
      margin-bottom: 16px;
    }
    .tip {
      color: #f54a45;
      font-size: 12px;
      line-height: 32px;
      height: 20px;
      margin-bottom: 12px;
    }
    .over-tip {
      padding-left: 24px;
      color: #f54a45;
      font-size: 12px;
      line-height: 32px;
      height: 20px;
      margin-bottom: 12px;
    }
    .preview {
      display: flex;
      background: #f2f3f5;
      border-radius: 4px;
      padding: 12px 16px;
      display: flex;
      color: #1f2329;
      font-size: 14px;
      .example {
        color: #8f959e;
        font-size: 14px;
      }
    }
    .operate {
      display: flex;
      align-items: center;
      margin-left: 24px;
      color: #3370ff;
      cursor: pointer;
      span {
        margin-left: 3px;
        padding-top: 1px;
      }
    }

    .drag-li {
      margin-bottom: 10px;
    }
  }
  .box2 {
    margin-bottom: 10px;
  }
  .flex-box {
    display: flex;
    align-items: center;

    .divider {
      margin: 0 5px;
    }
    .divider-input {
      width: 100px;
      margin: 0 5px;
    }

    .divider-input2 {
      margin: 0 5px;
    }

    .icon {
      font-size: 20px;
      cursor: move;
    }

    .slider {
      margin-left: 10px;
    }
  }
}
:deep(.el-textarea__inner) {
  height: 100px;
}

// 错误提示框
.is-error {
  :deep(.el-input__wrapper) {
    box-shadow: inset 0 0 0 1px #f5222d;
  }
}
</style>
../../hooks/judge