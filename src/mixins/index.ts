export default {
  methods: {
    calculate (): number {
      let height = document.body.clientHeight - 64
      window.onresize = () => {
        height = document.body.clientHeight - 64
      }
      return height
    }
  }
}
