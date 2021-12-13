import { shallowMount } from '@vue/test-utils'
import TodoItem from '../todoItem.vue'

describe('todoItem.vue', () => {
  /** @type { import('@vue/test-utils').Wrapper } */
  let wrapper = null
  beforeEach(() => {
    const todo = {
      id: 1,
      text: 'JavaScript',
      done: true
    }
    wrapper = shallowMount(TodoItem, {
      propsData: {
        todo
      }
    })
  })
  test('text', () => {
    expect(wrapper.find('[data-testid="todo-text"]').text()).toBe(wrapper.vm.todo.text)
  })

  test('done', async () => {
    const status = wrapper.find('[data-testid="todo-done"]')
    const todoItem = wrapper.find('[data-testid="todo-item"]')
    expect(status.element.checked).toBeTruthy()
    expect(todoItem.classes()).toContain('completed')

    await status.setChecked(false)
    expect(todoItem.classes('completed')).toBeFalsy()
  })
})
