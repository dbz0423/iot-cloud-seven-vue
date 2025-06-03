<template>
  <div class="table-box">
    <ProTable
      rowKey="pkId"
      ref="proTable"
      title="分类列表"
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
        <el-button type="primary" :icon="Download" plain @click="downloadFile">导出</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)" v-hasPermi="['sys:category:view']">查看</el-button>
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)" v-hasPermi="['sys:category:edit']">编辑</el-button>
      </template>
    </ProTable>
    <CategoryDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="tsx" name="Category">
import { ref, reactive } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import { Download, View, EditPen } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import ProTable from '@/components/ProTable/index.vue'
import { useDownload } from '@/hooks/useDownload'
import { CategoryApi } from '@/api/modules/resource'
import CategoryDialog from './components/CategoryDialog.vue'

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()
// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({})

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  console.log(data)
  return {
    list: data.list,
    total: data.total
  }
}

// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  return CategoryApi.page(params)
}

// 表格配置项
const columns: ColumnProps<CategoryType>[] = [
  {
    prop: 'title',
    label: '类别名称',
    search: {
      el: 'input',
      props: { placeholder: '请输入类别名称' }
    }
  },
  {
    prop: 'type',
    label: '类别类型'
  },
  {
    prop: 'description',
    label: '类别描述',
    width: 250
  },
  {
    prop: 'createTime',
    label: '创建时间'
  },
  { prop: 'operation', label: '操作', fixed: 'right' }
]

// 打开 drawer(新增、查看、编辑)
const dialogRef = ref()

const openDrawer = (title: string, row: Partial<CategoryType> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: title === '编辑' ? CategoryApi.edit : '',
    getTableList: proTable.value.getTableList,
    maxHeight: '500px'
  }
  switch (title) {
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

// 导出列表
const downloadFile = async () => {
  ElMessageBox.confirm('确认导出分类数据?', '温馨提示', { type: 'warning' }).then(() => useDownload(CategoryApi.export, '分类列表', proTable.value?.searchParam))
}
</script>
