<template>
  <div class="table-box">
    <ProTable ref="proTable" title="场景列表" :columns="columns" :request-api="getSceneList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-hasPermi="['scene:manager:add']">新增场景</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)" v-hasPermi="['scene:manager:edit']">编辑</el-button>
        <el-button type="primary" link :icon="User" @click="openAssignDialog('user', scope.row)" v-hasPermi="['scene:manager:assignUser']">分配用户</el-button>
        <el-button type="primary" link :icon="Cpu" @click="openAssignDialog('device', scope.row)" v-hasPermi="['scene:manager:assignDevice']">分配设备</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteSceneData(scope.row)" v-hasPermi="['scene:manager:delete']">删除</el-button>
      </template>
    </ProTable>
    <SceneDialog ref="sceneDialogRef" />
    <AssignUserDialog ref="assignUserDialogRef" />
    <AssignDeviceDialog ref="assignDeviceDialogRef" />
  </div>
</template>

<script setup lang="tsx" name="Scene">
import { ref } from 'vue'
import { Scene } from '@/api/interface'
import { ColumnProps } from '@/components/ProTable/interface'
import { useHandleData } from '@/hooks/useHandleData'
import ProTable from '@/components/ProTable/index.vue'
import SceneDialog from './components/SceneDialog.vue'
import AssignUserDialog from './components/AssignUserDialog.vue'
import AssignDeviceDialog from './components/AssignDeviceDialog.vue'
import { CirclePlus, Delete, EditPen, User, Cpu } from '@element-plus/icons-vue'
import { getSceneList, addScene, updateScene, deleteScene } from '@/api/modules/scene'

const proTable = ref()
const sceneDialogRef = ref()
const assignUserDialogRef = ref()
const assignDeviceDialogRef = ref()

const columns: ColumnProps<Scene.ResSceneList>[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  { prop: 'id', label: 'id' },
  { prop: 'name', label: '场景名称', search: { el: 'input' } },
  { prop: 'createTime', label: '创建时间' },
  { prop: 'operation', label: '操作', fixed: 'right' }
]

const deleteSceneData = async (params: Scene.ResSceneList) => {
  await useHandleData(deleteScene, { id: params.id }, `删除【${params.name}】场景`)
  proTable.value.getTableList()
}

const openDrawer = (title: string, row: Partial<Scene.ResSceneList> = {}) => {
  let params = {
    title,
    row: { ...row },
    api: title === '新增' ? addScene : updateScene,
    getTableList: proTable.value.getTableList
  }
  sceneDialogRef.value.openDialog(params)
}

const openAssignDialog = (type: 'user' | 'device', row: Partial<Scene.ResSceneList> = {}) => {
  const params = {
    row: { ...row }
  }
  if (type === 'user') {
    assignUserDialogRef.value.acceptParams(params)
  } else {
    assignDeviceDialogRef.value.acceptParams(params)
  }
}
</script>

<style lang="scss" scoped></style>
