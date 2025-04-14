export default [
  {
    path: "/",
    name: "index",
    meta: {
      icon: "ios-hammer",
      title: "概览",
    },
    // component: 'components/layout/main',
    component: "views/cmdb/basic/asset-main.vue",
  },
  {
    path: "global-asset-search",
    name: "cmdb_asset_search",
    meta: {
      icon: "ios-cube",
      title: "全局查询",
    },
    component: "views/cmdb/basic/search-asset.vue",
  },

  {
    path: "/service-tree",
    name: "serviceTree",
    meta: {
      icon: "md-albums",
      title: "服务树",
    },
    component: "views/cmdb/service-tree/index.vue",
  },

  {
    path: "/bizmg",
    name: "bizmg",
    meta: {
      icon: "md-albums",
      title: "业务管理",
    },
    component: "components/layout/main",
    children: [
      {
        path: "cmdb_biz_mg",
        name: "cmdb_biz_mg",
        meta: {
          icon: "md-folder",
          title: "业务管理",
        },
        component: "views/cmdb/biz/biz-mg.vue",
      },
      {
        path: "cmdb_dynamic_rules",
        name: "cmdb_dynamic_rules",
        meta: {
          icon: "ios-list-box",
          title: "规则管理",
        },
        component: "views/cmdb/biz/dynamic-rules.vue",
      },
      {
        path: "cmdb-dynamic-group",
        name: "cmdb_dynamic_group",
        meta: {
          icon: "ios-list-box",
          title: "动态分组",
        },
        component: "views/cmdb/biz/dynamic-group.vue",
      },
      {
        path: "cmdb-perm-group",
        name: "cmdb_perm_group",
        meta: {
          icon: "ios-list-box",
          title: "权限分组",
        },
        component: "views/cmdb/biz/perm-group.vue",
      },
      {
        path: "cmdb_set_temp",
        name: "cmdb_set_temp",
        meta: {
          icon: "md-funnel",
          title: "集群模板",
          // hideInMenu: true //隐藏视图
        },
        component: "views/cmdb/biz/biz-set-temp.vue",
      },
    ],
  },
  {
    path: "/basic",
    name: "basic",
    meta: {
      icon: "ios-cube",
      title: "资源管理",
    },
    component: "components/layout/main",
    children: [
      {
        path: "asset-server",
        name: "cmdb_asset_server",
        meta: {
          icon: "ios-cube",
          title: "主机列表",
        },
        component: "views/cmdb/basic/asset-server.vue",
      },
      {
        path: "asset-redis",
        name: "cmdb_asset_redis",
        meta: {
          icon: "ios-cube",
          title: "缓存列表",
        },
        component: "views/cmdb/basic/asset-redis.vue",
      },
      {
        path: "asset-mysql",
        name: "cmdb_asset_mysql",
        meta: {
          icon: "ios-cube",
          title: "云数据库",
        },
        component: "views/cmdb/basic/asset-mysql.vue",
      },
      {
        path: "asset-mongodb",
        name: "cmdb_asset_mongodb",
        meta: {
          icon: "ios-cube",
          title: "MongoDB",
        },
        component: "views/cmdb/basic/asset-mongodb.vue",
      },
      {
        path: "asset-lb",
        name: "cmdb_asset_lb",
        meta: {
          icon: "ios-cube",
          title: "负载均衡",
        },
        component: "views/cmdb/basic/asset-lb.vue",
      },
      {
        path: "asset-vpc",
        name: "cmdb_asset_vpc",
        meta: {
          icon: "ios-cube",
          title: "虚拟局域网",
        },
        component: "views/cmdb/basic/asset-vpc.vue",
      },
      {
        path: "asset-vswitch",
        name: "cmdb_asset_vswitch",
        meta: {
          icon: "ios-cube",
          title: "虚拟子网",
        },
        component: "views/cmdb/basic/asset-vswitch.vue",
      },
      {
        path: "security-group",
        name: "cmdb_security_group",
        meta: {
          icon: "ios-cube",
          title: "安全组",
        },
        component: "views/cmdb/basic/security-group.vue",
      },
      {
        path: "asset-nat",
        name: "cmdb_nat",
        meta: {
          icon: "ios-cube",
          title: "NAT网关",
        },
        component: "views/cmdb/basic/asset-nat.vue",
      },
            {
        path: "asset-cluster",
        name: "cmdb_cluster",
        meta: {
          icon: "ios-cube",
          title: "容器集群",
        },
        component: "views/cmdb/basic/asset-cluster.vue",
      },
      {
        path: "asset-switch",
        name: "cmdb_switch",
        meta: {
          icon: "ios-cube",
          title: "内网交换机",
        },
        component: "views/cmdb/basic/asset-switch.vue",
      },
      {
        path: "asset-agent",
        name: "cmdb_agent",
        meta: {
          icon: "ios-cube",
          title: "Agent列表",
        },
        component: "views/cmdb/basic/asset-agent.vue",
      },
    ],
  },
  // {
  //   path: "/resource",
  //   name: "resource",
  //   meta: {
  //     icon: "md-cloud",
  //     title: "资源采购",
  //   },
  //   component: "components/layout/main",
  //   children: [
  //     {
  //       path: "template-management",
  //       name: "template-management",
  //       meta: {
  //         icon: "md-cloud",
  //         title: "模板管理",
  //       },
  //       component: "views/cmdb/resource/templateManagement/templateManagement.vue",
  //     },
  //     // {
  //     //   path: "order-list",
  //     //   name: "order-list",
  //     //   meta: {
  //     //     icon: "md-cloud",
  //     //     title: "采购列表",
  //     //   },
  //     //   component: "views/cmdb/resource/orderList/orderList.vue",
  //     // },
  //   ],
  // },
  {
    path: "/discovery",
    name: "discovery",
    meta: {
      icon: "md-alert",
      title: "服务发现",
    },
    component: "components/layout/main",
    children: [
      {
        path: "consul-services",
        name: "services",
        meta: {
          title: "Consul Services",
        },
        component: "views/consul/consul-services.vue",
      },
      // {
      //   path: 'config',
      //   name: 'config',
      //   meta: {
      //     title: '相关配置（开发中）',
      //   },
      //   component: 'views/consul/more-config.vue',
      // },
    ],
  },
  {
    path: "/events",
    name: "events",
    meta: {
      icon: "md-alert",
      title: "云事件",
    },
    component: "components/layout/main",
    children: [
      {
        path: "aws-events",
        name: "aws_events",
        meta: {
          icon: "ios-alert",
          title: "AWS",
        },
        component: "views/cmdb/events/aws-events.vue",
      },
      {
        path: "aliyun-events",
        name: "aliyun_events",
        meta: {
          icon: "ios-alert",
          title: "阿里云",
        },
        component: "views/cmdb/events/aliyun-events.vue",
      },
      {
        path: "qcloud-events",
        name: "qcloud_events",
        meta: {
          icon: "ios-alert",
          title: "腾讯云",
        },
        component: "views/cmdb/events/qcloud-events.vue",
      },
    ],
  },
  {
    path: "/cloud-dns",
    name: "cloud_dns",
    meta: {
      icon: "md-alert",
      title: "云解析",
    },
    component: "components/layout/main",
    children: [
      {
        path: "cloud-domain-name",
        name: "cloud_domain_name",
        meta: {
          icon: "ios-alert",
          title: "域名管理",
        },
        component: "views/domain-name/cloud-domain-manage.vue",
      },
    ],
  },
  {
    path: "/cloud-region",
    name: "cloudRegion",
    meta: {
      icon: "ios-hammer",
      title: "云区域",
    },
    component: "views/cmdb/cloud-region.vue",
  },
  {
    path: "/tag",
    name: "tag",
    meta: {
      icon: "ios-hammer",
      title: "标签管理",
    },
    component: "views/cmdb/tag/tag-list.vue",
  },
  {
    path: "/cloud",
    name: "cloud",
    meta: {
      icon: "ios-hammer",
      title: "多云配置",
    },
    component: "components/layout/main",
    children: [
      {
        path: "cloud-account",
        name: "cloud_account",
        meta: {
          icon: "ios-alert",
          title: "云账号管理",
        },
        component: "views/cmdb/cloud-setting.vue",
      },
      {
        path: "cloud-manage",
        name: "cloud_manage",
        meta: {
          icon: "ios-alert",
          title: "公有云管理",
        },
      },
      {
        path: "cloud-child-account",
        name: "cloud_child_account",
        meta: {
          icon: "ios-alert",
          title: "子账号管理",
        },
      },
    ],
  },
  // {
  //   path: '/test',
  //   name: '开发中功能',
  //   meta: {
  //     icon: 'md-albums',
  //     title: '开发中功能',
  //   },
  //   component: 'views/cmdb/basic/asset-main.vue',
  // },
  {
    path: "/audit",
    name: "audit",
    meta: {
      icon: "md-cloud",
      title: "审计日志",
    },
    component: "components/layout/main",
    children: [
      {
        path: "audit-log",
        name: "audit-log",
        meta: {
          icon: "md-cloud",
          title: "审计日志",
        },
        component: "views/cmdb/audit-log/auditManagement/auditManagement.vue",
      },
      // {
      //   path: "order-list",
      //   name: "order-list",
      //   meta: {
      //     icon: "md-cloud",
      //     title: "采购列表",
      //   },
      //   component: "views/cmdb/resource/orderList/orderList.vue",
      // },
    ],
  },
]
