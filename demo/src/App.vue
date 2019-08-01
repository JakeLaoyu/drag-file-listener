<template>
  <div id="app">
    <div class="drag"></div>
  </div>
</template>

<script>
import DragLitener from '../../libs/index.esm'
export default {
  name: 'app',
  methods: {
    outputFile ({ files, filesTree }) {
      console.log(files)
      console.log(filesTree)
    }
  },
  mounted () {
    new DragLitener({
      selector: document.querySelector('.drag'),
      callback: this.outputFile
    })
  }
}
</script>

<style>
.drag {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
