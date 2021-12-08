import { mount } from '@vue/test-utils'
import AppHeader from '@/components/app-header.vue'
import Antd from 'ant-design-vue'

describe('Header', () => {
  it('renders', () => {
    const wrapper = mount(AppHeader, {
      global: {
        // 加载Vue的插件，因为项目里插件加载放在main.js中，测试文件需要单独在这里引入,相当于调用了 app.use()
        plugins: [Antd]
      }
    })
    console.log(wrapper)
  })
})

// describe('HelloWorld.vue', () => {
//   it('renders props.msg when passed', () => {
//     const msg = 'new message'
//     const wrapper = shallowMount(HelloWorld, {
//       props: { msg }
//     })
//     expect(wrapper.text()).toMatch(msg)
//   })
// })
