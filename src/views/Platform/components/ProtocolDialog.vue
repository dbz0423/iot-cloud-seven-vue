<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogProps.title"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :draggable="true"
    :close-on-press-escape="false"
    width="800px"
  >
    <el-form
      ref="ruleFormRef"
      label-position="right"
      label-width="100px"
      :rules="rules"
      :model="dialogProps.row"
      :disabled="dialogProps.isView"
      :hide-required-asterisk="dialogProps.isView"
    >
      <el-form-item label="协议名称" prop="name">
        <el-input v-model="dialogProps.row!.name" placeholder="请输入协议名称" />
      </el-form-item>
      <el-form-item label="协议内容" prop="content">
        <WangEditor v-model:value="dialogProps.row!.content" height="400px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button v-show="!dialogProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="protocolDialog">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import WangEditor from '@/components/WangEditor/index.vue'

interface DialogProps {
  title: string
  row: any
  api?: (params: any) => Promise<any>
  getTableList?: () => void
  isView?: boolean
  maxHeight?: string
}

const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()

// 表单校验规则
const rules = reactive({
  name: [{ required: true, message: '请输入协议名称' }],
  content: [{ required: true, message: '请输入协议内容' }]
})

// 接收父组件参数
const dialogProps = reactive<DialogProps>({
  title: '',
  row: {},
  api: undefined,
  getTableList: undefined,
  isView: false
})
const acceptParams = (params: DialogProps) => {
  Object.assign(dialogProps, params)
  dialogVisible.value = true
}

// 提交数据（新增/编辑）
const handleSubmit = async () => {
  await ruleFormRef.value?.validate()
  const submitData = { ...dialogProps.row }
  delete submitData.createTime
  await dialogProps.api!(submitData)
  ElMessage.success(`${dialogProps.title}成功！`)
  dialogProps.getTableList!()
  dialogVisible.value = false
}

defineExpose({
  acceptParams
})
</script>

<style scoped lang="less">
:deep(.el-dialog__body) {
  padding: 0 20px;
}
</style>
