<template>
  <a-config-provider :locale="locale">
    <!-- 根路由出口 -->
    <router-view />
  </a-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

interface Book {
  title: string;
  author: string;
  year: number
}

export default defineComponent({
  data () {
    return {
      book: {
        title: 'Vue 3 Guide',
        author: 'Vue Team',
        year: 2020
      } as Book,
      locale: zhCN
    }
  }
})
</script>

<style lang="scss" scoped>
// @import '~@/styles/variables.scss';

.text {
  color: $primary-color;
}
</style>
