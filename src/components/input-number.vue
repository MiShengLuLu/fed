<template>
  <a-input v-model:value="num">
    <template #addonBefore>
      <span style="cursor: pointer" @click="num > 0 && num--">
        <MinusOutlined />
      </span>
    </template>
    <template #addonAfter>
      <span style="cursor: pointer" @click="num++">
        <PlusOutlined />
      </span>
    </template>
  </a-input>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  name: 'input-number',
  components: { MinusOutlined, PlusOutlined },
  props: {
    value: {
      type: Number
    }
  },
  setup (props, { emit }) {
    const num = ref<number | undefined>(props.value)

    watch(num, (nV, oV) => {
      if (nV === oV) return
      emit('input', nV)
    })

    return {
      num
    }
  }
})
</script>
