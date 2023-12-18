import { defineStore } from "pinia"

interface IFormState {
  config: any[]
  errorContent: string[]
  currentIndex: number
  tempConfig: any[]
}

const errorContentObj = {
  repeat: "控件名称重复，请修改",
  numberRange: "数字范围设置错误，请修改",
  amountRange: "金额范围设置错误，请修改",
  optionEmpty: "单选/多选控件选项内容为空，请补充"
}

export const useFormStore = defineStore("formStore", {
  state: (): IFormState => {
    return {
      config: [],
      errorContent: [],
      currentIndex: -1,
      tempConfig: []
    }
  },
  getters: {
    getFormErrorContent: (state) => state.errorContent
  },
  actions: {
    // 更新配置文件
    updateConfig(payload: any[]) {
      this.config = payload
      this.computeErrorContent()
    },
    // 校验有没有哪个表单有不符合规则的内容
    computeErrorContent() {
      const typeObj: any = {}
      this.errorContent.length = 0 // 每次计算前重置错误汇总数组
      const tempErrorContent: Record<string, string[]> = {} // 各种组件的类型错误汇总的对象数组
      const tempArr: any[] = JSON.parse(JSON.stringify(this.config))

      tempArr.forEach((item, index) => {
        // 判断控件是否重复（判断标题label字段是否相同）
        if (!typeObj[item.type]) {
          typeObj[item.type] = []
          tempErrorContent[item.type] = []
          typeObj[item.type].push(item)
        } else {
          typeObj[item.type].push(item)
        }
      })

      tempArr.forEach((item, index) => {
        let flag = false
        typeObj[item.type].forEach((iten: any) => {
          if (item.field === iten.field) return

          // 判断组件的label是否一样
          if (
            !['explain', 'desc', 'divider', 'date-range', 'fence'].includes(item.type) &&
            item.label === iten.label
          ) {
            flag = true

            if (!tempErrorContent[item.type]?.includes(errorContentObj.repeat)) {
              tempErrorContent[item.type].push(errorContentObj.repeat)
            }
          }
        })

        item.hasError = flag
        this.judgeComponent(item, index, tempErrorContent)
      })

      // 将各个组件的类型错误汇总
      for (const [item, value] of Object.entries(tempErrorContent)) {
        this.errorContent.push(...value)
      }

      this.tempConfig = tempArr
    },
    // 判断单个每个组件是否符合规则
    judgeComponent(item: any, index: number, tempErrorContent: Record<string, string[]>) {
      /** 数值 */
      // 判断数字组件的范围
      if (item.type === "number" && item.minValue && item.maxValue) {
        if (+item.minValue > +item.maxValue) {
          if (!tempErrorContent[item.type]?.includes(errorContentObj.numberRange)) {
            tempErrorContent[item.type].push(errorContentObj.numberRange)
          }
        }

        if (tempErrorContent[item.type].length) {
          item.hasError = true
        } else {
          item.hasError = false
        }
      }

      // 判断金额组件的范围
      if (item.type === "amount" && item.minValue && item.maxValue) {
        if (+item.minValue > +item.maxValue) {
          if (!tempErrorContent[item.type]?.includes(errorContentObj.amountRange)) {
            tempErrorContent[item.type].push(errorContentObj.amountRange)
          }
        }

        if (tempErrorContent[item.type].length) {
          item.hasError = true
        } else {
          item.hasError = false
        }
      }

      /** 选项 */
      // 单选/多选组件
      if (["single-select", "multiple-select"].includes(item.type)) {
        item.selectOptions.forEach((iten: any) => {
          if (!iten.label) {
            if (!tempErrorContent[item.type]?.includes(errorContentObj.optionEmpty)) {
              tempErrorContent[item.type].push(errorContentObj.optionEmpty)
            }
          }
        })

        if (tempErrorContent[item.type].length) {
          item.hasError = true
        } else {
          item.hasError = false
        }
      }
    }
  }
})
