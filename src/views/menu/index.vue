<template>
  <div class="main-container">
    <a-card :bordered="false">
      <template #title>
        <a-button @click="$router.push('/menu/create')">添加菜单</a-button>
      </template>
      <a-table :columns="columns" :data-source="menus" rowKey="id" :scroll="{ x: 1000, y: scrollY }">
        <template #index="{ record }">
          <a>{{ record }}</a>
        </template>
        <template #operation="{ record }">
          <span>
            <a @click="$router.push({ name: 'menuEdit', params: { id: record.id } })">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              v-if="menus.length"
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { getAllMenus, menuDelete } from '@/services/menu'
import { FormState } from '@/types/menu'
import { message } from 'ant-design-vue'

const columns = [
  {
    title: '编号',
    dataIndex: 'id',
    width: 80
  },
  {
    title: '菜单名称',
    dataIndex: 'name',
    width: 160
  },
  {
    title: '菜单级数',
    dataIndex: 'parentId',
    width: 160
  },
  {
    title: '前端图标',
    dataIndex: 'icon',
    width: 160
  },
  {
    title: '排序',
    key: 'orderNum',
    dataIndex: 'orderNum',
    width: 160
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 200,
    slots: { customRender: 'operation' }
  }
]

export default defineComponent({
  data () {
    return {
      scrollY: 400
    }
  },
  setup () {
    const menus = ref<FormState[]>([])
    return {
      menus,
      columns
    }
  },
  created () {
    this.loadAllMenus()
  },
  async mounted () {
    this.tableScrollCalculate()
    window.addEventListener('resize', async () => {
      this.tableScrollCalculate()
    })
  },
  methods: {
    async loadAllMenus () {
      const { data } = await getAllMenus()
      if (data.code === '000000') {
        this.menus = data.data
      }
    },
    async onDelete (id: number) {
      const { data } = await menuDelete(id)
      if (data.code === '000000') {
        message.success(data.mesg)
        this.loadAllMenus()
      } else {
        message.error('删除失败了，请稍后再试')
      }
    },
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

:deep(.ant-pagination) {
  z-index: 1;
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>
