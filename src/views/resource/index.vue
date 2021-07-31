<template>
  <div class="main-container">
    <a-card :bordered="false">
      <template #title>
        <a-form
          layout="inline"
          :model="formState"
        >
          <a-form-item label="资源名称">
            <a-input v-model:value="formState.name" placeholder="请输入资源名称">
            </a-input>
          </a-form-item>
          <a-form-item label="资源路径">
            <a-input v-model:value="formState.url" placeholder="请输入资源路径">
            </a-input>
          </a-form-item>
          <a-form-item label="资源分类">
            <a-select
              v-model:value="formState.categoryId"
              style="width: 120px"
              ref="select"
              placeholder="请选择资源分类"
              allowClear
            >
              <a-select-option v-for="item in category" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              @click="getResources"
            >
              查询
            </a-button>
            <a-divider type="vertical" />
            <a-button @click="onReset">
              重置
            </a-button>
          </a-form-item>
        </a-form>
      </template>
      <a-button @click="() => { modalTitle = '添加资源'; showModal() }" :disabled="loading">添加</a-button>
      <a-divider type="vertical" />
      <a-button @click="$router.push('/resources/create')" :disabled="loading">资源分类</a-button>
      <a-table
        :columns="columns"
        :data-source="resources"
        rowKey="id"
        :scroll="{ x: 1000, y: scrollY }"
        :pagination="false"
        :loading="loading"
      >
        <template #action="{ record }">
          <span>
            <a @click="editResource(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              v-if="resources.length"
              title="确认删除？"
              @confirm="onDelete(record.id)"
            >
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <a-pagination
        v-model:current="formState.current"
        :total="total"
        show-size-changer
        show-quick-jumper
        :page-size="formState.size"
        :showTotal="total => `总共 ${total} 条`"
        @showSizeChange="changePageSize"
        @change="changePage"
        :disabled="loading"
      >
        <template #buildOptionText="props">
          <span v-if="props.value !== '50'">{{ props.value }}条/页</span>
          <span v-else>全部</span>
        </template>
      </a-pagination>
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
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
        <a-form-item label="资源名称" required name="name">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="资源路径" required name="name">
          <a-input v-model:value="form.url" />
        </a-form-item>
        <a-form-item label="角色管理" required name="name">
          <a-select v-model:value="form.categoryId">
            <a-select-option v-for="item in category" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="描述" name="name">
          <a-textarea v-model:value="form.description" />
        </a-form-item>
      </a-form>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getCategory, getResourcePages, deleteResource, updateResource } from '@/services/resources'
import { ResourcesItem, FormState } from '@/types/resources'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '编号',
    dataIndex: 'id'
  },
  {
    title: '资源名称',
    dataIndex: 'name'
  },
  {
    title: '资源路径',
    dataIndex: 'url'
  },
  {
    title: '描述',
    dataIndex: 'description'
  },
  {
    title: '添加时间',
    dataIndex: 'createdTime'
  },
  {
    title: 'Action',
    key: 'action',
    width: 200,
    fixed: 'right',
    slots: { customRender: 'action' }
  }
]

const init = {
  inlineForm: {
    name: '',
    url: '',
    categoryId: null,
    current: 1,
    size: 10
  },
  form: {
    name: '',
    url: '',
    categoryId: null,
    description: ''
  }
}
export default defineComponent({
  name: 'Resources',
  data () {
    return {
      scrollY: 320
    }
  },
  setup () {
    const formState = ref<FormState>(init.inlineForm)

    const category = ref<ResourcesItem[]>([])
    const resources = ref<ResourcesItem[]>([])
    const total = ref(0)
    const loading = ref(false)

    const getResources = async () => {
      loading.value = true
      const { data } = await getResourcePages(formState.value)
      loading.value = false
      if (data.code === '000000') {
        resources.value = data.data.records
        total.value = data.data.total
      }
    }

    const modalTitle = ref<string>()
    const isEdit = ref(false)
    const visible = ref<boolean>(false)
    const confirmLoading = ref<boolean>(false)
    const form = ref<FormState>(init.form)

    const showModal = () => {
      visible.value = true
      form.value = init.form
    }
    const handleOk = async () => {
      confirmLoading.value = true
      const { data } = await updateResource(form.value)
      if (data.code === '000000') {
        message.success(data.mesg)
        // 如果是新增，需刷新列表数据
        if (!isEdit.value) getResources()
        visible.value = false
      } else {
        message.error(data.mesg)
      }
      confirmLoading.value = false
    }
    return {
      resources,
      getResources,
      total,
      columns,
      loading,
      formState,
      category,
      modalTitle,
      visible,
      confirmLoading,
      showModal,
      handleOk,
      form,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      isEdit
    }
  },
  created () {
    this.loadCategory()
    this.getResources()
  },
  async mounted () {
    this.tableScrollCalculate()
    window.addEventListener('resize', async () => {
      this.tableScrollCalculate()
    })
  },
  methods: {
    async loadCategory () {
      const { data } = await getCategory()
      if (data.code === '000000') {
        this.category = data.data
      }
    },
    async onDelete (id: number) {
      const { data } = await deleteResource(id)
      if (data.code === '000000') {
        message.success(data.mesg)
        this.getResources()
      } else {
        message.error('删除失败了，请稍后再试')
      }
    },
    editResource (data: FormState) {
      this.isEdit = true
      this.modalTitle = '编辑资源'
      this.showModal()
      this.form = data
    },
    tableScrollCalculate () {
      const el = document.querySelector('.ant-spin-container')
      if (el && el?.clientHeight > 320) {
        this.scrollY = el?.clientHeight - 55 - 64 - 85
      }
    },
    // 重置
    onReset () {
      this.formState.name = ''
      this.formState.url = ''
      this.formState.categoryId = null
      this.formState.current = 1
      this.getResources()
    },
    // 分页 change
    changePage (current: number) {
      this.formState.current = current
      this.getResources()
    },
    changePageSize (current: number, size: number) {
      this.formState.current = 1
      this.formState.size = size
      this.getResources()
    }
  }
})
</script>

<style lang="scss" scoped>
@import url('../../styles/index.scss');

.ant-btn {
  margin-bottom: 20px;
}
.ant-pagination {
  margin-bottom: 20px;
  z-index: 1;
}
</style>
