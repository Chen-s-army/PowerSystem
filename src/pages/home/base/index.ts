import dayjs from "dayjs"
import { getChartListColor } from "@/utils/color"
import { getRandomArray } from "@/utils/charts"

/** 首页 home 折线图 */
export function constructInitDashboardDataset(type: string) {
  const dateArray: Array<string> = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  const datasetAxis = {
    xAxis: {
      type: "category",
      show: false,
      data: dateArray,
    },
    yAxis: {
      show: false,
      type: "value",
    },
    grid: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  }

  if (type === "line") {
    const lineDataset = {
      ...datasetAxis,
      color: ["#fff"],
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type,
          showSymbol: true,
          symbol: "circle",
          symbolSize: 0,
          markPoint: {
            data: [
              { type: "max", name: "最大值" },
              { type: "min", name: "最小值" },
            ],
          },
          itemStyle: {
            normal: {
              lineStyle: {
                width: 2,
              },
            },
          },
        },
      ],
    }
    return lineDataset
  }
  if (type === "bar") {
    const barDataset = {
      ...datasetAxis,
      color: getChartListColor(),
      series: [
        {
          data: [
            100,
            130,
            184,
            218,
            {
              value: 135,
              itemStyle: {
                opacity: 0.2,
              },
            },
            {
              value: 118,
              itemStyle: {
                opacity: 0.2,
              },
            },
            {
              value: 60,
              itemStyle: {
                opacity: 0.2,
              },
            },
          ],
          type,
          barWidth: 9,
        },
      ],
    }
    return barDataset
  }
}

/** 柱状图数据源 */
export function constructInitDataset({
  dateTime = [],
  placeholderColor,
  borderColor,
}: { dateTime: Array<string> } & Record<string, string>) {
  const divideNum = 30
  const timeArray = []
  const inArray = []
  const outArray = []
  for (let i = 0; i < divideNum; i++) {
    if (dateTime.length > 0) {
      const dateAbsTime: number = (new Date(dateTime[1]).getTime() - new Date(dateTime[0]).getTime()) / divideNum
      const enhandTime: number = new Date(dateTime[0]).getTime() + dateAbsTime * i
      timeArray.push(dayjs(enhandTime).format("MM-DD"))
    } else {
      timeArray.push(
        dayjs()
          .subtract(divideNum - i, "day")
          .format("MM-DD"),
      )
    }

    inArray.push(getRandomArray().toString())
    outArray.push(getRandomArray().toString())
  }
  const dataset = {
    color: getChartListColor(),
    tooltip: {
      trigger: "item",
    },
    xAxis: {
      type: "category",
      data: timeArray,
      axisLabel: {
        color: placeholderColor,
      },
      axisLine: {
        lineStyle: {
          color: borderColor,
          width: 1,
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: placeholderColor,
      },
      splitLine: {
        lineStyle: {
          color: borderColor,
        },
      },
    },
    grid: {
      top: "5%",
      left: "25px",
      right: 0,
      bottom: "60px",
    },
    legend: {
      icon: "rect",
      itemWidth: 12,
      itemHeight: 4,
      itemGap: 48,
      textStyle: {
        fontSize: 12,
        color: placeholderColor,
      },
      left: "center",
      bottom: "0",
      orient: "horizontal",
      data: ["触发次数"],
    },
    series: [
      {
        name: "触发次数",
        data: outArray,
        type: "bar",
      },
    ],
  }

  return dataset
}

/** 折线图数据源 */
export function getLineChartDataSet({
  dateTime = [],
  placeholderColor,
  borderColor,
}: { dateTime?: Array<string> } & Record<string, string>) {
  const divideNum = 30 // 显示的数据量
  const timeArray = []
  const inArray = []
  const outArray = []
  for (let i = 0; i < divideNum; i++) {
    if (dateTime.length > 0) {
      const dateAbsTime: number = (new Date(dateTime[1]).getTime() - new Date(dateTime[0]).getTime()) / divideNum
      const enhandTime: number = new Date(dateTime[0]).getTime() + dateAbsTime * i
      timeArray.push(dayjs(enhandTime).format("MM-DD"))
    } else {
      timeArray.push(
        dayjs()
          .subtract(divideNum - i, "day")
          .format("MM-DD"),
      )
    }

    inArray.push(getRandomArray().toString())
    outArray.push(getRandomArray().toString())
  }

  const dataSet = {
    color: getChartListColor(),
    tooltip: {
      trigger: "item",
    },
    grid: {
      left: "0",
      right: "20px",
      top: "5px",
      bottom: "36px",
      containLabel: true,
    },
    legend: {
      left: "center",
      bottom: "0",
      orient: "horizontal", // legend 横向布局。
      data: ["实际功耗", "理论功耗"],
      textStyle: {
        fontSize: 12,
        color: placeholderColor,
      },
    },
    xAxis: {
      type: "category",
      data: timeArray,
      boundaryGap: false,
      axisLabel: {
        color: placeholderColor,
      },
      axisLine: {
        lineStyle: {
          width: 1,
        },
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: placeholderColor,
      },
      splitLine: {
        lineStyle: {
          color: borderColor,
        },
      },
    },
    series: [
      {
        name: "实际功耗",
        data: outArray,
        type: "line",
        smooth: false,
        showSymbol: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          normal: {
            borderColor,
            borderWidth: 1,
          },
        },
        areaStyle: {
          normal: {
            opacity: 0.1,
          },
        },
      },
      {
        name: "理论功耗",
        data: inArray,
        type: "line",
        smooth: false,
        showSymbol: true,
        symbol: "circle",
        symbolSize: 8,
        itemStyle: {
          normal: {
            borderColor,
            borderWidth: 1,
          },
        },
      },
    ],
  }
  return dataSet
}

/**
 * 获取表行数据
 *
 * @export
 * @param {string} productName
 * @param {number} divideNum
 */
export function getSelftItemList(productName: string, divideNum: number): string[] {
  const productArray: string[] = [productName]
  for (let i = 0; i < divideNum; i++) {
    productArray.push(getRandomArray(100 * i).toString())
  }

  return productArray
}


export function getPieChartDataSet({
  textColor,
  placeholderColor,
  containerColor,
}: { radius: number } & Record<string, string>) {
  return {
    color: getChartListColor(),
    tooltip: {
      show: false,
      trigger: "axis",
      position: null,
    },
    grid: {
      top: "0",
      right: "0",
    },
    legend: {
      selectedMode: false,
      itemWidth: 12,
      itemHeight: 4,
      textStyle: {
        fontSize: 12,
        color: placeholderColor,
      },
      left: "center",
      bottom: "0",
      orient: "horizontal", // legend 横向布局。
    },
    series: [
      {
        name: "能耗分布",
        type: "pie",
        radius: ["48%", "60%"],
        avoidLabelOverlap: true,
        selectedMode: true,
        hoverAnimation: true,
        silent: true,
        itemStyle: {
          borderColor: containerColor,
          borderWidth: 1,
        },
        label: {
          show: true,
          position: "center",
          formatter: ["{value|{d}%}", "{name|{b}渠道占比}"].join("\n"),
          rich: {
            value: {
              color: textColor,
              fontSize: 28,
              fontWeight: "normal",
              lineHeight: 46,
            },
            name: {
              color: "#909399",
              fontSize: 12,
              lineHeight: 14,
            },
          },
        },
        emphasis: {
          label: {
            show: true,
            formatter: ["{value|{d}%}", "{name|{b}渠道占比}"].join("\n"),
            rich: {
              value: {
                color: textColor,
                fontSize: 28,
                fontWeight: "normal",
                lineHeight: 46,
              },
              name: {
                color: "#909399",
                fontSize: 14,
                lineHeight: 14,
              },
            },
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            value: 1048,
            name: "区域1",
          },
        ],
      },
    ],
  }
}
