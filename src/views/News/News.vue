<template>
  <!-- <button @click="testChange">更新</button> -->
  <div class="table-box">
    <ProTable ref="proTable" title="资讯列表" :columns="columns" :requestApi="getTableList" :initParam="initParam" :dataCallback="dataCallback">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-hasPermi="['news:new:add']">新增资讯</el-button>
        <el-button type="danger" :icon="Minus" @click="batchDelete()">删除资讯</el-button>
        <el-button type="success" :icon="RefreshRight" @click="updateChange()">更新资讯</el-button>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)" v-hasPermi="['news:new:add']">查看</el-button>
        <el-button type="warning" link :icon="EditPen" @click="openDrawer('编辑', scope.row)" v-hasPermi="['news:new:add']">编辑</el-button>
        <el-button type="danger" link :icon="Delete" @click="deleteRow(scope.row)" v-hasPermi="['news:new:add']">删除</el-button>
      </template>
    </ProTable>
    <NewsDialog ref="dialogRef" />
  </div>
</template>

<script setup lang="ts" name="SysRole">
import { ref, reactive, h } from 'vue'
import { News } from '@/api/interface'
import { ColumnProps } from '@/components/ProTable/interface'
import { useHandleData } from '@/hooks/useHandleData'
import ProTable from '@/components/ProTable/index.vue'
import NewsDialog from './components/NewsDialog.vue'
import { CirclePlus, Delete, EditPen, View, Minus, RefreshRight } from '@element-plus/icons-vue'
import { getNewsPage, addNews, editNews, deleteNews, getNews } from '@/api/modules/news'
import { ElImage, ElButton, ElMessage, ElTag } from 'element-plus'
import dayjs from 'dayjs'
import { useSelection } from '@/hooks/useSelection'

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref()

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({})

const updateChange = () => {
  const res = getNews()
  console.log('更新信息' + res)
}
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 datalist && total 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  }
}
const { selectedListIds } = useSelection()
console.log(selectedListIds)
const batchDelete = async () => {
  if (selectedListIds.value.length === 0) {
    ElMessage.warning('请先选择要删除的资讯')
    return
  }
  try {
    await useHandleData(deleteNews, selectedListIds.value, '删除选中资讯')
    proTable.value.getTableList()
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除失败')
  }
}
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  let newParams = { ...params }
  const list = getNewsPage(newParams)
  return list
}

// 表格配置项
const columns: ColumnProps[] = [
  { type: 'selection', fixed: 'left', width: 60 },
  {
    prop: 'id',
    label: '编号'
  },
  {
    prop: 'title',
    label: '标题',
    search: { el: 'input' }
  },
  {
    prop: 'top',
    label: '置顶',
    render: (scope) => {
      const contentMap = {
        0: '是',
        1: '否'
      }
      return h(ElTag, { type: scope.row.top == 0 ? 'success' : 'info' }, { default: () => contentMap[scope.row.top] || '未知' })
    }
  },
  {
    prop: 'cover',
    label: '封面',
    width: 200,
    render: (scope) => {
      const getFirstImage = (html: string) => {
        const doc = new DOMParser().parseFromString(html, 'text/html')
        return doc.querySelector('img')?.src || 'https://img95.699pic.com/desgin_photo/40186/9231_detail.jpg!detail860/fw/820/crop/0x0a0a1309/quality/90'
      }
      return h(ElImage, {
        style: { width: '90%', height: '80px' },
        src: getFirstImage(scope.row.content),
        fit: 'cover',
        previewSrcList: [getFirstImage(scope.row.content)]
      })
    }
  },
  {
    prop: 'video',
    label: '视频',
    width: 300,
    render: (scope) => {
      return scope.row.video
        ? h('video', {
            style: {
              width: '100%',
              height: '120px',
              objectFit: 'cover',
              borderRadius: '4px'
            },
            src: scope.row.video,
            controls: true,
            preload: 'metadata'
          })
        : h(ElTag, { type: 'info', style: { marginLeft: '10px' } }, '无视频内容')
    }
  },
  {
    prop: 'support',
    label: '点赞数'
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 132,
    render: (scope) => {
      return dayjs(scope.row.createTime).format('YYYY-MM-DD')
    }
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 300 }
]
// 删除单个
const deleteRow = async (params: News.ResNewsList) => {
  await useHandleData(deleteNews, [params.id], `删除【${params.title}资讯`)
  proTable.value.getTableList()
}

// 打开 drawer(新增、查看、编辑)
const dialogRef = ref()
const openDrawer = (title: string, row: Partial<News.ResNewsList> = {}) => {
  let params = {
    title,
    row: { ...row },
    isView: title === '查看',
    api: title === '新增' ? addNews : title === '编辑' ? editNews : '',
    getTableList: proTable.value.getTableList
  }
  dialogRef.value.acceptParams(params)
}
</script>
