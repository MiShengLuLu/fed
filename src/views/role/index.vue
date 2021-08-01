<template>
  <div class="main-container">
    <a-card :bordered="false">
      <template #title>
        <a-form
          layout="inline"
          :model="formState"
        >
          <a-form-item label="输入搜索">
            <a-input v-model:value="formState.name" placeholder="角色名称">
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              @click="getRolePages"
              :disabled="loading"
            >
              查询
            </a-button>
            <a-divider type="vertical" />
            <a-button @click="onReset" :disabled="loading">
              重置
            </a-button>
          </a-form-item>
        </a-form>
      </template>
      <a-button @click="addRole" :disabled="loading">添加角色</a-button>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        rowKey="id"
        :scroll="{ x: 1000, y: scrollY }"
        :pagination="false"
        :loading="loading"
      >
        <template #action="{ record }">
          <span>
            <a @click="$router.push({
              name: 'allocMenu',
              params: {
                roleId: record.id
              }
            })">分配菜单</a>
            <a-divider type="vertical" />
            <a @click="$router.push({
              name: 'allocResource',
              params: {
                roleId: record.id
              }
            })">分配资源</a>
            <a-divider type="vertical" />
            <a @click="editRole(record.id)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              v-if="dataSource.length"
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
    @cancel="cancel"
  >
    <a-form
      ref="formRef"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
        <a-form-item label="角色名称" required name="name">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="角色编码" required name="code">
          <a-input v-model:value="form.code" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea v-model:value="form.description" />
        </a-form-item>
      </a-form>
  </a-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { query, del, update, getRoleById } from '@/services/roles'
import { Role } from '@/types/roles'
import { Pagination } from '@/types/base'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '编号',
    dataIndex: 'id'
  },
  {
    title: '角色名称',
    dataIndex: 'name'
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
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
    slots: { customRender: 'action' }
  }
]

const rules = {
  name: [
    { required: true, message: '请输入角色名称' }
  ],
  code: [
    { required: true, message: '请输入角色编码' }
  ]
}

const init = {
  inlineForm: {
    name: '',
    current: 1,
    size: 10
  },
  form: {
    name: '',
    code: '',
    description: ''
  }
}

export default defineComponent({
  name: 'Role',
  data () {
    return {
      scrollY: 320
    }
  },
  setup () {
    const formState = ref<Role & Pagination>(init.inlineForm)

    const dataSource = ref<Role[]>([])
    const total = ref(0)
    const loading = ref(false)

    const getRolePages = async () => {
      loading.value = true
      const { data } = await query(formState.value)
      loading.value = false
      if (data.code === '000000') {
        dataSource.value = data.data.records
        total.value = data.data.total
      }
    }

    const modalTitle = ref<string>()
    const visible = ref<boolean>(false)
    const confirmLoading = ref<boolean>(false)
    const form = ref<Role>(init.form)
    const formRef = ref()

    // 添加角色
    const addRole = () => {
      modalTitle.value = '添加角色'
      visible.value = true
    }
    const handleOk = async () => {
      try {
        // 校验表单
        await formRef.value.validate()

        confirmLoading.value = true
        // 更新角色信息
        const { data } = await update(form.value)
        if (data.code === '000000') {
          message.success(data.mesg)
          // 刷新列表数据
          getRolePages()
          visible.value = false
          cancel()
        } else {
          message.error(data.mesg)
        }
        confirmLoading.value = false
      } catch (error) {
        console.error(error)
      }
    }
    // 编辑角色
    const editRole = async (id: number) => {
      modalTitle.value = '编辑角色'
      const { data } = await getRoleById(id)
      visible.value = true
      if (data.code === '000000') {
        form.value = data.data
      }
    }
    // 模态框关闭之后的回调
    const cancel = () => {
      // 重置对话框内表单数据
      form.value = init.form
      // 清除校验
      formRef.value.clearValidate()
    }
    return {
      dataSource,
      getRolePages,
      editRole,
      total,
      columns,
      loading,
      formState,
      modalTitle,
      visible,
      confirmLoading,
      formRef,
      addRole,
      handleOk,
      form,
      rules,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      cancel
    }
  },
  created () {
    this.getRolePages()
  },
  mounted () {
    this.tableScrollCalculate()
    window.addEventListener('resize', () => {
      this.tableScrollCalculate()
    })
  },
  methods: {
    async onDelete (id: number) {
      const { data } = await del(id)
      if (data.code === '000000') {
        message.success(data.mesg)
        this.getRolePages()
      } else {
        message.error('删除失败了，请稍后再试')
      }
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
      this.formState.current = 1
      this.getRolePages()
    },
    // 分页 change
    changePage (current: number) {
      this.formState.current = current
      this.getRolePages()
    },
    changePageSize (current: number, size: number) {
      this.formState.current = 1
      this.formState.size = size
      this.getRolePages()
    }
  }
})
</script>

<style lang="scss" scoped>
@import url('../../styles/index.scss');
.ant-card,
.ant-table-wrapper,
:deep(.ant-spin-nested-loading),
:deep(.ant-spin-container) {
  height: 100%;
}
:deep(.ant-card-body) {
  height: calc(100% - 65px);
  padding-bottom: 0;
}
.ant-table {
  padding-bottom: 64px;
}

.ant-btn {
  margin-bottom: 20px;
}
.ant-pagination {
  z-index: 1;
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
