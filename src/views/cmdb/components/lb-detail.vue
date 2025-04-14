<!-- eslint-disable vue/no-mutating-props -->
<template>
  <Modal v-model="modalData.show" width="780px;" :title="modalData.title" :footer-hide="true" :styles="{top: '30px'}">
    <Card dis-hover>
      <div class="inner">
        <Alert show-icon>基本信息</Alert>
        <div style="margin-top:10px; margin-bottom:10px">
          <Row>
            <Col span="4"><p> <b>实例ID：</b> </p></Col>
            <Col span="20"><p> {{ formData.instance_id }}</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>实例名称：</b> </p></Col>
            <Col span="20"><p> {{ formData.name }}</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>厂商：</b></p></Col>
            <Col v-if="formData.cloud_name" span="8"><p> {{ formData.cloud_name }} </p></Col>
            <Col span="4"><p> <b>AccountID：</b></p></Col>
            <Col span="8"><p> {{ formData.account_id }} </p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>地区：</b> </p></Col>
            <Col v-if="formData.region" span="8"><p> {{ formData.region }}</p></Col>
            <Col v-else span="8"><p>未知</p></Col>
            <Col span="4"><p> <b>机房：</b> </p></Col>
            <Col span="8"><p> {{ formData.zone }} </p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>网络类型：</b></p></Col>
            <Col v-if="formData.endpoint_type" span="8"><p> {{ formData.endpoint_type }} </p></Col>
            <Col v-else span="8"><p>未知信息</p></Col>
            <Col span="4"><p> <b>付费类型：</b></p></Col>
            <Col v-if="formData.ext_info && formData.ext_info.charge_type" span="8"><p> {{ formData.ext_info.charge_type }} </p></Col>
            <Col v-else span="8"><p>未知信息</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>实例状态：</b> </p></Col>
            <Col v-if="formData.state == '运行中'" span="8"><p> <tag color="success">{{ formData.state }}</tag> </p></Col>
            <Col v-else span="8"><p> <tag color="red">{{ formData.state }}</tag> </p></Col>
            <Col span="4"><p> <b>实例地址：</b> </p></Col>
            <Col span="8"  v-if="formData.dns_name"><p> {{ formData.dns_name }} </p></Col>
            <Col span="8"  v-else><p> {{ formData.lb_vip }} </p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>是否过期：</b>  </p></Col>
            <Col v-if="formData.is_expired === true" span="8"><p> <tag color="red">{{ formData.is_expired }}</tag></p></Col>
            <Col v-else span="8"><p>正常</p></Col>
            <Col span="4"><p> <b>备注信息：</b></p></Col>
            <Col v-if="formData.detail" span="8"><p> {{ formData.detail }} </p></Col>
            <Col v-else span="8"><p>无</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>创建时间：</b>  </p></Col>
            <Col v-if="formData.create_time" span="20"><p> {{ formData.create_time }} </p></Col>
            <Col v-else span="20"><p>未知信息</p></Col>
          </Row>

          <Row>
            <Col span="4"><p><b>更新时间：</b></p></Col>
            <Col span="20"><p> {{ formData.update_time }} </p></Col>
          </Row>
          <Row>
            <Col span="4"><p><b>ext_info：</b></p></Col>
            <Col span="20"><p> {{ formData.ext_info }} </p></Col>
          </Row>
        </div>
      </div>
    </Card>
  </Modal>
</template>
<script>
export default {
  name: 'LbDetail',
  props: {
    modalData: {
      type: Object,
      default: () => {},
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
