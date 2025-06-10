<template>
  <el-dialog v-model="dialogVisible" :title="title" width="500px" :close-on-click-modal="false" append-to-body @close="handleClose">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
      <el-form-item label="场景名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入场景名称" />
      </el-form-item>
      <el-form-item label="场景状态" prop="status">
        <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="场景标识" prop="sceneCode">
        <el-input v-model="formData.sceneCode" placeholder="请输入场景标识" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, defineEmits, defineExpose } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { addScene, updateScene } from '@/api/modules/scene'

const dialogVisible = ref(false)
const title = ref('新增场景')
const formRef = ref<FormInstance>()

const formData = reactive({
  id: undefined,
  name: '',
  status: 1,
  sceneCode: '',
  remark: ''
})

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入场景名称', trigger: 'blur' }],
  sceneCode: [{ required: true, message: '请输入场景标识', trigger: 'blur' }]
})

const emit = defineEmits(['success'])

const openDialog = (rowData?: any) => {
  dialogVisible.value = true
  if (rowData?.id) {
    title.value = '编辑场景'
    Object.assign(formData, rowData)
  } else {
    title.value = '新增场景'
    formRef.value?.resetFields()
    Object.assign(formData, { id: undefined, name: '', status: 1, sceneCode: '', remark: '' })
  }
}

const handleClose = () => {
  dialogVisible.value = false
}

const handleSubmit = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return
  try {
    if (formData.id) {
      await updateScene(formData as any)
      ElMessage.success('更新成功')
    } else {
      await addScene(formData)
      ElMessage.success('新增成功')
    }
    emit('success')
    handleClose()
  } catch (error) {
    console.error(error)
  }
}

defineExpose({
  openDialog
})
</script>
