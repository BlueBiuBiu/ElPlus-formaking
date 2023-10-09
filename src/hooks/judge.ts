import { computed } from "vue"
import type { Ref } from "vue"

// 判断设置数值/金额时的提示警告显示/隐藏
export const useJudgeNumberRange = (newCurrentItem: Ref<any>) => {
  return computed(() => {
    if (
      newCurrentItem.value.minValue &&
      newCurrentItem.value.maxValue &&
      +newCurrentItem.value.minValue > +newCurrentItem.value.maxValue
    ) {
      return true
    }
    return false
  })
}

// 判断单选/多选时的提示警告显示/隐藏
export const useJudgeOptionFit = (newCurrentItem: Ref<any>) => {
  return computed(() => {
    let flag = false
    newCurrentItem.value?.selectOptions.forEach((item: any) => {
      if (!item.label) {
        flag = true
        return
      }
    })
    return flag
  })
}
