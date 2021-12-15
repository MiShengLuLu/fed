import { VueWrapper } from '@vue/test-utils'

VueWrapper.prototype.findById = function (id) {
  return this.find(`[data-testid="${id}"]`)
}

VueWrapper.prototype.findAllById = function (id) {
  return this.findAll(`[data-testid="${id}"]`)
}
