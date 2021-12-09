import { mount, shallowMount } from '@vue/test-utils'
// import Antd from 'ant-design-vue'
import InputNumber from '@/components/input-number.vue'

// beforeAll(() => {
//   mount({
//     global: {
//       plugins: [Antd]
//     }
//   })
// })

describe('input-number.vue', () => {
  it('input number render', () => {
    const wrapper = shallowMount(InputNumber)
    console.log(wrapper)
  })
})
