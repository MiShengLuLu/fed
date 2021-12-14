import { shallowMount } from '@vue/test-utils'
import TodoFooter from '../todoFooter.vue'

describe('TodoFooter.vue', () => {
  /** @type { import('@vue/test-utils').Wrapper } */
  let wrapper = null

  beforeEach(() => {
    const todos = [
      { id: 1, text: 'JavaScript', done: false },
      { id: 2, text: 'ReactJs', done: true },
      { id: 3, text: 'TypeScript', done: true }
    ]
    wrapper = shallowMount(TodoFooter, {
      propsData: {
        todos
      }
    })
  })

  test('Todos Done Count', () => {
    const count = wrapper.vm.todos.filter(t => !t.done).length
    const countEle = wrapper.find('[data-testid="todos-done-count"]')
    expect(Number.parseInt(countEle.text())).toBe(count)
  })

  test('Clear Completed Show', async () => {
    const clearBtn = wrapper.find('[data-testid="clear-complted"]')
    expect(clearBtn.exists()).toBeTruthy()

    // 清除所有完成任务，断言：clearBtn 不存在
    wrapper = shallowMount(TodoFooter, {
      propsData: {
        todos: [
          { id: 1, text: 'JavaScript', done: false },
          { id: 2, text: 'ReactJs', done: false },
          { id: 3, text: 'TypeScript', done: false }
        ]
      }
    })
    expect(wrapper.find('[data-testid="clear-complted"]').exists()).toBeFalsy()
  })

  test('Clear Completed', async () => {
    const clearBtn = wrapper.find('[data-testid="clear-complted"]')
    clearBtn.trigger('click')
    expect(wrapper.emitted()['clear-completed']).toBeTruthy()
  })
})
