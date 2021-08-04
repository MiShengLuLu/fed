<template>
  <section class="main-container">
    <a-card :bordered="false">
      <template #title>
        <span style="cursor: pointer" @click="$router.back()">
          <ArrowLeftOutlined />
        </span>
        <a-divider type="vertical" />
        课时管理
        <a-divider type="vertical" />
        <a-button type="primary" @click="visible = true, sectionEdit = false"><PlusOutlined />添加阶段</a-button>
      </template>
      <a-tree
        show-icon
        default-expand-all
        blockNode
      >
        <a-tree-node v-for="item in treeData" :key="item.id">
          <template #switcherIcon v-if="item.lessonDTOS">
            <down-outlined />
          </template>
          <template #title>{{ item.sectionName }}</template>
          <template #icon>
            <a-button type="dashed" @click="viewSection(item.id)">编辑</a-button>
            <a-divider type="vertical" />
            <a-button>添加课时</a-button>
            <a-divider type="vertical" />
            <a-button type="dashed">{{ getStatus(item.status) }}</a-button>
          </template>
          <template v-if="item.lessonDTOS">
            <a-tree-node v-for="$s in item.lessonDTOS" :key="$s.id">
              <template #title>{{ $s.theme }}</template>
              <template #icon>
                <a-button @click="viewLesson(item.id, $s.id)">编辑</a-button>
                <a-divider type="vertical" />
                <a-button type="primary">上传视频</a-button>
                <a-divider type="vertical" />
                <a-button>{{ getStatus($s.status) }}</a-button>
              </template>
            </a-tree-node>
          </template>
        </a-tree-node>
      </a-tree>
    </a-card>
  </section>
  <a-modal v-model:visible="visible" title="章节信息" @ok="updateSection">
    <a-form
      :model="sectionForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="课程名称" required>
        <a-input v-model:value="sectionForm.courseName" :disabled="sectionEdit" />
      </a-form-item>
      <a-form-item label="章节名称" required>
        <a-input v-model:value="sectionForm.sectionName" />
      </a-form-item>
      <a-form-item label="章节描述">
        <a-textarea v-model:value="sectionForm.description" allow-clear />
      </a-form-item>
      <a-form-item label="章节排序">
        <input-number v-model:value="sectionForm.orderNum" @input="val => sectionForm.orderNum = Number(val)" :disabled="sectionEdit" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="show" title="课时信息" @ok="updateLesson">
    <a-form
      :model="lessonForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="课程名称" required>
        <a-input v-model:value="lessonForm.courseName" :disabled="lessonEdit"></a-input>
      </a-form-item>
      <a-form-item label="章节名称">
        <a-input v-model:value="lessonForm.sectionName" :disabled="lessonEdit"></a-input>
      </a-form-item>
      <a-form-item label="课时名称">
        <a-input v-model:value="lessonForm.theme"></a-input>
      </a-form-item>
      <a-form-item label="时长">
        <a-input addon-after="分钟" v-model:value="lessonForm.duration"></a-input>
      </a-form-item>
      <a-form-item label="是否开放试听">
        <a-switch v-model:checked="lessonForm.isFree"></a-switch>
      </a-form-item>
      <a-form-item label="课时排序">
        <input-number v-model:value="lessonForm.orderNum" @input="val => lessonForm.orderNum = Number(val)" :disabled="lessonEdit" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="modalVisible">
    <a-select v-model="status">
      <a-select-option :value="0">已隐藏</a-select-option>
      <a-select-option :value="1">待更新</a-select-option>
      <a-select-option :value="2">已更新</a-select-option>
    </a-select>
  </a-modal>
</template>

<script lang="ts">
import {
  DownOutlined,
  PlusOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons-vue'
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { getSectionAndLesson, getCourseById, saveOrUpdateSection, saveOrUpdate } from '@/services/courses'
import InputNumber from '@/components/input-number.vue'
import { Section, Lesson } from '@/types/courses'
import { message } from 'ant-design-vue'

interface S extends Section {
  courseName: string
}

interface L extends Lesson {
  courseName: string;
  sectionName: string
}

export default defineComponent({
  name: 'Lesson',
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  components: {
    DownOutlined,
    InputNumber,
    PlusOutlined,
    ArrowLeftOutlined
  },
  setup (props) {
    const state = reactive({
      visible: false,
      show: false,
      sectionForm: ref<S & { courseId: number}>({
        id: null,
        courseName: '',
        sectionName: '',
        description: '',
        orderNum: null,
        courseId: Number(props.courseId)
      }),
      lessonForm: ref<L & { courseId: number }>({
        id: null,
        courseName: '',
        sectionName: '',
        theme: '',
        duration: null,
        isFree: false,
        orderNum: null,
        courseId: Number(props.courseId)
      }),
      sectionEdit: false,
      lessonEdit: false,
      sectionConfirmLoading: false,
      lessonConfirmLoading: false,
      modalVisible: false,
      status: ref<number | null>()
    })
    const treeData = ref<Section[]>([])
    const course = ref<{
      courseName: string
    }>({
      courseName: ''
    })
    // 获取课程模块课时
    const loadData = async () => {
      const { data } = await getSectionAndLesson(Number(props.courseId))
      if (data.code === '000000') {
        treeData.value = data.data
      }
    }
    const loadCourseById = async () => {
      try {
        const { data } = await getCourseById(Number(props.courseId))
        if (data.code === '000000') {
          course.value.courseName = data.data.courseName
        }
      } catch (error) {
        console.log(error)
      }
    }
    // 预览章节
    const viewSection = (id: number) => {
      state.visible = true
      state.sectionEdit = true
      const item = treeData.value.filter(item => item.id === id)
      state.sectionForm = {
        ...item[0],
        ...course.value
      }
    }
    // 预览课时
    const viewLesson = (sectionId: number, id: number) => {
      state.show = true
      state.lessonEdit = true
      const item = treeData.value.filter(item => item.id === sectionId)
      const $item = item[0].lessonDTOS?.filter($item => $item.id === id) || []
      state.lessonForm = {
        ...$item[0],
        sectionName: item[0].sectionName || '',
        ...course.value
      }
    }
    // 更新章节
    const updateSection = async () => {
      state.sectionConfirmLoading = true
      try {
        const { data } = await saveOrUpdateSection({ ...state.sectionForm, ...course })
        if (data.code === '000000') {
          state.visible = false
          message.success(data.mesg)
        } else {
          message.error(data.mesg)
        }
      } catch (error) {
        console.log(error)
      }
      state.sectionConfirmLoading = false
    }
    // 更新课时
    const updateLesson = async () => {
      state.lessonConfirmLoading = true
      try {
        const { data } = await saveOrUpdate(state.lessonForm)
        if (data.code === '000000') {
          state.show = false
          message.success(data.mesg)
        } else {
          message.error(data.mesg)
        }
      } catch (error) {
        console.log(error)
      }
      state.lessonConfirmLoading = false
    }

    const getStatus = (v: number) => {
      switch (v) {
        case 0:
          return '已隐藏'
        case 1:
          return '待更新'
        case 2:
          return '已更新'
        default:
          break
      }
    }

    return {
      ...toRefs(state),
      // selectedKeys,
      treeData,
      loadData,
      loadCourseById,
      viewSection,
      viewLesson,
      updateSection,
      updateLesson,
      getStatus,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
  },
  created () {
    this.loadData()
    this.loadCourseById()
  }
})
</script>

<style lang="scss" scoped>
@import url('../../styles/index.scss');

.ant-card {
  height: 100%;
}
:deep(.ant-card-body) {
  height: calc(100% - 65px);
  padding-bottom: 0;
}
:deep(.ant-tree-node-content-wrapper) {
  width: calc(100% - 24px);
  background: #fff !important;
  height: auto !important;
  border-bottom: 1px solid #f6f6f6;

  .ant-tree-iconEle {
    float: right;
    width: fit-content;
  }

  .ant-tree-title {
    height: 32px;
    line-height: 32px;
    max-width: 400px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
  }
}
</style>
