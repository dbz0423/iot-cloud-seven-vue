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
        <!-- <el-form-item label="编号" prop="id">
          <el-input v-model="dialogProps.row!.id" placeholder="请填写编号" clearable :disabled="dialogProps.isView"></el-input>
        </el-form-item> -->
        <el-form-item label="租客名称" prop="name">
          <el-input v-model="dialogProps.row!.name" placeholder="请填写租客名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="dialogProps.row!.type" filterable placeholder="请选择" class="w-full">
            <el-option label="学校" :value="1" />
            <el-option label="小区" :value="2" />
            <el-option label="驿站" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8181/share-admin-api/common/upload/img"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="dialogProps.row!.avatar" :src="dialogProps.row!.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker v-model="dialogProps.row!.createTime" type="datetime" placeholder="选择创建时间" :disabled="dialogProps.isView"></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <slot name="footer">
        <el-button type="primary" @click="cancelDialog">取消</el-button>
        <el-button type="primary" v-show="!dialogProps.isView" @click="handleSubmit">确定</el-button>
      </slot>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Dialog } from '@/components/Dialog'
import { ElMessage, FormInstance, ElUpload } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

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
  row: { id: '', name: '', type: '', avatar: '', createTime: new Date() },
  labelWidth: 160,
  fullscreen: true,
  maxHeight: '500px'
})

// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  params.row = { ...dialogProps.value.row, ...params.row }
  dialogProps.value = { ...dialogProps.value, ...params }
  dialogVisible.value = true
}

defineExpose({
  acceptParams
})

const rules = reactive({
  id: [{ required: true, message: '请填写编号', trigger: 'blur' }],
  name: [{ required: true, message: '请填写租客名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
  createTime: [{ required: true, message: '请选择创建时间', trigger: 'blur' }]
})

const ruleFormRef = ref<FormInstance>()

const handleAvatarSuccess = (res) => {
  dialogProps.value.row!.avatar = res.data.fileUrl
}

const beforeAvatarUpload = (rawFile: File) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小不能超过2MB!')
    return false
  }
  return true
}

const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      await dialogProps.value.api!(dialogProps.value.row)
      ElMessage.success({ message: `${dialogProps.value.title}成功！` })
      dialogProps.value.getTableList!()
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
    dialogProps.value.row = { id: '', name: '', type: '', avatar: '', createTime: new Date() }
    ruleFormRef.value!.resetFields()
  }
}
</script>
<style lang="less" scoped>
.isabel-option {
  white-space: pre;
}
</style>
