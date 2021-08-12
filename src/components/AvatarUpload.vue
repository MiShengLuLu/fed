<template>
  <a-upload
    v-model:file-list="fileList"
    name="avatar"
    list-type="picture-card"
    class="avatar-uploader"
    :show-upload-list="false"
    :before-upload="beforeUpload"
    :custom-request="customRequest"
    @change="handleChange"
  >
    <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
    <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">上传</div>
    </div>
  </a-upload>
</template>
<script lang="ts">
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { defineComponent, ref } from 'vue'
import { avatarUpload } from '@/services/courses'

interface FileItem {
  uid?: string;
  name?: string;
  status?: string;
  response?: string;
  url?: string;
  type?: string;
  size?: number;
  // eslint-disable-next-line
  originFileObj?: any
}

interface FileInfo {
  file: FileItem;
  fileList: FileItem[]
}

function getBase64 (img: Blob, callback: (base64Url: string) => void) {
  const reader = new FileReader()
  // eslint-disable-next-line
  reader.addEventListener('load', () => callback(reader.result as string))
  reader.readAsDataURL(img)
}
export default defineComponent({
  name: 'AvatarUpload',
  components: {
    LoadingOutlined,
    PlusOutlined
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      this.imageUrl = val
    }
  },
  setup (props, { emit }) {
    const fileList = ref<FileItem[]>([])
    const loading = ref<boolean>(false)
    const imageUrl = ref<string>(props.value)

    const handleChange = (info: FileInfo) => {
      if (info.file.status === 'uploading') {
        loading.value = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (base64Url: string) => {
          imageUrl.value = base64Url
          loading.value = false
        })
      }
      if (info.file.status === 'error') {
        loading.value = false
        message.error('upload error')
      }
    }

    const beforeUpload = (file: FileItem) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        message.error('仅支持 png、jpg 格式的图片')
      }
      const isLt2M = file.size && file.size / 1024 < 150
      if (!isLt2M) {
        message.error('图片大小不能超过 150k')
      }
      return isJpgOrPng && isLt2M
    }

    // eslint-disable-next-line
    const customRequest = async (options: any) => {
      const fd = new FormData()
      fd.append('file', options.file)
      const { data } = await avatarUpload(fd)
      if (data.code === '000000') {
        emit('input', data.data.name)
      } else {
        message.error(data.mesg)
      }
    }

    // const handleChange = ({ fileList: newFileList }: FileInfo) => {
    //   fileList.value = newFileList
    // }

    return {
      fileList,
      loading,
      imageUrl,
      beforeUpload,
      handleChange,
      customRequest
    }
  }
})
</script>
<style lang="scss" scoped>
:deep(.ant-upload) {
  width: 128px;
  height: 128px;
  overflow: hidden;

  img {
    width: 126px;
    height: 126px;
  }
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
