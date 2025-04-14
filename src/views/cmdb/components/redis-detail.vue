<template>
  <Modal width="780px;" v-model="modalData.show" :title="modalData.title" :footer-hide=true :styles="{top: '30px'}">
    <Card dis-hover>
      <div class="inner">
        <Alert show-icon>基本信息</Alert>
            <div style="margin-top:10px; margin-bottom:10px">
                <Row>
                    <Col span="4" ><p> <b>实例ID：</b> </p></Col>
                    <Col span="20"><p> {{redisData.instance_id}}</p></Col>
                </Row>

                 <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4" ><p> <b>实例名称：</b> </p></Col>
                    <Col span="20"><p> {{redisData.name}}</p></Col>
                </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>厂商：</b></p></Col>
                     <Col span="8" v-if="redisData.cloud_name"><p> {{redisData.cloud_name}} </p></Col>
                     <Col span="4"><p> <b>AccountID：</b></p></Col>
                    <Col span="8"><p> {{redisData.account_id}} </p></Col>
                </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>地区：</b> </p></Col>
                    <Col span="8" v-if="redisData.region"><p> {{redisData.region}}</p></Col>
                    <Col span="8"  v-else><p>未知</p></Col>
                    <Col span="4"><p> <b>机房：</b> </p></Col>
                    <Col span="8"><p> {{redisData.zone}} </p></Col>
                </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>网络类型：</b></p></Col>
                    <Col span="8" v-if="redisData.network_type"><p> {{redisData.network_type}} </p></Col>
                    <Col span="8"  v-else><p>未知信息</p></Col>
                    <Col span="4"><p> <b>付费类型：</b></p></Col>
                    <Col span="8" v-if="redisData.charge_type"><p> {{redisData.charge_type}} </p></Col>
                    <Col span="8"  v-else><p>未知信息</p></Col>
                </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>实例状态：</b> </p></Col>
                    <Col span="8" v-if="redisData.state == '运行中'"><p> <tag color="success">{{redisData.state}}</tag> </p></Col>
                    <Col span="8" v-else><p> <tag color="red">{{redisData.state}}</tag> </p></Col>
                    <Col span="4"><p> <b>是否过期：</b>  </p></Col>
                    <Col span="8"  v-if="redisData.is_expired === true"><p> <tag color="red">{{redisData.is_expired}}</tag></p></Col>
                    <Col span="8"  v-else ><p>正常</p></Col>
                </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>引擎：</b>  </p></Col>
                    <Col span="8"  v-if="redisData.instance_type"><p> {{redisData.instance_type}}</p></Col>
                    <Col span="8"  v-else ><p>未知信息</p></Col>
                    <Col span="4"><p> <b>版本：</b></p></Col>
                    <Col span="8" v-if="redisData.instance_version"><p> {{redisData.instance_version}} </p></Col>
                    <Col span="8" v-else><p>未知信息</p></Col>
                </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>架构：</b>  </p></Col>
                    <Col span="8"  v-if="redisData.instance_arch"><p> {{redisData.instance_arch}}</p></Col>
                    <Col span="8"  v-else ><p>未知信息</p></Col>
                    <Col span="4"><p> <b>QPS：</b></p></Col>
                    <Col span="8" v-if="redisData.ext_info"><p> {{redisData.ext_info.qps}} </p></Col>
                    <Col span="8" v-else><p>未知信息</p></Col>
                </Row>


                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>实例类型：</b> </p></Col>
                    <Col span="20"><p> {{redisData.instance_class}} </p></Col>
                </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                    <Col span="4"><p> <b>创建时间：</b>  </p></Col>
                    <Col span="20" v-if="redisData.create_time"><p> {{redisData.create_time}} </p></Col>
                    <Col span="20" v-else><p>未知信息</p></Col>
                </Row>

                <Row>
                    <Col span="4"><p><b>最后更新时间：</b></p></Col>
                    <Col span="20"><p> {{redisData.update_time}} </p></Col>
                </Row>
            </div>
      </div>
    </Card>
  </Modal>
</template>
<script>
export default {
  name: 'mysqlDetail',
  props: {
    modalData: {
        type :Object,
        default: () =>{},
    },
    redisData: {
        type :Object,
        default: () =>{},
    }
  },
}
</script>
