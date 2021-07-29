<template>
  <a-layout>
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <app-aside></app-aside>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <app-header></app-header>
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
import AppAside from './components/app-aside.vue'
import AppHeader from './components/app-header.vue'

export default defineComponent({
  name: 'layout',
  components: { AppAside, AppHeader },
  data () {
    return {
      collapsed: ref<boolean>(false)
    }
  },
  watch: {
    collapse (val) {
      console.log(val)
    }
  }
})
</script>

<style lang="scss" scoped>
.ant-layout {
  min-height: 100vh;
  min-width: 980px;
}

.ant-layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
