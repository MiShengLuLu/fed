<template>
  <section class="main-container">
    <a-card :bordered="false">
      <template #title>
        <a-form
          ref="formRef"
          layout="inline"
          :model="formState"
        >
          <a-form-item label="课程名称" name="courseName">
            <a-input v-model:value="formState.courseName" placeholder="请输入课程名称">
            </a-input>
          </a-form-item>
          <a-form-item label="课程状态" name="status">
            <a-select
              v-model:value="formState.status"
              placeholder="请选择课程状态"
              style="width: 180px"
            >
              <a-select-option :value="null">全部</a-select-option>
              <a-select-option :value="1">启用</a-select-option>
              <a-select-option :value="0">禁用</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              @click="loadCourses"
              :disabled="loading"
            >
              查询
            </a-button>
            <a-divider type="vertical" />
            <a-button @click="onReset" :disabled="loading">
              重置
            </a-button>
            <a-divider type="vertical" />
            <a-button @click="$router.push('/course/add')" danger>新增课程</a-button>
          </a-form-item>
        </a-form>
      </template>
      <a-table
        :columns="columns"
        :data-source="courses"
        :pagination="false"
        rowKey="id"
        :scroll="{ x: 1100, y: scrollY }"
        :loading="loading"
      >
        <template #switch="{ record }">
          <a-switch
            v-model:checked="record.status"
            :checkedValue="1"
            :unCheckedValue="0"
            @change="(checked) => statusChange(checked, record)"
          ></a-switch>
        </template>
        <template #action="{ record }">
          <span>
            <a @click="$router.push({
              name: 'courseEdit',
              params: {
                courseId: record.id
              }
            })">编辑</a>
            <a-divider type="vertical" />
            <a @click="$router.push({
              name: 'lesson',
              params: {
                courseId: record.id
              }
            })">内容管理</a>
          </span>
        </template>
      </a-table>
      <a-pagination
        show-size-changer
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="total"
        @showSizeChange="onShowSizeChange"
        @change="onPageChange"
      />
    </a-card>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw, toRefs, UnwrapRef } from 'vue'
import { getQueryCourses, changeState } from '@/services/courses'
import { CourseQuery, Course } from '@/types/courses'
import { message } from 'ant-design-vue'

interface FormState extends CourseQuery {
  currentPage: number;
  pageSize: number
}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id'
  },
  {
    title: '课程名称',
    dataIndex: 'courseName'
  },
  {
    title: '价格',
    dataIndex: 'price'
  },
  {
    title: '排序',
    dataIndex: 'sortNum'
  },
  {
    title: '状态',
    dataIndex: 'status',
    slots: { customRender: 'switch' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    width: 200,
    align: 'center',
    slots: { customRender: 'action' }
  }
]

export default defineComponent({
  name: 'Courses',
  data () {
    return {
      scrollY: 400
    }
  },
  setup () {
    const formRef = ref()
    const state = reactive({
      loading: false,
      courses: ref<Course[]>([]),
      total: 0,
      currentPage: 0,
      pageSize: 10
    })
    const formState: UnwrapRef<FormState> = reactive({
      currentPage: 0,
      pageSize: 10,
      courseName: '',
      status: null
    })

    // onReset
    const onReset = () => {
      formRef.value.resetFields()
    }

    // 获取课程列表
    const loadCourses = async () => {
      const { data } = await getQueryCourses(toRaw(formState))
      if (data.code === '000000') {
        state.courses = data.data.records
        state.total = data.data.total
      }
    }

    // onShowSizeChange
    const onShowSizeChange = (current: number, pageSize: number) => {
      state.pageSize = pageSize
      loadCourses()
    }

    // onPageChange
    const onPageChange = (page: number) => {
      state.currentPage = page
      loadCourses()
    }
    // 启用/禁用
    const statusChange = async (status: number, record: Course) => {
      const { data } = await changeState({
        status,
        courseId: record.id
      })
      if (data.code !== '000000') {
        message.success(data.mesg)
      } else {
        message.error(data.mesg)
      }
    }
    return {
      formRef,
      ...toRefs(state),
      formState,
      onReset,
      loadCourses,
      columns,
      onShowSizeChange,
      onPageChange,
      statusChange
    }
  },
  created () {
    this.loadCourses()
  },
  async mounted () {
    this.tableScrollCalculate()
    window.addEventListener('resize', async () => {
      this.tableScrollCalculate()
    })
  },
  methods: {
    tableScrollCalculate () {
      const el = document.querySelector('.ant-spin-container')
      if (el && el?.clientHeight > 400) {
        this.scrollY = el?.clientHeight - 55 - 64
      }
    }
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
:deep(.ant-table) {
  padding-bottom: 64px;
}

.ant-pagination {
  z-index: 1;
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
