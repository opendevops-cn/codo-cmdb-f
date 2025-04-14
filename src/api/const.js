
export const assetList = [{ value: 'server', label: '服务器' }, { value: 'mysql', label: 'MySQL' },
    { value: 'redis', label: 'Redis' }, { value: 'lb', label: '负载均衡' }
]

export const columnTypeList = [{ value: 'name', label: '名称' }, { value: 'cloud_name', label: '厂商' },
    { value: 'account_id', label: '用户' }, { value: 'region', label: '云区域' }, 
    { value: 'inner_ip', label: '内网地址(主机)' },
    { value: 'state', label: '运行状态' }
]


export const operatorList = [
      { label: "包含", value: "包含" },
      { label: "正则", value: "正则" },
      { label: "等于", value: "=="  },
      { label: "不等于", value: "!=" }, 
      { label: "开始", value: "开始" },
      { label: "结束", value: "结束" }
]