<template>
  <div id="app">
    <div class="drag">
      Drop Files Here
    </div>

    <h2>Directory tree:</h2>

    <div ref="listing"></div>
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
      this.createFolder(filesTree, this.$refs['listing'])
    },
    createFolder(folders, container){
      folders.forEach(folder => {
        let elem = document.createElement("ul")
        elem.innerHTML = folder.name
        container.appendChild(elem)
        this.scanFiles(folder.files, elem)
        this.createFolder(folder.children, elem)
      })
    },
    scanFiles(files, container) {
      files.forEach(file => {
        let elem = document.createElement("li")
        elem.innerHTML = file.name
        container.appendChild(elem)
      })  
    }
  },
  mounted () {
    this.drag = new DragLitener({
      selector: document.querySelector('.drag'),
      drop: this.outputFile
    })
    console.log(this.drag.files)
  }
}
</script>

<style>
.drag {
  text-align: center;
  width: 300px;
  height: 100px;
  margin: 10px;
  padding: 10px;
  border: 4px dashed red;
  border-radius: 10px;
}
</style>
