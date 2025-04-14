/* eslint-disable camelcase */
// export const getFeFormInfo = (v, _this) => ({
//   ...v,
//   renderSecurityGroups: Object.entries(v.security_groups).reduce((pre, cur) => {
//     const [key, value] = cur
//     pre += `${key} | ${value};`
//     return pre
//   }, ""),
//   renderTags: Object.entries(v.tags).reduce((pre, cur) => {
//     const [key, value] = cur
//     pre += `${key} | ${value};`
//     return pre
//   }, ""),
//   resTypeRender: _this.resTypeOptions.find((c) => c.value === v.res_type)?.label,
//   instanceChargeTypeRender: _this.instanceChargeTypeOptions.find((c) => c.value === v.instance_charge_type)?.label,
//   systemDiskTypeRender: _this.systemDiskTypeOptions.find((c) => c.value === v.system_disk_type)?.label,
//   dataDiskTypeRender: _this.dataDiskTypeOptions.find((c) => c.value === v.data_disk?.type)?.label,
//   internetChargeTypeRender: _this.internetChargeTypeOptions.find((c) => c.value === v.internet_charge_type)?.label,
//   cloundAccountRender: `${v.account_id} | ${v.vendor}`,
//   data_disk_type: v.data_disk?.type,
//   data_disk_size: v.data_disk?.size,
//   is_eip: v.is_eip,
//   inner_ip: v.inner_ip,
//   bandwidth_pkg_id: v.bandwidth_pkg_id,
//   data_disk: v.data_disk || { type: "", size: "" },
//   securityGroupsValues: Object.entries(v.security_groups).map((cur) => {
//     const [key, value] = cur
//     return `${key}${_this.specialSplit}${value}`
//   }),
//   max_flow_out: Number(v.max_flow_out),
//   tagsValues: Object.entries(v.tags).map((c) => {
//     _this.handleSelectTag({ value: c[0] })
//     return {
//       key: c[0],
//       value: c[1],
//     }
//   }),
// })

export const getFeFormInfo = (v, _this) => ({
  ...v,
  renderTags: Object.entries(v.tags).reduce((pre, cur) => {
    const [key, value] = cur
    pre += `${key} | ${value};`
    return pre
  }, ""),
  resTypeRender: _this.resTypeOptions.find((c) => c.value === v.res_type)?.label,
  cloundAccountRender: `${v.account_id} | ${v.vendor}`,
  tagsValues: Object.entries(v.tags).map((c) => {
    _this.handleSelectTag({ value: c[0] })
    return {
      key: c[0],
      value: c[1],
    }
  }),
})

export const getUniqueStr = (randomLength) => `^${Number(Math.random().toString().substring(2, randomLength) + Date.now()).toString(36)}$`

// export const getParams = (formValues, _this) => {
//   const {
//     name, account_id, vendor,
//     cloud_region_id, res_type, region, zone,
//     image_id, image_name, cpu, memory, instance_type, system_disk_size,
//     system_disk_type, securityGroupsValues, tagsValues,
//     vpc_id, vpc_name, subnet_id, subnet_name, max_flow_out,
//     instance_charge_type, internet_charge_type,
//     data_disk_size, data_disk_type, description, is_eip, inner_ip, bandwidth_pkg_id,
//   } = formValues
//  return {
//     name,
//     account_id,
//     vendor,
//     cloud_region_id,
//     res_type,
//     region,
//     zone,
//     image_id,
//     image_name,
//     cpu: Number(cpu),
//     memory,
//     instance_type,
//     system_disk_size: Number(system_disk_size),
//     system_disk_type,
//     security_groups: securityGroupsValues.reduce((pre, cur) => {
//       const arr = cur.split(_this.specialSplit)
//       const [key, value] = arr
//       pre[key] = value
//       return pre
//     }, {}),
//     tags: tagsValues.reduce((pre, cur) => {
//       pre[cur.key] = cur.value
//       return pre
//     }, {}),
//     vpc_id,
//     vpc_name,
//     subnet_id,
//     subnet_name,
//     max_flow_out,
//     instance_charge_type,
//     internet_charge_type,
//     data_disk: {
//       size: Number(data_disk_size),
//       type: data_disk_type,
//     },
//     is_eip,
//     inner_ip,
//     bandwidth_pkg_id,
//     description,
//   }
// }

export const getParams = (formValues, _this) => {
  const {
    name, account_id, vendor,
    cloud_region_id, res_type, region, zone, tagsValues,
    content, description, vpc_id, vpc_name, subnet_id, subnet_name,
  } = formValues

  return {
    name,
    account_id,
    vendor,
    cloud_region_id,
    vpc_id,
    vpc_name,
    subnet_id,
    subnet_name,
    res_type,
    region,
    zone,
    tags: tagsValues.reduce((pre, cur) => {
      pre[cur.key] = cur.value
      return pre
    }, {}),
    content,
    description,
  }
}
