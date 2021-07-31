<template>
  <div class="main-container">
    <a-card title="添加菜单" :bordered="false">
      <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="菜单名称">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="菜单路径">
          <a-input v-model:value="formState.href" />
        </a-form-item>
        <a-form-item label="上级菜单">
          <a-select v-model:value="formState.parentId" placeholder="请选择上级菜单">
            <a-select-option value="-1">无上一级菜单</a-select-option>
            <a-select-option v-for="menu in parentMenuList" :key="menu.id" :value="menu.id">{{ menu.name }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-model:value="formState.description" />
        </a-form-item>
        <a-form-item label="前端图标">
          <a-input v-model:value="formState.icon" />
        </a-form-item>
        <a-form-item label="是否显示">
          <a-radio-group v-model:value="formState.shown">
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="排序">
          <a-input addon-before="-" addon-after="+" v-model:value="formState.orderNum">
            <template #addon-before>
              <MinusOutlined />
            </template>
            <template #addon-after>
              <PlusOutlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">提交</a-button>
          <a-button style="margin-left: 10px" @click="$router.go(-1)">取消</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue'
import { FormState } from '@/types/menu'
import { menuUpdate, getEditMenu } from '@/services/menu'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'

const menuItem = {
  name: '',
  href: '',
  parentId: -1,
  description: '',
  icon: '',
  shown: false,
  orderNum: null
}

export default defineComponent({
  components: { MinusOutlined, PlusOutlined },
  setup () {
    // const formState: UnwrapRef<FormState> = reactive({
    //   name: '',
    //   href: '',
    //   parentId: -1,
    //   description: '',
    //   icon: '',
    //   shown: false,
    //   orderNum: null
    // })
    const formState = ref<FormState>(menuItem)

    const $router = useRouter()
    const $route = useRoute()
    const onSubmit = async () => {
      if ($route.name === 'menuEdit') {
        formState.value.id = Number($route.params.id)
      }
      const { data } = await menuUpdate(formState.value)
      if (data.code === '000000') {
        message.success(data.mesg)
        $router.back()
      } else {
        message.error(data.mesg)
      }
    }

    const parentMenuList = ref<FormState[]>([])

    return {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      formState,
      onSubmit,
      parentMenuList
    }
  },
  created () {
    this.loadMenuInfo()
  },
  methods: {
    async loadMenuInfo () {
      const { data } = await getEditMenu(Number(this.$route.params.id) || -1)
      if (data.code === '000000') {
        this.parentMenuList = data.data.parentMenuList
        this.formState = data.data.menuInfo || menuItem
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
</style>
