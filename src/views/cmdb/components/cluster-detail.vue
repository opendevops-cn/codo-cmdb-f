<template>
    <Modal width="780px;" v-model="modalData.show" :title="modalData.title" :footer-hide=true :styles="{ top: '30px' }">
        <Card dis-hover>
            <div class="inner">
                <Alert show-icon>基本信息</Alert>
                <div style="margin-top:10px; margin-bottom:10px">
                    <Row>
                        <Col span="4">
                        <p> <b>实例ID：</b> </p>
                        </Col>
                        <Col span="20">
                        <p> {{ clusterData.instance_id }}</p>
                        </Col>
                    </Row>

                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>实例名称：</b> </p>
                        </Col>
                        <Col span="20">
                        <p> {{ clusterData.name }}</p>
                        </Col>
                    </Row>

                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>厂商：</b></p>
                        </Col>
                        <Col span="8" v-if="clusterData.cloud_name">
                        <p> {{ clusterData.cloud_name }} </p>
                        </Col>
                        <Col span="4">
                        <p> <b>AccountID：</b></p>
                        </Col>
                        <Col span="8">
                        <p> {{ clusterData.account_id }} </p>
                        </Col>
                    </Row>

                    <!-- <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>地区：</b> </p>
                        </Col>
                        <Col span="8" v-if="natData.region">
                        <p> {{ clusterData.region }}</p>
                        </Col>
                        <Col span="8" v-else>
                        <p>未知</p>
                        </Col>
                        <Col span="4">
                        <p> <b>机房：</b> </p>
                        </Col>
                        <Col span="8">
                        <p> {{ clusterData.zone }} </p>
                        </Col>
                    </Row> -->

                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>网络类型：</b></p>
                        </Col>
                        <Col span="8" v-if="clusterData.network_type">
                        <p> {{ clusterData.network_type }} </p>
                        </Col>
                        <Col span="8" v-else>
                        <p>未知信息</p>
                        </Col>
                        <Col span="4">
                        <p> <b>付费类型：</b></p>
                        </Col>
                        <Col span="8" v-if="clusterData.charge_type">
                        <p> {{ clusterData.charge_type }} </p>
                        </Col>
                        <Col span="8" v-else>
                        <p>未知信息</p>
                        </Col>
                    </Row>

                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>实例状态：</b> </p>
                        </Col>
                        <Col span="8" v-if="clusterData.state == '运行中' || clusterData.state == '可用'">
                        <p>
                            <tag color="success">{{ clusterData.state }}</tag>
                        </p>
                        </Col>
                        <Col span="8" v-else>
                        <p>
                            <tag color="red">{{ clusterData.state }}</tag>
                        </p>
                        </Col>
                        <Col span="4">
                        <p> <b>是否过期：</b> </p>
                        </Col>
                        <Col span="8" v-if="clusterData.is_expired === true">
                        <p>
                            <tag color="red">{{ clusterData.is_expired }}</tag>
                        </p>
                        </Col>
                        <Col span="8" v-else>
                        <p>正常</p>
                        </Col>
                    </Row>

                    <!-- <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>公网IP：</b> </p>
                        </Col>
                        <Col span="8" v-if="clusterData.outer_ip">
                        <p> {{ clusterData.outer_ip.join(', ') }}</p>
                        </Col>
                        <Col span="8" v-else>
                        <p>未知信息</p>
                        </Col>
                        <Col span="4">
                        <p> <b>VPC</b></p>
                        </Col>
                        <Col span="8" v-if="clusterData.vpc_id">
                        <p> {{ clusterData.vpc_id }} </p>
                        </Col>
                        <Col span="8" v-else>
                        <p>未知信息</p>
                        </Col>
                    </Row> -->


                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>实例类型：</b> </p>
                        </Col>
                        <Col span="20">
                        <p> {{ clusterData.cluster_type }} </p>
                        </Col>
                    </Row>

                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>创建时间：</b> </p>
                        </Col>
                        <Col span="20" v-if="clusterData.create_time">
                        <p> {{ clusterData.create_time }} </p>
                        </Col>
                        <Col span="20" v-else>
                        <p>未知信息</p>
                        </Col>
                    </Row>

                    <Row>
                        <Col span="4">
                        <p><b>最后更新时间：</b></p>
                        </Col>
                        <Col span="20">
                        <p> {{ clusterData.update_time }} </p>
                        </Col>
                    </Row>
                </div>
            </div>
        </Card>
    </Modal>
</template>
<script>
export default {
    name: 'clusterDetail',
    props: {
        modalData: {
            type: Object,
            default: () => { },
        },
        clusterData: {
            type: Object,
            default: () => { },
        }
    },
}
</script>
