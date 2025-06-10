<template>
  <el-dialog v-model="dialogVisible" :title="`分配场景给【${drawerProps.row?.nickname}】`" width="800px" :destroy-on-close="true">
    <ProTable ref="proTableRef" :columns="columns" :request-api="getSceneList" :init-param="initParam" :data-callback="dataCallback" row-key="id"> </ProTable>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getSceneList as getSceneListApi } from '@/api/modules/scene'
import { getUserSceneAssignments, bindUserToScene, unbindUserFromScene } from '@/api/modules/binding'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'

interface User {
  id: number
  nickname: string
}

interface DrawerProps {
  row: Partial<User>
}

const dialogVisible = ref(false)
const drawerProps = ref<DrawerProps>({
  row: {}
})

const proTableRef = ref()
const initParam = reactive({})

const initialAssignedIds = ref<Set<number>>(new Set())

const acceptParams = async (params: DrawerProps) => {
  drawerProps.value = params
  dialogVisible.value = true

  // 获取该用户已分配的场景
  const res = await getUserSceneAssignments(params.row.id!)
  // @ts-expect-error
  const assignedScenes = res.data?.assigned || []
  initialAssignedIds.value = new Set(assignedScenes.map((item: any) => item.id))

  // 强制刷新 ProTable 并进行默认选中
  nextTick(() => {
    proTableRef.value?.getTableList()
  })
}

const getSceneList = (params: any) => {
  return getSceneListApi(params)
}

const dataCallback = (data: any) => {
  nextTick(() => {
    if (proTableRef.value) {
      // 核心改动：先清空上一次的选中状态
      proTableRef.value.clearSelection()
      // 再根据新的数据设置选中状态
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

  // 找出需要绑定的 (新选中)
  finalAssignedIds.forEach((id) => {
    if (!initialAssignedIds.value.has(id)) {
      toBind.push(id)
    }
  })

  // 找出需要解绑的 (取消选中)
  initialAssignedIds.value.forEach((id) => {
    if (!finalAssignedIds.has(id)) {
      toUnbind.push(id)
    }
  })

  try {
    const promises: Promise<any>[] = []
    const userId = drawerProps.value.row.id!

    toBind.forEach((sceneId) => promises.push(bindUserToScene({ userId, sceneId })))
    toUnbind.forEach((sceneId) => promises.push(unbindUserFromScene({ userId, sceneId })))

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
