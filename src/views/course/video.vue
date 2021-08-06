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
        ref="formRef"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="formState"
      >
        <a-form-item label="课程名称" required>
          <a-input v-model:value="formState.courseName" disabled />
        </a-form-item>
        <a-form-item label="章节名称" required>
          <a-input v-model:value="formState.sectionName" disabled />
        </a-form-item>
        <a-form-item label="视频上传">
          <input type="file" ref="videoRef" />
          <div style="height: 20px; display: flex">
            <span style="word-break: keep-all" v-if="videoProgress">视频上传进度：</span>
            <a-progress status="active" v-if="videoProgress" :percent="videoProgress" size="small" />
          </div>
        </a-form-item>
        <a-form-item label="封面上传">
          <input type="file" ref="fileRef" />
          <div style="height: 20px; display: flex">
            <span style="word-break: keep-all" v-if="imageProgress">文件上传进度：</span>
            <a-progress status="active" v-if="imageProgress" :percent="imageProgress" size="small" />
          </div>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <div style="height: 20px; display: flex; padding-top: 10px">
            <span style="word-break: keep-all" v-if="transCodeProgress">转码进度：</span>
            <a-progress status="active" v-if="transCodeProgress && transCodeProgress < 100" :percent="transCodeProgress" size="small" />
            <span v-if="transCodeProgress === 100">已完成</span>
          </div>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="handlerUpload">开始上传</a-button>
          <a-divider type="vertical" />
          <a-button @click="$router.back()">返回</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { aliyunImagUploadAddressAdnAuth, aliyunVideoUploadAddressAdnAuth, aliyunTransCode, aliyunTransCodePercent } from '@/services/aliyun-upload'
import { getCourseById, getBySectionId } from '@/services/courses'
import { useRoute } from 'vue-router'

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
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const formRef = ref()
    const videoRef = ref<UploadFile>()
    const fileRef = ref<UploadFile>()
    const state = reactive({
      formState: ref({
        courseName: '',
        sectionName: ''
      }),
      uploader: null,
      imageUrl: '',
      videoId: '',
      imageProgress: 0, // 图片上传进度
      videoProgress: 0, // 视频上传进度
      transCodeProgress: 0 // 视频转码进度
    })
    const $route = useRoute()

    const loadCourseById = async () => {
      try {
        const { data } = await getCourseById(Number(props.courseId))
        if (data.code === '000000') {
          state.formState.courseName = data.data.courseName
        }
      } catch (error) {}
    }
    const loadSectionById = async () => {
      try {
        const { data } = await getBySectionId(Number($route.query.sectionId))
        if (data.code === '000000') {
          state.formState.sectionName = data.data.sectionName
        }
      } catch (error) {}
    }

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
              state.videoId = uploadAddressAndAuth.videoId
            }
          }

          // 2. 调用 uploader.setUploadAuthAndAddress 设置上传凭证
          // eslint-disable-next-line
          ;(state.uploader as any).setUploadAuthAndAddress(
            uploadInfo,
            uploadAddressAndAuth.uploadAuth,
            uploadAddressAndAuth.uploadAddress,
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId
          )

          // 3. 设置好上传凭证，上传进度开始

          // 需要根据uploadInfo.videoId是否有值，调用视频点播的不同接口获取uploadauth和uploadAddress，如果videoId有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          // 从视频点播服务获取的uploadAuth、uploadAddress和videoId，设置到SDK里
          // uploader.setUploadAuthAndAddress(
          //   uploadInfo,
          //   uploadAuth,
          //   uploadAddress,
          //   videoId
          // )
        },
        // 文件上传成功
        // eslint-disable-next-line
        onUploadSucceed: function (uploadInfo: any) {
          console.log('onUploadSucceed')
        },
        // 文件上传失败
        // eslint-disable-next-line
        onUploadFailed: function (uploadInfo: any, code: any, message: any) {
          console.log('onUploadFailed: ', message)
        },
        // 文件上传进度，单位：字节
        // eslint-disable-next-line
        onUploadProgress: function (uploadInfo: any, totalSize: any, loadedPercent: any) {
          console.log('onUploadProgress: ', Math.ceil(loadedPercent * 100) + '%')
          if (uploadInfo.isImage) {
            state.imageProgress = Math.ceil(loadedPercent * 100)
          } else {
            state.videoProgress = Math.ceil(loadedPercent * 100)
          }
        },
        // 上传凭证超时
        // eslint-disable-next-line
        onUploadTokenExpired: function (uploadInfo: any) {
          console.log('onUploadTokenExpired')
          // 实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
          // 从点播服务刷新的uploadAuth，设置到SDK里

          // uploader.resumeUploadWithAuth(uploadAuth)
        },
        // 全部文件上传结束
        // eslint-disable-next-line
        onUploadEnd: async (uploadInfo: any) => {
          console.log('onUploadEnd: uploaded all the files', uploadInfo)
          if (videoRef.value) {
            // 视频转码
            const { data } = await aliyunTransCode({
              lessonId: Number($route.query.lessonId),
              coverImageUrl: state.imageUrl,
              fileId: state.videoId,
              fileName: videoRef.value.files[0].name
            })
            console.log('视频转码: ', data)
            // 转码进度轮询
            const timer = await setInterval(async () => {
              const { data } = await aliyunTransCodePercent(Number($route.query.lessonId))
              if (data.code === '000000') {
                state.transCodeProgress = data.data
                if (data.data === 100) {
                  console.log('转码成功')
                  clearInterval(timer)
                }
              }
            }, 10000)
            message.success('视频上传成功啦')
          }
        }
      })
    }
    // 获取上传文件并上传
    const handlerUpload = () => {
      // eslint-disable-next-line
      if (!(fileRef.value as any).files) return message.warning('请上传封面')
      // eslint-disable-next-line
      if (!(videoRef.value as any).files) return message.warning('请上传视频')
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

    return {
      formRef,
      ...toRefs(state),
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      loadCourseById,
      loadSectionById,
      videoRef,
      fileRef,
      initUploader,
      handlerUpload
    }
  },
  created () {
    // 上传器初始化
    this.initUploader()

    this.loadCourseById()
    this.loadSectionById()
  }
})
</script>

<style lang="scss" scoped>
@import url('../../styles/index.scss');
.ant-card {
  height: 100%;
}
.ant-card-body {
  height: calc(100% - 65px);
  padding-bottom: 0;
  position: relative;
}
</style>
