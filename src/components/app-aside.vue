<template>
  <div class="logo" />
  <a-menu
    mode="inline"
    theme="dark"
    :inline-collapsed="collapsed"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
    @click="handleClick"
  >
    <a-sub-menu key="1">
      <template #icon>
        <InboxOutlined />
      </template>
      <template #title>权限管理</template>
      <a-menu-item key="1-1" name="role">角色列表</a-menu-item>
      <a-menu-item key="1-2" name="menu">菜单列表</a-menu-item>
      <a-menu-item key="1-3" name="resource">资源列表</a-menu-item>
    </a-sub-menu>
    <a-menu-item key="2" name="course">
      <template #icon>
        <AppstoreOutlined />
      </template>
      课程管理
    </a-menu-item>
    <a-menu-item key="3" name="user">
      <template #icon>
        <PieChartOutlined />
      </template>
      用户管理
    </a-menu-item>
  </a-menu>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import {
  PieChartOutlined,
  // MailOutlined,
  // DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

interface Item {
  name: string
}

export default defineComponent({
  naem: 'AppAside',
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },

  setup (props) {
    const state = reactive({
      selectedKeys: ['1-1'],
      openKeys: ['1'],
      preOpenKeys: ['1']
    })

    const $router = useRouter()

    watch(
      () => state.openKeys,
      (val, oldVal) => {
        state.preOpenKeys = oldVal
      }
    )
    const toggleCollapsed = () => {
      state.openKeys = props.collapsed ? [] : state.preOpenKeys
    }

    const handleClick = ({ item, key }: { item: Item, key: string }) => {
      console.log(item, key)
      $router.push(`/${item.name}`)
    }

    return {
      ...toRefs(state),
      toggleCollapsed,
      handleClick
    }
  },
  components: {
    PieChartOutlined,
    // MailOutlined,
    // DesktopOutlined,
    InboxOutlined,
    AppstoreOutlined
  }
})
</script>

<style lang="scss" scoped>
.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}
</style>
