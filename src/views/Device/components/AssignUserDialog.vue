<template>
  <el-dialog v-model="dialogVisible" :title="`分配用户给【${dialogProps.row?.name}】`" width="800px" :destroy-on-close="true">
    <ProTable ref="proTableRef" :columns="columns" :request-api="getUserList" :init-param="initParam" :data-callback="dataCallback" row-key="id"> </ProTable>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { UserApi } from '@/api/modules/user'
import { bindUserToDevice, unbindUserFromDevice, getDeviceUserAssignmentIds } from '@/api/modules/binding'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'

interface Device {
  id: number
  name: string
  tenantId: number
}

interface DialogProps {
  row: Partial<Device>
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  row: {}
})

const proTableRef = ref()
const initParam = reactive({
  type: 2,
  tenantId: undefined as number | undefined
})

const initialAssignedIds = ref<Set<number>>(new Set())

const acceptParams = (params: DialogProps) => {
  dialogProps.value = params
  initParam.tenantId = params.row.tenantId
  dialogVisible.value = true
}

watch(
  () => dialogVisible.value,
  async (visible) => {
    if (visible) {
      const res = await getDeviceUserAssignmentIds(dialogProps.value.row.id!)
      initialAssignedIds.value = new Set(res.data || [])
      nextTick(() => {
        proTableRef.value?.getTableList()
      })
    }
  }
)

const getUserList = (params: any) => {
  return UserApi.page(params)
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
  { prop: 'id', label: '用户ID' },
  { prop: 'nickname', label: '用户昵称', search: { el: 'input' } },
  { prop: 'username', label: '用户名', search: { el: 'input' } },
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
    const deviceId = dialogProps.value.row.id!

    toBind.forEach((userId) => promises.push(bindUserToDevice({ userId, deviceId })))
    toUnbind.forEach((userId) => promises.push(unbindUserFromDevice({ userId, deviceId })))

    await Promise.all(promises)
    ElMessage.success('用户分配成功！')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('用户分配失败')
  }
}

defineExpose({
  acceptParams
})
</script>
