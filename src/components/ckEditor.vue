<template>
  <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

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
          save (editor: any) {
            // which should be resolved when the data is successfully saved.
            // return editor.getData()
            emit('input', editor.getData())
          },
          waitingTime: 5000
        }
      }
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
