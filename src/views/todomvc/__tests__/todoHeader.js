import { shallowMount } from '@vue/test-utils'
import TodoHeader from '../todoHeader.vue'

describe('todoHeader.vue', () => {
  let wrapper = null

  beforeEach(() => {
    wrapper = shallowMount(TodoHeader)
  })

  test('New todo', async () => {
    // 获取 input 输入框
    const input = wrapper.find('input[data-testid="new-todo"]')
    const text = 'NodeJs'
    await input.setValue(text)
    await input.trigger('keyup.enter')
    expect(wrapper.emitted()['new-todo']).toBeTruthy()
    expect(wrapper.emitted()['new-todo'][0][0]).toBe(text)
    expect(input.element.value).toBe('')
  })

  test('New todo no text', async () => {
    const input = wrapper.find('input[data-testid="new-todo"]')
    const text = ''
    await input.setValue(text)
    await input.trigger('keyup.enter')
    expect(wrapper.emitted()['new-todo']).toBeFalsy()
  })

  // 快照测试
  test('snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
