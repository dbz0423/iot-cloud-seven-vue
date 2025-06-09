<template>
  <el-dialog v-model="dialogVisible" :title="dialogProps.title" width="500px" destroy-on-close>
    <el-form ref="ruleFormRef" :model="dialogProps.row" :rules="rules" label-width="100px">
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="dialogProps.row.name" placeholder="请输入设备名称" />
      </el-form-item>
      <el-form-item label="设备ID" prop="deviceId">
        <el-input v-model="dialogProps.row.deviceId" placeholder="请输入设备ID" />
      </el-form-item>
      <el-form-item label="设备类型" prop="type">
        <el-select v-model="dialogProps.row.type" placeholder="请选择设备类型">
          <el-option label="灯" :value="1" />
          <el-option label="传感器" :value="2" />
          <el-option label="摄像头" :value="3" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'

interface DialogProps {
  title: string
  row: any
  api?: (params: any) => Promise<any>
  getTableList?: () => void
}

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  title: '',
  row: {}
})

const rules = reactive<FormRules>({
  name: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  deviceId: [{ required: true, message: '请输入设备ID', trigger: 'blur' }],
  type: [{ required: true, message: '请选择设备类型', trigger: 'change' }]
})

const ruleFormRef = ref<FormInstance>()

const acceptParams = (params: DialogProps) => {
  dialogProps.value = params
  dialogVisible.value = true
}

const handleSubmit = async () => {
  const form = ruleFormRef.value
  if (!form) return
  await form.validate(async (valid) => {
    if (valid) {
      try {
        await dialogProps.value.api(dialogProps.value.row)
        ElMessage.success({ message: `${dialogProps.value.title}设备成功！` })
        dialogProps.value.getTableList()
        dialogVisible.value = false
      } catch (error) {
        // console.error(error);
      }
    }
  })
}

defineExpose({
  acceptParams
})
</script>
