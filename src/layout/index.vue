<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <app-aside></app-aside>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <app-header :collapsed="collapsed" @collapsedChange="collapsedChange"></app-header>
      </a-layout-header>
      <a-layout-content>
        <!-- 子路由出口 -->
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import AppAside from '@/components/app-aside.vue'
import AppHeader from '@/components/app-header.vue'

function useCollapsed () {
  const collapsed = ref<boolean>(false)
  const collapsedChange = (val: boolean) => {
    collapsed.value = val
  }
  return {
    collapsed,
    collapsedChange
  }
}

export default defineComponent({
  name: 'layout',
  components: { AppAside, AppHeader },
  setup () {
    return {
      ...useCollapsed()
    }
  }
})
</script>

<style lang="scss" scoped>
.ant-layout {
  height: 100vh;
  min-width: 980px;
}

.ant-layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ant-layout-content {
  height: calc(100% - 64px);
}

:deep(.ant-layout-sider-trigger) {
  position: absolute;
}
</style>
