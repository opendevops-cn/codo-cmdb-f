<!-- eslint-disable vue/no-mutating-props -->
<template>
  <Modal v-model="modalData.show" width="720px" :title="modalData.title" :footer-hide="true" :styles="{top: '35px'}">
    <Card dis-hover>
      <div class="inner">
        <Alert show-icon>基本信息</Alert>
        <div style="margin-top:10px; margin-bottom:10px">
          <Row>
            <Col span="4"><p> <b>实例ID：</b> </p></Col>
            <Col span="20"><p> {{ switchData.instance_id }}</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>交换机名：</b> </p></Col>
            <Col span="8"><p> {{ switchData.name }}</p></Col>
            <Col span="4"><p> <b>云区域ID：</b> </p></Col>
            <Col span="8"><p> {{ switchData.cloud_region_id }}</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>厂商：</b></p></Col>
            <Col v-if="switchData.cloud_name" span="8"><p> {{ switchData.cloud_name }} </p></Col>
            <Col span="4"><p> <b>AccountID：</b></p></Col>
            <Col span="8"><p> {{ switchData.account_id }} </p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>地区：</b> </p></Col>
            <Col v-if="switchData.region" span="8"><p> {{ switchData.region }}</p></Col>
            <Col v-else span="8"><p>未知</p></Col>
            <Col span="4"><p> <b>机房：</b> </p></Col>
            <Col span="8"><p> {{ switchData.zone }} </p></Col>
          </Row>


          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>网段V4：</b>  </p></Col>
            <Col v-if="switchData.cidr_block_v4" span="8"><p> {{ switchData.cidr_block_v4 }}</p></Col>
            <Col v-else span="8"><p>未知信息</p></Col>
            <Col span="4"><p> <b>网段V6：</b></p></Col>
            <Col v-if="switchData.cidr_block_v6" span="8"><p> {{ switchData.cidr_block_v6 }} </p></Col>
            <Col v-else span="8"><p>未知信息</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>VPC：</b>  </p></Col>
            <Col v-if="switchData.vpc_id" span="8"><p> {{ switchData.vpc_id }}</p></Col>
            <Col v-else span="8"><p>未知信息</p></Col>
            <Col span="4"><p> <b>VPC名称：</b></p></Col>
            <Col v-if="switchData.vpc_name" span="8"><p> {{ switchData.vpc_name }} </p></Col>
            <Col v-else span="8"><p>未知信息</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>可用IP：</b>  </p></Col>
            <Col v-if="switchData.address_count" span="8"><p> <tag color="gold">{{ switchData.address_count }}</tag></p></Col>
            <Col v-else span="8"><p>未知信息</p></Col>
            <Col span="4"><p> <b>备注信息：</b></p></Col>
            <Col v-if="switchData.detail" span="8"><p> {{ switchData.detail }} </p></Col>
            <Col v-else span="8"><p>无</p></Col>
          </Row>

          <Row style="margin-top:10px; margin-bottom:10px">
            <Col span="4"><p> <b>创建时间：</b>  </p></Col>
            <Col v-if="switchData.create_time" span="20"><p> {{ switchData.create_time }} </p></Col>
            <Col v-else span="20"><p>未知信息</p></Col>
          </Row>

          <Row>
            <Col span="4"><p><b>最后更新时间：</b></p></Col>
            <Col span="20"><p> {{ switchData.update_time }} </p></Col>
          </Row>
        </div>
      </div>
    </Card>
  </Modal>
</template>
<script>
export default {
  name: 'VswitchDetail',
  props: {
    modalData: {
      type: Object,
      default: () => {},
    },
    switchData: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
