<template>
  <Dialog :model-value="dialogVisible" :title="dialogProps.title" :fullscreen="dialogProps.fullscreen" :max-height="dialogProps.maxHeight" :cancel-dialog="cancelDialog">
    <div :style="'width: calc(100% - ' + dialogProps.labelWidth! / 2 + 'px)'">
      <el-form
        ref="ruleFormRef"
        label-position="right"
        :label-width="dialogProps.labelWidth + 'px'"
        :rules="rules"
        :model="dialogProps.row"
        :disabled="dialogProps.isView"
        :hide-required-asterisk="dialogProps.isView"
      >
        <el-form-item label="版本号" prop="versionNumber">
          <el-input v-model="dialogProps.row!.versionNumber" placeholder="请输入版本号" clearable></el-input>
        </el-form-item>
        <el-form-item label="版本描述" prop="description">
          <WangEditor v-model:value="dialogProps.row!.description" height="300" :disabled="dialogProps.isView" :hide-tool-bar="dialogProps.isView" />
        </el-form-item>
        <el-form-item label="发布时间" prop="releaseTime">
          <el-date-picker v-model="dialogProps.row!.releaseTime" type="datetime" placeholder="请选择发布时间" clearable></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <slot name="footer">
        <el-button @click="cancelDialog">取消</el-button>
        <el-button type="primary" v-show="!dialogProps.isView" @click="handleSubmit">确定</el-button>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { Dialog } from '@/components/Dialog'
import WangEditor from '@/components/WangEditor/index.vue'

interface DialogProps {
  title: string
  isView: boolean
  fullscreen?: boolean
  row: any
  labelWidth?: number
  maxHeight?: number | string
  api?: (params: any) => Promise<any>
  getTableList?: () => Promise<any>
}
const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  isView: false,
  title: '',
  row: {},
  labelWidth: 160,
  fullscreen: true,
  maxHeight: '500px'
})

// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  // 处理发布时间格式
  if (params.row?.releaseTime) {
    params.row.releaseTime = new Date(params.row.releaseTime)
  }
  params.row = { ...dialogProps.value.row, ...params.row }
  dialogProps.value = { ...dialogProps.value, ...params }
  dialogVisible.value = true
}

defineExpose({
  acceptParams
})
const rules = reactive({
  versionNumber: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
  description: [{ required: true, message: '请输入版本描述', trigger: 'blur' }],
  releaseTime: [{ required: true, message: '请选择发布时间', trigger: 'blur' }]
})
const ruleFormRef = ref<FormInstance>()

const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      await dialogProps.value.api!(dialogProps.value.row)
      ElMessage.success({ message: `${dialogProps.value.title}成功！` })
      dialogProps.value.getTableList!()
      dialogVisible.value = false
      ruleFormRef.value!.resetFields()
      cancelDialog(true)
    } catch (error) {
      console.log(error)
    }
  })
}
const cancelDialog = (isClean?: boolean) => {
  dialogVisible.value = false
  let condition = ['查看', '编辑']
  if (condition.includes(dialogProps.value.title) || isClean) {
    dialogProps.value.row = {}
    ruleFormRef.value!.resetFields()
  }
}
</script>
