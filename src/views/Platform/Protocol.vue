<template>
  <div class="table-box">
    <ProTable ref="proTable" title="协议管理" :columns="columns" :requestApi="ProtocolApi.page" :initParam="initParam" :dataCallback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-hasPermi="['pla:protocol:add']">新增</el-button>
      </template>

      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)" v-hasPermi="['pla:protocol:view']">查看</el-button>
        <el-button type="warning" link :icon="EditPen" @click="openDrawer('编辑', scope.row)" v-hasPermi="['pla:protocol:edit']">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteRowData(scope.row)" v-hasPermi="['pla:protocol:remove']">删除</el-button>
      </template>
    </ProTable>
    <ProtocolDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="protocol">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import { Delete, CirclePlus, View, EditPen } from '@element-plus/icons-vue'
import { ProtocolApi } from '@/api/modules/platform'
import { useHandleData } from '@/hooks/useHandleData'
import ProtocolDialog from './components/ProtocolDialog.vue'

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({})

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

// 表格配置项
const columns: ColumnProps<any>[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'name',
    label: '协议名称',
    width: 162,
    search: { el: 'input' }
  },
  {
    prop: 'content',
    label: '协议内容',
    width: 600,
    render: (scope) => {
      return <div class="line-clamp-2" v-html={scope.row.content}></div>
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 200
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 230 }
]

// 删除数据
const deleteRowData = async (params) => {
  await useHandleData(ProtocolApi.remove, [params.pkId], `删除【${params.name}】`)
  proTable.value.getTableList()
}

// 打开 drawer(新增、查看、编辑)
const dialogRef = ref()
const openDrawer = (title: string, row: Partial<any> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: title === '新增' ? ProtocolApi.add : title === '编辑' ? ProtocolApi.edit : '',
    getTableList: proTable.value.getTableList,
    maxHeight: '500px'
  }
  dialogRef.value.acceptParams(params)
}
</script>

<style scoped lang="less">
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
