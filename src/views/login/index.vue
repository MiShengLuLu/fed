<template>
  <a-form
    name="custom-validation"
    ref="formRef"
    :model="formState"
    :rules="rules"
    v-bind="layout"
    @finish="handleFinish"
    @finishFailed="handleFinishFailed"
  >
    <a-form-item has-feedback label="手机号" name="phone">
      <a-input v-model:value="formState.phone" type="text" autocomplete="off" />
    </a-form-item>
    <a-form-item has-feedback label="密码" name="password">
      <a-input v-model:value="formState.password" type="password" autocomplete="off" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" html-type="submit" :loading="loading">登 陆</a-button>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">
import { RuleObject, ValidateErrorEntity } from 'ant-design-vue/es/form/interface'
import { message } from 'ant-design-vue'
import { defineComponent, reactive, ref, UnwrapRef } from 'vue'
import request from '@/utils/request'
import qs from 'qs'
import { useRouter } from 'vue-router'

interface FormState {
  phone: string
  password: string
}
export default defineComponent({
  setup () {
    const $router = useRouter()

    const formRef = ref()
    const formState: UnwrapRef<FormState> = reactive({
      phone: '18201288771',
      password: '111111'
    })
    const loading = ref(false)
    const validatePassword = async (rule: RuleObject, value: string) => {
      if (!value) {
        return Promise.reject(new Error('请输入密码'))
      }
      return Promise.resolve()
    }
    const validatePhone = async (rule: RuleObject, value: string) => {
      if (!value) {
        return Promise.reject(new Error('请输入电话'))
      }
      if (!Number(value)) {
        return Promise.reject(new Error('请输入数字'))
      }
      return Promise.resolve()
    }

    const rules = {
      phone: [{ required: true, validator: validatePhone, trigger: 'change' }],
      password: [{ required: true, validator: validatePassword, trigger: 'change' }]
    }
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 }
    }
    const handleFinish = async (values: FormState) => {
      loading.value = true
      const { data } = await request({
        method: 'post',
        url: '/front/user/login',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(values)
      })
      if (data.state !== 1) {
        return message.warning(data.message)
      }
      loading.value = false
      $router.push('/')
      message.success('登陆成功')
    }
    const handleFinishFailed = (errors: ValidateErrorEntity<FormState>) => {
      console.log('errors', errors)
    }
    return {
      formState,
      formRef,
      rules,
      layout,
      loading,
      handleFinishFailed,
      handleFinish
    }
  }
})
</script>

<style lang="scss" scoped>
.ant-form {
  width: 500px;
  margin: 0 auto;
  padding-top: 250px;
}
</style>
