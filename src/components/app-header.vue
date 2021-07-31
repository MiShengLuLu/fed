<template>
  <div class="header-left">
    <menu-unfold-outlined
      v-if="collapsed"
      class="trigger"
      @click="collapsedChange"
    />
    <menu-fold-outlined v-else class="trigger" @click="collapsedChange" />
    <a-breadcrumb>
      <a-breadcrumb-item>Home</a-breadcrumb-item>
      <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
      <a-breadcrumb-item><a href="">Application List</a></a-breadcrumb-item>
      <a-breadcrumb-item>An Application</a-breadcrumb-item>
    </a-breadcrumb>
  </div>
  <a-popover placement="bottomRight">
    <template #content>
      <p>{{ userInfo.userName }}</p>
      <p style="cursor: pointer" @click="logout">退出</p>
    </template>
    <template #title>
      <span>Title</span>
    </template>
    <a-space>
      <a-avatar shape="square" size="large" :src="userInfo.portrait">
        <template #icon><UserOutlined /></template>
      </a-avatar>
      <DownOutlined />
    </a-space>
  </a-popover>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, createVNode } from 'vue'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  DownOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import { getUserInfo } from '@/services/user'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'

function useLogout () {
  const $store = useStore()
  const $router = useRouter()
  const logout = () => {
    Modal.confirm({
      title: '退出提示',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, '确认退出吗？'),
      onOk () {
        $store.commit('UPDATE_USER', null)
        $router.push('/login')
      },
      onCancel () {
        console.log('Cancel')
      },
      class: 'test'
    })
  }
  return {
    logout
  }
}

export default defineComponent({
  props: {
    collapsed: {
      type: Boolean,
      default: false
    }
  },
  components: { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, DownOutlined },
  emits: ['collapsedChange'],
  setup (props, { emit }) {
    const state = reactive({
      userInfo: {}
    })

    const collapsedChange = () => {
      emit('collapsedChange', !props.collapsed)
    }
    const loadInfo = async () => {
      const { data } = await getUserInfo()
      state.userInfo = data.content
    }

    return {
      ...toRefs(state),
      loadInfo,
      ...useLogout(),
      collapsedChange
    }
  },
  created () {
    this.loadInfo()
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
