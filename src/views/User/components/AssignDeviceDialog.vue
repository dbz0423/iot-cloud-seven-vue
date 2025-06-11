<template>
  <el-dialog v-model="dialogVisible" :title="`分配设备给【${dialogProps.row?.nickname}】`" width="800px" :destroy-on-close="true">
    <ProTable ref="proTableRef" :columns="columns" :request-api="getDeviceList" :init-param="initParam" :data-callback="dataCallback" row-key="id"> </ProTable>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getDeviceList as getDeviceListApi } from '@/api/modules/device'
import { getUserDeviceAssignments, bindUserToDevice, unbindUserFromDevice } from '@/api/modules/binding'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'

interface User {
  id: number
  nickname: string
}

interface DialogProps {
  row: Partial<User>
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  row: {}
})

const proTableRef = ref()
const initParam = reactive({})

const initialAssignedIds = ref<Set<number>>(new Set())

const acceptParams = async (params: DialogProps) => {
  dialogProps.value = params
  dialogVisible.value = true

  const res = await getUserDeviceAssignments(params.row.id!)
  // @ts-expect-error
  const assignedDevices = res.data?.assigned || []
  initialAssignedIds.value = new Set(assignedDevices.map((item: any) => item.id))

  nextTick(() => {
    proTableRef.value?.getTableList()
  })
}

const getDeviceList = (params: any) => {
  return getDeviceListApi(params)
}

const dataCallback = (data: any) => {
  nextTick(() => {
    if (proTableRef.value) {
      proTableRef.value.clearSelection()
      data.list.forEach((item: any) => {
        if (initialAssignedIds.value.has(item.id)) {
          proTableRef.value.toggleRowSelection(item, true)
        }
      })
    }
  })
  return data
}

const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 50 },
  { prop: 'id', label: '设备ID' },
  { prop: 'name', label: '设备名称', search: { el: 'input' } },
  { prop: 'createTime', label: '创建时间' }
]

const handleSubmit = async () => {
  const finalAssignedIds = new Set(proTableRef.value?.selectedList.map((item: any) => item.id))

  const toBind: number[] = []
  const toUnbind: number[] = []

  finalAssignedIds.forEach((id) => {
    if (!initialAssignedIds.value.has(id)) {
      toBind.push(id)
    }
  })

  initialAssignedIds.value.forEach((id) => {
    if (!finalAssignedIds.has(id)) {
      toUnbind.push(id)
    }
  })

  try {
    const promises: Promise<any>[] = []
    const userId = dialogProps.value.row.id!

    toBind.forEach((deviceId) => promises.push(bindUserToDevice({ userId, deviceId })))
    toUnbind.forEach((deviceId) => promises.push(unbindUserFromDevice({ userId, deviceId })))

    await Promise.all(promises)
    ElMessage.success('设备分配成功！')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('设备分配失败')
  }
}

defineExpose({
  acceptParams
})
</script>
