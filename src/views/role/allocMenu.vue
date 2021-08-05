<template>
  <div class="main-container">
    <a-card :bordered="false">
      <a-tree
        v-if="treeData.length"
        checkable
        :tree-data="treeData"
        :replaceFields="replaceFields"
        defaultExpandAll
        v-model:checkedKeys="checkedKeys"
      ></a-tree>
      <div style="width: 100%; text-align: center; padding: 20px 0; position: absolute; bottom: 0; left: 0; right: 0">
        <a-button type="primary" @click="onSubmit">保存</a-button>
        <a-divider type="vertical" />
        <a-button @click="checkedKeys = []">清空</a-button>
        <a-divider type="vertical" />
        <a-button @click="$router.back()">
          <template #icon><ArrowLeftOutlined /></template>
          返回
        </a-button>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { TreeDataItem } from 'ant-design-vue/es/tree/Tree'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { MenuItem } from '@/types/menu'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'AllocMenu',
  components: { ArrowLeftOutlined },
  props: {
    roleId: {
      type: [Number, String],
      required: true// 必传
    }
  },
  setup (props) {
    const treeData = ref<TreeDataItem[]>([])
    const checkedKeys = ref<number[]>([])
    const $router = useRouter()
    watch(checkedKeys, () => {
      console.log('checkedKeys', checkedKeys)
    })

    // 获取所有菜单
    const loadAllMenu = async () => {
      const { data } = await getMenuNodeList()
      if (data.code === '000000') {
        treeData.value = data.data
      }
    }

    // 保存角色菜单
    const onSubmit = async () => {
      const { data } = await allocateRoleMenus({
        roleId: props.roleId,
        menuIdList: checkedKeys.value
      })
      if (data.code === '000000') {
        await message.success(data.mesg, 1)
        $router.back()
      } else {
        message.error(data.mesg)
      }
    }

    // 获取角色拥有的菜单
    const loadRoleMenu = async () => {
      const { data } = await getRoleMenus(props.roleId)
      if (data.code === '000000') {
        getSelectedKeys(data.data)
      }
    }
    const getSelectedKeys = (menus: MenuItem[]) => {
      menus.forEach(menu => {
        if (menu.selected) {
          // checkedKeys.value.push(menu.id)
          checkedKeys.value = [...checkedKeys.value, menu.id]
        }
        if (menu.subMenuList && menu.subMenuList.length) {
          getSelectedKeys(menu.subMenuList)
        }
      })
    }

    return {
      treeData,
      replaceFields: {
        title: 'name',
        children: 'subMenuList',
        key: 'id'
      },
      loadAllMenu,
      onSubmit,
      checkedKeys,
      loadRoleMenu
    }
  },
  created () {
    this.loadAllMenu()
    this.loadRoleMenu()
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
  overflow: hidden;
  overflow-y: auto;
}
</style>
