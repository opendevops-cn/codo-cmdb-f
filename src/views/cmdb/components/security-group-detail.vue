<template>
  <div>
    <Drawer v-model="drawerData.show" :title="drawerData.title" :mask-closable="false" :transfer="false" :inner="true" width="75%">
      <Tabs value="attribute" @on-click="handleClick">
        <TabPane label="安全组规则" name="attribute">
          <Table  size="small" :columns="tableColumns" :data="security_info" ></Table>
        </TabPane>
        <TabPane label="安全组内主机" name="server">
          <Table  size="small" :columns="tableColumnsServer" :data="tableDataServer" ></Table>
        </TabPane>
        <TabPane v-if="ref_info.length > 0" label="安全组间关联" name="references">
          {{ref_info}} 关联了本安全组
        </TabPane>
      </Tabs>
      <div v-if="serverData">
        <serverDetail :modalData="modalData" :serverData="serverData"></serverDetail>
      </div>
    </Drawer>
  </div>
</template>
<script>
import {  getSecurityGroupRefs } from '@/api/cloud/security-group.js'
import serverDetail from './server-detail'
export default {
  name: 'SecurityGroupDetail',
  components: {
    serverDetail
  },
  props: {
    drawerData: {
      type: Object,
      default: {}
    },
    security_info: {
      type: Array|Object,
      default: []
    },
     ref_info: {
      type: Array|Object,
      default: []
    },
    securityGroupId: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      tableColumns: [
        {
          title: '安全组ID',
          key: 'security_group_id',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '授权策略',
          key: 'policy',
          minWidth: 100,
          render: (h, params) => {
            let policy = params.row.policy
            if (policy == 'Accept') {
              return h('span', {}, '允许')
            } else if (policy == 'ACCEPT') {
              return h('span', {}, '允许')
            } else {
              return h('span', {}, policy)
            }
          }
        },
        {
          title: '优先级',
          key: 'priority',
          minWidth: 80
        },
        {
          title: '协议类型',
          key: 'ip_protocol',
          minWidth: 100
        },
        {
          title: '端口范围',
          key: 'port_range',
          minWidth: 100
        },
        {
          title: '授权对象',
          key: 'source_cidr_ip',
          minWidth: 180,
          render: (h, params) => {
            console.info(params.row)
            let direction = params.row.direction
            if (direction == 'ingress') {
              return h('span', {}, `源：${params.row.source_cidr_ip} ${params.row.source_group_name}`)
            } else if (direction == 'egress') {
              return h('span', {}, `目标：${params.row.dest_cidr_ip} ${params.row.dest_group_name}`)
            } else if (direction == 'all') {
              return h('span', {}, `源：${params.row.source_cidr_ip}  目标：${params.row.dest_cidr_ip} `)
            } else {
              return h('span', {}, `源：${params.row.source_cidr_ip}  目标：${params.row.dest_cidr_ip} `)
            }
          }
        },
        {
          title: '授权方向',
          key: 'direction',
          minWidth: 100,
          render: (h, params) => {
            let direction = params.row.direction
            if (direction == 'ingress') {
              return h('span', {}, '入方向')
            } else if (direction == 'egress') {
              return h('span', {}, '出方向')
            } else if (direction == 'all') {
              return h('span', {}, '全部')
            } else {
              return h('span', {},  params.row.direction)
            }
          }
        },
        {
          title: '描述',
          key: 'description',
          tooltip: true,
          minWidth: 100
        }

      ],
      tableDataServer: [], //
      tableColumnsServer: [
        {
          title: '实例ID',
          key: 'instance_id',
          minWidth: 150,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.handlerDetail(params.row)
                }
              }
            }, params.row.instance_id

            )
          }
        },
        {
          title: '主机名',
          key: 'name',
          minWidth: 100
        },
        {
          title: '内网IP',
          key: 'inner_ip',
          minWidth: 130
        },
        {
          title: '地域',
          key: 'region',
          minWidth: 100
        }
      ],
      serverData: {},
      modalData: {
        show: false,
        title: '主机详情'
      },
      referencesGroup: null
    }
  },
  methods: {
    handleGetSecurityGroupServer () {
      getSecurityGroupRefs({sg_id : this.securityGroupId, asset_type: 'server'}).then(res => {
        if (res.code == 0) {
          this.tableDataServer = res.data
        } else {
          this.tableDataServer = []
          this.$Message.info('当前安全组下没有找到实例')
        }
      })
    },

    handleClick (value) {
      // if (value == 'server') {
      //   this.handleGetSecurityGroupServer()
      // } else if (value == 'references') {
      //   this.handleGetSecurityGroupSecurity()
      // }
    },
    handlerDetail (value) {
      this.serverData = value
      this.modalData.show = true
    }
  },
  watch: {
    securityGroupId (val) {
      this.handleGetSecurityGroupServer()
    }
  },
  mounted () {
  }
  //
}
</script>
