import { shallowMount } from '@vue/test-utils'
import TodoApp from '../index.vue'
import { nextTick } from 'vue'
import TodoItem from '../todoItem.vue'
import { useRoute } from 'vue-router'

jest.mock('vue-router', () => ({
  useRoute: jest.fn()
}))

describe('todoApp.vue', () => {
  /** @type { import('@vue/test-utils').Wrapper } */
  let wrapper = null

  beforeEach(() => {
    useRoute.mockImplementationOnce(() => ({
      path: '/todo'
    }))
    wrapper = shallowMount(TodoApp)

    const todos = [
      { id: 1, text: 'JavaScript', done: false },
      { id: 2, text: 'ReactJs', done: true },
      { id: 3, text: 'TypeScript', done: true }
    ]
    wrapper.vm.todos = todos
  })

  test('New todo', () => {
    const text = 'NodeJs'
    wrapper.vm.handleNewTodo(text)
    const todo = wrapper.vm.todos.find(t => t.text === text)
    expect(todo).toBeTruthy()
  })

  test('Todo List', () => {
    // nextTick(() => {
    //   expect(wrapper.findAllComponents(TodoItem).length).toBe(todos.length)
    // })
    expect(wrapper.findAllComponents(TodoItem).length).toBe(wrapper.vm.todos.length)
  })

  test('Todo Delete', async () => {
    await wrapper.vm.handleDeleteTodo(1)
    expect(wrapper.vm.todos.length).toBe(2)
    expect(wrapper.findAllComponents(TodoItem).length).toBe(2)
  })

  test('Todo Delete', async () => {
    await wrapper.vm.handleDeleteTodo(123)
    expect(wrapper.vm.todos.length).toBe(3)
    expect(wrapper.findAllComponents(TodoItem).length).toBe(3)
  })

  test('Edit Delete', async () => {
    const todo = { id: 2, text: 'VueJs' }
    await wrapper.vm.handleEditTodo(todo)
    expect(wrapper.vm.todos[1].text).toBe(todo.text)

    // 数据被删除
    todo.text = ''
    await wrapper.vm.handleEditTodo(todo)
    expect(wrapper.vm.todos.find(t => t.id === todo.id)).toBeFalsy()
  })

  test('Toggle All', async () => {
    const toggleAll = wrapper.find('[data-testid="toggle-all"]')

    // 断言所有的子任务被选中了
    await toggleAll.setChecked()
    wrapper.vm.todos.forEach(todo => {
      expect(todo.done).toBeTruthy()
    })

    // 取消全选
    await toggleAll.setChecked(false)
    wrapper.vm.todos.forEach(todo => {
      expect(todo.done).toBeFalsy()
    })
  })

  test('Toggle All State', async () => {
    const toggleAll = wrapper.find('[data-testid="toggle-all"]')
    // 让所有任务都变成完成状态
    wrapper.vm.todos.forEach(todo => (todo.done = true))
    await nextTick()
    // 断言：toggleAll 状态为全选
    expect(toggleAll.element.checked).toBeTruthy()
    // 取消某个任务
    wrapper.vm.todos[0].done = false
    await nextTick()
    // 断言：toggleAll 状态为非全选
    expect(toggleAll.element.checked).toBeFalsy()
  })

  test('Clear Todos', async () => {
    const toggleAll = wrapper.find('[data-testid="toggle-all"]')
    wrapper.vm.todos = []

    await nextTick()
    expect(toggleAll.element.checked).toBeFalsy()
  })

  test('Clear All Completed', async () => {
    await wrapper.vm.handleClearCompleted()
    expect(wrapper.vm.todos).toEqual([
      { id: 1, text: 'JavaScript', done: false }
    ])
  })

  test('Filter Todos', async () => {
    // 将路由导航到 /todo
    // 断言：todosFilter = 所有任务列表
    expect(wrapper.vm.todosFilter).toEqual([
      { id: 1, text: 'JavaScript', done: false },
      { id: 2, text: 'ReactJs', done: true },
      { id: 3, text: 'TypeScript', done: true }
    ])

    // 将路由导航到 /todo/active
    useRoute.mockImplementationOnce(() => ({
      path: '/todo/active'
    }))
    await nextTick()
    // 断言：todosFilter = 未完成的任务列表
    // expect(wrapper.vm.todosFilter).toEqual([
    //   { id: 1, text: 'JavaScript', done: false }
    // ])

    // 将路由导航到 /todo/completed
    // 断言：todosFilter = 已完成的任务列表
  })

  // 快照测试
  test('snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
