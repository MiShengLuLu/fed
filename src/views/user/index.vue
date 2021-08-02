<template>
  <div class="main-container">
    <a-card :bordered="false">
      <template #title>
        <a-form
          ref="formRef"
          layout="inline"
          :model="formState"
        >
          <a-form-item label="手机号">
            <a-input v-model:value="formState.phone" placeholder="请输入手机号">
            </a-input>
          </a-form-item>
          <a-form-item label="注册时间">
            <a-range-picker v-model:value="time" @change="onChange"/>
          </a-form-item>
          <a-form-item>
            <a-button
              type="primary"
              @click="loadUserPage"
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
      <a-table
        :pagination="false"
        :columns="columns"
        :data-source="dataSource"
        rowKey="id"
        :scroll="{ x: 1000, y: scrollY }"
        :loading="loading"
      >
        <template #badge="{ record }">
          <a-badge :color="record.status === 'ENABLE' ? 'lime' : 'red'" />
        </template>
        <template #operation="{ record }">
          <span>
            <a-popconfirm
              v-if="dataSource.length"
              :title="`确认${record.status === 'ENABLE' ? '禁用' : '启用'}？`"
              @confirm="changeStatus(record)"
            >
              <a>{{record.status === 'ENABLE' ? '禁用' : '启用'}}</a>
            </a-popconfirm>
            <a-divider type="vertical" />
            <a @click="assignRoles(record.id)">分配角色</a>
          </span>
        </template>
      </a-table>
      <a-pagination
        v-model:current="currentPage"
        :total="total"
        show-size-changer
        show-quick-jumper
        :page-size="pageSize"
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
    title="分配角色"
    v-model:visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="cancel"
  >
    <a-select
      mode="multiple"
      v-model:value="roleIdList"
      style="width: 100%"
      placeholder="请选择"
    >
      <a-select-option v-for="item in roles" :key="item.id">
        {{ item.name }}
      </a-select-option>
    </a-select>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, UnwrapRef, toRaw } from 'vue'
import { getUserPage, forbidUser, enableUser } from '@/services/user'
import { getRoles, allocateUserRoles, getRolesById } from '@/services/roles'
import { UserItem } from '@/types/user'
import { Role } from '@/types/roles'
import { Moment } from 'moment'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '用户ID',
    dataIndex: 'id',
    width: 80
  },
  {
    title: '头像',
    dataIndex: 'portrait',
    width: 60,
    slots: { customRender: 'img' }
  },
  {
    title: '用户名',
    dataIndex: 'name',
    width: 160
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    width: 160
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    width: 180
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 60,
    slots: { customRender: 'badge' }
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 200,
    slots: { customRender: 'operation' }
  }
]
const query = {
  phone: '',
  startCreateTime: '',
  endCreateTime: ''
}

export default defineComponent({
  name: 'User',
  data () {
    return {
      scrollY: 400
    }
  },
  setup () {
    const state = reactive({
      dataSource: ref<UserItem[]>([]),
      loading: ref<boolean>(false),
      currentPage: 1,
      pageSize: 10,
      total: 0,
      time: ref<Moment[]>([]),
      roles: ref<Role[]>([]),
      userId: ref<number>(),
      roleIdList: ref<number[]>([]),
      visible: ref<boolean>(false),
      confirmLoading: ref<boolean>(false)
    })
    const formRef = ref()
    const formState: UnwrapRef<{ phone: string; time: Moment | undefined }> = reactive({
      phone: '',
      time: undefined
    })
    // const visible = ref<boolean>(false)

    // 重置
    const onReset = () => {
      formRef.value.resetFields()
      // 重置分页数据
      state.currentPage = 1
      // 重置 query 数据
      query.phone = ''
      query.startCreateTime = ''
      query.endCreateTime = ''
      // 重新查询列表
      loadUserPage()
    }

    // 根据条件查询用户列表
    const loadUserPage = async () => {
      state.loading = true
      try {
        const { startCreateTime, endCreateTime } = query
        const { phone } = toRaw(formState)
        const { data } = await getUserPage({
          phone,
          startCreateTime,
          endCreateTime,
          currentPage: state.currentPage,
          pageSize: state.pageSize
        })
        if (data.code === '000000') {
          state.dataSource = data.data.records
          state.total = data.data.total
        }
        state.loading = false
      } catch (error) {
        state.loading = true
      }
    }
    // 分页 change
    const changePage = (current: number) => {
      state.currentPage = current
      loadUserPage()
    }
    const changePageSize = (current: number, size: number) => {
      state.currentPage = 1
      state.pageSize = size
      loadUserPage()
    }
    // datePicker
    const onChange = (dates: [Moment, Moment] | [string, string], dateStrings: [string, string]) => {
      query.startCreateTime = dateStrings[0]
      query.endCreateTime = dateStrings[1]
    }
    const changeStatus = async (record: UserItem) => {
      if (record.status === 'ENABLE') {
        const { data } = await forbidUser(record.id)
        if (data.code === '000000') {
          message.success(data.mesg)
        } else {
          message.error(data.mesg)
        }
      } else {
        const { data } = await enableUser(record.id)
        if (data.code === '000000') {
          message.success(data.mesg)
        } else {
          message.error(data.mesg)
        }
      }
    }
    // 获取所有角色
    const loadRoles = async () => {
      const { data } = await getRoles()
      if (data.code === '000000') {
        state.roles = data.data
      }
    }
    // 分配角色
    const assignRoles = (id: number) => {
      // 查询用户拥有的角色
      getUserRoles(id)

      state.visible = true
      state.userId = id
    }
    // 为用户分配角色
    const handleOk = async () => {
      state.confirmLoading = true
      try {
        if (state.userId) {
          const { data } = await allocateUserRoles({
            userId: state.userId,
            roleIdList: state.roleIdList
          })
          if (data.code === '000000') {
            message.success(data.mesg)
            cancel()
          } else {
            message.error(data.mesg)
          }
          state.confirmLoading = false
        }
      } catch (error) {
        state.confirmLoading = false
      }
    }
    // cancel
    const cancel = () => {
      // 关闭模态框
      state.visible = false
      // 重置数据
      state.roleIdList = []
    }
    // 查询用户角色
    const getUserRoles = async (userId: number) => {
      const { data } = await getRolesById(userId)
      if (data.code === '000000') {
        data.data.forEach(item => {
          item.id && state.roleIdList.push(item.id)
        })
      }
    }
    return {
      formRef,
      ...toRefs(state),
      columns,
      formState,
      loadUserPage,
      onReset,
      changePage,
      changePageSize,
      onChange,
      changeStatus,
      loadRoles,
      handleOk,
      cancel,
      assignRoles
    }
  },
  created () {
    this.loadUserPage()
    this.loadRoles()
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
