/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '@ckeditor/ckeditor5-vue'

interface Window {
  AliyunUpload: any
}
