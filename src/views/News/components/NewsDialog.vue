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
        <el-form-item label="标题" prop="title">
          <el-input v-model="dialogProps.row!.title" placeholder="请填写标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <div v-if="dialogProps.title == '查看'" class="preview-content" v-html="dialogProps.row!.content"></div>
          <div style="border: 1px solid #ccc; width: 100%" v-else>
            <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :mode="mode"></Toolbar>
            <Editor v-model="dialogProps.row!.content" :defaultConfig="editorConfig" @on-created="handleCreated" :mode="mode" style="height: 500px; overflow-y: hidden"></Editor>
          </div>
        </el-form-item>
        <!-- <el-form-item label="封面" prop="cover">
          <el-upload
            class="avatar-uploader"
            action="http://localhost:8181/share-admin-api/common/upload/img"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload"
          >
            <img v-if="dialogProps.row!.cover" :src="dialogProps.row!.cover" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item> -->
        <el-form-item label="视频" prop="video">
          <el-upload
            class="video-uploader"
            action="http://localhost:8181/share-admin-api/common/upload/video"
            :show-file-list="false"
            :on-success="handleVideoSuccess"
            :before-upload="beforeVideoUpload"
            :on-error="handleVideoError"
          >
            <video v-if="dialogProps.row!.video" :src="dialogProps.row!.video" class="video-preview" controls></video>
            <el-icon v-else class="video-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="点赞数" prop="support">
          <el-input-number v-model="dialogProps.row!.support" placeholder="输入点赞数" :disabled="dialogProps.isView"></el-input-number>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker v-model="dialogProps.row!.createTime" type="datetime" placeholder="选择创建时间" :disabled="dialogProps.isView"></el-date-picker>
        </el-form-item>
        <el-form-item label="定时提交时间" prop="scheduledTime">
          <el-date-picker v-model="dialogProps.row!.scheduledTime" type="datetime" placeholder="选择定时提交时间" clearable></el-date-picker>
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
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { onBeforeUnmount, shallowRef } from 'vue'

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

/* wangEditor5 初始化开始 */
const baseUrl = 'http://localhost:8181'
const editorRef = shallowRef() // 编辑器实例，必须用 shallowRef
const mode = 'default'
const editorConfig = { MENU_CONF: {}, placeholder: '请输入内容...', autoFocus: false }
// 图片上传配置
editorConfig.MENU_CONF['uploadImage'] = {
  server: baseUrl + '/share-admin-api/common/upload/img',
  fieldName: 'file',
  maxFileSize: 10 * 1024 * 1024, // 10M
  allowedFileTypes: ['image/*'],
  timeout: 60 * 1000, // 60秒
  onSuccess(file: File, res: any) {
    return res.data.fileUrl // 根据实际接口返回结构调整
  },
  customInsert(res: any, insertFn: any) {
    insertFn(res.data.fileUrl, '', '')
  }
}
// 视频上传配置
editorConfig.MENU_CONF['uploadVideo'] = {
  server: baseUrl + '/share-admin-api/common/upload/video',
  fieldName: 'file',
  maxFileSize: 50 * 1024 * 1024, // 50M
  allowedFileTypes: ['video/*'],
  timeout: 300 * 1000, // 5分钟
  onSuccess(file: File, res: any) {
    return res.data.videoUrl
  },
  customInsert(res: any, insertFn: any) {
    insertFn(res.data.videoUrl, '', '')
  }
}
// 组件销毁时，也及时销毁编辑器，否则可能会造成内存泄漏
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
// 记录 editor 实例，重要！
const handleCreated = (editor) => {
  editorRef.value = editor
}
/* wangEditor5 初始化结束 */

const dialogVisible = ref(false)
const dialogProps = ref<DialogProps>({
  isView: false,
  title: '',
  row: { id: '', title: '', content: '', cover: '', video: '', createTime: new Date(), scheduledTime: null },
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
  title: [{ required: true, message: '请填写标题', trigger: 'blur' }],
  content: [{ required: true, message: '请填写内容', trigger: 'blur' }],
  cover: [{ required: true, message: '请上传封面', trigger: 'blur' }],
  createTime: [{ required: true, message: '请选择创建时间', trigger: 'blur' }],
  scheduledTime: [{ required: false }]
})

const ruleFormRef = ref<FormInstance>()

// const handleCoverSuccess = (res) => {
//   console.log(res)
//   dialogProps.value.row!.cover = res.data.fileUrl
// }

// const beforeCoverUpload = (rawFile: File) => {
//   if (rawFile.size / 1024 / 1024 > 2) {
//     ElMessage.error('封面大小不能超过2MB!')
//     return false
//   }
//   return true
// }

const handleVideoSuccess = (res) => {
  console.log(res)
  dialogProps.value.row!.video = res.data.videoUrl
}

const beforeVideoUpload = (rawFile: File) => {
  if (rawFile.size / 1024 / 1024 > 50) {
    ElMessage.error('视频大小不能超过50MB!')
    return false
  }
  return true
}

const handleVideoError = (err) => {
  console.error(err)
  ElMessage.error('视频上传失败')
}

const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      const scheduledTime = dialogProps.value.row!.scheduledTime
      const now = new Date()

      if (!scheduledTime) {
        // 如果定时时间为空，立即提交
        await dialogProps.value.api!(dialogProps.value.row)
        ElMessage.success({ message: `${dialogProps.value.title}成功！` })
        dialogProps.value.getTableList!()
        cancelDialog(true)
      } else {
        const diff = scheduledTime.getTime() - now.getTime()

        if (diff <= 0) {
          // 如果当前时间大于或等于选择的时间，立即提交
          await dialogProps.value.api!(dialogProps.value.row)
          ElMessage.success({ message: `${dialogProps.value.title}成功！` })
          dialogProps.value.getTableList!()
          cancelDialog(true)
        } else {
          // 如果当前时间小于选择的时间，等待直到时间到
          ElMessage.info({ message: `将在${diff / 1000}秒后提交表单`, duration: 3000 })
          await new Promise((resolve) => setTimeout(resolve, diff))
          await dialogProps.value.api!(dialogProps.value.row)
          ElMessage.success({ message: `${dialogProps.value.title}成功！` })
          dialogProps.value.getTableList!()
          cancelDialog(true)
        }
      }
    } catch (error) {
      console.log(error)
    }
  })
}

const cancelDialog = (isClean?: boolean) => {
  dialogVisible.value = false
  let condition = ['查看', '编辑']
  if (condition.includes(dialogProps.value.title) || isClean) {
    dialogProps.value.row = { id: '', title: '', content: '', cover: '', video: '', createTime: new Date(), scheduledTime: null }
    ruleFormRef.value!.resetFields()
  }
}
</script>

<style scoped>
.preview-content {
  border: 2px solid #f5f7fa;
  border-radius: 5px;
  background-color: #f5f7fa;
  width: 100%;
  padding: 16px;
  line-height: 1.6;
}

.video-preview {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.video-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  line-height: 200px;
  text-align: center;
}
</style>
