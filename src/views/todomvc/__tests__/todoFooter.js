import { shallowMount } from '@vue/test-utils'
import TodoFooter from '../todoFooter.vue'
// import { createRouter, useRouter } from 'vue-router'
// import { nextTick } from 'vue'

// jest.mock('vue-router', () => ({
//   useRoute: jest.fn(),
//   useRouter: jest.fn(() => ({ push: () => {} }))
// }))

// const router = createRouter({
//   linkActiveClass: 'selected'
// })

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
      props: {
        todos
      }
      // global: {
      //   mocks: {
      //     $route: {},
      //     $router: {
      //       push: jest.fn()
      //     }
      //   }
      //   // plugins: [router]
      // }
    })
  })

  test('Todos Done Count', () => {
    const count = wrapper.vm.todos.filter(t => !t.done).length
    const countEle = wrapper.find('[data-testid="todos-done-count"]')
    expect(Number.parseInt(countEle.text())).toBe(count)
  })

  test('Clear Completed Show', async () => {
    const clearBtn = wrapper.find('[data-testid="clear-completed"]')
    expect(clearBtn.exists()).toBeTruthy()

    // 清除所有完成任务，断言：clearBtn 不存在
    wrapper = shallowMount(TodoFooter, {
      props: {
        todos: [
          { id: 1, text: 'JavaScript', done: false },
          { id: 2, text: 'ReactJs', done: false },
          { id: 3, text: 'TypeScript', done: false }
        ]
      }
    })
    expect(wrapper.find('[data-testid="clear-completed"]').exists()).toBeFalsy()
  })

  test('Clear Completed', async () => {
    const clearBtn = wrapper.find('[data-testid="clear-completed"]')
    clearBtn.trigger('click')
    expect(wrapper.emitted()['clear-completed']).toBeTruthy()
  })

  // test('Router Link ActiveClass', async () => {
  //   const links = wrapper.findAllComponents({ name: 'RouterLink' })
  //   useRouter.mockImplementationOnce(() => ({
  //     push: () => '/todo'
  //   }))
  //   await nextTick()
  //   for (let i = 0; i < links.length; i++) {
  //     const link = links.at(i)
  //     if (link.vm.to === '/todo') {
  //       expect(link.classes()).toContain('selected')
  //     } else {
  //       expect(link.classes('selected')).toBeFalsy()
  //     }
  //   }

  //   useRouter.mockImplementationOnce(() => ({
  //     push: () => '/todo/active'
  //   }))
  //   for (let i = 0; i < links.length; i++) {
  //     const link = links.at(i)
  //     if (link.vm.to === '/todo/active') {
  //       expect(link.classes()).toContain('selected')
  //     } else {
  //       expect(link.classes('selected')).toBeFalsy()
  //     }
  //   }

  //   useRouter.mockImplementationOnce(() => ({
  //     push: () => '/todo/completed'
  //   }))
  //   for (let i = 0; i < links.length; i++) {
  //     const link = links.at(i)
  //     if (link.vm.to === '/todo/completed') {
  //       expect(link.classes()).toContain('selected')
  //     } else {
  //       expect(link.classes('selected')).toBeFalsy()
  //     }
  //   }
  // })

  // 快照测试
  test('snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })
})
