<template>
  <el-dialog v-model="dialogVisible" :title="dialogProps.title" width="500px" @close="handleClose">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
      <el-form-item label="场景名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入场景名称" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { Scene } from '@/api/interface'

interface DialogProps {
  title: string
  row?: Partial<Scene.ResSceneList>
  api?: (params: any) => Promise<any>
  getTableList?: () => void
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  title: '新增场景'
})
const formRef = ref<FormInstance>()
const formData = reactive({
  id: undefined as number | undefined,
  name: ''
})

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入场景名称', trigger: 'blur' }]
})

const acceptParams = (params: DialogProps) => {
  dialogProps.value = params
  dialogVisible.value = true
  if (params.row) {
    formData.id = params.row.id
    formData.name = params.row.name || ''
  }
}

const handleClose = () => {
  formRef.value?.resetFields()
  formData.id = undefined
  formData.name = ''
}

const handleSubmit = () => {
  formRef.value?.validate(async (valid) => {
    if (!valid) return
    try {
      await dialogProps.value.api!(formData)
      ElMessage.success({ message: `${dialogProps.value.title}成功！` })
      dialogProps.value.getTableList?.()
      dialogVisible.value = false
    } catch (error) {
      console.log(error)
    }
  })
}

defineExpose({
  acceptParams
})
</script>
