const dataDiskTypeOptions = [
  {
    label: "高性能云硬盘",
    value: "CLOUD_PREMIUM",
  },
  {
    label: "通用型SSD云硬盘",
    value: "CLOUD_BSSD",
  },
  {
    label: "SSD云硬盘",
    value: "CLOUD_SSD",
  },
  {
    label: "增强型SSD云硬盘",
    value: "CLOUD_HSSD",
  },
]
const systemDiskTypeOptions = [
  {
    label: "高性能云硬盘",
    value: "CLOUD_PREMIUM",
  },
  {
    label: "通用型SSD云硬盘",
    value: "CLOUD_BSSD",
  },
  {
    label: "SSD云硬盘",
    value: "CLOUD_SSD",
  },
  {
    label: "增强型SSD云硬盘",
    value: "CLOUD_HSSD",
  },
]
const resTypeOptions = [
  {
    label: "服务器",
    value: "server",
  },
  {
    label: "LB",
    value: "LB",
  },
  // {
  //   label: "Mysql",
  //   value: "mysql",
  // },
  // {
  //   label: "Redis",
  //   value: "redis",
  // },
]
const instanceChargeTypeOptions = [
  {
    label: "包年包月",
    value: "PREPAID",
  },
  {
    label: "按量计费",
    value: "POSTPAID_BY_HOUR",
  },
]
const internetChargeTypeOptions = [
  {
    label: "带宽包用户",
    value: "BANDWIDTH_PACKAGE",
  },
  {
    label: "按带宽包年包月计费",
    value: "BANDWIDTH_PREPAID",
  },
  {
    label: "流量按小时后付费",
    value: "TRAFFIC_POSTPAID_BY_HOUR",
  },
]
export {
  resTypeOptions,
  dataDiskTypeOptions,
  systemDiskTypeOptions,
  instanceChargeTypeOptions,
  internetChargeTypeOptions,
}
