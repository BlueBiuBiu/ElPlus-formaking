import dayjs from "dayjs"
import numeral from 'numeral'
import type { Ref } from "vue"

/**
 * 数字相关
 */
const numberChange = (newCurrentItem: Ref<any>) => {
  // 有最小值，没有最大值
  if (newCurrentItem.value.minValue && !newCurrentItem.value.maxValue) {
    newCurrentItem.value.placeholder = `不小于${newCurrentItem.value.minValue}`
  }
  // 有最大值，没有最小值
  if (!newCurrentItem.value.minValue && newCurrentItem.value.maxValue) {
    newCurrentItem.value.placeholder = `不大于${newCurrentItem.value.maxValue}`
  }
  // 有最大值跟最小值
  if (newCurrentItem.value.minValue && newCurrentItem.value.maxValue) {
    newCurrentItem.value.placeholder = `${newCurrentItem.value.minValue} 至 ${newCurrentItem.value.maxValue}`
  }
  // 没有最大值，没有最小值
  if (!newCurrentItem.value.minValue && !newCurrentItem.value.maxValue) {
    newCurrentItem.value.placeholder = "请输入"
  }
}

export const numberMinChangeM = (value: string, newCurrentItem: Ref<any>) => {
  const num = +value
  // 非数字类型直接返回
  if (isNaN(num)) {
    return
  }
  if (num === 0) {
    newCurrentItem.value.minValue = null
  } else {
    newCurrentItem.value.minValue = num
  }
  numberChange(newCurrentItem)
}

export const numberMaxChangeM = (value: string, newCurrentItem: Ref<any>) => {
  const num = +value
  // 非数字类型或者比最小值小直接返回
  if (isNaN(num)) {
    return
  }
  if (num === 0) {
    newCurrentItem.value.maxValue = null
  } else {
    newCurrentItem.value.maxValue = num
  }
  numberChange(newCurrentItem)
}

/**
 * 日期区间相关
 */

// 计算开始时间到结束时间的时长
export const computedDateRangeM = (element: any, formData: Ref<any>) => {
  const dateValue = formData.value[element.field]
  let diff = 0 // 两个时间的时长间隔

  if (dateValue.beginParentDateValue && dateValue.endParentDateValue) {
    let beginTime = `${dateValue.beginParentDateValue} ${dateValue.beginChildDateValue}`
    let endTime = `${dateValue.endParentDateValue} ${dateValue.endChildDateValue}`

    // 上下午模式不需要计算子时间
    beginTime = beginTime.replace(/(am|pm)$/, "")
    endTime = endTime.replace(/(am|pm)$/, "")

    console.log("beginTime", beginTime)
    console.log("endTime", endTime)

    if (element.dateFormat !== "YYYY-MM-DD hh:mm") {
      diff = dayjs(endTime).diff(dayjs(beginTime), "day")
    } else {
      diff = dayjs(endTime).diff(dayjs(beginTime), "hour")
    }
  }
  formData.value[element.field].dateRange = diff + 1
}

// 时间禁用处理
export const makeRange = (start: number, end: number) => {
  const result: number[] = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}


export const formatAmount = (
  value: number,
  showThousand = true,
  showDecimals = true,
  decimalsCount = 2
) => {
  let format = '0'

  if (showThousand) {
    format += ',0'
  }

  if (showDecimals && decimalsCount) {
    format += '.'
    for (let i = 1; i <= decimalsCount; i++) {
      format += '0'
    }
  }

  return numeral(value).format(format)
}

/**
 * 将金额转成大写繁体数字
 * @param {number} num 金额数字
 * @returns {any}
 */
export const formatCurrency = (num: number) => {
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [
    '',
    '拾',
    '佰',
    '仟',
    '万',
    '拾',
    '佰',
    '仟',
    '亿',
    '拾',
    '佰',
    '仟',
    '兆',
    '拾',
    '佰',
    '仟'
  ]

  // 如果数字超过 99 兆，直接返回原始数字
  if (num >= Number.MAX_SAFE_INTEGER) {
    return num
  }

  // 拆分整数和小数部分
  const [integerPart, decimalPart] = String(num).split('.')

  // 格式化整数部分
  let formattedIntegerPart = ''
  for (let i = 0; i < integerPart.length; i++) {
    formattedIntegerPart += digit[Number(integerPart[i])] + unit[integerPart.length - i - 1]
  }

  // 格式化小数部分
  let formattedDecimalPart = ''
  if (decimalPart) {
    formattedDecimalPart =
      digit[Number(decimalPart[0])] + '角' + digit[Number(decimalPart[1])] + '分'
  }

  // 返回格式化后的金额
  return formattedIntegerPart + '元' + formattedDecimalPart
}

export const useGetImageUrl = (url: string) => {
  return new URL(`../assets/images/${url}`, import.meta.url).href
}