<template>
  <section class="main-container">
    <a-card :bordered="false">
      <template #title>
        <ArrowLeftOutlined style="cursor: pointer" @click="$router.back()" />
        <a-divider type="vertical" />
        新增课程
      </template>
      <a-steps v-model:current="current">
        <a-step title="基本信息">
          <template #icon>
            <EditOutlined />
          </template>
        </a-step>
        <a-step title="销售信息">
          <template #icon>
            <AreaChartOutlined />
          </template>
        </a-step>
        <a-step title="秒杀活动">
          <template #icon>
            <AccountBookOutlined />
          </template>
        </a-step>
        <a-step title="课程详情">
          <template #icon>
            <ContainerOutlined />
          </template>
        </a-step>
      </a-steps>
      <a-divider />
      <a-form
        ref="formRef"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :model="formState"
        :rules="rules"
      >
        <template v-if="current === 0">
          <a-form-item label="名称" name="courseName" required>
            <a-input v-model:value="formState.courseName" />
          </a-form-item>
          <a-form-item label="简介" name="brief" required>
            <a-textarea v-model:value="formState.brief" />
          </a-form-item>
          <a-form-item label="讲师姓名" name="teacherDTO.teacherName" required>
            <a-input v-model:value="formState.teacherDTO.teacherName" />
          </a-form-item>
          <a-form-item label="职位" name="teacherDTO.position" required>
            <a-input v-model:value="formState.teacherDTO.position" />
          </a-form-item>
          <a-form-item label="讲师简介" name="teacherDTO.description" required>
            <a-textarea v-model:value="formState.teacherDTO.description" />
          </a-form-item>
          <a-form-item label="课程名称" name="previewFirstField" required>
            <a-input v-model:value="formState.previewFirstField" />
          </a-form-item>
          <a-form-item label="课程概述" name="previewSecondField" required>
            <a-input v-model:value="formState.previewSecondField" />
          </a-form-item>
          <a-form-item label="课程封面">
            <avatar-upload v-model:value="formState.courseListImg" @input="val => formState.courseListImg = val" />
          </a-form-item>
          <a-form-item label="介绍封面">
            <avatar-upload v-model:value="formState.courseImgUrl" @input="val => formState.courseImgUrl = val" />
          </a-form-item>
          <a-form-item label="课程排序" name="sortNum" required>
            <a-input v-model:value="formState.sortNum">
              <template #addonBefore>
                <span>-</span>
              </template>
              <template #addonAfter>
                <span>+</span>
              </template>
            </a-input>
          </a-form-item>
        </template>
        <template v-if="current === 1">
          <a-form-item label="售卖价格" name="discounts">
            <a-input addon-after="元" v-model:value="formState.discounts" />
          </a-form-item>
          <a-form-item label="商品原价" name="price">
            <a-input addon-after="元" v-model:value="formState.price" />
          </a-form-item>
          <a-form-item label="销量" name="sales">
            <a-input addon-after="单" v-model:value="formState.sales" />
          </a-form-item>
          <a-form-item label="活动标签" name="discountsTag">
            <a-input v-model:value="formState.discountsTag" placeholder="请输入活动标签" />
          </a-form-item>
        </template>
        <template v-if="current === 2">
          <a-form-item label="限时秒杀开关" name="activityCourse">
            <a-switch v-model:checked="formState.activityCourse"></a-switch>
          </a-form-item>
          <template v-if="formState.activityCourse">
            <a-form-item label="开始时间" name="activityCourseDTO.beginTime">
              <a-date-picker
                v-model:value="formState.activityCourseDTO.beginTime"
                format="YYYY-MM-DD"
                placeholder="选择日期时间"
              />
            </a-form-item>
            <a-form-item label="结束时间" name="activityCourseDTO.endTime">
              <a-date-picker
                v-model:value="formState.activityCourseDTO.endTime"
                format="YYYY-MM-DD"
                placeholder="选择日期时间"
              />
            </a-form-item>
            <a-form-item label="秒杀价" name="activityCourseDTO.amount">
              <a-input addon-after="元" />
            </a-form-item>
            <a-form-item label="秒杀库存" name="activityCourseDTO.stock">
              <a-input addon-after="个" />
            </a-form-item>
          </template>
        </template>
        <template v-if="current === 3">
          <editor v-model="formState.courseDescriptionMarkDown" />
        </template>
      </a-form>
      <div class="foot-container">
        <a-button v-if="current < 3" @click="current++">下一步</a-button>
        <a-divider type="vertical" />
        <a-button v-if="current > 0" @click="current--">上一步</a-button>
        <a-divider type="vertical" />
        <a-button type="primary" v-if="current === 3" @click="onSubmit">确认</a-button>
      </div>
    </a-card>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from 'vue'
import { ArrowLeftOutlined, EditOutlined, AreaChartOutlined, AccountBookOutlined, ContainerOutlined } from '@ant-design/icons-vue'
import { FormState } from '@/types/courses'
import AvatarUpload from '@/components/AvatarUpload.vue'
// import editor from '@/components/quillEditor.vue'
import editor from '@/components/ckEditor.vue'
import { saveOrUpdateCourse, getCourseById } from '@/services/courses'
import { message } from 'ant-design-vue'
import { useRoute } from 'vue-router'
import moment from 'moment'

const rules = {
  courseName: [
    { required: true, message: '请输入课程名称' },
    { max: 50, message: '课程名称长度不能超过50' }
  ],
  brief: [
    { required: true, max: 100, message: '请输入课程简介' },
    { max: 100, message: '课程简介长度不能超过100' }
  ],
  teacherDTO: {
    teacherName: [
      { required: true, message: '请输入讲师姓名' },
      { max: 50, message: '讲师名称长度不能超过50' }
    ],
    position: [
      { required: true, max: 50, message: '请输入讲师职位' },
      { max: 50, message: '讲师职位长度不能超过50' }
    ],
    description: [
      { required: true, message: '请输入讲师简介' },
      { max: 100, message: '讲师简介长度不能超过100' }
    ]
  },
  previewFirstField: [
    { required: true, message: '请输入课程名称' },
    { max: 20, message: '课程名称长度不能超过20' }
  ],
  previewSecondField: [
    { required: true, message: '请输入课程概述' },
    { max: 20, message: '课程概述长度不能超过20' }
  ],
  sortNum: [
    { required: true, message: '请输入课程排序' },
    { pattern: new RegExp(/^[0-9]\d*$/), message: '请输入大于等于0的整数', trigger: 'change' }
  ],
  discounts: [
    { required: true, message: '请输入售卖价格' },
    { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '价格格式不正确' }
  ]
}

export default defineComponent({
  name: 'CourseDetail',
  props: {
    courseId: {
      type: String
    }
  },
  components: {
    ArrowLeftOutlined,
    EditOutlined,
    AreaChartOutlined,
    AccountBookOutlined,
    ContainerOutlined,
    AvatarUpload,
    editor
  },
  setup (props) {
    const formRef = ref()
    const state = reactive({
      current: ref(0)
    })
    const formState = ref<FormState>({
      courseName: '',
      brief: '',
      teacherDTO: {
        teacherName: '',
        position: '',
        description: ''
      },
      previewFirstField: '',
      previewSecondField: '',
      courseListImg: '',
      courseImgUrl: '',
      sortNum: null,
      discounts: null,
      price: null,
      sales: null,
      discountsTag: '',
      activityCourse: false,
      activityCourseDTO: {
        beginTime: null,
        endTime: null,
        amount: null,
        stock: null
      },
      courseDescriptionMarkDown: ''
    })
    // const { validate } = useForm(formState.value, rules)
    const $route = useRoute()
    // 更新课程信息
    const onSubmit = async () => {
      await formRef.value.validate()
      const { data } = await saveOrUpdateCourse(formState.value)
      if (data.code === '000000') {
        message.success(data.mesg)
      } else {
        message.error(data.mesg)
      }
    }
    // 获取课程信息
    const loadCourseById = async () => {
      if ($route.name === 'courseEdit') {
        try {
          const { data } = await getCourseById(Number(props.courseId))
          if (data.code === '000000') {
            const { data: result } = data
            if (result.activityCourseDTO) {
              const { beginTime = '', endTime = '' } = result.activityCourseDTO
              result.activityCourseDTO.beginTime = beginTime ? moment(beginTime, 'YYYY-MM-DD') : null
              result.activityCourseDTO.endTime = endTime ? moment(endTime, 'YYYY-MM-DD') : null
              formState.value = result
            } else {
              formState.value = {
                ...result,
                activityCourseDTO: {
                  beginTime: null,
                  endTime: null,
                  amount: null,
                  stock: null
                }
              }
            }
          }
        } catch (error) {}
      }
    }
    return {
      formRef,
      ...toRefs(state),
      rules,
      formState,
      labelCol: { span: 5 },
      wrapperCol: { span: 10 },
      onSubmit,
      loadCourseById
    }
  },
  created () {
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
  height: calc(100% - 57px);
}
:deep(.ant-form) {
  height: calc(100% - 125px);
  overflow-y: auto;
}
.ant-calendar-picker {
  width: 100%;
}
.foot-container {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  text-align: center;
  height: 30px;
}
</style>
