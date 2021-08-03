<template>
  <div class="main-container">
    <a-card :bordered="false">
      <template #title>
        <a-button @click="(
          visible = true,
          isEdit = false,
          modalTitle = '添加分类'
        )">添加</a-button>
        <a-divider type="vertical" />
        <a-button @click="$router.back()">
          <template #icon><ArrowLeftOutlined /></template>
          返回
        </a-button>
      </template>
      <a-table
        :columns="columns"
        :data-source="categories"
        rowKey="id"
        :loading="loading"
        :scroll="{ x: 1000, y: scrollY }"
      >
        <template #action="{ record }">
          <span>
            <a @click="(
              visible = true,
              isEdit = true,
              modalTitle = '编辑分类',
              formState = record
            )">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              v-if="categories.length"
              title="确认删除？"
              @confirm="onDelete(record.id)"
            >
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
    </a-card>
  </div>
  <a-modal
    :title="modalTitle"
    v-model:visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
  >
    <a-form
      ref="formRef"
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
        <a-form-item label="名称" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="排序" name="name">
          <a-input v-model:value="formState.sort" />
        </a-form-item>
      </a-form>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { CategoryItem } from '@/types/resources'
import { getCategory, updateCategory, deleteCategory } from '@/services/resources'
import { message } from 'ant-design-vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

const columns = [
  {
    title: '编号',
    dataIndex: 'id'
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime'
  },
  {
    title: '排序',
    dataIndex: 'sort'
  },
  {
    title: '操作',
    key: 'action',
    width: 160,
    fixed: 'right',
    align: 'center',
    slots: { customRender: 'action' }
  }
]

const init = {
  name: '',
  sort: null
}

export default defineComponent({
  name: 'Categories',
  data () {
    return {
      scrollY: 400
    }
  },
  components: { ArrowLeftOutlined },
  setup () {
    const loading = ref(false)
    const categories = ref<CategoryItem[]>([])
    const formState = ref<CategoryItem>(init)
    const confirmLoading = ref(false)
    const visible = ref(false)
    const isEdit = ref(false)
    const modalTitle = ref('')
    // 获取资源分类列表
    const getAllCategory = async () => {
      loading.value = true
      const { data } = await getCategory()
      if (data.code === '000000') {
        categories.value = data.data
      }
      loading.value = false
    }
    // 删除
    const onDelete = async (id: number) => {
      const { data } = await deleteCategory(id)
      if (data.code === '000000') {
        message.success(data.mesg)
        getAllCategory()
      } else {
        message.error(data.mesg)
      }
    }
    // 更新资源分类信息
    const handleOk = async () => {
      confirmLoading.value = true
      const { data } = await updateCategory(formState.value)
      if (data.code === '000000') {
        message.success(data.mesg)
        // 如果是新增，需刷新列表数据
        if (!isEdit.value) getAllCategory()
        visible.value = false
      } else {
        message.error(data.mesg)
      }
      confirmLoading.value = false
    }
    watch(isEdit, (newVal, oldVal) => {
      if (newVal === oldVal) return
      if (!isEdit.value) {
        formState.value = init
      }
    })

    return {
      loading,
      categories,
      columns,
      getAllCategory,
      onDelete,
      handleOk,
      formState,
      visible,
      isEdit,
      modalTitle,
      confirmLoading,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
  },
  created () {
    this.getAllCategory()
  },
  mounted () {
    this.tableScrollCalculate()
    window.addEventListener('resize', () => {
      this.tableScrollCalculate()
    })
  },
  methods: {
    tableScrollCalculate () {
      const el = document.querySelector('.ant-spin-container')
      if (el && el?.clientHeight > 320) {
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
:deep(.ant-pagination) {
  z-index: 1;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
