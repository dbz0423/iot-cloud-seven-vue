<template>
  <div class="table-box">
    <ProTable ref="proTable" title="设备列表" :columns="columns" :requestApi="getTableList" :initParam="initParam" :dataCallback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-hasPermi="['device:manager:add']">新增设备</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)" v-hasPermi="['device:manager:view']">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)" v-hasPermi="['device:manager:edit']">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteRow(scope.row)" v-hasPermi="['device:manager:remove']">删除</el-button>
      </template>
    </ProTable>
    <DeviceDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="Device">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import { useHandleData } from '@/hooks/useHandleData'
import ProTable from '@/components/ProTable/index.vue'
import DeviceDialog from './components/DeviceDialog.vue'
import { getDeviceList, addDevice, updateDevice, deleteDevice } from '../../api/modules/device'
import { Device } from '@/api/interface'
import { CirclePlus, EditPen, Delete, View } from '@element-plus/icons-vue'
import { useWebSocket } from '@/hooks/useWebSocket'

// 获取 ProTable 元素
const proTable = ref()

// 初始化请求参数
const initParam = reactive({})

// dataCallback 是对于返回的表格数据做处理
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

// 获取设备列表
const getTableList = (params: any) => {
  let newParams = { ...params }
  return getDeviceList(newParams)
}

// 表格配置项
const columns: ColumnProps<Device.ResDeviceList>[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  { prop: 'name', label: '设备名称', search: { el: 'input' } },
  { prop: 'deviceId', label: '设备ID' },
  {
    prop: 'type',
    label: '设备类型',
    render: (scope) => {
      // 这里可以根据实际的设备类型进行映射
      const typeMap = { 1: '灯', 2: '传感器', 3: '摄像头' }
      return typeMap[scope.row.type] || '未知'
    }
  },
  {
    prop: 'deviceOnline',
    label: '在线状态',
    render: (scope) => {
      return <el-tag type={scope.row.deviceOnline === 1 ? 'success' : 'info'}>{scope.row.deviceOnline === 1 ? '在线' : '离线'}</el-tag>
    }
  },
  { prop: 'createTime', label: '创建时间', width: 200 },
  { prop: 'operation', label: '操作', fixed: 'right', width: 280 }
]

// 删除设备
const deleteRow = async (row: Device.ResDeviceList) => {
  await useHandleData(deleteDevice, { id: row.id }, `删除【${row.name}】设备`)
  proTable.value.getTableList()
}

// 打开 drawer
const dialogRef = ref()
const openDrawer = (title: string, row: Partial<Device.ResDeviceList> = {}) => {
  const params = {
    title,
    isView: title === '查看',
    row: { ...row },
    api: title === '新增' ? addDevice : title === '编辑' ? updateDevice : '',
    getTableList: proTable.value.getTableList
  }
  dialogRef.value.acceptParams(params)
}

// WebSocket 实时更新
const handleMessage = (data: any) => {
  if (proTable.value && proTable.value.tableData) {
    const device = proTable.value.tableData.find((item: Device.ResDeviceList) => item.deviceId === data.deviceId)
    if (device) {
      device.deviceOnline = data.deviceOnline
      device.deviceStatus = data.deviceStatus
    }
  }
}

const { connect, disconnect } = useWebSocket({
  url: 'ws://192.168.100.239:8082/ws/device/status',
  onMessage: handleMessage
})

onMounted(() => {
  connect()
})

onUnmounted(() => {
  disconnect()
})
</script>
