<template>
  <header class="header">
    <h1>todos</h1>
    <input data-testid="new-todo" class="new-todo" placeholder="What needs to be done?" autofocus @keyup.enter="handleNewTodo" />
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

interface Event {
  target: {
    value: string;
    checked: boolean
  }
}

export default defineComponent({
  name: 'TodoHeader',
  setup (props, { emit }) {
    const handleNewTodo = (e: Event) => {
      const value = e.target.value.trim()
      if (!value.length) return
      emit('new-todo', value)
      e.target.value = ''
    }

    return {
      handleNewTodo
    }
  }
})
</script>

<style lang="scss" scoped>
.header {
  input::-webkit-input-placeholder {
    font-style: italic;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }

  input::-moz-placeholder {
    font-style: italic;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }

  input::input-placeholder {
    font-style: italic;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
  }

  h1 {
    position: absolute;
    top: -100px;
    width: 100%;
    font-size: 80px;
    font-weight: 200;
    text-align: center;
    color: #b83f45;
    -webkit-text-rendering: optimizeLegibility;
    -moz-text-rendering: optimizeLegibility;
    text-rendering: optimizeLegibility;
  }

  .new-todo {
    position: relative;
    margin: 0;
    width: 100%;
    font-size: 24px;
    font-family: inherit;
    font-weight: inherit;
    line-height: 1.4em;
    height: 65px;
    color: inherit;
    padding: 16px 16px 16px 60px;
    border: none;
    background: rgba(0, 0, 0, 0.003);
    box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
</style>
