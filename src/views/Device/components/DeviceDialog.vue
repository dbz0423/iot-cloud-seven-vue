<template>
  <el-dialog v-model="dialogVisible" :title="title" width="500px" :close-on-click-modal="false" append-to-body @close="handleClose">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px">
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="设备ID" prop="deviceId">
        <el-input v-model="formData.deviceId" placeholder="请输入设备ID" />
      </el-form-item>
      <el-form-item label="设备类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择设备类型">
          <el-option label="灯" :value="1" />
          <el-option label="传感器" :value="2" />
          <el-option label="摄像头" :value="3" />
        </el-select>
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
import { addDevice, updateDevice } from '@/api/modules/device'

const dialogVisible = ref(false)
const title = ref('新增设备')
const formRef = ref<FormInstance>()

const formData = reactive({
  id: undefined,
  name: '',
  status: 1,
  deviceCode: '',
  remark: '',
  type: null,
  deviceId: ''
})

const formRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  deviceCode: [{ required: true, message: '请输入设备标识', trigger: 'blur' }],
  type: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
  deviceId: [{ required: true, message: '请输入设备ID', trigger: 'blur' }]
})

const emit = defineEmits(['success'])

const openDialog = (rowData?: any) => {
  dialogVisible.value = true
  if (rowData?.id) {
    title.value = '编辑设备'
    Object.assign(formData, rowData)
  } else {
    title.value = '新增设备'
    formRef.value?.resetFields()
    Object.assign(formData, { id: undefined, name: '', status: 1, deviceCode: '', remark: '', type: null, deviceId: '' })
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
      await updateDevice(formData as any)
      ElMessage.success('更新成功')
    } else {
      await addDevice(formData as any)
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
