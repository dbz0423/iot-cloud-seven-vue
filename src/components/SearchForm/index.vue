<template>
  <div class="card table-search" v-if="columns.length">
    <el-form ref="formRef" :model="searchParam">
      <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">
        <GridItem v-for="(item, index) in columns" :key="item.prop" v-bind="getResponsive(item)" :index="index" style="display: flex; grid-gap: 80px; width: 600px">
          <el-form-item :label="`${item.label} :`">
            <SearchFormItem :column="item" :search-param="searchParam" />
          </el-form-item>
          <el-form-item label="类型" prop="type" class="w-50">
            <el-select filterable placeholder="请选择" class="w-full" v-model="searchParam.type" @change="handleTypeChange">
              <el-option label="全部" :value="100" />
              <el-option label="最新动态" :value="0" />
              <el-option label="通知公告" :value="1" />
              <el-option label="设备监控" :value="2" />
              <el-option label="智慧教室" :value="3" />
            </el-select>
          </el-form-item>
        </GridItem>
        <GridItem suffix>
          <div class="operation">
            <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
            <el-button :icon="RefreshLeft" type="warning" @click="reset">重置</el-button>
            <el-button v-if="showCollapse" type="primary" class="search-isOpen" @click="collapsed = !collapsed">
              {{ collapsed ? '展开' : '合并' }}
              <el-icon class="el-icon--right">
                <component :is="collapsed ? ArrowDown : ArrowUp"></component>
              </el-icon>
            </el-button>
          </div>
        </GridItem>
      </Grid>
    </el-form>
  </div>
</template>

<script setup lang="ts" name="SearchForm">
import { computed, ref } from 'vue'
import { ColumnProps } from '@/components/ProTable/interface'
import { BreakPoint } from '@/components/Grid/interface'
import { RefreshLeft, Search, ArrowDown, ArrowUp } from '@element-plus/icons-vue'
import SearchFormItem from './components/SearchFormItem.vue'
import Grid from '@/components/Grid/index.vue'
import GridItem from '@/components/Grid/components/GridItem.vue'

interface ProTableProps {
  /** 搜索配置列 */
  columns?: ColumnProps[]
  /** 搜索参数 */
  searchParam?: { [key: string]: any }
  searchCol: number | Record<BreakPoint, number>
  /** 搜索方法 */
  search: (params: any) => void
  /** 重置方法 */
  reset: (params: any) => void
}

// 默认值
const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  searchParam: () => ({})
})

// 获取响应式设置
const getResponsive = (item: ColumnProps) => {
  return {
    span: item.search?.span,
    offset: item.search?.offset ?? 0,
    xs: item.search?.xs,
    sm: item.search?.sm,
    md: item.search?.md,
    lg: item.search?.lg,
    xl: item.search?.xl
  }
}

// 是否默认折叠搜索项
const collapsed = ref(true)

// 获取响应式断点
const gridRef = ref()
const breakPoint = computed<BreakPoint>(() => gridRef.value?.breakPoint)

// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  let show = false
  props.columns.reduce((prev, current) => {
    prev += (current.search![breakPoint.value]?.span ?? current.search?.span ?? 1) + (current.search![breakPoint.value]?.offset ?? current.search?.offset ?? 0)
    if (typeof props.searchCol !== 'number') {
      if (prev >= props.searchCol[breakPoint.value]) show = true
    } else {
      if (prev >= props.searchCol) show = true
    }
    return prev
  }, 0)
  return show
})

// 下拉框分类搜索
const handleTypeChange = () => {
  // 触发搜索
  props.search(props.searchParam)
}
</script>
