<template>
  <div class="table-box">
    <ProTable ref="proTable" title="资讯列表" :columns="columns" :requestApi="getTableList" :initParam="initParam" :dataCallback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-hasPermi="['sys:role:add']">新增角色</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="success" :icon="View" @click="openDrawer('查看', scope.row)" v-hasPermi="['sys:role:view']">查看</el-button>
        <el-button type="primary" :icon="EditPen" @click="openDrawer('编辑', scope.row)" v-hasPermi="['sys:role:edit']">编辑</el-button>
        <el-button type="danger" :icon="Delete" @click="deleteRow(scope.row)" v-hasPermi="['sys:role:remove']">删除</el-button>
      </template>
    </ProTable>
    <TenantDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="Tenant">
import { ref, reactive, h } from 'vue'
import { Tenant } from '@/api/interface'
import { ColumnProps } from '@/components/ProTable/interface'
import { useHandleData } from '@/hooks/useHandleData'
import ProTable from '@/components/ProTable/index.vue'
import TenantDialog from './components/TenantDialog.vue'
import { getTenantPage, addTenant, editTenant, deleteTenant } from '@/api/modules/tenant'
import { ElImage } from 'element-plus'
import dayjs from 'dayjs'

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({})

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 datalist && total 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = { ...params }
  return getTenantPage(newParams)
}

// 表格配置项
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'id',
    label: '编号'
  },
  {
    prop: 'name',
    label: '租户名称',
    search: { el: 'input' }
  },
  {
    prop: 'type',
    label: '类型',
    render: (scope) => {
      const typeMap = {
        0: '小区',
        1: '学校',
        2: '驿站'
      }
      return typeMap[scope.row.type] || '未知'
    }
  },
  {
    prop: 'avatar',
    label: '头像',
    width: 70,
    render: (scope) => {
      return h(ElImage, {
        style: { width: '40px', height: '40px', borderRadius: '50%' },
        src: scope.row.avatar,
        fit: 'cover',
        previewSrcList: [scope.row.avatar]
      })
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 200,
    render: (scope) => {
      return dayjs(scope.row.createTime).format('YYYY-MM-DD')
    }
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]

// 删除单个
const deleteRow = async (params: Tenant.ResTenantList) => {
  await useHandleData(deleteTenant, [params.id], `删除【${params.name}租户】`)
  proTable.value.getTableList()
}

// 打开 drawer(新增、查看、编辑)
const dialogRef = ref()
const openDrawer = (title: string, row: Partial<Tenant.ResTenantList> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: title === '新增' ? addTenant : title === '编辑' ? editTenant : '',
    getTableList: proTable.value.getTableList
  }
  dialogRef.value.acceptParams(params)
}
</script>
