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

  test('delete todo', async () => {
    const deleteBtn = wrapper.find('[data-testid="todo-delete"]')
    await deleteBtn.trigger('click')
    expect(wrapper.emitted()['delete-todo']).toBeTruthy()
    expect(wrapper.emitted()['delete-todo'][0][0]).toBe(wrapper.vm.todo.id)
  })

  test('edit todo style', async () => {
    const label = wrapper.find('[data-testid="todo-text"]')
    const todoItem = wrapper.find('[data-testid="todo-item"]')
    const todoEdit = wrapper.find('[data-testid="todo-edit"]')

    await label.trigger('dblclick')
    expect(todoItem.classes()).toContain('editing')

    await todoEdit.trigger('blur')
    expect(todoItem.classes('editing')).toBeFalsy()
  })

  test('edit todo save', async () => {
    const label = wrapper.find('[data-testid="todo-text"]')
    const todoEdit = wrapper.find('[data-testid="todo-edit"]')
    await label.trigger('dblclick')
    const text = 'hello'

    // 编辑文本框中的内容展示
    expect(todoEdit.element.value).toBe(wrapper.vm.todo.text)
    // 修改文本的值
    todoEdit.setValue(text)
    // 触发回车保存事件
    await todoEdit.trigger('keyup.enter')

    // 断言数据被修改了
    // expect(wrapper.vm.todo.text).toBe(text)
    expect(wrapper.emitted('edit-todo')).toBeTruthy()
    expect(wrapper.emitted('edit-todo')[0][0]).toEqual({
      id: wrapper.vm.todo.id,
      text
    })
    expect(wrapper.vm.isEditing).toBeFalsy()
  })

  test('edit todo cancel', async () => {
    const label = wrapper.find('[data-testid="todo-text"]')
    const todoEdit = wrapper.find('[data-testid="todo-edit"]')

    await label.trigger('dblclick')
    // 备份数据
    const text = wrapper.vm.todo.text

    await todoEdit.setValue('HTML5')
    // 触发取消事件
    await todoEdit.trigger('keyup.esc')
    // 验证字段没有被修改
    expect(wrapper.vm.todo.text).toBe(text)
    // 验证编辑状态被取消
    expect(wrapper.vm.isEditing).toBeFalsy()
  })
})
