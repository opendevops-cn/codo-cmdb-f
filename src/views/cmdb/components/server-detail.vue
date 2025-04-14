<template>
  <Modal width="780px;" v-model="modalData.show" :title="modalData.title" :footer-hide=true :styles="{top: '30px'}">
    <Card dis-hover>
      <div class="inner">
        <Alert show-icon>基本信息</Alert>
          <div style="margin-top:10px; margin-bottom:10px">
            <Row>
                <Col span="4" >
                  <p> <b>实例ID：</b> </p>
                </Col>
                <Col span="20">
                  <p> {{serverData.instance_id}}</p>
                </Col>
            </Row>

                <Row style="margin-top:10px; margin-bottom:10px">
                <Col span="4" ><p> <b>主机名：</b> </p></Col>
                <Col span="20"><p> {{serverData.name}}</p></Col>
            </Row>

            <Row style="margin-top:10px; margin-bottom:10px">
                <Col span="4"><p> <b>厂商：</b></p></Col>
                    <Col span="8" v-if="serverData.cloud_name"><p> {{serverData.cloud_name}} </p></Col>
                    <Col span="4"><p> <b>可用区：</b></p></Col>
                <Col span="8"><p> {{serverData.zone}} </p></Col>
            </Row>

            <Row style="margin-top:10px; margin-bottom:10px">
                <Col span="4"><p> <b>网络类型：</b></p></Col>
                <Col span="8" v-if="serverData.network_type"><p> {{serverData.network_type}} </p></Col>
                <Col span="8"  v-else><p>未知信息</p></Col>
                <Col span="4"><p> <b>付费类型：</b></p></Col>
                <Col span="8" v-if="serverData.charge_type"><p> {{serverData.charge_type}} </p></Col>
                <Col span="8"  v-else><p>未知信息</p></Col>
            </Row>

            <Row style="margin-top:10px; margin-bottom:10px">
                <Col span="4"><p> <b>实例状态：</b> </p></Col>
                <Col span="8" v-if="serverData.state == '运行中'"><p> <tag color="success">{{serverData.state}}</tag> </p></Col>
                <Col span="8" v-else><p> <tag color="red">{{serverData.state}}</tag> </p></Col>
                <Col span="4"><p> <b>实例类型：</b> </p></Col>
                <Col span="8"><p> {{serverData.instance_type}} </p></Col>
            </Row>

            <Row style="margin-top:10px; margin-bottom:10px">
                <Col span="4"><p> <b>公网IP：</b> </p></Col>
                <Col span="8" v-if="serverData.outer_ip"><p> {{serverData.outer_ip}}</p></Col>
                <Col span="8"  v-else><p>没有公网IP</p></Col>
                <Col span="4"><p> <b>私网IP：</b> </p></Col>
                <Col span="8"><p> {{serverData.inner_ip}} </p></Col>
            </Row>

            <Row style="margin-top:10px; margin-bottom:10px">
                <Col span="4"><p> <b>CPU核心：</b>  </p></Col>
                <Col span="8" v-if="serverData.cpu"><p> {{serverData.cpu}} </p></Col>
                <Col span="8"  v-else><p>未知信息</p></Col>
                <Col span="4"><p> <b>内存：</b>  </p></Col>
                <Col span="8" v-if="serverData.memory"><p> {{serverData.memory}} </p></Col>
                <Col span="8"  v-else><p>未知信息</p></Col>
            </Row>

            <Row style="margin-top:10px; margin-bottom:10px">
                <Col span="4"><p> <b>系统磁盘：</b>  </p></Col>
                <Col span="8" v-if="serverData.system_disk"><p> {{serverData.system_disk}} </p></Col>
                <Col span="8"  v-else><p>未知信息</p></Col>

                <Col span="4"><p> <b>数据磁盘：</b>  </p></Col>
                <Col span="8"  v-if="serverData.data_disk"><p> {{serverData.data_disk}}</p></Col>
                <Col span="8"  v-else><p>未知信息</p></Col>
            </Row>
            
            <Row style="margin-top:10px; margin-bottom:10px">
                <Col span="4"><p> <b>安全组：</b> </p></Col>
                <Col span="20" v-if="serverData.security_group_ids">
                  <span v-for="sg_id in serverData.security_group_ids" style="margin-right: 6px;"> {{sg_id}} </span>
                </Col>
                <Col span="20"  v-else><p>没有安全组</p></Col>
            </Row>

            <Row style="margin-top:10px; margin-bottom:10px">
                <Col span="4"><p> <b>系统名称：</b>  </p></Col>
                <Col span="8"  v-if="serverData.os_name"><p> {{serverData.os_name}}</p></Col>
                <Col span="8"  v-else ><p>未知信息</p></Col>
                <Col span="4"><p> <b>CloudWatch：</b></p></Col>
                <Col span="8" v-if="serverData.cloudwatch_state"><p> {{serverData.cloudwatch_state}} </p></Col>
                <Col span="8" v-else><p>未知信息</p></Col>
            </Row>

            <Row style="margin-top:10px; margin-bottom:10px">
                <Col span="4"><p> <b>是否过期：</b>  </p></Col>
                <Col span="8"  v-if="serverData.is_expired === true"><p> <tag color="red">{{serverData.is_expired}}</tag></p></Col>
                <Col span="8"  v-else ><p>正常</p></Col>
                <Col span="4"><p> <b>备注信息：</b></p></Col>
                <Col span="8" v-if="serverData.detail"><p> {{serverData.detail}} </p></Col>
                <Col span="8"  v-else><p>无</p></Col>
            </Row>

            <Row style="margin-top:10px; margin-bottom:10px">
                <Col span="4"><p> <b>创建时间：</b>  </p></Col>
                <Col span="8" v-if="serverData.instance_create_time"><p> {{serverData.instance_create_time}} </p></Col>
                <Col span="8"  v-else><p>未知信息</p></Col>

                <Col span="4"><p> <b>过期时间：</b>  </p></Col>
                <Col span="8"  v-if="serverData.instance_expired_time"><p> {{serverData.instance_expired_time}}</p></Col>
                <Col span="8"  v-else><p>未知信息</p></Col>
            </Row>

            <Row>
                <Col span="4"><p><b>最后更新时间：</b></p></Col>
                <Col span="20"><p> {{serverData.update_time}} </p></Col>
            </Row>
        </div>
      </div>
    </Card>
  </Modal>
</template>
<script>
export default {
  name: 'serverDetail',
  props: {
    modalData: {
        type :Object,
        default: () =>{},
    },
    serverData: {
        type :Object,
        default: () =>{},
    }
  }
}
</script>
