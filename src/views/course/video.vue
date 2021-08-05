<template>
  <section class="main-container">
    <a-card :bordered="false">
      <template #title>
        <span style="cursor: pointer" @click="$router.back()">
          <ArrowLeftOutlined />
        </span>
        <a-divider type="vertical" />
        添加视频
      </template>
      <a-form
        ref="modelRef"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="课程名称" required>
          <a-input v-model:value="modelRef.courseName" disabled />
        </a-form-item>
        <a-form-item label="章节名称" required>
          <a-input v-model:value="modelRef.sectionName" />
        </a-form-item>
        <a-form-item label="视频上传">
          <input type="file" ref="videoRef" />
        </a-form-item>
        <a-form-item label="封面上传">
          <input type="file" ref="fileRef" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handlerUpload">开始上传</a-button>
          <a-button>返回</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { Form } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { aliyunImagUploadAddressAdnAuth, aliyunVideoUploadAddressAdnAuth } from '@/services/aliyun-upload'

const { useForm } = Form

interface File {
  name: string,
  uid: number
}
interface UploadFile {
  files: Array<File>
}

export default defineComponent({
  name: 'VideoUpload',
  components: { ArrowLeftOutlined },
  setup () {
    const modelRef = reactive({
      courseName: '',
      sectionName: ''
    })
    const videoRef = ref<UploadFile>()
    const fileRef = ref<UploadFile>()
    const state = reactive({
      uploader: null,
      imageUrl: ''
    })

    const initUploader = () => {
      state.uploader = new window.AliyunUpload.Vod({
        // userID，必填，只需有值即可。
        userId: '1618139964448548',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 是否上报上传日志到视频点播，默认为true
        enableUploadProgress: true,
        // 开始上传
        // eslint-disable-next-line
        onUploadstarted: async (uploadInfo: any) => {
          console.log('onUploadstarted')

          let uploadAddressAndAuth
          // 1. 通过我们的后端获取文件上传凭证
          if (uploadInfo.isImage) {
            // 获取图片上传凭证
            const { data } = await aliyunImagUploadAddressAdnAuth()
            if (data.code === '000000') {
              state.imageUrl = data.data.imageURL
              uploadAddressAndAuth = data.data
            }
          } else {
            // 获取视频上传凭证
            const { data } = await aliyunVideoUploadAddressAdnAuth({
              fileName: uploadInfo.file.name,
              imageUrl: state.imageUrl // 确保先上传图片
            })
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data
            }
          }

          // 2. 调用 uploader.setUploadAuthAndAddress 设置上传凭证
          if (uploadInfo.isImage) {
            // eslint-disable-next-line
            (state.uploader as any).setUploadAuthAndAddress(
              uploadInfo,
              uploadAddressAndAuth,
              uploadAddressAndAuth.uploadAdress,
              uploadAddressAndAuth.imageId
            )
          } else {
            // eslint-disable-next-line
            (state.uploader as any).setUploadAuthAndAddress(
              uploadInfo,
              uploadAddressAndAuth,
              uploadAddressAndAuth.uploadAdress,
              uploadAddressAndAuth.videoId
            )
          }

          // 3. 设置好上传凭证，上传进度开始

          // 上传方式1，需要根据uploadInfo.videoId是否有值，调用视频点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          if (uploadInfo.videoId) {
            // 如果uploadInfo.videoId存在，调用刷新视频上传凭证接口
          } else {
            // 如果uploadInfo.videoId不存在，调用获取视频上传地址和凭证接口
            // 从视频点播服务获取的uploadAuth、uploadAddress和videoId，设置到SDK里
            // uploader.setUploadAuthAndAddress(
            //   uploadInfo,
            //   uploadAuth,
            //   uploadAddress,
            //   videoId
            // )
          }
        },
        // 文件上传成功
        // eslint-disable-next-line
        onUploadSucceed: function (uploadInfo: any) {
          console.log(
            'onUploadSucceed: ' +
              uploadInfo.file.name +
              ', endpoint:' +
              uploadInfo.endpoint +
              ', bucket:' +
              uploadInfo.bucket +
              ', object:' +
              uploadInfo.object
          )
        },
        // 文件上传失败
        // eslint-disable-next-line
        onUploadFailed: function (uploadInfo: any, code: any, message: any) {
          console.log(
            'onUploadFailed: file:' +
              uploadInfo.file.name +
              ',code:' +
              code +
              ', message:' +
              message
          )
        },
        // 文件上传进度，单位：字节
        // eslint-disable-next-line
        onUploadProgress: function (uploadInfo: any, totalSize: any, loadedPercent: any) {
          console.log(
            'onUploadProgress:file:' +
              uploadInfo.file.name +
              ', fileSize:' +
              totalSize +
              ', percent:' +
              Math.ceil(loadedPercent * 100) +
              '%'
          )
        },
        // 上传凭证超时
        // eslint-disable-next-line
        onUploadTokenExpired: function (uploadInfo: any) {
          console.log('onUploadTokenExpired: ', uploadInfo)
          // 实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
          // 从点播服务刷新的uploadAuth，设置到SDK里

          // uploader.resumeUploadWithAuth(uploadAuth)
        },
        // 全部文件上传结束
        // eslint-disable-next-line
        onUploadEnd: function (uploadInfo: any) {
          console.log('onUploadEnd: uploaded all the files', uploadInfo)
        }
      })
    }
    // 获取上传文件并上传
    const handlerUpload = () => {
      // 获取上传的文件
      const videoFile = videoRef.value?.files[0]
      const imageFile = fileRef.value?.files[0]
      // eslint-disable-next-line
      const uploader = state.uploader as any

      // 将用户所选的文件添加到上传列表中
      // 一旦开始上传，就会按照列表中添加的顺序开始上传
      uploader.addFile(imageFile, null, null, null, '{ "Vod": {}}')
      uploader.addFile(videoFile, null, null, null, '{ "Vod": {}}')
      // 注意：必须先上传图片再上传视频

      // 开始上传，触发 onUploadstarted 事件
      uploader.startUpload()
    }
    useForm(modelRef, {})
    return {
      modelRef,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      videoRef,
      fileRef,
      initUploader,
      handlerUpload
    }
  },
  created () {
    // 上传器初始化
    this.initUploader()
  }
})
</script>
