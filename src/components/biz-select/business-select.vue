<!-- eslint-disable max-len -->
<template>
  <div v-if="showBusiness" class="busines-avatar-dropdown">
    <template v-if="businessList">
      <Select v-model="theBusinessID" filterable label-in-value style="width: 180px" placeholder="请选择业务" @on-change="handlerChange">
        <Option v-for="item in businessList" :key="item.biz_id" :value="item.biz_id" :label="item.biz_cn_name" />
      </Select>
    </template>
  </div>
</template>

<script>
import {
    mapState, mapMutations, mapActions, mapGetters,
} from 'vuex'

export default {
    name: 'BusinessSelect',
    data() {
        return {
            theBusinessID: this.$store.state.project.theBusinessID,
        }
    },
    computed: {
    // ...mapState(["businessList", "showBusiness"]),
        ...mapState({
            showBusiness: (state) => state.project.showBusiness,
            theBusinessStore: (state) => state.project.theBusinessID,
        }),
        ...mapGetters('project', ['businessList']),
    },
    watch: {
        theBusinessStore(val) {
            this.setBusinessID(val)
            this.theBusinessID = val
        },
    },
    created() {
        this.getBizList()
    },
    methods: {
        ...mapMutations('project', ['setBusinessID']),
        ...mapActions('project', [
            'handlerGetBusinessList',
            'handlerSelectBusiness',
        ]),

        async getBizList() {
            await this.handlerGetBusinessList()
        },

        handlerChange(value) {
            if (!value) {
                this.getBizList()
                return
            }
            this.handlerSelectBusiness(value).then((res) => {
                if (res.code !== 0) {
                    this.$Message.error({
                        content: JSON.stringify(res.msg),
                        duration: 5,
                    })
                    this.getBizList()
                } else {
                    this.setBusinessID(value.value)
                    this.$Message.success(res.msg)
                }
            })
        },
    },

}
</script>
<style lang="less" scoped>
.busines {
  &-avatar-dropdown {
    cursor: pointer;
    display: inline-block;
    // height: 64px;
    vertical-align: middle;
    // line-height: 64px;
    .ivu-badge-dot {
      top: 16px;
    }
  }
}
</style>
