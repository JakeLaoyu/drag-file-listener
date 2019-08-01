import debounce from 'lodash/debounce'

class Drag {
  constructor (options) {
    if (!options.selector) {
      throw new Error('selector is must')
    }
    this.selector = options.selector
    this.callback = options.callback
    this.debounceHandleCheck = debounce(this.returnFile, 300)
    this.debounceReadFileFinish = debounce(this.readFileFinish, 300)
    this.files = []
    this.filesTree = {}

    this.currentDirObj = {} // path -> dirObj
    this.bindDrag()
  }

  bindDrag () {
    this.selector.addEventListener('drop', this.dragHandler.bind(this))
    this.selector.addEventListener('dragenter', this.preventDefault)
    this.selector.addEventListener('dragover', this.preventDefault)
    this.selector.addEventListener('dragleave', this.preventDefault)
  }

  readFileFinish () {
    Object.keys(this.currentDirObj).forEach(async path => {
      this.currentDirObj[path].files = await Promise.all(this.currentDirObj[path].files)
      this.files = this.files.concat(this.currentDirObj[path].files)
      this.debounceHandleCheck()
    })
  }

  async returnFile () {
    // 回调
    this.callback({
      files: this.files,
      filesTree: this.filesTree
    })
  }

  dragHandler (e) {
    e.preventDefault()
    e.stopPropagation()
    if (!e.dataTransfer) {
      console.warning('请使用最新版Chrome 或 firefox 或 Edge浏览器')
      return
    }
    var items = e.dataTransfer.items
    for (var i = 0; i < items.length; i++) {
      var item = items[i].webkitGetAsEntry()
      if (item) {
        this.traverseFileTree(item)
      }
    }
  }

  // readEntries 每次最多返回100个，需要重复调用
  // https://developer.mozilla.org/en-US/docs/Web/API/FileSystemDirectoryReader/readEntries
  readerEntries (dirReader) {
    dirReader.readEntries(entries => {
      for (var i = 0; i < entries.length; i++) {
        this.traverseFileTree(entries[i])
      }
      if (entries.length) this.readerEntries(dirReader)
    })
  }

  traverseFileTree (item) {
    if (item.isFile) {
      if (item.name.charAt(0) === '.') return
      const filePath = item.fullPath.split('/')
      filePath.pop()
      this.currentDirObj[filePath.join('/')].files.push(new Promise(resolve => {
        item.file(file => {
          resolve(file)
        })
      }))
    } else if (item.isDirectory) {
      this.createDirObj(item)

      var dirReader = item.createReader()
      this.readerEntries(dirReader)
    }
    this.debounceReadFileFinish()
  }

  createDirObj (dir) {
    const { fullPath, name } = dir
    const pathArr = fullPath.split('/')
    if (this.currentDirObj[fullPath]) return

    const dirObj = {
      name,
      fullPath,
      children: [],
      files: []
    }
    if (pathArr.length === 2) this.filesTree.push(dirObj)
    this.currentDirObj[fullPath] = dirObj
    pathArr.pop()
    this.currentDirObj[pathArr.join('/')] && this.currentDirObj[pathArr.join('/')].children.push(dirObj)
  }

  preventDefault (e) {
    e.preventDefault()
    e.stopPropagation()
  }
}

export default Drag
