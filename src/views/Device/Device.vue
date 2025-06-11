<template>
  <div class="table-box">
    <ProTable ref="proTable" title="设备列表" :columns="columns" :request-api="getDeviceList" :init-param="initParam" height="550px">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDialog('新增')" v-hasPermi="['device:manager:add']">新增设备</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDialog('编辑', scope.row)" v-hasPermi="['device:manager:edit']">编辑</el-button>
        <el-button type="primary" link :icon="User" @click="openAssignDialog('user', scope.row)" v-hasPermi="['device:manager:assignUser']">分配用户</el-button>
        <el-button type="primary" link :icon="Connection" @click="openAssignDialog('scene', scope.row)" v-hasPermi="['device:manager:assignScene']">分配场景</el-button>
        <el-button type="danger" link :icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['device:manager:delete']">删除</el-button>
      </template>
    </ProTable>
    <DeviceDialog ref="deviceDialogRef" />
    <AssignUserDialog ref="assignUserDialogRef" />
    <AssignSceneDialog ref="assignSceneDialogRef" />
  </div>
</template>

<script setup lang="tsx" name="Device">
import { reactive, ref } from 'vue'
import { Device } from '@/api/interface'
import { ColumnProps } from '@/components/ProTable/interface'
import { useHandleData } from '@/hooks/useHandleData'
import ProTable from '@/components/ProTable/index.vue'
import DeviceDialog from './components/DeviceDialog.vue'
import AssignUserDialog from './components/AssignUserDialog.vue'
import AssignSceneDialog from './components/AssignSceneDialog.vue'
import { CirclePlus, Delete, EditPen, User, Connection } from '@element-plus/icons-vue'
import { getDeviceList, deleteDevice } from '@/api/modules/device'
import { useRoute } from 'vue-router'

const route = useRoute()
const proTable = ref()
const deviceDialogRef = ref()
const assignUserDialogRef = ref()
const assignSceneDialogRef = ref()

const initParam = reactive({
  tenantId: route.params.tenantId ? Number(route.params.tenantId) : undefined
})

const columns: ColumnProps<Device.ResDeviceList>[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  { prop: 'id', label: 'id', width: 100 },
  { prop: 'name', label: '设备名称', search: { el: 'input' } },
  { prop: 'deviceId', label: '设备ID', search: { el: 'input' }, width: 180 },
  { prop: 'type', label: '设备类型', width: 120 },
  {
    prop: 'deviceStatus',
    label: '设备状态',
    width: 120,
    render: (scope) => {
      return <el-tag type={scope.row.deviceStatus ? 'success' : 'danger'}>{scope.row.deviceStatus ? '在线' : '离线'}</el-tag>
    }
  },
  { prop: 'createTime', label: '创建时间', width: 200 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 }
]

const handleDelete = async (row: any) => {
  await useHandleData(deleteDevice, { id: row.id }, '删除设备')
  proTable.value.getTableList()
}

const openDialog = (type: '新增' | '编辑', rowData?: any) => {
  deviceDialogRef.value.openDialog(rowData)
}

const openAssignDialog = (type: 'user' | 'scene', row: Partial<Device.ResDeviceList> = {}) => {
  const params = {
    row: { ...row }
  }
  if (type === 'user') {
    assignUserDialogRef.value.acceptParams(params)
  } else {
    assignSceneDialogRef.value.acceptParams(params)
  }
}
</script>
