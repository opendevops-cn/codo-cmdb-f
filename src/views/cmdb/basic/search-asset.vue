<template>
  <Card dis-hover :bordered="false">

    <div>
      <Alert type="success" show-icon> 后续逐步完善关联关系的展示...</Alert>
      <Affix :offset-top="50" style="padding-bottom: 15px;">
        <Input class="search-input" v-model="initPara.searchVal" search :maxlength="50" @on-search="handleSearch"
          placeholder="根据IP或者名称查询..." />
      </Affix>
      <template v-if="serverData.length !== 0">
        <Table size="small" :columns="serverColumns" :data="serverData" style="margin-bottom: 20px;"></Table>
      </template>
      <template v-if="mysqlData.length !== 0">
        <Table size="small" :columns="mysqlColumns" :data="mysqlData" style="margin-bottom: 20px;"></Table>
      </template>
      <template v-if="redisData.length !== 0">
        <Table size="small" :columns="redisColumns" :data="redisData" style="margin-bottom: 20px;"></Table>
      </template>
      <template v-if="lbData.length !== 0">
        <Table size="small" :columns="lbColumns" :data="lbData" style="margin-bottom: 20px;"></Table>
      </template>
      <template v-if="domainRData.length !== 0">
        <Table size="small" :columns="columnsRecord" :data="domainRData" style="margin-bottom: 20px;"></Table>
      </template>
      <template v-if="treeAssetData.length !== 0">
        <Table size="small" :columns="treeAssetColumns" :data="treeAssetData" style="margin-bottom: 20px;"></Table>
      </template>
      <template v-if="natData.length !== 0">
        <Table size="small" :columns="natColumns" :data="natData" style="margin-bottom: 20px;"></Table>
      </template>
    </div>

  </Card>
</template>

<script>
import { searchAssetList } from "@/api/cmdb.js";

export default {
  data() {
    return {
      initPara:{
        page_number: 1,
        page_size: 15,
        searchVal: null
      },
      serverData: [],
      mysqlData: [],
      redisData: [],
      lbData: [],
      natData: [],
      domainRData: [],
      treeAssetData: [],
      treeAssetColumns: [
        {
          title: "业务 ID",
          key: "biz_id",
          align: "center",
          width: 130,
        },
        {
          title: "业务(英文名)",
          key: "biz_en_name",
          align: "center",
          width: 200,
        },
        {
          title: "业务(中文名)",
          key: "biz_cn_name",
          align: "center",
          width: 250,
        },
        {
          title: "环境",
          key: "env_name",
          align: "center",
          width: 200,
        },
        {
          title: "集群",
          key: "region_name",
          align: "center",
          width: 250,
        },
        {
          title: "模块",
          key: "module_name",
          align: "center",
          width: 250,
        },
        {
          title: "内网IP",
          key: "inner_ip",
          align: "center",
          width: 200,
        },
        {
          title: "上线状态",
          key: "is_enable",
          align: "center",
          width: 175,
          render: (h, params) => {
            const enable = params.row.is_enable
            if (enable === 1) {
              return h('span', {}, '已上线')
            } else if (enable === 0) {
              return h('span', {}, '已下线')
            } else { return h('span', {}, enable) }
          },
        },
      ],
      serverColumns: [
        {
          title: "主机 ID",
          key: "id",
          width: 130,
          align: "center",
        },
        {
          title: '云厂商',
          key: 'cloud_name',
          width: 130,
        },
        {
          title: '实例ID',
          key: 'instance_id',
          align: 'left',
          minWidth: 130,
        },
        {
          title: "实例名称",
          key: "name",
          minWidth: 120,
          maxWidth: 170,
          align: "center",
        },
        {
          title: '地域',
          key: 'region',
          minWidth: 130,
          maxWidth: 160
        },
        {
          title: '内网IP',
          key: 'inner_ip',
          align: 'center',
          minWidth: 150
        },
        {
          title: '外网IP',
          key: 'outer_ip',
          align: 'center',
          minWidth: 150,
        },
        {
          title: "状态",
          key: "state",
          minWidth: 110,
          maxWidth: 140,
          align: "center",
        },
        {
          title: '更新时间',
          key: "update_time",
          minWidth: 170,
          maxWidth: 210
        },
      ],
      mysqlColumns: [
        {
          title: "MySQL ID",
          key: "id",
          width: 130,
          align: "center",
        },
        {
          title: '云厂商',
          key: 'cloud_name',
          width: 130,
        },
        {
          title: '实例ID',
          key: 'instance_id',
          align: 'left',
          minWidth: 130
        },
        {
          title: '实例名称',
          key: 'name',
          align: 'left',
          minWidth: 130,
          tooltip: true,
        },
        {
          title: '地域',
          key: 'region',
          minWidth: 130,
          maxWidth: 160
        },
        {
          title: '引擎',
          key: 'db_engine',
          align: 'left',
          width: 130,
          sortable: true,
        },
        {
          title: '地址',
          key: 'db_address',
          align: 'left',
          minWidth: 150,
          tooltip: true,
        },
      ],
      redisColumns: [
        {
          title: "Redis ID",
          key: "id",
          width: 130,
          align: "center",
        },
        {
          title: '云厂商',
          key: 'cloud_name',
          width: 130,
        },
        {
          title: '实例ID',
          key: 'instance_id',
          align: 'left',
          minWidth: 130
        },
        {
          title: '实例名称',
          key: 'name',
          align: 'left',
          minWidth: 130,
          tooltip: true,
        },
        {
          title: '地域',
          key: 'region',
          minWidth: 130,
          maxWidth: 160
        },
        {
          title: '版本',
          key: 'instance_version',
          align: 'center',
          width: 100
        },
        {
          title: '地址',
          key: 'instance_address',
          align: 'center',
          tooltip: true,
        },
      ],
      natColumns:[
        {
          title: '厂商',
          key: 'cloud_name',
          align: 'center',
          width: 120,
          sortable: true,
          // eslint-disable-next-line consistent-return
          render: (h, params) => {
            const cloudName = params.row.cloud_name
            // const { cloud_name } = params.row
            if (cloudName === 'qcloud') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'geekblue' },
                  },
                  '腾讯云',
                ),
              ])
            } else if (cloudName === 'aliyun') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'blue' },
                  },
                  '阿里云',
                ),
              ])
            } else if (cloudName === 'cds') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'cyan' },
                  },
                  '首都云',
                ),
              ])
            } else if (cloudName === 'vmware') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'purple' },
                  },
                  'VMware',
                ),
              ])
            } else if (cloudName === 'volc') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'orange' },
                  },
                  '火山云',
                ),
              ])
            } else if (cloudName === 'gcp') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'green' },
                  },
                  '谷歌云',
                ),
              ])
            } else if (cloudName === 'aws') {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'volcano' },
                  },
                  'AWS',
                ),
              ])
            } else {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: 'gold' },
                  },
                  cloudName,
                ),
              ])
            }
          },
        },
        {
          title: '状态',
          key: 'state',
          align: 'center',
          width: 130,
          sortable: true,
          render: (h, params) => {
            const { row } = params
            // eslint-disable-next-line no-nested-ternary
            const color = row.state === '运行中' ? 'success' : row.state === '关机' ? 'error' : row.state === '创建中' ? 'primary' : 'error'
            // eslint-disable-next-line no-nested-ternary
            const text = row.state === '运行中' ? '运行中' : row.state === '关机' ? '已关机' : row.state === '创建中' ? '创建中' : row.state === '未同步' ? '未同步' : row.state
            return h(
              'Tag',
              {
                props: {
                  type: 'dot',
                  color,
                },
              },
              text,
            )
          },
        },
        {
          title: '网关名称',
          key: 'name',
          tooltip: true,
          sortable: true,
          minWidth: 150
        },
        {
          title: '网关ID',
          key: 'instance_id',
          ellipsis: true,
          tooltip: true,
          minWidth: 200,
        },
        {
          title: '类型',
          key: 'spec',
          minWidth: 100
        },
        {
          title: '地域',
          key: 'region',
          minWidth: 90
        },
        {
          title: '公网IP',
          key: 'outer_ip',
          minWidth: 190,
          render: (h, params) => {
            return h('span', params.row.outer_ip.join(','));
          },
        },
        {
          title: '备注',
          key: 'description',
          ellipsis: true,
          tooltip: true,
          minWidth: 100
        },
        {
          title: '更新时间',
          key: 'update_time',
          sortable: true,
          width: 170
        }

      ],
      lbColumns: [
      {
          title: "负载均衡ID",
          key: "id",
          width: 130,
          align: "center",
        },
        {
          title: '云厂商',
          key: 'cloud_name',
          width: 130,
        },
        {
          title: '实例ID',
          key: 'instance_id',
          align: 'left',
          minWidth: 130,
          sortable: true
        },
        {
          title: '实例名称',
          key: 'name',
          align: 'left',
          minWidth: 130,
          tooltip: true,
        },
        {
          title: '地域',
          key: 'region',
          minWidth: 130,
          maxWidth: 160
        },
        {
          title: '地址',
          key: 'lb_vip',
          minWidth: 150,
          tooltip: true,
          render: (h, params) => {
            let addr = params.row.dns_name ? params.row.dns_name: params.row.lb_vip
            return h('div', [
              h(
                  'p',
                   addr,
                ),
              ])
          },
        },
      ],
      //
       columnsRecord: [
        {
          title: '主机记录',
          key: 'domain_rr',
          sortable: true,
          minWidth: 110
         },
        {
          title: '域名',
          key: 'domain_name',
          sortable: true,
          minWidth: 110
        },
        {
          title: '记录类型',
          key: 'domain_type',
          align: 'center',
          sortable: true,
          width: 110
        },
        {
          title: '线路',
          width: 100,
          key: 'line',
          sortable: true,
          align: 'center',
          render: (h, params) => {
            let line = params.row.line
            if (line === 'default') {
              return h('span', {}, '默认')
            } else if (line === 'oversea') {
              return h('span', {}, '海外')
            } else { return h('span', {}, line) }
          }
        },
        {
          title: '记录值',
          key: 'domain_value',
          sortable: true,
          minWidth: 150,
          render: (h, params) => {
            let domain_mx = params.row.domain_mx
            if (params.row.domain_type === 'MX') {
              return h('span', {}, params.row.domain_value + ' | ' + domain_mx)
            } else { return h('span', {}, params.row.domain_value) }
          }
        },
        {
          title: 'TTL',
          key: 'domain_ttl',
          align: 'center',
          sortable: true,
          width: 100,
        },
        {
          title: '权重',
          key: 'weight',
          align: 'center',
          sortable: true,
          width: 100,
        },
        {
          title: '状态',
          key: 'state',
          width: 100,
          sortable: true,
          align: 'center',
          render: (h, params) => {
            let state = params.row.state
            if (state == 'ENABLE' || state == 'enable' || state == 'enabled') {
              return h('div', [
                h('Tag', { props: { color: 'green' } }, '正常')
              ])
            } else if (state == 'default') {
              return h('div', [
                h('Tag', { props: { color: 'blue' } }, '默认')
              ])
            } else if (state == 'DISABLE' || state == 'disable') {
              return h('div', [
                h('Tag', { props: { color: 'blue' } }, '暂停')
              ])
            } else { return h('div', [h('Tag', { props: { color: 'error' } }, state)]) }
          }
        },
        {
          title: '备注',
          key: 'remark',
          width: 60,
          render: (h, params) => {
            return h('Tooltip', {
              props: { placement: 'top' }
            }, [
              h('icon', {
                props: {
                  type: 'ios-help-circle',
                  // size: 'small'
                },
                style: {
                  marginRight: '1px'
                }
              }),
              h('span', { slot: 'content', style: { whiteSpace: 'normal', wordBreak: 'break-all' } }, params.row.remark)
            ])
          }
        },
      ],
      //
    };
  },
  methods: {
    // 获取
    async handleGetData() {
      const res = await searchAssetList(this.initPara);
      if (res.code === 0) {
        this.serverData = res.server_data;
        this.mysqlData = res.mysql_data;
        this.redisData = res.redis_data;
        this.lbData = res.lb_data;
        this.domainRData = res.dns_data;
        this.treeAssetData = res.tree_asset_data;
        this.natData = res.nat_data;
      } else {
        this.$Notice.info({ title: `${res.msg}` });
      }
    },
    handleSearch(){
      this.handleGetData()
    },
  },
  watch: {
  },
  mounted () {
  },
};
</script>