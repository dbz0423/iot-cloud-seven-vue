<template>
  <div class="table-box">
    <ProTable
      rowKey="pkId"
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
        <el-button type="primary" plain :icon="CirclePlus" @click="openDrawer('新增')" v-hasPermi="['sys:user:add']">新增用户</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)" v-hasPermi="['sys:user:view']">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)" v-hasPermi="['sys:user:edit']">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteAccount(scope.row)" v-hasPermi="['sys:manager:remove']">删除</el-button>
      </template>
    </ProTable>
    <UserDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="UserManager">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import ProTable from '@/components/ProTable/index.vue'
import UserDialog from './components/UserDialog.vue'
import { CirclePlus, View, EditPen, Delete } from '@element-plus/icons-vue'
import { UserApi } from '@/api/modules/user'
import { useHandleData } from '@/hooks/useHandleData'
import { useAppStoreWithOut } from '@/store/modules/app'
// import { useDate } from '@/hooks/useDate'
// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({})

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}

const appstore = useAppStoreWithOut()

// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  const newParams = {
    ...params,
    tenantId: appstore.userInfo.tenantId
  }
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

// 打开 drawer(新增、查看、编辑)
const dialogRef = ref()

const openDrawer = (title: string, row: Partial<UserType> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: title === '新增' ? UserApi.add : title === '编辑' ? UserApi.edit : '',
    getTableList: proTable.value.getTableList,
    maxHeight: '500px'
  }
  switch (title) {
    case '新增':
      dialogRef.value.acceptParams(params)
      break
    case '查看':
      dialogRef.value.acceptParams(params)
      break
    case '编辑':
      dialogRef.value.acceptParams(params)
      break
    default:
      break
  }
}

// 删除用户信息
const deleteAccount = async (params) => {
  await useHandleData(UserApi.delete, [params.id], `删除【${params.username}】用户`)
  proTable.value.getTableList()
}
</script>
