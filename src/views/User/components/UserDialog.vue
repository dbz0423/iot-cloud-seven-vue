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
        <el-form-item label="用户名" prop="nickname">
          <el-input v-model="dialogProps.row!.nickname" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="dialogProps.title !== '新增'" label="账号" prop="username">
          <el-input v-model="dialogProps.row!.username" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar">
          <UploadImg v-model:image-url="dialogProps.row!.avatar" width="135px" height="135px" :file-size="5">
            <template #empty>
              <el-icon><Avatar /></el-icon>
              <span>请上传头像</span>
            </template>
            <template #tip> 头像大小不能超过 5M </template>
          </UploadImg>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="dialogProps.row!.mobile" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item label="对应租户" prop="tenantName">
          <el-input v-model="dialogProps.tenantName" placeholder="租户" class="w-full"> </el-input>
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
import UploadImg from '@/components/Upload/Img.vue'
import { useAppStoreWithOut } from '@/store/modules/app'

interface DialogProps {
  title: string
  isView: boolean
  fullscreen?: boolean
  row: any
  labelWidth?: number
  maxHeight?: number | string
  api?: (params: any) => Promise<any>
  getTableList?: () => Promise<any>
  tenantId: number
  tenantName: string
  username: string
}

const dialogVisible = ref(false)

const dialogProps = ref<DialogProps>({
  isView: false,
  title: '',
  row: {},
  labelWidth: 160,
  fullscreen: true,
  maxHeight: '500px',
  tenantId: 0,
  tenantName: '',
  username: ''
})
const appStore = useAppStoreWithOut()
// 接收父组件传过来的参数
const acceptParams = (params: DialogProps): void => {
  params.row = { ...dialogProps.value.row, ...params.row }
  dialogProps.value = { ...dialogProps.value, ...params, tenantId: appStore.userInfo.tenantId, tenantName: appStore.userInfo.tenantName }
  // console.log('dialogProps', dialogProps.value)
  dialogVisible.value = true
}

defineExpose({
  acceptParams
})

const rules = reactive({
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    {
      min: 2,
      max: 20,
      message: '长度在 2 到 20 个字符',
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur'
    }
  ],
  avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }]
})
const ruleFormRef = ref<FormInstance>()

const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      // console.log('dialogPropsaaaaaaaaaaaa', dialogProps.value.api)
      const params = {
        ...dialogProps.value.row,
        tenantId: dialogProps.value.tenantId
      }
      console.log('dialogPropsbbbbbbbbbbbb', params)
      await dialogProps.value.api!(params)
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

<style scoped lang="less"></style>
