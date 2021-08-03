<template>
  <!-- Create the toolbar container -->
  <div ref="toolbar" id="toolbar">
    <span class="ql-formats">
      <select class="ql-font"></select>
      <select class="ql-size"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-color"></select>
      <select class="ql-background"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-header" value="1"></button>
      <button class="ql-header" value="2"></button>
      <button class="ql-blockquote"></button>
      <button class="ql-code-block"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-direction" value="rtl"></button>
      <select class="ql-align"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-link"></button>
      <button class="ql-image"></button>
      <button class="ql-video"></button>
      <button class="ql-formula"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-clean"></button>
    </span>
  </div>
  <!-- Create the editor container -->
  <div ref="editorRef" id="editor">
    <p>Hello World!</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import Quill from 'quill'

import 'quill/dist/quill.snow.css'

export default defineComponent({
  // props: {
  //   value: {
  //     type: String
  //   }
  // },
  setup (props, { emit }) {
    const editorRef = ref()
    const toolbar = ref()
    const state = reactive({
      value: {}
    })
    const initEditor = () => {
      const editor = new Quill('#editor', {
        modules: {
          toolbar: '#toolbar'
        },
        theme: 'snow'
        // autosave: {
        //   waitingTime: 5000, // in ms
        //   save: (editor: any) => {
        //     console.log(editor)
        //   }
        // }
      })
      // editor.setContents(props.value)
      // editor.on('text-change', (delta: any, oldDelta: any, source: any) => {
      //   emit('input', editor.getContents())
      // })
    }
    return {
      ...toRefs(state),
      editorRef,
      toolbar,
      initEditor
    }
  },
  mounted () {
    this.initEditor()
  }
})
</script>

<style lang="scss" scoped>
.editor {
  height: calc(100% - 67px);
}
</style>
