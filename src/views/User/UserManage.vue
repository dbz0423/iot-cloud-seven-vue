<template>
  <div class="table-box">
    <ProTable
      rowKey="id"
      ref="proTable"
      title="用户列表"
      :columns="columns"
      :requestApi="getTableList"
      :initParam="initParam"
      :dataCallback="dataCallback"
      :searchCol="{ xs: 1, sm: 2, md: 3, lg: 4, xl: 4 }"
      :row-style="{ height: '0' }"
      :cell-style="{ padding: '0px' }"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="Download" plain @click="openImport">导入</el-button>
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出</el-button>
        <el-button type="primary" plain :icon="CirclePlus" @click="openDialog('新增')" v-hasPermi="['sys:user:add']">新增用户</el-button>
        <el-button type="danger" :icon="Delete" plain :disabled="!proTable?.isSelected" @click="batchDelete(proTable?.selectedListIds)" v-hasPermi="['sys:user:remove']"
          >批量删除</el-button
        >
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDialog('查看管理员', scope.row)">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDialog('编辑管理员', scope.row)" v-hasPermi="['sys:user:edit']">编辑</el-button>
        <el-button type="primary" link :icon="Connection" @click="openAssignDialog('scene', scope.row)" v-hasPermi="['sys:user:assignScene']">分配场景</el-button>
        <el-button type="primary" link :icon="Cpu" @click="openAssignDialog('device', scope.row)" v-hasPermi="['sys:user:assignDevice']">分配设备</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteManager(scope.row)" v-hasPermi="['sys:user:remove']">删除</el-button>
      </template>
    </ProTable>
    <UserDialog ref="dialogRef" />
    <ExcelImportDialog
      ref="excelDialogRef"
      :api="UserApi.import"
      :temp-api="UserApi.exportTemplate"
      :on-success="handleImportSuccess"
      :template-params="{ tenantId: appstore.userInfo.tenantId }"
      template-name="用户数据模板.xlsx"
    />
    <AssignSceneDialog ref="assignSceneDialogRef" />
    <AssignDeviceDialog ref="assignDeviceDialogRef" />
  </div>
</template>

<script setup lang="tsx" name="UserManager">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import UserDialog from './components/UserDialog.vue'
import { CirclePlus, View, EditPen, Delete, Connection, Cpu, Download } from '@element-plus/icons-vue'
import { UserApi } from '@/api/modules/user'
import { useHandleData } from '@/hooks/useHandleData'
import { useAppStoreWithOut } from '@/store/modules/app'
import { ElMessageBox } from 'element-plus'
import { useDownload } from '@/hooks/useDownload'
import ExcelImportDialog from '@/components/ImportExcel/index.vue'
// import { useDate } from '@/hooks/useDate'
import { useRoute } from 'vue-router'
import AssignSceneDialog from './components/AssignSceneDialog.vue'
import AssignDeviceDialog from './components/AssignDeviceDialog.vue'

const route = useRoute()

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({
  tenantId: route.params.tenantId ? Number(route.params.tenantId) : undefined,
  type: 2
})

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.list,
    page: data.page,
    limit: data.limit,
    total: data.total
  }
}

const appstore = useAppStoreWithOut()

// 导出列表
const downloadFile = async () => {
  console.log('protable', proTable.value?.searchParam)
  // 获取选中行的完整数据
  const selectedRows = proTable.value?.selectedList || []
  console.log('selectedRows', selectedRows)
  // 提取选中用户的mobile和nickname
  const selectedMobiles = [...new Set(selectedRows.map((row) => row.mobile))]
  const selectedNicknames = [...new Set(selectedRows.map((row) => row.nickname))]
  const newParams = {
    ...proTable.value?.searchParam,
    tenantId: appstore.userInfo.tenantId,
    // 添加选中用户的参数
    mobile: selectedMobiles,
    nickname: selectedNicknames
  }
  ElMessageBox.confirm('确认导出用户数据?', '温馨提示', { type: 'warning' }).then(() => useDownload(UserApi.export, '用户列表', newParams))
}

// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  const newParams = { ...proTable.value.searchParam, ...params }
  newParams.tenantId = newParams.tenantId || appstore.userInfo.tenantId
  return UserApi.page(newParams)
}

// 表格配置项
const columns: ColumnProps<UserType>[] = [
  { type: 'selection', fixed: 'left', width: 50 },
  {
    prop: 'avatar',
    label: '头像',
    width: 170,
    render: (scope) => {
      return (
        <div class={['flex', 'justify-center', 'p-1']}>
          <el-avatar shape={'square'} size={30} src={scope.row.avatar} />
        </div>
      )
    }
  },
  {
    prop: 'nickname',
    showOverflowTooltip: true,
    label: '用户名',
    width: 170,
    search: {
      el: 'input',
      props: { placeholder: '请输入用户名' }
    }
  },
  {
    prop: 'username',
    showOverflowTooltip: true,
    label: '账号',
    width: 170
  },
  {
    prop: 'mobile',
    label: '手机号',
    search: {
      el: 'input',
      props: { placeholder: '请输入手机号' }
    },
    width: 200
  },
  {
    prop: 'status',
    label: '状态',
    width: 200,
    render: (scope) => {
      return <el-tag type={scope.row.status === 0 ? 'warning' : 'primary'}>{scope.row.status === 0 ? '禁用' : '启用'}</el-tag>
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 300
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 340 }
]

const excelDialogRef = ref()
// 打开 drawer(新增、查看、编辑)
const dialogRef = ref()
const assignSceneDialogRef = ref()
const assignDeviceDialogRef = ref()

const handleImportSuccess = () => {
  proTable.value.getTableList()
  ElMessage.success('导入成功')
}

const openImport = () => {
  excelDialogRef.value.acceptParams({
    title: '用户导入',
    templateFileName: '用户数据模板.xlsx'
  })
}

const openDialog = (title: string, row: Partial<UserType> = {}) => {
  const params = {
    title,
    row: { ...row },
    isView: title.includes('查看'),
    api: title.includes('新增') ? UserApi.add : title.includes('编辑') ? UserApi.edit : undefined,
    getTableList: proTable.value.getTableList
  }
  dialogRef.value.acceptParams(params)
}

// 分配场景/设备弹窗
const openAssignDialog = (type: 'scene' | 'device', row: Partial<UserType> = {}) => {
  const params = {
    row: { ...row }
  }
  if (type === 'scene') {
    assignSceneDialogRef.value.acceptParams(params)
  } else {
    assignDeviceDialogRef.value.acceptParams(params)
  }
}

// 删除用户信息
const deleteManager = async (params) => {
  await useHandleData(UserApi.delete, [params.id].map(Number), `删除【${params.username}】用户`)
  proTable.value.getTableList()
}

// * 批量删除管理员
const batchDelete = async (ids: string[]) => {
  await useHandleData(UserApi.delete, ids.map(Number), '删除所选用户信息')
  proTable.value.clearSelection()
  proTable.value.getTableList()
}
</script>
