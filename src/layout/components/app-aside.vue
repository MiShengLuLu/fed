<template>
  <div class="logo" />
  <a-menu
    mode="inline"
    theme="dark"
    :inline-collapsed="collapsed"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
  >
    <a-sub-menu key="1">
      <template #icon>
        <InboxOutlined />
      </template>
      <template #title>权限管理</template>
      <a-menu-item key="1-1">角色列表</a-menu-item>
      <a-menu-item key="1-2">菜单列表</a-menu-item>
      <a-menu-item key="1-3">资源列表</a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="2">
      <template #icon>
        <AppstoreOutlined />
      </template>
      <template #title>课程管理</template>
      <a-menu-item key="2-1">Option 9</a-menu-item>
      <a-menu-item key="2-2">Option 10</a-menu-item>
    </a-sub-menu>
    <a-sub-menu key="3">
      <template #icon>
        <PieChartOutlined />
      </template>
      <template #title>用户管理</template>
      <a-menu-item key="3-1">Option 9</a-menu-item>
      <a-menu-item key="3-2">Option 10</a-menu-item>
    </a-sub-menu>
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

export default defineComponent({
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },

  setup (props) {
    const state = reactive({
      // collapsed: false,
      selectedKeys: ['1-1'],
      openKeys: ['1'],
      preOpenKeys: ['1']
    })

    watch(
      () => state.openKeys,
      (val, oldVal) => {
        state.preOpenKeys = oldVal
      }
    )
    const toggleCollapsed = () => {
      // props.collapsed = !props.collapsed
      state.openKeys = props.collapsed ? [] : state.preOpenKeys
    }

    return {
      ...toRefs(state),
      toggleCollapsed
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
