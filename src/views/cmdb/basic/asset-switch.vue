<template>
  <div>
    <div class="search-con search-con-top">
      <Input class="search-input" v-model="initPara.searchVal" search :maxlength='50' @on-search="handleSearch"
        placeholder="输入关键字搜索" />
      <h4 v-if="id" class="search-col">实例：{{id}}</h4>
      <Button 
        type="primary" 
        class="search-add-btn" 
        @click="handleImport"
      >
        批量导入
      </Button>
      <Button v-if="!id" type="error" class="search-add-btn" @click="handleDel"
        :disabled="selectList.length !== 0 ? false : true">批量删除</Button>
    </div>

    <Table ref="selection" size="small" :columns="tableColumns" :data="tableData" :loading="i.tableLoading"
      @on-sort-change="handleSort" @on-selection-change="handleSelect"></Table>

    <!-- 分页 -->
    <div style="margin: 10px; overflow: hidden">
      <div style="float: left;">
        <Page :total="i.pageTotal" :current="initPara.page_number" :page-size="initPara.page_size" show-total show-sizer
          :page-size-opts="[15, 50, 100, 1000]" @on-change="handlerChangePage" @on-page-size-change="handlePageSize" />
      </div>
    </div>

    <!-- <div v-if="natData">
      <NatDetail :modal-data="modalData" :nat-data="natData" />
    </div> -->

    <!-- 导入弹窗 -->
    <Modal
      v-model="importModal.show"
      :title="importModal.title"
      :mask-closable="false"
    >
      <div class="import-container">
        <Upload
          ref="upload"
          :show-upload-list="false"
          :before-upload="handleBeforeUpload"
          action="#"
          :auto-upload="false"
        >
        <!-- <div class="button-group"> -->
          <Button icon="ios-cloud-upload-outline" type="primary">选择文件</Button>
          <Button type="text" @click="downloadTemplate" class="download-btn">
          <Icon type="ios-download-outline" />下载模板</Button>
        <!-- </div> -->
        </Upload>

        <!-- 数据预览表格 -->
        <div v-if="previewData.length" class="preview-wrapper mt-16">
          <div class="preview-header">
            <span>数据预览（共 {{ previewData.length }} 条）</span>
          </div>
          <Table 
            :columns="previewColumns" 
            :data="previewData"
            :height="300"
            size="small"
          ></Table>
        </div>
      </div>
      <div slot="footer">
        <Button @click="importModal.show = false">取消</Button>
        <Button 
          type="primary" 
          :loading="importing"
          @click="handleImportSubmit"
          :disabled="previewData.length === 0"
        >
          确认导入
        </Button>
      </div>
    </Modal>

    <!-- 导入结果弹窗 -->
    <Modal
      v-model="resultModal.show"
      title="导入结果"
      :mask-closable="false"
    >
      <div class="result-content">
        <div class="result-item">
          <span>成功数量：</span>
          <span class="success-text">{{ importResult.success_count }}</span>
        </div>
        <div class="result-item">
          <span>失败数量：</span>
          <span class="error-text">{{ importResult.failed_count }}</span>
        </div>
        <div v-if="importResult.errors.length" class="error-list">
          <div class="error-title">错误详情：</div>
          <div class="error-scroll">
            <Alert 
              v-for="(error, index) in importResult.errors" 
              :key="index"
              type="error"
              show-icon
            >
              {{ error }}
            </Alert>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="handleResultClose">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { importSwitch, getSwitch, optSwitch } from '@/api/cloud/switch.js'
import * as XLSX from 'xlsx'
export default {
  name: 'Switch',
    props: {
    id: {
      type: String,
      default: null
    },
  },
  data () {
    return {
      natData: {},
      tableColumns: [
        {
          type: "selection",
          key: "selection",
          width: 60,
          align: "center",
        },
        {
          title: '设备',
          key: 'name',
          align: "center",
          tooltip: true,
          sortable: true,
          minWidth: 150
        },
        {
          title: '管理IP',
          key: 'manage_ip',
          ellipsis: true,
          tooltip: true,
          minWidth: 150,
        },
        {
          title: '序列号',
          key: 'sn',
          minWidth: 150
        },
        {
          title: 'MAC地址',
          key: 'mac_address',
          minWidth: 100
        },
        {
          title: '厂商',
          key: 'vendor',
          align: "center",
          minWidth: 150
        },
        {
          title: '型号',
          key: 'model',
          align: "center",
          minWidth: 150,
        },
        {
          title: '机房',
          key: 'idc',
          minWidth: 90
        },
        {
          title: '机柜',
          key: 'rack',
          minWidth: 90
        },
        {
          title: 'U位',
          key: 'position',
          minWidth: 90
        },
        {
          title: '角色',
          key: 'role',
          minWidth: 90
        },
        {
          title: '状态',
          key:'status',
          minWidth: 90
        },
        {
          title: '备注',
          key: 'description',
          minWidth: 100
        },
        {
          title: '创建时间',
          key: 'create_time',
          minWidth: 100
        }

      ],
      tableData: [],
      i:{
        pageTotal: 0, //总数
        tableLoading: true
      },
      initPara:{
        page_number: 1,
        page_size: 15,
        searchVal: null,
        // sg_ids: [],
        order_by: "",      //排序字段
        order: "ascend", //排序 ascend descend
      },
      selectList: [],
      // 导入相关
      importModal: {
        show: false,
        title: '批量导入'
      },
      resultModal: {
        show: false
      },
      importing: false,
      previewData: [],
      importResult: {
        success_count: 0,
        failed_count: 0,
        errors: []
      },
      previewColumns: [
        {
          title: '设备名称',
          key: 'name',
          width: 150
        },
        {
          title: '管理IP',
          key: 'manage_ip',
          width: 100
        },
        {
          title: '序列号',
          key: 'sn',
          width: 90
        },
        {
          title: 'MAC地址',
          key: 'mac_address',
          width: 90
        },
        {
          title: '厂商',
          key: 'vendor',
          width: 150
        },
        {
          title: '型号',
          key:'model',
          width: 150
        },
        {
          title: '机房',
          key: 'idc',
          width: 150
        },
        {
          title: '机柜',
          key: 'rack',
          width: 150
        },
        {
          title: 'U位',
          key: 'position',
          width: 100
        },
        {
          title: '角色',
          key: 'role',
          width: 150
        },
        {
          title: '状态',
          key:'status',
          width: 100
        },
        {
          title: '备注',
          key: 'description',
          width: 150
        }
      ]
    }
  },
  methods: {
    // 获取
    async handleGetData() {
      const res = await getSwitch(this.initPara);
      if (res.code == 0) {
        this.tableData = res.data;
        this.i.pageTotal = res.count
      } else {
        this.$Message.error(res.msg)
      }
      this.i.tableLoading = false
    },
    // 删除
    handleDel() {
      this.$Modal.confirm({
        title: '二次确认',
        content: '确定删除已选中的数据？',
        onOk: () => {
          optSwitch({ id_list: this.selectList }, 'delete').then(res => {
            if (res.code === 0) {
              this.$Message.success(res.msg)
              this.handleGetData()
            } else {
             this.$Notice.error({ title: `${res.msg}` })
            }
          })
        },
        onCancel: () => {
          this.$Message.info('回头是岸~')
        },
      })
    },
    // 详细信息
    handleDetail(paramsRow) {
      this.natData = paramsRow
      this.modalData.show = true
    },
    handleClose() {
      this.modalAdd.show = false
      this.modalData.show = false
      this.handleGetData()
    },
    handleSelect (val) {
      let selectIdList = []
      val.forEach(item => {
        selectIdList.push(item.id)
      })
      this.selectList = selectIdList
    },
    handleSearch(){
      this.initPara.page_number = 1
      this.handleGetData()
    },
    handleSort (column, key, order) {
      this.initPara.order = column.order === "asc" ? 'ascend' : 'descend'
      this.initPara.order_by = column.key
      this.handleGetData()
    },
    // 分页
    handlerChangePage (value) {
      this.initPara.page_number = value
      this.handleGetData()
    },
    handlePageSize (value) {
      this.initPara.page_number = 1
      this.initPara.page_size = value
      this.handleGetData()
    },
    // 打开导入弹窗
    handleImport() {
      this.importModal.show = true
      this.previewData = []
    },

    // 文件上传前处理
    handleBeforeUpload(file) {
      // 检查文件类型
      const fileTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ]
      const isValidType = fileTypes.includes(file.type)
      if (!isValidType) {
        this.$Message.error('只能上传 Excel/CSV 文件！')
        return false
      }
      // 检查文件大小（10MB）
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        this.$Message.error('文件大小不能超过 10MB！')
        return false
      }
      // 读取文件
      this.readFile(file)
      return false
    },
    // 读取文件内容
    readFile(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
        
          // 获取第一个工作表
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          
          // 转换为JSON
          const jsonData = XLSX.utils.sheet_to_json(firstSheet)

          // 验证数据
          if (jsonData.length === 0) {
            this.$Message.error('文件内容为空')
            return
          }
          // 转换列名
          const columnMapping = {
            '设备名称': 'name',
            '管理IP': 'manage_ip',
            '序列号': 'sn',
            'MAC地址': 'mac_address',
            '厂商': 'vendor',
            '型号': 'model',
            '机房': 'idc',
            '机柜': 'rack',
            'U位': 'position',
            '角色': 'role',
            '状态':'status',
            '备注': 'description'
          }

          // 转换数据
          this.previewData = jsonData.map(row => {
            const newRow = {}
            Object.keys(row).forEach(key => {
              const newKey = columnMapping[key] || key
              if (row[key] === undefined || row[key] === null) {
                newRow[newKey] = ''
              } else {
              newRow[newKey] = row[key]
            }
          })
            return newRow
          })

        } catch (error) {
          this.$Message.error('文件解析失败：' + error.message)
        }
      }
      reader.onerror = () => {
        this.$Message.error('文件读取失败')
      }
      reader.readAsArrayBuffer(file)
    },
    // 下载模板
    downloadTemplate(e) {
      e.stopPropagation()
      // 创建工作簿
      const wb = XLSX.utils.book_new()
      
      // 创建工作表数据
      const wsData = [
        ['设备名称', '管理IP', '序列号', 'MAC地址', '厂商', '型号', '机房', '机柜', 'U位', '角色', '状态', '备注'],
        ['test', '127.0.0.1', 'xxxxxx', 'xxxxxxx', '遥遥领先', 'xxxxx', 'xxxxx', 'xxxxx', '1', 'xxxxx', 'xxxxx', 'xxxxx']
      ]
      
      // 创建工作表
      const ws = XLSX.utils.aoa_to_sheet(wsData)
      
      // 将工作表添加到工作簿
      XLSX.utils.book_append_sheet(wb, ws, '内网交换机导入模板')
      
      // 下载文件
      XLSX.writeFile(wb, 'switch_template.xlsx')
    },
    // 提交导入
    async handleImportSubmit() {
      if (!this.previewData.length) {
        this.$Message.warning('没有可导入的数据')
        return
      }
      try {
        this.importing = true
        const data = {
          data: this.previewData
        }
        let res = await importSwitch(data)
        if (res.code !== 0) {
           this.$Message.error(res.msg)
           this.importing = false
           return
        }
        this.importResult = res.data
        this.importModal.show = false
        this.resultModal.show = true

        if (res.data.failed_count === 0) {
          this.previewData = []
          this.handleGetData()
        } else {
          this.importing = false
          this.$Message.error('导入失败: 数据格式错误');
        }
      } catch (error) {
        this.$Message.error('导入失败：' + error.message)
      } finally {
        this.importing = false
      }
    },
    // 关闭结果弹窗
    handleResultClose() {
      this.resultModal.show = false
      if (this.importResult.failed_count === 0) {
        this.previewData = []
      }
    }
  },
  watch: {
    searchValue (val) {
      this.pageNum = 1
      this.handleGetData()
    },
  },
  computed: {
  },
  mounted () {
    this.handleGetData()
  }
}
</script>
<style lang="less" scoped>
.search-con {
  padding: 5px 0;
  .search {
    &-col {
      display: inline-block;
      margin-left: 10px;
      width: 400px;
    }
    &-input {
      display: inline-block;
      width: 350px;
      margin-left: 2px;
    }
    &-add-btn {
      margin-left: 2px;
      margin-right: 3px;
    }
  }
}

.import-container {
  padding: 16px;
}

.import-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  .ivu-upload {
    display: inline-block;
  }
}

.import-tips {
  margin-left: 16px;
  display: flex;
  align-items: center;
}

.upload-tip {
  color: #999;
  font-size: 12px;
}

.download-btn {
  margin-left: 280px !important;
  color: #2d8cf0;
  font-size: 12px;
  padding: 0;
  height: auto;
  
  &:hover {
    color: #57a3f3;
  }
  
  .ivu-icon {
    margin-right: 4px;
  }
}

.preview-wrapper {
  background: #f8f8f9;
  padding: 16px;
  border-radius: 4px;
  margin-top: 16px;
  
  .ivu-table-wrapper {
    border: 1px solid #dcdee2;
  }
}

.preview-header {
  margin-bottom: 12px;
  font-size: 14px;
  color: #17233d;
}

// 调整表格内边距
:deep(.ivu-table-small) {
  td {
    padding: 6px 0;
  }
}

// Modal 内容区域的上下边距
:deep(.ivu-modal-body) {
  padding: 0;
}

// 调整按钮组的间距
:deep(.ivu-modal-footer) {
  border-top: 1px solid #e8eaec;
  padding: 12px 18px;
  
  .ivu-btn + .ivu-btn {
    margin-left: 8px;
  }
}
</style>
