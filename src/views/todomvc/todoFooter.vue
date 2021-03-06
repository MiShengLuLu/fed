<template>
  <!-- This footer should be hidden by default and shown when there are todos -->
  <footer class="footer">
    <!-- This should be `0 items left` by default -->
    <span class="todo-count"><strong data-testid="todos-done-count">{{ doneTodosCount }}</strong> item left</span>
    <!-- Remove this if you don't implement routing -->
    <ul class="filters">
      <li>
        <router-link data-testid="link-all" exact to="/todo">All</router-link>
      </li>
      <li>
        <router-link data-testid="link-active" to="/todo/active">Active</router-link>
      </li>
      <li>
        <router-link data-testid="link-completed" to="/todo/completed">Completed</router-link>
      </li>
    </ul>
    <!-- Hidden if no completed items are left ↓ -->
    <button
      v-if="isClearCompletedShow"
      class="clear-completed"
      data-testid="clear-completed"
      @click="$emit('clear-completed')"
    >Clear completed</button>
  </footer>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { Todo } from '@/types/todomvc'

export default defineComponent({
  name: 'TodoFooter',
  props: {
    todos: {
      type: Array,
      required: true
    }
  },
  setup (props) {
    const doneTodosCount = computed(() => {
      const { todos } = props
      return todos.filter(todo => !(todo as Todo).done).length
    })

    const isClearCompletedShow = computed(() => props.todos.find(t => (t as Todo).done))

    return {
      doneTodosCount,
      isClearCompletedShow
    }
  }
})
</script>

<style lang="scss" scoped>
.footer {
  padding: 10px 15px;
  height: 40px;
  text-align: center;
  font-size: 15px;
  border-top: 1px solid #e6e6e6;
}

.footer:before {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 50px;
  overflow: hidden;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
    0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6,
    0 17px 2px -6px rgba(0, 0, 0, 0.2);
}

.todo-count {
  float: left;
  text-align: left;
}

.todo-count strong {
  font-weight: 300;
}

.filters {
  margin: 0;
  padding: 0;
  list-style: none;
  position: absolute;
  right: 0;
  left: 0;
}

.filters li {
  display: inline;
}

.filters li a {
  color: inherit;
  margin: 3px;
  padding: 3px 7px;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 3px;
}

.filters li a:hover {
  border-color: #db7676;
}

.filters li a.selected {
  border-color: #ce4646;
}

.clear-completed,
html .clear-completed:active {
  float: right;
  position: relative;
  line-height: 19px;
  text-decoration: none;
  cursor: pointer;
}

.clear-completed:hover {
  text-decoration: underline;
}

.info {
  margin: 65px auto 0;
  color: #4d4d4d;
  font-size: 11px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  text-align: center;
}

.info p {
  line-height: 1;
}

.info a {
  color: inherit;
  text-decoration: none;
  font-weight: 400;
}

.info a:hover {
  text-decoration: underline;
}
</style>
