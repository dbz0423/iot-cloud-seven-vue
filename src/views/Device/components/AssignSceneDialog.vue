<template>
  <el-dialog v-model="dialogVisible" :title="`分配场景给【${dialogProps.row?.name}】`" width="800px" :destroy-on-close="true">
    <ProTable ref="proTableRef" :columns="columns" :request-api="getSceneList" :init-param="initParam" :data-callback="dataCallback" row-key="id"> </ProTable>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getSceneList as getSceneListApi } from '@/api/modules/scene'
import { getDeviceSceneAssignmentIds, bindDeviceToScene, unbindDeviceFromScene } from '@/api/modules/binding'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'

interface Device {
  id: number
  name: string
}

interface DialogProps {
  row: Partial<Device>
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  row: {}
})

const proTableRef = ref()
const initParam = reactive({})

const initialAssignedIds = ref<Set<number>>(new Set())

const acceptParams = (params: DialogProps) => {
  dialogProps.value = params
  dialogVisible.value = true
}

watch(
  () => dialogVisible.value,
  async (visible) => {
    if (visible) {
      const res = await getDeviceSceneAssignmentIds(dialogProps.value.row.id!)
      initialAssignedIds.value = new Set(res.data || [])
      nextTick(() => {
        proTableRef.value?.getTableList()
      })
    }
  }
)

const getSceneList = (params: any) => {
  return getSceneListApi(params)
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
  { prop: 'id', label: '场景ID' },
  { prop: 'name', label: '场景名称', search: { el: 'input' } },
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

    toBind.forEach((sceneId) => promises.push(bindDeviceToScene({ deviceId, sceneId })))
    toUnbind.forEach((sceneId) => promises.push(unbindDeviceFromScene({ deviceId, sceneId })))

    await Promise.all(promises)
    ElMessage.success('场景分配成功！')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('场景分配失败')
  }
}

defineExpose({
  acceptParams
})
</script>
