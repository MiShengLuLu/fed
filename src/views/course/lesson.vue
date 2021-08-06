<template>
  <section class="main-container">
    <a-card :bordered="false">
      <template #title>
        <span style="cursor: pointer" @click="$router.back()">
          <ArrowLeftOutlined />
        </span>
        <a-divider type="vertical" />
        {{ course.courseName || '内容管理' }}
        <a-divider type="vertical" />
        <a-button type="primary" @click="addSection"><PlusOutlined />添加阶段</a-button>
      </template>
      <a-spin :spinning="loading" size="large" />
      <a-tree
        show-icon
        default-expand-all
        blockNode
        multiple
      >
        <template #switcherIcon>
          <down-outlined />
        </template>
        <a-tree-node v-for="(item, i) in treeData" :key="item.id">
          <template #title>{{ item.sectionName }}</template>
          <template #icon>
            <ArrowUpOutlined style="color: #1890ff" v-if="i > 0"/>
            <a-divider type="vertical" />
            <ArrowDownOutlined style="color: #1890ff" v-if="i < treeData.length - 1" />
            <span style="display: inline-block; width: 40px"></span>
            <a-button type="dashed" @click="viewSection(item)">编辑</a-button>
            <a-divider type="vertical" />
            <a-button @click="addLesson(item)">添加课时</a-button>
            <a-divider type="vertical" />
            <a-button type="dashed" @click="viewStatus(item)">{{ getStatus(item.status) }}</a-button>
          </template>
          <template v-if="item.lessonDTOS">
            <a-tree-node v-for="($s, $i) in item.lessonDTOS" :key="$s.id">
              <template #title>{{ $s.theme }}</template>
              <template #icon>
                <ArrowUpOutlined style="color: #1890ff" v-if="$i > 0"/>
                <a-divider type="vertical" />
                <ArrowDownOutlined style="color: #1890ff" v-if="$i < item.lessonDTOS.length - 1" />
                <span style="display: inline-block; width: 40px"></span>
                <a-button @click="viewLesson(item, $s)">编辑</a-button>
                <a-divider type="vertical" />
                <a-button type="primary" @click="$router.push({
                  name: 'videoUpload',
                  params: {
                    courseId
                  },
                  query: {
                    sectionId: item.id,
                    lessonId: $s.id
                  }
                })">上传视频</a-button>
                <a-divider type="vertical" />
                <a-button @click="viewStatus(item, $s)">{{ getStatus($s.status) }}</a-button>
              </template>
            </a-tree-node>
          </template>
        </a-tree-node>
      </a-tree>
      <div v-if="!treeData" class="empty-container">暂无数据</div>
    </a-card>
  </section>
  <a-modal v-model:visible="visible" title="章节信息" @ok="updateSection">
    <a-form
      :model="sectionForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="课程名称" required>
        <a-input v-model:value="sectionForm.courseName" disabled />
      </a-form-item>
      <a-form-item label="章节名称" required>
        <a-input v-model:value="sectionForm.sectionName" />
      </a-form-item>
      <a-form-item label="章节描述">
        <a-textarea v-model:value="sectionForm.description" allow-clear />
      </a-form-item>
      <a-form-item label="章节排序">
        <input-number
          v-model:value="sectionForm.orderNum"
          @input="val => sectionForm.orderNum = Number(val)"
        />
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
        <a-input v-model:value="lessonForm.courseName" disabled></a-input>
      </a-form-item>
      <a-form-item label="章节名称">
        <a-input v-model:value="lessonForm.sectionName" disabled></a-input>
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
        <input-number
          v-model:value="lessonForm.orderNum"
          @input="val => lessonForm.orderNum = Number(val)"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="modalVisible" title="温馨提示" @ok="ok">
    <h1>当前状态：{{ getStatus(status) }}</h1>
    <a-select v-model:value="status" style="width: 200px" @change="onChange">
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
  ArrowLeftOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
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

const formDate = {
  id: null,
  courseName: '',
  sectionName: '',
  description: '',
  orderNum: null,
  status: 0
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
    ArrowLeftOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
  },
  setup (props) {
    const state = reactive({
      visible: false,
      show: false,
      sectionForm: ref<S & { courseId: number}>({
        ...formDate,
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
        courseId: Number(props.courseId),
        sectionId: null,
        status: 0
      }),
      sectionEdit: false,
      lessonEdit: false,
      sectionConfirmLoading: false,
      lessonConfirmLoading: false,
      modalVisible: false,
      status: ref<number>(),
      confirmLoading: false,
      loading: false
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
      } catch (error) {}
    }
    // 预览章节
    const viewSection = (item: Section) => {
      state.visible = true
      state.sectionEdit = true
      state.sectionForm = {
        ...item,
        ...course.value
      }
    }
    // 预览课时
    const viewLesson = ($x: Section, $y: Lesson) => {
      state.show = true
      state.lessonEdit = true
      state.lessonForm = {
        ...$y,
        sectionName: $x.sectionName || '',
        ...course.value
      }
    }
    // 状态预览
    const viewStatus = ($x: Section, $y?: Lesson) => {
      if ($y) {
        // 课时
        state.status = $y.status
        state.lessonEdit = true
        state.lessonForm = {
          ...$y,
          sectionName: $x.sectionName,
          ...course.value
        }
      } else {
        // 章节
        state.status = $x.status
        state.sectionEdit = true
        state.sectionForm = {
          ...$x,
          ...course.value
        }
      }
      state.modalVisible = true
    }
    // 更新章节
    const updateSection = async () => {
      state.sectionConfirmLoading = true
      try {
        const { data } = await saveOrUpdateSection(state.sectionForm)
        if (data.code === '000000') {
          state.visible = false
          message.success(data.mesg)
          loadData()
        } else {
          message.error(data.mesg)
        }
      } catch (error) {}
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
      } catch (error) {}
      state.lessonConfirmLoading = false
    }
    const onChange = (val: number) => {
      if (state.sectionEdit) {
        state.sectionForm.status = val
      } else {
        state.lessonForm.status = val
      }
    }
    // 状态更新
    const ok = async () => {
      state.confirmLoading = true
      try {
        if (state.lessonEdit) {
          await updateLesson()
        } else {
          await updateSection()
        }
      } catch (error) {}
      state.confirmLoading = false
      state.modalVisible = false
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
    // 添加章节
    const addSection = () => {
      state.visible = true
      state.sectionEdit = false
      state.sectionForm = {
        courseName: course.value.courseName,
        sectionName: '',
        description: '',
        orderNum: null,
        status: 0,
        courseId: Number(props.courseId)
      }
    }
    // 添加课时
    const addLesson = (section: Section) => {
      state.show = true
      state.lessonEdit = false
      state.lessonForm = {
        courseName: course.value.courseName,
        sectionName: section.sectionName,
        sectionId: section.id,
        theme: '',
        duration: null,
        isFree: false,
        orderNum: null,
        courseId: Number(props.courseId),
        status: 0
      }
    }

    return {
      ...toRefs(state),
      course,
      treeData,
      loadData,
      loadCourseById,
      viewSection,
      viewLesson,
      updateSection,
      updateLesson,
      getStatus,
      viewStatus,
      onChange,
      ok,
      addSection,
      addLesson,
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
  },
  async created () {
    this.loading = true
    try {
      await this.loadData()
      await this.loadCourseById()
    } catch (error) {}
    this.loading = false
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
.ant-spin,
.empty-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.empty-container {
  color: #c9c9c9;
}
</style>
