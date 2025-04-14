<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div>
    <Modal v-model="dialog.show" title="选择主机" width="950" :mask-closable="false" :footer-hide="true">
      <alert>一共查询到:{{ totalCount }}条数据</alert>
      <Input v-model="searchVal" style="width: 330px; margin: 0px" clearable placeholder="输入实例ID、主机名、内网IP搜索"
        @keydown.enter.native="handleFilter" @on-change="handleFilter" search />

      <div style="margin-top: 5px">
        <Table highlight-row stripe size="small" :columns="columnsData" :data="tableData" ref="table"/>
      </div>

      <div style="margin: 10px; overflow: hidden">
        <Page :total="totalCount" :current="pageNum" :page-size="pageSize" show-total @on-change="handlerChangePage" />
      </div>
    </Modal>
  </div>
</template>
<script>
import { optServerMainAgent } from '@/api/cloud/server.js'
import { on } from 'codemirror';
import { color } from 'echarts/lib/export';
export default {
  name: "BindHost",
  props: {
    dialog: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      serverList: [], // 初始总数
      serverFilteredList: [],
      boundServerIds: [], 
      tableData: [],
      searchVal: "",
      agentInstanceId: 0,
      pageTotal: 0,
      pageSize: 10,
      pageNum: 1,
      columnsData: [
        {
          title: "实例名称",
          key: "name",
          align: "center",
          minWidth: 100,
          sortable: true,
        },
        {
          title: "内网IP",
          key: "inner_ip",
          align: "center",
          width: 140,

          sortable: true,
        },
        {
          title: "可用区",
          key: "region",
          align: "center",
          width: 140,
          sortable: true,
        },
        {
          title: "厂商",
          key: "cloud_name",
          align: "center",
          width: 140,
          sortable: true,
        },
        {
          title: "是否有主agent",
          key: "has_main_agent",
          align: "center",
          width: 140,
          sortable: true,
          render: (h, params) => {
            const status = params.row.has_main_agent;
            if (status === true) {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: '#19be6b' },
                  },
                  '是',
                ),
              ])
            } else {
              return h('div', [
                h(
                  'Tag',
                  {
                    props: { color: '#ed3f14' },
                  },
                  '否',
                ),
              ])
            }
          },
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            // 检查当前行是否已绑定
            const isBound = params.row.is_bound_to_this_agent ||
              (params.row.agent_id &&
                this.boundServerIds.includes(params.row.id));

            return h('div', [
              isBound ?
                // 已绑定 - 显示禁用的"已绑定"按钮
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'small',
                    // disabled: true
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.setMainAgent(params.row);
                    }
                  }
                }, '已绑定')
                :
                // 未绑定 - 显示"绑定"按钮
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.setMainAgent(params.row);
                    }
                  }
                }, '绑定')
            ]);
          }
        }
      ],
    }
  },
  computed: {
    totalCount() {
      return this.serverFilteredList.length
    },
  },
  watch: {
    "dialog.show": function (newVal) {
      if (newVal) {
        this.initData()
        this.setCurrentPageData()
      }
    },
  },
  methods: {
    handleConfirm() {
      if (this.currentRow) {
        this.$emit('on-select', this.currentRow);
        this.dialog.show = false;
      }
    },
    /**
 * 处理服务器数据，标记绑定状态并排序
 * @param {Array} servers 服务器数据列表
 * @param {string} agentId 当前Agent ID
 * @returns {Object} 包含处理后的数据和绑定ID列表
 */
    processServerData(servers, agentId) {
      if (!servers || !Array.isArray(servers)) {
        return {
          sortedServers: [],
          boundServerIds: []
        };
      }

      // 获取绑定主机的ID列表
      const boundServers = servers.filter(server => server.agent_id === agentId);
      const boundServerIds = boundServers.map(server => server.id);

      // 对所有主机标记绑定状态
      const allServersWithBindFlag = servers.map(server => ({
        ...server,
        // 标记是否已绑定到当前Agent
        is_bound_to_this_agent: server.agent_id === agentId,
      }));

      // 排序：已绑定的主机放在前面
      const sortedServers = allServersWithBindFlag.sort((a, b) => {
        // 已绑定的排在前面
        if (a.is_bound_to_this_agent && !b.is_bound_to_this_agent) return -1;
        if (!a.is_bound_to_this_agent && b.is_bound_to_this_agent) return 1;
        // 如果绑定状态相同，按ID排序
        return a.id - b.id;
      });

      return {
        sortedServers,
        boundServerIds
      };
    },

    /**
     * 加载并处理服务器数据
     * @param {Array} servers 服务器数据列表
     * @param {string} agentId 当前Agent ID
     */
    loadServerData(servers, agentId, agent_instance_id) {
      if (!servers || !agentId) {
        this.$Message.error('无效的数据参数');
        return;
      }

      // 处理服务器数据
      const { sortedServers, boundServerIds } = this.processServerData(servers, agentId);

      // 更新组件数据
      this.serverList = sortedServers;
      this.boundServerIds = boundServerIds;
      this.agentInstanceId = agent_instance_id;

      // 重新过滤和分页
      this.initData();
      this.setCurrentPageData();
    },                                                                                                                    
    /**
     * 显示确认对话框
     * @param {Object} row 行数据
     * @returns {Promise<void>}
     */
    showConfirmDialog(row) {
      let setMainAgent = false;
      return new Promise((resolve, reject) => {
        this.$Modal.confirm({
          title: '确认修改',
          render: (h) => {
            return h('div', [
              // 主要提示内容
              h('p', '当前该主机已绑定主agent，请确认是否将本agent设为主agent？'),

              // 添加复选框
              h('div', {
                style: {
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center'
                }
              }, [
                h('Checkbox', {
                  props: {
                    value: setMainAgent
                  },
                  on: {
                    'on-change': (value) => {
                      setMainAgent = value;
                    }
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', '设为主agent')
              ])
            ]);
          },
          onOk: async () => {
            try {
              row.set_main_agent = setMainAgent;
              await this.updateMainAgent(row, setMainAgent);
              resolve({ success: true, setMainAgent: setMainAgent });
            } catch (error) {
              reject(error);
            }
          },
          onCancel: () => {
            resolve();
          }
        });
      });
    },
    /**
 * 显示设置主 Agent 确认对话框
 * @param {Object} row 行数据
 * @returns {Promise<void>}
 */
    showSetMainConfirm(row) {
      return new Promise((resolve, reject) => {
        // 默认不设为主 agent
        let setAsMain = false;

        this.$Modal.confirm({
          title: '确认修改',
          // 使用 render 函数自定义内容
          render: (h) => {
            return h('div', [
              // 主要提示内容
              h('p', '请确认是否将本agent绑定到该主机，并设置为主agent？'),

              // 添加复选框
              h('div', {
                style: {
                  marginTop: '16px',
                  display: 'flex',
                  alignItems: 'center'
                }
              }, [
                h('Checkbox', {
                  props: {
                    value: setAsMain
                  },
                  on: {
                    'on-change': (value) => {
                      setAsMain = value;
                    }
                  },
                  style: {
                    marginRight: '8px'
                  }
                }),
                h('span', '设为主agent')
              ])
            ]);
          },
          onOk: async () => {
            try {
              // 传递勾选状态
              await this.updateMainAgent(row, setAsMain);
              resolve({ success: true, setAsMain });
            } catch (error) {
              reject(error);
            }
          },
          onCancel: () => {
            resolve({ success: false, setAsMain: false });
          }
        });
      });
    },
    /**
     * 更新主 Agent
     * @param {Object} row 行数据
     * @returns {Promise<void>}
     */
    async updateMainAgent(row, setAsMain) {
      try {
        const data = {
          server_id: row.id,
          agent_instance_id: this.agentInstanceId,
          main_agent: setAsMain
        };

        const res = await optServerMainAgent(data, 'post');

        if (res.code === 0) {
          this.$Message.success('设置成功');
          this.dialog.show = false;
          // 触发刷新
          this.$emit("refresh")
          this.$emit('bind-complete'); 
        } else {
          throw new Error(res.msg || '操作失败');
        }
      } catch (error) {
        throw error;
      }
    },
    /**
     * 设置主 Agent
     * @param {Object} row 行数据
     * @returns {Promise<void>}
     */
    async setMainAgent(row) {
      try {
        if (row.has_main_agent && row.bind_agnet_status !== 0) {
          // 如果已有主 agent，则弹出确认气泡
          await this.showConfirmDialog(row);
        } else {
          // 如果没有主 agent，直接设为主 agent
          await this.showSetMainConfirm(row);
        }
      } catch (error) {
        this.$Message.error(`设置主Agent失败: ${error.message}`);
      }
    },
    handlerChangePage(value) {
      this.pageNum = value
      this.setCurrentPageData()
    },
    // 分页处理
    setCurrentPageData() {
      const begin = (this.pageNum - 1) * this.pageSize
      const end = this.pageNum * this.pageSize
      this.tableData = this.serverFilteredList.slice(begin, end)
    },
    checkRegion(item) {
      return item.region.indexOf(this.region) >= 0
    },
    checkExecList(item) {
      return (item.name.indexOf(this.searchVal) >= 0) || (item.cloud_name.indexOf(this.searchVal) >= 0 || (item.inner_ip && item.inner_ip.indexOf(this.searchVal) >= 0) || (item.region && item.region.indexOf(this.searchVal) >= 0))
    },
    // 前端搜索和筛选
    handleFilter() {
      this.pageNum = 1
      if (this.searchVal) {
        this.searchVal = this.searchVal.trim()
        this.serverFilteredList = this.serverList.filter(this.checkExecList)
      } else {
        this.serverFilteredList = this.serverList
      }

      this.setCurrentPageData()
    },
    initData() {
      this.serverFilteredList = this.serverList
      this.pageNum = 1
      this.pageSize = 10
      this.searchVal = ""
    },
  },
}
</script>