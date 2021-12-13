import { shallowMount } from '@vue/test-utils'
import TodoApp from '../index.vue'
import { nextTick } from 'vue'
import TodoItem from '../todoItem.vue'

describe('todoApp.vue', () => {
  test('New todo', async () => {
    const wrapper = shallowMount(TodoApp)
    const text = 'NodeJs'
    wrapper.vm.handleNewTodo(text)
    const todo = wrapper.vm.todos.find(t => t.text === text)
    expect(todo).toBeTruthy()
  })

  test('Todo List', async () => {
    const todos = [
      { id: 1, text: 'JavaScript', done: false },
      { id: 2, text: 'ReactJs', done: true },
      { id: 3, text: 'TypeScript', done: true }
    ]
    const wrapper = shallowMount(TodoApp)
    wrapper.vm.todos = todos
    nextTick(() => {
      expect(wrapper.findAllComponents(TodoItem).length).toBe(todos.length)
    })
  })
})
