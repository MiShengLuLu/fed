<template>
  <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { MyCustomUploadAdapterPlugin } from '@/plugins/ckUpload'

export default defineComponent({
  name: 'ckEditor',
  props: {
    value: String
  },
  components: {
    ckeditor: CKEditor.component
  },
  setup (props, { emit }) {
    const state = reactive({
      editor: ClassicEditor,
      editorData: props.value,
      editorConfig: {
        autosave: {
          // eslint-disable-next-line
          save (editor: any) {
            // which should be resolved when the data is successfully saved.
            // return editor.getData()
            emit('input', editor.getData())
          },
          waitingTime: 5000
        },
        extraPlugins: [MyCustomUploadAdapterPlugin]
      }
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(.ck-content) {
  min-height: 360px;
}
</style>
