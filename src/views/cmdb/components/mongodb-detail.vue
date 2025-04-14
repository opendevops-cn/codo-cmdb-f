<!-- eslint-disable vue/no-mutating-props -->
<template>
  <Modal v-model="modalData.show" width="780px;" :title="modalData.title" :footer-hide="true" :styles="{top: '30px'}">
    <Card dis-hover>
      <div class="inner">
        <Alert show-icon>基本信息</Alert>
        <div style="margin-top:10px; margin-bottom:10px">
          <Row>
            <Col span="4"><p> <b>实例ID：</b> </p></Col>
            <Col span="20"><p> {{ mysqlData.instance_id }}</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>主机名：</b> </p></Col>
            <Col span="20"><p> {{ mysqlData.name }}</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>厂商：</b></p></Col>
            <Col v-if="mysqlData.cloud_name" span="8"><p> {{ mysqlData.cloud_name }} </p></Col>
            <Col span="4"><p> <b>AccountID：</b></p></Col>
            <Col span="8"><p> {{ mysqlData.account_id }} </p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>地区：</b> </p></Col>
            <Col v-if="mysqlData.region" span="8"><p> {{ mysqlData.region }}</p></Col>
            <Col v-else span="8"><p>未知</p></Col>
            <Col span="4"><p> <b>机房：</b> </p></Col>
            <Col span="8"><p> {{ mysqlData.zone }} </p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>网络类型：</b></p></Col>
            <Col v-if="mysqlData.network_type " span="8"><p> {{ mysqlData.network_type }} </p></Col>
            <Col v-else span="8"><p>未知信息</p></Col>
            <Col span="4"><p> <b>付费类型：</b></p></Col>
            <Col v-if="mysqlData.charge_type " span="8"><p> {{ mysqlData.charge_type }} </p></Col>
            <Col v-else span="8"><p>未知信息</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>实例状态：</b> </p></Col>
            <Col v-if="mysqlData.state == '运行中'" span="8"><p> <tag color="success">{{ mysqlData.state }}</tag> </p></Col>
            <Col v-else span="8"><p> <tag color="red">{{ mysqlData.state }}</tag> </p></Col>
            <Col span="4"><p> <b>实例类型：</b> </p></Col>
            <Col span="8"><p> {{ mysqlData.db_class }} </p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>引擎：</b>  </p></Col>
            <Col v-if="mysqlData.db_engine" span="8"><p> {{ mysqlData.db_engine }}</p></Col>
            <Col v-else span="8"><p>未知信息</p></Col>
            <Col span="4"><p> <b>版本：</b></p></Col>
            <Col v-if="mysqlData.db_version" span="8"><p> {{ mysqlData.db_version }} </p></Col>
            <Col v-else span="8"><p>未知信息</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>是否过期：</b>  </p></Col>
            <Col v-if="mysqlData.is_expired === true" span="8"><p> <tag color="red">{{ mysqlData.is_expired }}</tag></p></Col>
            <Col v-else span="8"><p>正常</p></Col>
            <Col span="4"><p> <b>：</b></p></Col>
            <Col v-if="mysqlData.detail" span="8"><p> {{ mysqlData.detail }} </p></Col>
            <Col v-else span="8"><p>无</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>创建时间：</b>  </p></Col>
            <Col v-if="mysqlData.create_time" span="20"><p> {{ mysqlData.create_time }} </p></Col>
            <Col v-else span="20"><p>未知信息</p></Col>
          </Row>

          <Row>
            <Col span="4"><p><b>最后更新时间：</b></p></Col>
            <Col span="20"><p> {{ mysqlData.update_time }} </p></Col>
          </Row>
        </div>
      </div>
    </Card>
  </Modal>
</template>
<script>
export default {
  name: 'MongoDBDetail',
  props: {
    modalData: {
      type: Object,
      default: () => {},
    },
    mysqlData: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
