import { nanoid } from 'nanoid'
import { ref } from 'vue'

/**
 *  侧面面板栏配置项说明
 *
 *  type  类别
 *  title 右侧属性配置栏表头名
 *  dateFormat 日期格式
 *  tagIcon  阿里云图标字体名称
 *  appendSlot  输入组件是否有末尾插槽
 *  appendSlotContent  末尾插槽文本
 *  label  标签名
 *  label1  日期区间标签名
 *  label2  日期区间标签名
 *  label3  日期区间标签名
 *  placeholder 占位文本
 *  label3Placeholder 日期区间时长（小时）占位文本
 *  label3CanEidt 日期区间时长是否允许修改
 *  tip 提示语
 *  defaultValueRequired 是否有默认值
 *  defaultValue  默认值
 *  dateValue: { 日期
 *    parentDateValue: null, 父时间
 *    childDateValue: null 子时间
 *  },
 *  childDateValue 子日期值（比如上下午）
 *  dateValue: { 日期区间
 *    beginParentDateValue: "", 开始的父时间
 *    beginChildDateValue: "", 开始的子时间
 *    endParentDateValue: "", 结束的父时间
 *    endChildDateValue: "", 结束的子时间
 *    dateRange: null 开始到结束的时长
 *  }
 *  beginDate 日期区间开始日期
 *  endDate 日期区间结束日期
 *  dateRange 日期区间时长
 *  minValue 最小值
 *  maxValue 最大值
 *  isBold 字体是否加粗
 *  amountFormat: { 金额格式
 *    showCapital 显示大写
 *    showThousand 显示千分分隔符
 *    showDecimals 显示小数位数
 *    decimalsCount 小数位数数量
 *  }
 *  selectOptions: [{ 选择项
 *    label: 'Option1', 选择项标签名
 *    value: 'Option1', 选择项值
 *  }]
 *  multiple 是否多选
 *  rulesConfig: { 表单校验规则
 *    trigger: "change", 触发方式
 *    messageTip: "", 校验提示
 *    rules: [] 校验数组
 *  },
 *  options: { 其他可选的配置项
 *    isRequired: true,
 *    requiredLabel: "必填"
 *  }
 *  fenceCount 栅栏个数
 */

const config = [
  {
    title: '文本',
    config: [
      {
        type: 'single-input',
        title: '单行文本',
        field: nanoid(),
        tagIcon: 'icon-danxingwenben',
        label: '单行文本',
        placeholder: '请输入',
        defaultValueRequired: false,
        defaultValue: '',
        rulesConfig: {
          trigger: 'blur',
          messageTip: '请输入内容',
          rules: []
        },
        options: {
          isRequired: false,
          requiredLabel: '必填'
        }
      },
      {
        type: 'textarea',
        title: '多行文本',
        field: nanoid(),
        tagIcon: 'icon-duohangwenben',
        label: '多行文本',
        placeholder: '请输入',
        defaultValueRequired: false,
        defaultValue: '',
        rulesConfig: {
          trigger: 'blur',
          messageTip: '请输入内容',
          rules: []
        },
        options: {
          isRequired: false,
          requiredLabel: '必填'
        }
      },
      {
        type: 'explain',
        title: '说明',
        field: nanoid(),
        tagIcon: 'icon-danxingwenben',
        label: '说明',
        defaultValue: '说明'
      }
    ]
  },
  {
    title: '数值',
    config: [
      {
        type: 'number',
        title: '数字',
        field: nanoid(),
        tagIcon: 'icon-shuzi',
        label: '数字',
        placeholder: '请输入',
        tip: '身份证、银行卡等超过 15 位数的情况，请使用文本控件',
        defaultValue: '',
        minValue: null,
        maxValue: null,
        rulesConfig: {
          trigger: 'blur',
          messageTip: '请输入数值',
          rules: []
        },
        options: {
          isRequired: false,
          requiredLabel: '必填'
        }
      },
      {
        type: 'amount',
        title: '金额',
        field: nanoid(),
        tagIcon: 'icon-chongzhi',
        appendSlot: true,
        appendSlotContent: 'CNY-人民币元',
        label: '金额',
        placeholder: '请输入',
        defaultValue: '',
        minValue: null,
        maxValue: null,
        amountFormat: {
          showCapital: false,
          showThousand: true,
          showDecimals: true,
          decimalsCount: 2
        },
        options: {
          isRequired: false,
          requiredLabel: '必填'
        },
        rulesConfig: {
          trigger: 'blur',
          messageTip: '请输入数值',
          rules: []
        }
      }
    ]
  },
  {
    title: '选项',
    config: [
      {
        type: 'single-select',
        title: '单选',
        field: nanoid(),
        multiple: false,
        tagIcon: 'icon-xuanzekuanghou',
        label: '单选',
        placeholder: '请选择',
        defaultValueRequired: false,
        defaultValue: null,
        selectOptions: [
          {
            label: '默认值',
            value: '默认值'
          }
        ],
        rulesConfig: {
          trigger: 'change',
          messageTip: '请至少选择一项',
          rules: []
        },
        options: {
          isRequired: false,
          requiredLabel: '必填'
        }
      },
      {
        type: 'multiple-select',
        title: '多选',
        field: nanoid(),
        multiple: true,
        tagIcon: 'icon-duoxuananniu',
        label: '多选',
        placeholder: '请选择',
        defaultValueRequired: false,
        defaultValue: null,
        selectOptions: [
          {
            label: '默认值',
            value: '默认值'
          }
        ],
        rulesConfig: {
          trigger: 'change',
          messageTip: '请至少选择一项',
          rules: []
        },
        options: {
          isRequired: false,
          requiredLabel: '必填'
        }
      }
    ]
  },
  {
    title: '日期',
    config: [
      {
        type: 'date',
        title: '日期',
        field: nanoid(),
        dateFormat: 'YYYY-MM-DD A',
        tagIcon: 'icon-riqi',
        label: '日期',
        placeholder: '请选择',
        dateValue: {
          parentDateValue: '',
          childDateValue: ''
        },
        selectOptions: [
          {
            label: '上午',
            value: 'am'
          },
          {
            label: '下午',
            value: 'pm'
          }
        ],
        rulesConfig: {
          trigger: 'blur',
          messageTip: '请选择日期',
          rules: []
        },
        options: {
          isRequired: false,
          requiredLabel: '必填'
        }
      },
      {
        type: 'date-range',
        title: '日期区间',
        field: nanoid(),
        dateFormat: 'YYYY-MM-DD A',
        tagIcon: 'icon-24gl-calendar',
        label: '日期区间',
        label1: '开始时间',
        label2: '结束时间',
        label3: '时长 (天)',
        placeholder: '请选择',
        label3Placeholder: '自动计算',
        label3CanEidt: true,
        dateValue: {
          beginParentDateValue: '',
          beginChildDateValue: '',
          endParentDateValue: '',
          endChildDateValue: '',
          dateRange: ''
        },
        selectOptions: [
          {
            label: '上午',
            value: 'am'
          },
          {
            label: '下午',
            value: 'pm'
          }
        ],
        rulesConfig: {
          trigger: 'blur',
          messageTip: '请选择时间',
          rules: []
        },
        options: {
          isRequired: false,
          requiredLabel: '必填'
        }
      }
    ]
  },
  {
    title: '其他',
    config: [
      {
        type: 'upload-picture',
        title: '图片',
        field: nanoid(),
        tagIcon: 'icon-tupian',
        label: '图片',
        defaultValue: [],
        rulesConfig: {
          trigger: 'change',
          messageTip: '请上传文件',
          rules: []
        },
        options: {
          isRequired: false,
          requiredLabel: '必填'
        }
      },
      {
        type: 'upload-file',
        title: '附件',
        field: nanoid(),
        tagIcon: 'icon-fujian',
        label: '附件',
        defaultValue: [],
        rulesConfig: {
          trigger: 'change',
          messageTip: '请上传文件',
          rules: []
        },
        options: {
          isRequired: false,
          requiredLabel: '必填'
        }
      },
      {
        type: 'section',
        title: '部门',
        field: nanoid(),
        tagIcon: 'icon-bumen',
        label: '部门',
        defaultValue: [],
        radioValue: 0,
        radioOptions: [
          { value: 0, label: '可选一个部门' },
          { value: 1, label: '可选多个部门' }
        ],
        rulesConfig: {
          trigger: 'change',
          messageTip: '请选择部门',
          rules: []
        },
        options: {
          isRequired: false,
          requiredLabel: '必填'
        }
      }
    ]
  },
  {
    title: '页面布局',
    config: [
      {
        type: 'desc',
        title: '描述文本',
        field: nanoid(),
        tagIcon: 'icon-danxingwenben',
        label: '描述文本',
        defaultValue: 14, // 字体大小
        minValue: 10,
        maxValue: 30,
        isBold: false
      },
      {
        type: 'divider',
        title: '分割线',
        field: nanoid(),
        tagIcon: 'icon-danxingwenben',
        label: '分割线'
      },
      {
        type: 'fence',
        title: '栅栏布局',
        field: nanoid(),
        tagIcon: 'icon-zhagebuju',
        label: '栅栏布局',
        fenceCount: 1,
        fenceChildren: {
          child1: [],
          child2: [],
          child3: [],
          child4: [],
          child5: [],
          child6: []
        }
      }
    ]
  }
]

interface formPropertyConfigType {
  labelPosition: 'left' | 'top'
}

// 表单属性
/**
 * labelPosition 标签对齐方式
 */
const formPropertyConfig = ref<formPropertyConfigType>({
  labelPosition: 'top'
})

export default config
export { formPropertyConfig }
