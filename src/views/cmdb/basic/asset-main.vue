<template>
  <div style="padding-top: 1px">
    <Alert type="info" show-icon>
      <p >基础资源面板：</p>
      <template slot="desc">
        <p>快速跳转查看基础资源，基础资源定时同步云商数据</p>
      </template>
    </Alert>
    
    <Row :gutter="20">
      <i-col style="cursor: pointer;" :key="index" :xxl="6" :lg="8" :sm="12"  v-for="item, index in basicList">
        <Card dis-hover :bordered="false" style="margin: 1px 0px 20px; text-align: center" @click.native="handlerName(item)">
          <div style="text-align: center">
            <Icon style="font-size: 80px; color: #00b2ee" :type="item.icon" />
            <h3>
              <router-link :to="{ name: item.router_path_name }" class="nav-link">{{ item.name }}</router-link>
            </h3>
            <p style="padding: 5px">{{ item.detail }}</p>
          </div>
        </Card>
      </i-col>  
    </Row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      basicList: [
        {
          name: '集群',
          value: 'server',
          icon: 'ios-apps',
          detail: '拓扑的集群模板',
          router_path_name: 'cmdb_set_temp',
        },
        {
          name: '主机',
          value: 'server',
          icon: 'logo-tux',
          detail: '云厂商服务器资源',
          router_path_name: 'cmdb_asset_server', 
        },
        {
          name: '数据库',
          value: 'mysql',
          icon: 'ios-photos',
          detail: '云厂商RDS/PoalarDB资源',
          router_path_name: 'cmdb_asset_mysql', // 路由名称
        },
        {
          name: 'Redis',
          value: 'Redis',
          icon: 'logo-buffer',
          detail: '云厂商Redis緩存资源',
          router_path_name: 'cmdb_asset_redis', // 路由名称
        },
        {
          name: '负载均衡',
          value: 'lb',
          icon: 'ios-git-network',
          detail: '云厂商负载均衡',
          router_path_name: 'cmdb_asset_lb', // 
        },
        {
          name: 'VPC',
          value: 'vpc',
          icon: 'md-grid',
          detail: '云厂商虚拟局域网',
          router_path_name: 'cmdb_asset_vpc', // 路由名称 
        },
        {
          name: '虚拟子网',
          value: 'vswitch',
          icon: 'ios-options',
          detail: '云厂商虚拟交换机、虚拟子网',
          router_path_name: 'cmdb_asset_vswitch', 
        },
        {
          name: '安全组',
          value: 'sg',
          icon: 'ios-lock',
          detail: '云厂商安全组',
          router_path_name: 'cmdb_security_group', 
        },
      ],
    }
  },
  methods: {
    handlerName(item) {
      const route = {
        name: item.router_path_name,
      }
      this.$router.push(route)
    },
  },
}
</script>
