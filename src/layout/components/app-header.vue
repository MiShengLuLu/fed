<template>
  <div class="header-left">
    <menu-unfold-outlined
      v-if="collapsed"
      class="trigger"
      @click="() => (collapsed = !collapsed)"
    />
    <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
    <a-breadcrumb>
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="">Application List</a></a-breadcrumb-item>
      <a-breadcrumb-item>An Application</a-breadcrumb-item>
    </a-breadcrumb>
  </div>
  <a-popover placement="bottomRight">
    <template #content>
      <p>Content</p>
      <p>Content</p>
    </template>
    <template #title>
      <span>Title</span>
    </template>
    <a-space>
      <a-avatar shape="square" size="large">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <DownOutlined />
    </a-space>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  DownOutlined
} from '@ant-design/icons-vue'

export default defineComponent({
  // props: {
  //   collapsed: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  components: { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, DownOutlined },
  setup () {
    const state = reactive({
      collapsed: false
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
.header-left {
  display: inline-flex;
  align-items: center;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #1890ff;
  }
}

.ant-space {
  margin-right: 20px;
}
</style>
