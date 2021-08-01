<template>
  <section class="main-container">
    <div class="inner-container">
      <a-card :bordered="true" v-for="item in categories" :key="item.id">
        <template #title>
          <a-checkbox
            v-model:checked="item.selected"
            v-model:value="item.id"
            @change="onCheckAllChange"
          >
            {{ item.name }}
          </a-checkbox>
        </template>
        <template v-for="$re in resources" :key="$re.id">
          <template v-if="$re.categoryId === item.id">
            <a-checkbox
              v-model:checked="$re.selected"
              v-model:value="$re.id"
              :key="$re.id"
              @change="e => onChange(e, $re.categoryId)"
            >
              {{ $re.name }}
            </a-checkbox>
          </template>
        </template>
      </a-card>
      <div class="footer-container">
        <a-button type="primary" @click="onSubmit">保存</a-button>
        <a-divider type="vertical" />
        <a-button @click="resourceIdList = []">清空</a-button>
        <a-divider type="vertical" />
        <a-button @click="$router.back()">
          <template #icon><ArrowLeftOutlined /></template>
          返回
        </a-button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, toRefs } from 'vue'
import { getCategory, getAll, allocateRoleResources, getRoleResources } from '@/services/resources'
import { CategoryItem, ResourcesItem } from '@/types/resources'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'

interface Event {
  target: {
    value: number;
    checked: boolean
  }
}

export default defineComponent({
  name: 'allocResource',
  components: { ArrowLeftOutlined },
  props: {
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  setup (props) {
    const state = reactive({
      categories: ref<CategoryItem[]>([]),
      resources: ref<ResourcesItem[]>([]),
      checkAll: false,
      resourceIdList: ref<number[]>([])
    })
    const $router = useRouter()
    // 获取资源分类列表
    const getAllCategory = async () => {
      const { data } = await getCategory()
      if (data.code === '000000') {
        state.categories = data.data
      }
    }
    // 获取所有资源
    const loadAllResource = async () => {
      const { data } = await getAll()
      if (data.code === '000000') {
        state.resources = data.data
      }
    }
    // 全选/全不选
    const onCheckAllChange = (e: Event) => {
      state.resources.forEach((item: ResourcesItem, index: number) => {
        if (item.categoryId === e.target.value) {
          if (!e.target.checked) {
            state.resourceIdList.splice(index)
          }
          item.selected = e.target.checked
          item.id && state.resourceIdList.push(item.id)
        }
      })
    }
    // 单选
    const onChange = (e: Event, categoryId: number) => {
      let len = 0// 资源类别下的资源个数
      let l = 0// 资源类别下的选中的资源数目
      if (e.target.checked) {
        const id = state.resourceIdList.findIndex(item => item === e.target.value)
        if (id < 0) {
          state.resourceIdList.push(e.target.value)
        }
        // 遍历资源列表，相同的 categoryId 项的 selected 都为 true 时，该资源类目选中
        state.resources.forEach((item: ResourcesItem) => {
          if (item.categoryId === categoryId) {
            len++
            if (item.selected) l++
          }
        })
      } else {
        const id = state.resourceIdList.findIndex(item => item === e.target.value)
        if (id >= 0) {
          state.resourceIdList.splice(id, 1)
        }
      }
      // 资源类别项是否全选
      state.categories.forEach((item: CategoryItem) => {
        if (item.id === categoryId && len === l && len && l) {
          item.selected = true
        } else {
          item.selected = false
        }
      })
    }
    // 保存分配给角色的资源信息
    const onSubmit = async () => {
      const { resourceIdList } = state
      const { data } = await allocateRoleResources({
        roleId: Number(props.roleId),
        resourceIdList: Array.from(resourceIdList)
      })
      if (data.code === '000000') {
        message.success(data.mesg, 1)
        $router.back()
      } else {
        message.error(data.mesg)
      }
    }
    // 获取角色拥有的资源列表
    const loadRoleResources = async () => {
      const { data } = await getRoleResources(Number(props.roleId))
      if (data.code === '000000') {
        data.data.forEach((item: ResourcesItem) => {
          if (item.id) {
            state.resourceIdList.push(item.id)
            const i = state.resources.findIndex(r => r.id === item.id)
            if (i > -1) {
              state.resources[i].selected = true
            }
          }
        })
      }
    }

    return {
      ...toRefs(state),
      getAllCategory,
      loadAllResource,
      loadRoleResources,
      onCheckAllChange,
      onChange,
      onSubmit
    }
  },
  created () {
    this.getAllCategory()
    this.loadAllResource()
    this.loadRoleResources()
  }
})
</script>

<style lang="scss" scoped>
.main-container {
  padding: 16px;
  height: 100%;
  background: #ececec;
  overflow: hidden;
  position: relative;
}

.inner-container {
  height: calc(100% - 64px);
  overflow-y: auto;
  padding: 16px;
  background: #fff;
}

.footer-container {
  text-align: center;
  padding: 20px 0;
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  background: #fff;
}

:deep(.ant-card-head) {
  background: #ebf5ff;
}
.ant-checkbox-wrapper {
  width: 33.33%;
  margin-left: 0;
}
</style>
