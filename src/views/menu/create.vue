<template>
  <div class="main-container">
    <a-card :bordered="false">
      <template #title>
        <span style="cursor: pointer" @click="$router.back()">
          <ArrowLeftOutlined />
        </span>
        <a-divider type="vertical" />
        {{ $route.name === 'menuEdit' ? '编辑菜单' : '添加菜单' }}
      </template>
      <a-form ref="formRef" :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" :rules="rules">
        <a-form-item label="菜单名称" required name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="菜单路径" required name="href">
          <a-input v-model:value="formState.href" />
        </a-form-item>
        <a-form-item label="上级菜单" required name="parentId">
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
          <input-number v-model:value="formState.orderNum" @input="val => formState.orderNum = Number(val)" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="onSubmit">提交</a-button>
          <a-button style="margin-left: 10px" @click="$router.go(-1)">取消</a-button>
        </a-form-item>
      </a-form>
      <div v-if="loading" class="empty-continer">
        <a-spin :spinning="loading" />
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { FormState } from '@/types/menu'
import { menuUpdate, getEditMenu } from '@/services/menu'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import InputNumber from '@/components/input-number.vue'
import { ArrowLeftOutlined } from '@ant-design/icons-vue'

const menuItem = {
  name: '',
  href: '',
  parentId: -1,
  description: '',
  icon: '',
  shown: false,
  orderNum: null
}

const rules = {
  name: [{ required: true, message: '请输入菜单名称' }],
  href: [{ required: true, message: '请输入菜单路径' }],
  parentId: [{ required: true, message: '请选择上一级菜单' }]
}

export default defineComponent({
  name: 'Menu',
  components: { InputNumber, ArrowLeftOutlined },
  setup () {
    const formState = ref<FormState>(menuItem)
    const formRef = ref()
    const state = reactive({
      loading: false
    })

    const $router = useRouter()
    const $route = useRoute()
    const onSubmit = async () => {
      state.loading = true
      try {
        await formRef.value.validate()
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
      } catch (error) {
        console.error(error)
      }
      state.loading = false
    }

    const parentMenuList = ref<FormState[]>([])

    return {
      ...toRefs(state),
      formRef,
      rules,
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
.ant-card-body {
  height: calc(100% - 65px);
  padding-bottom: 0;
  position: relative;
}
.empty-continer {
  background: rgba($color: #fcfcfc, $alpha: .5);
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;

  .ant-spin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
