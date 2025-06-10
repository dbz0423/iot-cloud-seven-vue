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
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { UserApi } from '@/api/modules/user'
import { getSceneUserAssignments, bindUserToScene, unbindUserFromScene } from '@/api/modules/binding'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'

interface Scene {
  id: number
  name: string
}

interface DialogProps {
  row: Partial<Scene>
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  row: {}
})

const proTableRef = ref()
const initParam = reactive({ type: 2 }) // 只查询普通用户

const initialAssignedIds = ref<Set<number>>(new Set())

const acceptParams = async (params: DialogProps) => {
  dialogProps.value = params
  dialogVisible.value = true

  const res = await getSceneUserAssignments(params.row.id!)
  // @ts-expect-error
  const assignedUsers = res.data?.assigned || []
  initialAssignedIds.value = new Set(assignedUsers.map((item: any) => item.id))

  nextTick(() => {
    proTableRef.value?.getTableList()
  })
}

const getUserList = (params: any) => {
  return UserApi.page(params)
}

const dataCallback = (data: any) => {
  nextTick(() => {
    if (proTableRef.value?.element) {
      proTableRef.value.element.clearSelection()
      data.list.forEach((item: any) => {
        if (initialAssignedIds.value.has(item.id)) {
          proTableRef.value.element.toggleRowSelection(item, true)
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
  const finalAssignedIds = new Set(proTableRef.value?.selectedList.map((item: any) => Number(item.id)))

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
    const sceneId = Number(dialogProps.value.row.id)

    toBind.forEach((userId) => promises.push(bindUserToScene({ userId: Number(userId), sceneId: sceneId })))
    toUnbind.forEach((userId) => promises.push(unbindUserFromScene({ userId: Number(userId), sceneId: sceneId })))

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
