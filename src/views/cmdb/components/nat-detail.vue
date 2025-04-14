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
                        <p> {{ natData.instance_id }}</p>
                        </Col>
                    </Row>

                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>实例名称：</b> </p>
                        </Col>
                        <Col span="20">
                        <p> {{ natData.name }}</p>
                        </Col>
                    </Row>

                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>厂商：</b></p>
                        </Col>
                        <Col span="8" v-if="natData.cloud_name">
                        <p> {{ natData.cloud_name }} </p>
                        </Col>
                        <Col span="4">
                        <p> <b>AccountID：</b></p>
                        </Col>
                        <Col span="8">
                        <p> {{ natData.account_id }} </p>
                        </Col>
                    </Row>

                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>地区：</b> </p>
                        </Col>
                        <Col span="8" v-if="natData.region">
                        <p> {{ natData.region }}</p>
                        </Col>
                        <Col span="8" v-else>
                        <p>未知</p>
                        </Col>
                        <Col span="4">
                        <p> <b>机房：</b> </p>
                        </Col>
                        <Col span="8">
                        <p> {{ natData.zone }} </p>
                        </Col>
                    </Row>

                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>网络类型：</b></p>
                        </Col>
                        <Col span="8" v-if="natData.network_type">
                        <p> {{ natData.network_type }} </p>
                        </Col>
                        <Col span="8" v-else>
                        <p>未知信息</p>
                        </Col>
                        <Col span="4">
                        <p> <b>付费类型：</b></p>
                        </Col>
                        <Col span="8" v-if="natData.charge_type">
                        <p> {{ natData.charge_type }} </p>
                        </Col>
                        <Col span="8" v-else>
                        <p>未知信息</p>
                        </Col>
                    </Row>

                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>实例状态：</b> </p>
                        </Col>
                        <Col span="8" v-if="natData.state == '运行中' || natData.state == '可用'">
                        <p>
                            <tag color="success">{{ natData.state }}</tag>
                        </p>
                        </Col>
                        <Col span="8" v-else>
                        <p>
                            <tag color="red">{{ natData.state }}</tag>
                        </p>
                        </Col>
                        <Col span="4">
                        <p> <b>是否过期：</b> </p>
                        </Col>
                        <Col span="8" v-if="natData.is_expired === true">
                        <p>
                            <tag color="red">{{ natData.is_expired }}</tag>
                        </p>
                        </Col>
                        <Col span="8" v-else>
                        <p>正常</p>
                        </Col>
                    </Row>

                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>公网IP：</b> </p>
                        </Col>
                        <Col span="8" v-if="natData.outer_ip">
                        <p> {{ natData.outer_ip.join(', ') }}</p>
                        </Col>
                        <Col span="8" v-else>
                        <p>未知信息</p>
                        </Col>
                        <Col span="4">
                        <p> <b>VPC</b></p>
                        </Col>
                        <Col span="8" v-if="natData.vpc_id">
                        <p> {{ natData.vpc_id }} </p>
                        </Col>
                        <Col span="8" v-else>
                        <p>未知信息</p>
                        </Col>
                    </Row>


                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>实例类型：</b> </p>
                        </Col>
                        <Col span="20">
                        <p> {{ natData.spec }} </p>
                        </Col>
                    </Row>

                    <Row style="margin-top:10px; margin-bottom:10px">
                        <Col span="4">
                        <p> <b>创建时间：</b> </p>
                        </Col>
                        <Col span="20" v-if="natData.create_time">
                        <p> {{ natData.create_time }} </p>
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
                        <p> {{ natData.update_time }} </p>
                        </Col>
                    </Row>
                </div>
            </div>
        </Card>
    </Modal>
</template>
<script>
export default {
    name: 'natDetail',
    props: {
        modalData: {
            type: Object,
            default: () => { },
        },
        natData: {
            type: Object,
            default: () => { },
        }
    },
}
</script>
