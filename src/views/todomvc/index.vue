<template>
  <section class="todoapp">
    <todo-header @new-todo="handleNewTodo"></todo-header>
    <!-- This section should be hidden by default and shown when there are todos -->
    <section class="main">
      <input id="toggle-all" class="toggle-all" type="checkbox" />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <!-- These are here just to show the structure of the list items -->
        <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
        <todo-item v-for="item in todos" :key="item.id" :todo="item"></todo-item>
        <!-- <li>
          <div class="view">
            <input class="toggle" type="checkbox" />
            <label>Buy a unicorn</label>
            <button class="destroy"></button>
          </div>
          <input class="edit" value="Rule the web" />
        </li> -->
      </ul>
    </section>
    <todo-footer></todo-footer>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import TodoHeader from './todoHeader.vue'
import TodoFooter from './todoFooter.vue'
import TodoItem from './todoItem.vue'

interface Todo {
  id: number,
  text: string,
  done: boolean
}

export default defineComponent({
  components: { TodoHeader, TodoFooter, TodoItem },
  setup () {
    const todos = ref<Todo[]>([])
    const handleNewTodo = (text: string) => {
      const lastTodo = todos.value[todos.value.length - 1]
      todos.value.push({
        id: lastTodo ? lastTodo.id + 1 : 1,
        text,
        done: false
      })
    }

    return {
      todos,
      handleNewTodo
    }
  }
})
</script>

<style scoped>
@import url("../../styles/todomvc.css");

.hidden {
  display: none;
}

.todoapp {
  background: #fff;
  margin: 160px auto 40px;
  min-width: 230px;
  max-width: 550px;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
}

.edit {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.main {
  position: relative;
  z-index: 2;
  border-top: 1px solid #e6e6e6;
}

.toggle-all {
  width: 1px;
  height: 1px;
  border: none; /* Mobile Safari */
  opacity: 0;
  position: absolute;
  right: 100%;
  bottom: 100%;
}

.toggle-all + label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 65px;
  font-size: 0;
  position: absolute;
  top: -65px;
  left: -0;
}

.toggle-all + label:before {
  content: "❯";
  display: inline-block;
  font-size: 22px;
  color: #949494;
  padding: 10px 27px 10px 27px;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.toggle-all:checked + label:before {
  color: #484848;
}

.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

/*
  Hack to remove background from Mobile Safari.
  Can't use it globally since it destroys checkboxes in Firefox
*/
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .toggle-all,
  .todo-list li .toggle {
    background: none;
  }

  .todo-list li .toggle {
    height: 40px;
  }
}

@media (max-width: 430px) {
  .footer {
    height: 50px;
  }

  .filters {
    bottom: 10px;
  }
}

:focus,
.toggle:focus + label,
.toggle-all:focus + label {
  box-shadow: 0 0 2px 2px #cf7d7d;
  outline: 0;
}
</style>
