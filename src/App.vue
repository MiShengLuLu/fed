<template>
  <!-- 根路由出口 -->
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

export default defineComponent({
  data () {
    return {
      book: {
        title: 'Vue 3 Guide',
        author: 'Vue Team',
        year: 2020
      } as Book
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
