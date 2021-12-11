import { shallowMount } from '@vue/test-utils'
import TodoHeader from '@/views/todomvc/todoHeader.vue'

describe('todoHeader.vue', () => {
  test('New todo', async () => {
    const wrapper = shallowMount(TodoHeader)
    // 获取 input 输入框
    const input = wrapper.find('input[data-testid="new-todo"]')
    const text = 'NodeJs'
    await input.setValue(text)
    await input.trigger('keyup.enter')
    expect(wrapper.emitted()['new-todo']).toBeTruthy()
    expect(wrapper.emitted()['new-todo'][0][0]).toBe(text)
    expect(input.element.value).toBe('')
  })
})
